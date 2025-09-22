import { PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <PiggyBank className="size-8 text-primary" />
      <span className="font-headline text-2xl font-bold">
        Mis Finanzas
      </span>
    </div>
  );
}
