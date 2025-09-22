
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Wallet,
  Target,
  BarChart,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { logout } from '@/lib/actions';
import { users } from '@/lib/data';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/transactions',
    label: 'Transacciones',
    icon: Wallet,
  },
  {
    href: '/dashboard/budgets',
    label: 'Presupuestos',
    icon: Target,
  },
  {
    href: '/dashboard/reports',
    label: 'Reportes',
    icon: BarChart,
  },
];

// NOTE: In a real app, you would get the current user from the session.
// For this demo, we'll just grab the first user.
const currentUser = users[0];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {currentUser?.role === 'admin' && (
             <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === '/dashboard/admin'}
                tooltip="Administrador">
                <Link href="/dashboard/admin">
                  <Shield />
                  <span>Administrador</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={pathname === '/dashboard/settings'}
              tooltip="Ajustes">
              <Link href="/dashboard/settings">
                <Settings />
                <span>Ajustes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton asChild tooltip="Cerrar Sesión">
                  <button className="w-full">
                      <LogOut />
                      <span>Cerrar Sesión</span>
                  </button>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
