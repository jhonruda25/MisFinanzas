import { transactions, categories, budgets } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { ReportsView } from '@/components/dashboard/reports-view';

export default function ReportsPage() {
  return (
    <>
      <DashboardHeader title="Reportes" description="Visualiza tus finanzas con gráficos detallados." />
      <ReportsView transactions={transactions} categories={categories} budgets={budgets} />
    </>
  );
}
