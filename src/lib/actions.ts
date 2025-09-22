
"use server";

import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { categorizeTransaction } from "@/ai/flows/categorize-transaction";
import { deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/definitions';
import bcrypt from 'bcrypt';

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
    
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection<User>('users').findOne({ email });

    if (!user) {
      return 'Credenciales incorrectas.';
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordsMatch) {
      return 'Credenciales incorrectas.';
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        return errorData.message || 'Error al iniciar sesión.';
    }

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

  const { name, email, password, role } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return { message: "Un usuario con este email ya existe." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const newUser: User = {
      userId,
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    
    const result = await db.collection('users').insertOne(newUser);
    console.log("New User created:", result.insertedId)

    return { message: "Usuario agregado exitosamente." };

  } catch (error) {
    console.error("Error adding user:", error);
    return { message: "Algo salió mal. Por favor, intente de nuevo." };
  }
}
