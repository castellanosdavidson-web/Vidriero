import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';

export default async function ComprobantePage({ params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      glassType: true,
      installationRule: true,
    }
  });

  if (!quote) {
    notFound();
  }

  const isLaminated = quote.glassType.category?.includes('Laminado');
  const isTempered = quote.glassType.category?.includes('Templado');

  return (
    <div className="min-h-screen bg-[#0A0D14] font-body-md text-slate-200 py-12 px-4 flex items-center justify-center relative overflow-hidden print:bg-white print:text-black print:p-0">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 print:hidden"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10 print:hidden"></div>
      
      <div className="max-w-2xl w-full bg-[#11141D]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none print:bg-white print:rounded-none z-10">
        
        {/* Header del Comprobante */}
        <div className="bg-primary p-8 text-on-primary flex justify-between items-center print:bg-white print:text-black print:border-b-2 print:border-black">
          <div>
            <h1 className="font-display text-3xl font-bold">Comprobante de Cotización</h1>
            <p className="opacity-80 mt-1 print:opacity-100">ID: {quote.id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-display font-bold text-3xl print:bg-black print:text-white">
            V
          </div>
        </div>

        {/* Cuerpo del Ticket */}
        <div className="p-8 space-y-8">
          
          <div className="flex justify-between items-start border-b border-white/10 pb-6 print:border-black/20">
            <div>
              <h2 className="text-sm font-label-sm font-bold text-primary uppercase tracking-widest mb-1 print:text-black">Cliente</h2>
              <p className="font-bold text-lg text-white print:text-black">{quote.clientName}</p>
              <p className="text-slate-400 print:text-black/70">{quote.clientPhone}</p>
              <p className="text-slate-400 print:text-black/70">{quote.clientCity}</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-label-sm font-bold text-primary uppercase tracking-widest mb-1 print:text-black">Fecha</h2>
              <p className="font-medium text-white print:text-black">{new Date(quote.createdAt).toLocaleDateString('es-CO')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-label-sm font-bold text-primary uppercase tracking-widest mb-4 print:text-black">Detalles del Proyecto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl print:border print:border-black/20 print:bg-transparent">
                <span className="block text-xs text-slate-400 mb-1 print:text-black/70">Material</span>
                <span className="font-bold text-white print:text-black">{quote.glassType.name}</span>
                <span className="block text-xs text-primary mt-1 print:text-black">{quote.glassType.category}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl print:border print:border-black/20 print:bg-transparent">
                <span className="block text-xs text-slate-400 mb-1 print:text-black/70">Dimensiones</span>
                <span className="font-bold text-white print:text-black">{quote.width} x {quote.height} {quote.unit}</span>
                <span className="block text-xs text-slate-500 mt-1 print:text-black/70">Área: {quote.areaM2.toFixed(2)} m²</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl print:border print:border-black/20 print:bg-transparent">
                <span className="block text-xs text-slate-400 mb-1 print:text-black/70">Grosor y Color</span>
                <span className="font-bold text-white print:text-black">{quote.thickness} / {quote.color}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl print:border print:border-black/20 print:bg-transparent">
                <span className="block text-xs text-slate-400 mb-1 print:text-black/70">Instalación</span>
                <span className="font-bold text-white print:text-black">{quote.requiresInstall ? 'Sí (Incluida)' : 'No requerida'}</span>
                {quote.installationRule && (
                  <span className="block text-xs text-slate-500 mt-1 print:text-black/70">{quote.installationRule.name}</span>
                )}
              </div>
              {quote.hardwareName && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl print:border print:border-black/20 print:bg-transparent">
                  <span className="block text-xs text-slate-400 mb-1 print:text-black/70">Herrajes Adicionales</span>
                  <span className="font-bold text-white print:text-black">{quote.hardwareName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Totales */}
          <div className="border-t border-white/10 pt-6 print:border-black/20">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-300 print:text-black/80">
                <span>Costo de Material ({quote.areaM2.toFixed(2)} m²)</span>
                <span>${quote.basePrice.toLocaleString()}</span>
              </div>
              {quote.hardwarePrice > 0 && (
                <div className="flex justify-between text-slate-300 print:text-black/80">
                  <span>Kit de Herrajes</span>
                  <span>${quote.hardwarePrice.toLocaleString()}</span>
                </div>
              )}
              {quote.installationPrice > 0 && (
                <div className="flex justify-between text-slate-300 print:text-black/80">
                  <span>Cargo por Instalación</span>
                  <span>${quote.installationPrice.toLocaleString()}</span>
                </div>
              )}
              {quote.surcharges > 0 && (
                <div className="flex justify-between text-slate-300 print:text-black/80">
                  <span>Recargos Adicionales</span>
                  <span>${quote.surcharges.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center bg-primary/10 border border-primary/20 p-4 rounded-xl print:border print:border-black/30 print:bg-transparent">
              <span className="font-bold text-lg text-primary print:text-black">Precio Total Estimado</span>
              <span className="font-display font-bold text-3xl text-primary print:text-black">${quote.totalPrice.toLocaleString()}</span>
            </div>

            {/* 50/50 Payment Split */}
            <div className="mt-6 flex justify-between bg-white/5 border border-white/5 p-4 rounded-xl print:border print:border-black/30 print:bg-transparent">
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold print:text-black/70">Anticipo Requerido (50%)</p>
                <p className="font-bold text-lg text-white print:text-black">${(quote.totalPrice / 2).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold print:text-black/70">Saldo a Contraentrega (50%)</p>
                <p className="font-bold text-lg text-white print:text-black">${(quote.totalPrice / 2).toLocaleString()}</p>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 mt-6 print:text-black/60">
              *Este documento es una estimación sujeta a rectificación de medidas en obra. Validez de 15 días.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-[#0A0D14]/80 p-6 flex justify-center gap-4 border-t border-white/10 print:hidden">
          <Link href="/" className="px-6 py-3 font-bold text-slate-400 hover:text-white transition">
            Volver al Inicio
          </Link>
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
