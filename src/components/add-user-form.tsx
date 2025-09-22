"use client";

import { useActionState } from 'react';
import { addUser } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function AddUserForm() {
  const [state, dispatch] = useActionState(addUser, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Nuevo Usuario</CardTitle>
        <CardDescription>Completa el formulario para registrar un nuevo usuario.</CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" required />
            {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
             {state?.errors?.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select name="role" required>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
            </Select>
            {state?.errors?.role && <p className="text-sm text-red-500">{state.errors.role}</p>}
          </div>
          {state?.message && state.message.startsWith('Error') && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
           {state?.message && state.message.startsWith('Usuario') && (
            <Alert>
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">Agregar Usuario</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
