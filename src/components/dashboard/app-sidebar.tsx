
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
  Users,
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
import { getCurrentUser } from '@/lib/session';
import { useEffect, useState } from 'react';
import { User } from '@/lib/definitions';

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

export function AppSidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

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
                isActive={pathname.startsWith('/dashboard/users')}
                tooltip="Usuarios">
                <Link href="/dashboard/users">
                  <Users />
                  <span>Usuarios</span>
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
