import { transactions, categories, accounts } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function TransactionsPage() {
  const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getCategory = (categoryId: string) => categories.find(c => c.id === categoryId);
  const getAccountName = (accountId: string) => accounts.find(a => a.id === accountId)?.name;

  return (
    <>
      <DashboardHeader title="Transacciones" description="Aquí puedes ver todos tus movimientos.">
        <AddTransactionDialog />
      </DashboardHeader>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Cuenta</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map(t => {
                const category = getCategory(t.categoryId);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>{getAccountName(t.accountId)}</TableCell>
                    <TableCell>
                      {category && (
                        <Badge variant="outline" className="flex items-center gap-2 w-fit">
                          {category.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(t.date).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell className={`text-right font-semibold ${t.amount > 0 ? 'text-green-600' : ''}`}>
                      {t.amount < 0 ? '-' : '+'}
                      {formatCurrency(Math.abs(t.amount))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
