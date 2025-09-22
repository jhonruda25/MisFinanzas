"use client";

import { useMemo } from 'react';
import type { Transaction, Category, Budget } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';

type ReportsViewProps = {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
};

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function ReportsView({ transactions, categories, budgets }: ReportsViewProps) {
  const monthlySummary = useMemo(() => {
    const data: { [key: string]: { month: string; ingresos: number; gastos: number } } = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('es-CO', { month: 'short', year: '2-digit' });
      if (!data[month]) {
        data[month] = { month, ingresos: 0, gastos: 0 };
      }
      if (t.type === 'Ingreso') {
        data[month].ingresos += t.amount;
      } else {
        data[month].gastos += t.amount;
      }
    });
    return Object.values(data).reverse();
  }, [transactions]);
  
  const expenseByCategory = useMemo(() => {
    const data: { [key: string]: { name: string; value: number } } = {};
    transactions
      .filter(t => t.type === 'Gasto')
      .forEach(t => {
        const categoryName = categories.find(c => c.categoryId === t.categoryId)?.name || 'Otros';
        if (!data[categoryName]) {
          data[categoryName] = { name: categoryName, value: 0 };
        }
        data[categoryName].value += t.amount;
      });
    return Object.values(data);
  }, [transactions, categories]);

  const budgetVsActual = useMemo(() => {
    return budgets.map(budget => {
        const categoryName = categories.find(c => c.categoryId === budget.categoryId)?.name || 'Desconocido';
        const actual = transactions
            .filter(t => t.categoryId === budget.categoryId && t.type === 'Gasto')
            .reduce((sum, t) => sum + t.amount, 0);
        return { name: categoryName, budget: budget.amount, actual, difference: budget.amount - actual };
    });
  }, [budgets, transactions, categories]);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs. Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <BarChart data={monthlySummary} accessibilityLayer>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="ingresos" fill="hsl(var(--chart-2))" radius={4} name="Ingresos" />
                <Bar dataKey="gastos" fill="hsl(var(--chart-3))" radius={4} name="Gastos" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                         {expenseByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Presupuesto vs. Real</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Presupuesto</TableHead>
                        <TableHead className="text-right">Gastado</TableHead>
                        <TableHead className="text-right">Diferencia</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {budgetVsActual.map(item => (
                        <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.budget)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                            <TableCell className={`text-right ${item.difference < 0 ? 'text-destructive' : ''}`}>
                                {formatCurrency(item.difference)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
