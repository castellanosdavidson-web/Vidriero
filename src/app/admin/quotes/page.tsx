import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function QuotesListPage() {
  const quotes = await prisma.quote.findMany({
    include: {
      status: true,
      glassType: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="pb-24 max-w-4xl mx-auto font-body-md text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex items-center px-4 h-16 max-w-4xl gap-3">
        <Link href="/admin" className="text-primary text-xl">←</Link>
        <h1 className="font-display font-bold tracking-tight text-primary">Todas las Cotizaciones</h1>
      </header>

      <main className="mt-24 px-4">
        {quotes.length === 0 ? (
          <p className="text-on-surface-variant text-sm py-8 text-center">No hay cotizaciones aún.</p>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="block">
                <div className="p-4 bg-white border border-outline-variant/50 rounded-xl flex gap-4 items-start shadow-sm hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary text-2xl">📄</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-label-sm text-base text-on-surface font-bold">{quote.clientName}</span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border"
                        style={{ 
                          backgroundColor: `${quote.status.color}15`, 
                          color: quote.status.color,
                          borderColor: `${quote.status.color}30` 
                        }}
                      >
                        {quote.status.name}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium">
                      {quote.glassType?.name || 'Vidrio'} ({quote.width}x{quote.height} {quote.unit})
                    </p>
                    <div className="flex justify-between mt-2 pt-2 border-t border-outline-variant/30">
                       <p className="text-sm font-bold text-primary">${quote.totalPrice.toLocaleString()}</p>
                       <p className="text-xs text-outline">{format(new Date(quote.createdAt), "d MMM, yyyy", { locale: es })}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
