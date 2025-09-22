import type { ReactNode } from 'react';

type DashboardHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="grid gap-1">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
