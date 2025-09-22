"use client";

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addTransaction, getAiCategorySuggestion } from '@/lib/actions';
import { categories, accounts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from 'date-fns/locale';

const transactionSchema = z.object({
  type: z.enum(["Ingreso", "Gasto"], { required_error: "Debe seleccionar un tipo." }),
  amount: z.coerce.number().positive("El monto debe ser un número positivo."),
  description: z.string().min(3, "La descripción debe tener al menos 3 caracteres."),
  date: z.date({ required_error: "La fecha es requerida." }),
  accountId: z.string().min(1, "Debe seleccionar una cuenta."),
  categoryId: z.string().min(1, "Debe seleccionar una categoría."),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Agregar Transacción
    </Button>
  );
}

// Basic debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isAiLoading, startAiTransition] = useTransition();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Gasto',
      amount: 0,
      description: '',
      date: new Date(),
    },
  });

  const descriptionValue = form.watch('description');
  const debouncedDescription = useDebounce(descriptionValue, 500);

  const handleAiSuggestion = useCallback(() => {
    if (debouncedDescription.length > 5) {
      startAiTransition(async () => {
        const { suggestion } = await getAiCategorySuggestion(debouncedDescription, 'user_001');
        if (suggestion) {
          form.setValue('categoryId', suggestion, { shouldValidate: true });
          toast({
            title: "Sugerencia de IA",
            description: "Hemos seleccionado una categoría para ti.",
          });
        }
      });
    }
  }, [debouncedDescription, form, toast]);

  useEffect(() => {
    handleAiSuggestion();
  }, [handleAiSuggestion]);

  const onSubmit = async (data: TransactionFormValues) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('amount', String(data.amount));
    formData.append('description', data.description);
    formData.append('date', data.date.toISOString());
    formData.append('accountId', data.accountId);
    formData.append('categoryId', data.categoryId);

    const result = await addTransaction(null, formData);
    if (result?.message.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    } else {
      toast({
        title: 'Éxito',
        description: result.message,
      });
      setOpen(false);
      form.reset();
    }
  };
  
  const transactionType = form.watch('type');
  const availableCategories = categories.filter(c => c.type === transactionType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Agregar Nueva Transacción</DialogTitle>
          <DialogDescription>
            Registra un nuevo ingreso o gasto en tus cuentas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Tipo de Transacción</Label>
                <RadioGroup
                    defaultValue="Gasto"
                    className="grid grid-cols-2 gap-4"
                    value={transactionType}
                    onValueChange={(value) => form.setValue('type', value as 'Ingreso' | 'Gasto', { shouldValidate: true })}
                >
                    <div>
                        <RadioGroupItem value="Gasto" id="gasto" className="peer sr-only" />
                        <Label
                        htmlFor="gasto"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        Gasto
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="Ingreso" id="ingreso" className="peer sr-only" />
                        <Label
                        htmlFor="ingreso"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        Ingreso
                        </Label>
                    </div>
                </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Monto</Label>
                    <Input id="amount" type="number" {...form.register('amount')} placeholder="0" />
                    {form.formState.errors.amount && <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                           <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !form.watch('date') && "text-muted-foreground"
                            )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {form.watch('date') ? format(form.watch('date'), "PPP", { locale: es }) : <span>Elige una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={form.watch('date')}
                                onSelect={(date) => form.setValue('date', date as Date, {shouldValidate: true})}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                     {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" {...form.register('description')} placeholder="Ej: Café con amigos" />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="accountId">Cuenta</Label>
                    <Select onValueChange={(value) => form.setValue('accountId', value, { shouldValidate: true })}>
                        <SelectTrigger><SelectValue placeholder="Selecciona una cuenta" /></SelectTrigger>
                        <SelectContent>
                            {accounts.map(account => (
                                <SelectItem key={account.accountId} value={account.accountId}>{account.accountName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.accountId && <p className="text-sm text-destructive">{form.formState.errors.accountId.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="categoryId" className="flex items-center justify-between">
                        Categoría
                        {isAiLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </Label>
                    <Select onValueChange={(value) => form.setValue('categoryId', value, { shouldValidate: true })} value={form.watch('categoryId')}>
                        <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                        <SelectContent>
                            {availableCategories.map(cat => (
                                <SelectItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.categoryId && <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>}
                </div>
            </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Agregar Transacción</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
