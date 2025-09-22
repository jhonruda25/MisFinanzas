"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addBudget } from '@/lib/actions';
import { categories } from '@/lib/data';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Agregar Presupuesto
    </Button>
  );
}

export function AddBudgetDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, formAction] = useFormState(addBudget, initialState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await addBudget(null, formData);
    
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
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'Gasto');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Presupuesto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Crear Nuevo Presupuesto</DialogTitle>
          <DialogDescription>
            Define un límite de gasto mensual para una categoría.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoría</Label>
            <Select name="categoryId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría de gasto" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map(cat => (
                  <SelectItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto del Presupuesto</Label>
            <Input id="amount" name="amount" type="number" placeholder="0" required />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
