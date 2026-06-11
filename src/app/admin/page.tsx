import React from 'react';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const quotes = await prisma.quote.findMany({
    include: {
      status: true,
      glassType: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });

  const totalQuotes = await prisma.quote.count();
  const totalRevenue = quotes.reduce((acc, quote) => acc + quote.totalPrice, 0);

  return (
    <div className="pb-24 max-w-4xl mx-auto font-body-md text-on-surface">
      {/* Top App Bar (Optional inside the layout, but we'll include a simple header here) */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-4 h-16 max-w-4xl">
        <div className="flex items-center gap-3">
          <span className="text-primary text-xl">☰</span>
          <h1 className="font-display font-bold tracking-tight text-primary">VIDRIERO ADMIN</h1>
        </div>
        <div className="flex items-center">
          <form action="/api/auth/signout" method="POST">
             <button type="submit" className="text-sm font-label-sm text-error bg-error/10 px-3 py-1.5 rounded-lg font-bold">Salir</button>
          </form>
        </div>
      </header>

      <main className="mt-20 px-4 space-y-4">
        {/* Welcome Section */}
        <section className="py-4">
          <p className="font-label-sm text-sm text-on-surface-variant">Hola, Administrador</p>
          <h2 className="font-display text-2xl text-on-surface font-bold">Panel de Control</h2>
        </section>

        {/* KPI Grid (Bento Style) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-white/80 backdrop-blur border border-outline-variant/50 p-4 rounded-xl space-y-2 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-sm text-on-surface-variant">Total Ingresos Estimados</span>
              <span className="text-primary/60 text-xl">💰</span>
            </div>
            <div>
              <p className="font-display text-3xl text-primary font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="text-sm">↗</span> +12% este mes
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur border border-outline-variant/50 p-4 rounded-xl space-y-2 shadow-sm">
            <span className="font-label-sm text-sm text-on-surface-variant">Cotizaciones</span>
            <p className="font-display text-3xl text-on-surface font-bold">{totalQuotes}</p>
            <p className="text-xs text-on-surface-variant">Activas</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-outline-variant/50 p-4 rounded-xl space-y-2 shadow-sm">
            <span className="font-label-sm text-sm text-on-surface-variant">Conversión</span>
            <p className="font-display text-3xl text-on-surface font-bold">-- %</p>
            <p className="text-xs text-on-surface-variant">Estimada</p>
          </div>
        </section>

        {/* Management Quick Links */}
        <section className="py-4 space-y-4">
          <h3 className="font-label-sm text-sm text-on-surface-variant uppercase tracking-widest">Gestión</h3>
          <div className="space-y-2">
            <Link href="/admin/glass" className="flex items-center justify-between p-4 bg-white/80 border border-outline-variant/50 rounded-xl hover:bg-primary-container/10 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-primary text-xl">📦</span>
                <span className="font-label-sm text-sm text-on-surface font-semibold">Gestionar Catálogo y Precios</span>
              </div>
              <span className="text-outline">›</span>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-label-sm text-sm text-on-surface-variant uppercase tracking-widest">Cotizaciones Recientes</h3>
            <Link href="/admin/quotes" className="text-primary font-label-sm text-sm hover:underline">Ver todas</Link>
          </div>

          <div className="space-y-2">
            {quotes.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No hay cotizaciones aún.</p>
            ) : (
              quotes.map((quote) => (
                <Link key={quote.id} href={`/admin/quotes/${quote.id}`}>
                  <div className="p-4 bg-white border border-outline-variant/50 rounded-xl flex gap-4 items-start shadow-sm hover:border-primary/50 transition-colors mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-lg">📄</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-label-sm text-sm text-on-surface font-bold">{quote.clientName}</span>
                        <span 
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                          style={{ 
                            backgroundColor: `${quote.status.color}15`, 
                            color: quote.status.color,
                            borderColor: `${quote.status.color}30` 
                          }}
                        >
                          {quote.status.name}
                        </span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant font-medium">{quote.glassType.name} ({quote.width}x{quote.height} {quote.unit})</p>
                      <div className="flex justify-between">
                         <p className="text-[12px] font-bold text-primary">${quote.totalPrice.toLocaleString()}</p>
                         <p className="text-[10px] text-outline">{format(new Date(quote.createdAt), "d MMM", { locale: es })}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
