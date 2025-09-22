import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// Rutas que no requieren autenticación
const publicRoutes = ['/login', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la ruta es pública, no hacer nada
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Para todas las demás rutas (protegidas)
  const session = await getSession();

  // Si no hay sesión, redirigir a login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay sesión, permitir el acceso
  return NextResponse.next();
}

export const config = {
  // Proteger todas las rutas excepto las de la API, Next.js y archivos estáticos
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
