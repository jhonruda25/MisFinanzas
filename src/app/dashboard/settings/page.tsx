
import { categories, accounts } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CategoryIcon } from '@/lib/icons';

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Ajustes" description="Gestiona tus categorías, cuentas y otras configuraciones." />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Categorías</CardTitle>
                <CardDescription>Edita o elimina tus categorías de ingresos y gastos.</CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Categoría
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.categoryId}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className="h-4 w-4" />
                      {cat.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cat.type === 'Gasto' ? 'destructive' : 'default'}>
                        {cat.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cuentas</CardTitle>
                <CardDescription>Administra tus cuentas de débito y crédito.</CardDescription>
              </div>
               <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Cuenta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc.accountId}>
                    <TableCell className="font-medium">{acc.accountName}</TableCell>
                    <TableCell>{acc.accountType}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
