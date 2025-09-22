import { budgets, transactions, categories } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { AddBudgetDialog } from '@/components/dashboard/add-budget-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

export default function BudgetsPage() {
  const getCategory = (categoryId: string) => categories.find(c => c.id === categoryId);

  const calculateSpent = (budget: typeof budgets[0]) => {
    return transactions
      .filter(t =>
        t.categoryId === budget.categoryId && t.amount < 0
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  return (
    <>
      <DashboardHeader title="Presupuestos" description="Crea y gestiona tus presupuestos mensuales por categoría.">
        <AddBudgetDialog />
      </DashboardHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map(budget => {
          const spent = calculateSpent(budget);
          const progress = (spent / budget.amount) * 100;
          const remaining = budget.amount - spent;
          const category = getCategory(budget.categoryId);

          const isOverBudget = progress > 100;
          const isNearBudget = progress >= 90 && progress <= 100;
          
          let progressColorClass = 'bg-primary';
          if (isOverBudget) progressColorClass = 'bg-destructive';
          else if (isNearBudget) progressColorClass = 'bg-yellow-500';

          return (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CardDescription>{category?.name}</CardDescription>
                </div>
                <CardTitle className="font-headline text-2xl">{formatCurrency(budget.amount)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between text-sm">
                    <span>Gastado</span>
                    <span>{formatCurrency(spent)}</span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" indicatorClassName={progressColorClass} />
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <span>{Math.round(progress)}%</span>
                    <span>{isOverBudget ? `Excedido por ${formatCurrency(Math.abs(remaining))}` : `Quedan ${formatCurrency(remaining)}`}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
