import type { Account, Transaction } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, CreditCard } from 'lucide-react';

type AccountSummaryProps = {
  accounts: Account[];
  transactions: Transaction[];
};

export function AccountSummary({ accounts, transactions }: AccountSummaryProps) {
  const calculateBalance = (account: Account) => {
    const accountTransactions = transactions.filter(t => t.accountId === account.accountId);
    const balance = accountTransactions.reduce((acc, t) => {
      if (t.type === 'Ingreso') {
        return acc + t.amount;
      }
      return acc - t.amount;
    }, account.initialBalance);
    return balance;
  };

  return (
    <div>
      <h2 className="text-xl font-headline font-semibold mb-4">Resumen de Cuentas</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map(account => (
          <Card key={account.accountId}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{account.accountName}</CardTitle>
              {account.accountType === 'Débito' ? <DollarSign className="h-4 w-4 text-muted-foreground" /> : <CreditCard className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(calculateBalance(account))}</div>
              <p className="text-xs text-muted-foreground">{account.accountType}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
