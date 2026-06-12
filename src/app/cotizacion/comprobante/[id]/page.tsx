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

  const whatsappSetting = await prisma.setting.findUnique({
    where: { key: 'WHATSAPP_NUMBER' }
  });
  const whatsappNumber = whatsappSetting?.value || '573000000000';

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
        <div className="bg-[#0A0D14]/80 p-6 flex justify-center gap-4 border-t border-white/10 print:hidden flex-wrap">
          <Link href="/" className="px-6 py-3 font-bold text-slate-400 hover:text-white transition flex items-center justify-center">
            Volver
          </Link>
          <PrintButton />
          <a 
            href={`https://wa.me/${whatsappNumber}?text=Hola,%20acabo%20de%20generar%20una%20cotizaci%C3%B3n%20en%20su%20p%C3%A1gina%20web.%0A%0A%2ACliente:%2A%20${quote.clientName}%0A%2AID%20Cotizaci%C3%B3n:%2A%20${quote.id.slice(-8).toUpperCase()}%0A%2ATotal%20Estimado:%2A%20$${quote.totalPrice.toLocaleString()}%0A%0AMe%20gustar%C3%ADa%20coordinar%20el%20servicio.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold shadow-md hover:bg-[#20b858] transition flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Notificar a Asesor
          </a>
        </div>
      </div>
    </div>
  );
}
