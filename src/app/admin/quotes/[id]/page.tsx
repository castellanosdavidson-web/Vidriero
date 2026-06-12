import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      status: true,
      glassType: true,
    }
  });

  if (!quote) {
    return notFound();
  }

  return (
    <div className="bg-background text-on-surface font-body-md antialiased overflow-x-hidden min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-4 h-16 max-w-md mx-auto left-0 right-0">
        <a href="/admin" className="flex items-center justify-center p-2 hover:bg-primary-container/10 transition-colors rounded-full active:scale-95 duration-150">
          <span className="text-primary text-2xl font-bold">←</span>
        </a>
        <h1 className="font-display text-lg font-bold tracking-tight text-primary uppercase">Detalle Cotización</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-md mx-auto">
        {/* Success State Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/10 mb-4">
             <span className="text-primary text-3xl">📄</span>
          </div>
          <h2 className="font-display text-2xl text-on-surface mb-2 font-bold">{quote.clientName}</h2>
          <p className="font-body-md text-on-surface-variant">
            Generada el {format(new Date(quote.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
          </p>
          <div className="mt-4">
             <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{ 
                  backgroundColor: `${quote.status.color}15`, 
                  color: quote.status.color,
                  borderColor: `${quote.status.color}30` 
                }}
              >
                {quote.status.name}
              </span>
          </div>
        </div>

        {/* Quote Breakdown Grid */}
        <div className="space-y-4 mb-8">
          <div className="bg-white/80 backdrop-blur border border-outline-variant/50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary text-2xl">
              🔍
            </div>
            <div>
              <p className="font-label-sm text-sm text-on-surface-variant">Tipo de Vidrio</p>
              <p className="font-body-md font-semibold">{quote.glassType.name} {quote.color}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur border border-outline-variant/50 rounded-xl p-4">
              <p className="font-label-sm text-sm text-on-surface-variant">Medidas</p>
              <p className="font-body-md font-semibold">{quote.width} x {quote.height} {quote.unit}</p>
            </div>
            <div className="bg-white/80 backdrop-blur border border-outline-variant/50 rounded-xl p-4">
              <p className="font-label-sm text-sm text-on-surface-variant">Grosor</p>
              <p className="font-body-md font-semibold">{quote.thickness}</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur border border-outline-variant/50 rounded-xl p-4">
            <p className="font-label-sm text-sm text-on-surface-variant">Datos de Contacto</p>
            <p className="font-body-md font-semibold mt-1">📞 {quote.clientPhone}</p>
            <p className="font-body-md font-semibold mt-1">📍 {quote.clientCity}</p>
          </div>
        </div>

        {/* Pricing Card */}
        <section>
          <div className="bg-inverse-surface text-white rounded-xl p-6 shadow-lg overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-white/5 blur-2xl rounded-full"></div>
            
            <h3 className="font-label-sm text-sm uppercase tracking-widest opacity-70 mb-4">Resumen de Inversión</h3>
            <div className="space-y-4 mb-6 relative z-10">
              <div className="flex justify-between items-center opacity-90">
                <span className="font-body-md">Materiales</span>
                <span className="font-body-md">${quote.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center opacity-90">
                <span className="font-body-md">Instalación</span>
                <span className="font-body-md">${quote.installationPrice.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                <span className="font-label-sm text-sm">TOTAL FINAL</span>
                <span className="font-display text-3xl font-bold text-primary-fixed">${quote.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <a 
              href={`https://wa.me/${quote.clientPhone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hola ${quote.clientName}, te escribo de VitroClic sobre tu cotización.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary hover:bg-primary-container transition-all py-3 rounded-lg flex items-center justify-center gap-2 text-white font-semibold active:scale-95 duration-150 relative z-10"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
