import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center">
        <Logo />
        <Button asChild variant="outline">
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <section className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4">
            Toma el Control de tus Finanzas Personales
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Nuestra aplicación te ayuda a registrar tus transacciones, crear presupuestos y visualizar tus hábitos de gasto de una manera simple e intuitiva.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Comenzar Ahora</Link>
          </Button>
        </section>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mis Finanzas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
