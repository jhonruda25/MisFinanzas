import type { Transaction, Category, Account } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CategoryIcon } from '@/lib/icons';

type RecentTransactionsProps = {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
};

export function RecentTransactions({ transactions, categories, accounts }: RecentTransactionsProps) {
  const recent = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getCategory = (categoryId: string) => categories.find(c => c.categoryId === categoryId);
  const getAccountName = (accountId: string) => accounts.find(a => a.accountId === accountId)?.accountName;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Transacciones Recientes</CardTitle>
        <CardDescription>Tus últimos 5 movimientos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead className="hidden sm:table-cell">Categoría</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map(t => {
              const category = getCategory(t.categoryId);
              return (
                <TableRow key={t.transactionId}>
                  <TableCell>
                    <div className="font-medium">{t.description}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                        {new Date(t.date).toLocaleDateString('es-CO')}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {category && (
                      <Badge variant="outline" className="flex items-center gap-2 w-fit">
                        <CategoryIcon name={category.icon} className="h-3 w-3" />
                        {category.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(t.date).toLocaleDateString('es-CO', {day: 'numeric', month: 'long'})}</TableCell>
                  <TableCell className={`text-right font-semibold ${t.type === 'Ingreso' ? 'text-green-600' : ''}`}>
                    {t.type === 'Gasto' ? '-' : '+'}
                    {formatCurrency(t.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
