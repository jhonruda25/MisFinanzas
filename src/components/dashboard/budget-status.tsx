import type { Budget, Transaction, Category } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type BudgetStatusProps = {
  budgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
};

export function BudgetStatus({ budgets, transactions, categories }: BudgetStatusProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.categoryId === categoryId)?.name || 'Desconocido';
  };

  const calculateSpent = (budget: Budget) => {
    const budgetStart = new Date(budget.startDate);
    const budgetEnd = new Date(budget.endDate);

    return transactions
      .filter(t =>
        t.categoryId === budget.categoryId &&
        t.type === 'Gasto' &&
        new Date(t.date) >= budgetStart &&
        new Date(t.date) <= budgetEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Estado de Presupuestos</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {budgets.map(budget => {
          const spent = calculateSpent(budget);
          const progress = (spent / budget.amount) * 100;
          const isOverBudget = progress > 100;
          const isNearBudget = progress >= 90 && progress <= 100;
          
          let progressColorClass = 'bg-primary';
          if (isOverBudget) progressColorClass = 'bg-destructive';
          else if (isNearBudget) progressColorClass = 'bg-yellow-500';

          return (
            <div key={budget.budgetId} className="grid gap-2">
              <div className="flex items-center justify-between font-semibold">
                <span>{getCategoryName(budget.categoryId)}</span>
                <span className="flex items-center gap-2 text-sm">
                  {isOverBudget ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2 [&>div]:bg-primary" indicatorClassName={progressColorClass} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
