import { accounts, transactions, budgets, categories } from '@/lib/data';
import { AccountSummary } from '@/components/dashboard/account-summary';
import { BudgetStatus } from '@/components/dashboard/budget-status';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { DashboardHeader } from '@/components/dashboard-header';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" description="Un resumen de tus finanzas.">
        <AddTransactionDialog />
      </DashboardHeader>
      <div className="grid gap-6">
        <AccountSummary accounts={accounts} transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions transactions={transactions} categories={categories} accounts={accounts} />
          </div>
          <div>
            <BudgetStatus budgets={budgets} transactions={transactions} categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}
