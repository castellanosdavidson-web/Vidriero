import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Settings, FileText, Package } from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[var(--color-muted)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-card)] border-r border-[var(--color-border)] flex flex-col">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-display font-bold text-[var(--color-primary)]">VitroClic Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-muted)] text-[var(--color-primary)]">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/admin/quotes" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
            <FileText className="w-4 h-4" />
            Cotizaciones
          </Link>
          <Link href="/admin/glass" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
            <Package className="w-4 h-4" />
            Tipos de Vidrio
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
            <Settings className="w-4 h-4" />
            Configuración
          </Link>
        </nav>
        <div className="p-4 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-muted-foreground)]">Admin: {session?.user?.email}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
