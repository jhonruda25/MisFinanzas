
"use server";

import { z } from "zod";
import { categorizeTransaction } from "@/ai/flows/categorize-transaction";
import { users } from '@/lib/data';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const transactionSchema = z.object({
  type: z.enum(["Ingreso", "Gasto"]),
  amount: z.coerce.number().positive("El monto debe ser positivo"),
  description: z.string().min(1, "La descripción es requerida"),
  date: z.string().min(1, "La fecha es requerida"),
  accountId: z.string().min(1, "La cuenta es requerida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
});

export async function addTransaction(prevState: any, formData: FormData) {
  const validatedFields = transactionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Por favor revise los campos.',
    };
  }
  
  // Here you would typically save the data to your database
  console.log("New Transaction:", validatedFields.data);

  return { message: "Transacción agregada exitosamente." };
}

const budgetSchema = z.object({
    amount: z.coerce.number().positive("El monto debe ser positivo"),
    categoryId: z.string().min(1, "La categoría es requerida"),
    // In a real app, you would probably have start and end dates
});

export async function addBudget(prevState: any, formData: FormData) {
    const validatedFields = budgetSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error: Por favor revise los campos.',
        };
    }
    
    // Here you would typically save the data to your database
    console.log("New Budget:", validatedFields.data);

    return { message: "Presupuesto agregado exitosamente." };
}

export async function getAiCategorySuggestion(description: string, userId: string) {
  if (!description) {
    return { suggestion: null, error: null };
  }

  try {
    const result = await categorizeTransaction({ description, userId });
    return { suggestion: result.categoryId, error: null };
  } catch (error)
 {
    console.error("AI categorization failed:", error);
    return { suggestion: null, error: "No se pudo obtener la sugerencia de IA." };
  }
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { email, password } = LoginSchema.parse(Object.fromEntries(formData.entries()));
    
    // NOTE: This is a simplified authentication for demonstration purposes.
    // In a real application, you should securely hash and compare passwords.
    const user = users.find((u) => u.email === email);

    if (!user || user.passwordHash !== password) {
      return 'Credenciales incorrectas.';
    }

    await createSession(user.userId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return 'Error de validación. Revise los campos.';
    }
    return 'Algo salió mal. Por favor, intente de nuevo.';
  }
  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

const userSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  email: z.string().email("El email no es válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  role: z.enum(['admin', 'user']),
});

export async function addUser(prevState: any, formData: FormData) {
  const validatedFields = userSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Por favor revise los campos.',
    };
  }

  // NOTE: This is for demonstration. In a real app, you would save to a database.
  const newUser = {
    userId: `user_${Date.now()}`,
    ...validatedFields.data,
    passwordHash: validatedFields.data.password, // Remember to hash passwords in a real app!
    createdAt: new Date().toISOString(),
  };

  console.log("New User:", newUser);
  // In a real app, you would push this to your database.
  // users.push(newUser);

  return { message: "Usuario agregado exitosamente." };
}
