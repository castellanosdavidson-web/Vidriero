"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCalculator } from '@/hooks/useCalculator';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const quoteSchema = z.object({
  clientName: z.string().min(2, 'Nombre requerido'),
  clientPhone: z.string().min(5, 'Teléfono requerido'),
  clientCity: z.string().min(2, 'Ciudad requerida'),
  glassTypeId: z.string().min(1, 'Selecciona un vidrio'),
  color: z.string().min(1, 'Selecciona un color'),
  thickness: z.string().min(1, 'Selecciona el grosor'),
  height: z.number().min(1, 'Alto requerido'),
  width: z.number().min(1, 'Ancho requerido'),
  unit: z.enum(['CM', 'M']),
  requiresInstall: z.boolean(),
  hardwareName: z.string().optional(),
  observations: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const MOCK_GLASS_TYPES = [
  { id: '1', name: 'Vidrio Templado', description: '4 a 5 veces más resistente que el vidrio común.', pricePerM2: 85000, icon: 'shield' },
  { id: '3', name: 'Vidrio Laminado', description: 'Dos capas unidas por una lámina. Acústico y seguro.', pricePerM2: 120000, icon: 'layers' },
  { id: '2', name: 'Espejo Plata', description: 'Recubrimiento reflectante premium.', pricePerM2: 65000, icon: 'auto_awesome' },
];

export default function QuoteForm({ glassTypes }: { glassTypes: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialGlassId = searchParams.get('glass');
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdQuoteId, setCreatedQuoteId] = useState<string | null>(null);
  
  // Ensure we fall back gracefully if no glass types are available
  const fallbackGlass = glassTypes && glassTypes.length > 0 ? glassTypes[0] : { id: 'dummy', name: 'No hay vidrios', pricePerM2: 0, thicknesses: '[]', colors: '[]' };
  
  // Find requested glass or use fallback
  const initialGlass = (glassTypes || []).find(g => g.id === initialGlassId) || fallbackGlass;
  
  const [selectedGlass, setSelectedGlass] = useState(initialGlass);
  const [selectedHardware, setSelectedHardware] = useState<any>(null);
  const [showCrossSell, setShowCrossSell] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientCity: '',
      unit: 'CM',
      requiresInstall: false,
      glassTypeId: initialGlass.id,
      color: 'claro',
      thickness: '4mm',
      height: 100,
      width: 100,
      hardwareName: '',
    },
  });

  const watchAllFields = watch();

  const calculatorOutputs = useCalculator({
    height: watchAllFields.height || 0,
    width: watchAllFields.width || 0,
    unit: watchAllFields.unit || 'CM',
    pricePerM2: selectedGlass.pricePerM2,
    requiresInstall: watchAllFields.requiresInstall || false,
    baseInstallPrice: 30000,
    installPricePerM2: 15000,
    surcharges: 0,
    minArea: selectedGlass.minArea || 0.30,
    hardwarePrice: selectedHardware ? selectedHardware.price : 0,
  });

  // Cross-selling Trigger Logic
  React.useEffect(() => {
    if (selectedGlass.productType === 'SYSTEM' || selectedGlass.category === 'Divisiones de Baño') {
      setShowCrossSell(true);
    } else {
      setShowCrossSell(false);
    }
  }, [selectedGlass]);

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...calculatorOutputs,
          hardwarePrice: selectedHardware ? selectedHardware.price : 0
        }),
      });
      const result = await response.json();
      if (result.success && result.id) {
        setIsSuccess(true);
        setCreatedQuoteId(result.id);
        setShowSuccessPopup(true);
      } else {
        alert("Error al guardar cotización.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Progress */}
        <div className="mb-8" id="cotizador">
          <div className="flex justify-between items-end mb-2">
            <span className="font-label-sm text-sm text-primary uppercase tracking-widest">Paso {step} de 4</span>
            <span className="font-display text-xl text-white font-bold">
              {step === 1 && "Datos de Contacto"}
              {step === 2 && "Dimensiones"}
              {step === 3 && "Tipo de Vidrio"}
              {step === 4 && "Instalación & Resumen"}
            </span>
          </div>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {/* Step 1: Contacto */}
        <div className={`transition-all duration-300 ${step === 1 ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="font-label-sm text-sm text-slate-300">Nombre Completo</label>
              <input {...register('clientName')} className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-lg text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600" placeholder="Ej. Juan Pérez" />
              {errors.clientName && <p className="text-red-400 text-xs">{errors.clientName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-sm text-slate-300">Teléfono</label>
              <input {...register('clientPhone')} className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-lg text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600" placeholder="+57 300 000 0000" />
              {errors.clientPhone && <p className="text-red-400 text-xs">{errors.clientPhone.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-sm text-slate-300">Ciudad</label>
              <input {...register('clientCity')} className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-lg text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600" placeholder="Bogotá" />
              {errors.clientCity && <p className="text-red-400 text-xs">{errors.clientCity.message}</p>}
            </div>
          </div>
        </div>

        {/* Step 2: Dimensiones */}
        <div className={`transition-all duration-300 ${step === 2 ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="flex justify-end items-center gap-2 mb-6">
            <span className="font-label-sm text-sm text-slate-400">Unidad:</span>
            <div className="bg-[#0A0D14] border border-white/10 rounded-full p-1 flex">
              <button type="button" onClick={() => setValue('unit', 'CM')} className={`px-4 py-1.5 rounded-full font-label-sm text-sm transition-all ${watchAllFields.unit === 'CM' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>CM</button>
              <button type="button" onClick={() => setValue('unit', 'M')} className={`px-4 py-1.5 rounded-full font-label-sm text-sm transition-all ${watchAllFields.unit === 'M' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>M</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="font-label-sm text-sm text-slate-300">Ancho ({watchAllFields.unit})</label>
              <div className="relative">
                <input type="number" {...register('width', { valueAsNumber: true })} className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">↔</div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-sm text-slate-300">Alto ({watchAllFields.unit})</label>
              <div className="relative">
                <input type="number" {...register('height', { valueAsNumber: true })} className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">↕</div>
              </div>
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <span className="font-label-sm text-sm text-primary uppercase tracking-widest">Área Total Estimada</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl text-white font-bold">{calculatorOutputs.rawAreaM2.toFixed(2)}</span>
              <span className="font-display text-xl text-slate-400 font-semibold">m²</span>
            </div>
            {calculatorOutputs.rawAreaM2 < (selectedGlass.minArea || 0.3) && (
              <p className="text-xs text-red-400 mt-2 font-medium">Nota: Por políticas de producción, se facturará un área mínima de {(selectedGlass.minArea || 0.3).toFixed(2)} m².</p>
            )}
          </div>
        </div>

        {/* Step 3: Vidrio */}
        <div className={`transition-all duration-300 ${step === 3 ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {glassTypes && glassTypes.map((glass: any) => {
              const isSelected = watchAllFields.glassTypeId === glass.id;
              // Use a generic icon for now
              const icon = 'shield'; 
              return (
                <button
                  key={glass.id}
                  type="button"
                  onClick={() => {
                    setValue('glassTypeId', glass.id);
                    setSelectedGlass(glass);
                    // Reset thickness and color when glass changes to avoid invalid combinations
                    try {
                      const t = JSON.parse(glass.thicknesses);
                      if (t.length > 0) setValue('thickness', t[0]);
                      const c = JSON.parse(glass.colors);
                      if (c.length > 0) setValue('color', c[0]);
                    } catch(e) {}
                  }}
                  className={`text-left p-4 rounded-xl border transition-all group ${isSelected ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-white/10 bg-[#0A0D14] hover:border-white/30'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                     🛡️
                  </div>
                  <h3 className="font-display text-sm font-bold text-white mb-1">{glass.name}</h3>
                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">{glass.description}</p>
                  <p className="text-xs font-semibold text-primary">${glass.pricePerM2.toLocaleString()}/m²</p>
                </button>
              );
            })}
            {(!glassTypes || glassTypes.length === 0) && (
              <p className="text-sm text-error col-span-3">No hay vidrios disponibles. Agrega uno en el panel de administración.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-label-sm text-sm text-slate-300">Grosor</label>
              <select {...register('thickness')} className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none">
                {(() => {
                  try {
                    const t = JSON.parse(selectedGlass.thicknesses || '[]');
                    if (t.length === 0) return <option value="">N/A</option>;
                    return t.map((thick: string) => <option key={thick} value={thick}>{thick}</option>);
                  } catch(e) { return <option value="4mm">4mm</option>; }
                })()}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-sm text-slate-300">Color / Tinte</label>
              <select {...register('color')} className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none">
                {(() => {
                  try {
                    const c = JSON.parse(selectedGlass.colors || '[]');
                    if (c.length === 0) return <option value="">N/A</option>;
                    return c.map((col: string) => <option key={col} value={col}>{col}</option>);
                  } catch(e) { return <option value="claro">Claro</option>; }
                })()}
              </select>
            </div>
          </div>

          {/* Opciones de Herrajes (Si es un Sistema) */}
          {(() => {
            try {
              const h = JSON.parse(selectedGlass.hardwareOptions || '[]');
              if (h.length > 0) {
                return (
                  <div className="mt-6 space-y-1">
                    <label className="font-label-sm text-sm text-slate-300">Acabado de Herrajes</label>
                    <select 
                      {...register('hardwareName')} 
                      onChange={(e) => {
                        const selected = h.find((opt: any) => opt.name === e.target.value);
                        setSelectedHardware(selected || null);
                        setValue('hardwareName', e.target.value);
                      }}
                      className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    >
                      <option value="">Ninguno (Solo Vidrio)</option>
                      {h.map((opt: any) => (
                        <option key={opt.name} value={opt.name}>{opt.name} (+${opt.price.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>
                );
              }
              return null;
            } catch(e) { return null; }
          })()}
        </div>

        {/* Step 4: Instalación y Resumen */}
        <div className={`transition-all duration-300 ${step === 4 ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setValue('requiresInstall', true)}
              className={`flex flex-col items-center justify-center py-6 rounded-xl border transition-all group ${watchAllFields.requiresInstall ? 'border-primary bg-primary/10 ring-1 ring-primary text-white' : 'border-white/10 hover:border-white/30 bg-[#0A0D14] text-slate-400'}`}
            >
              <span className={`text-3xl mb-2 ${watchAllFields.requiresInstall ? '' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}>👷‍♂️</span>
              <span className="font-label-sm text-sm font-bold">Sí, instalar</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('requiresInstall', false)}
              className={`flex flex-col items-center justify-center py-6 rounded-xl border transition-all group ${!watchAllFields.requiresInstall ? 'border-primary bg-primary/10 ring-1 ring-primary text-white' : 'border-white/10 hover:border-white/30 bg-[#0A0D14] text-slate-400'}`}
            >
              <span className={`text-3xl mb-2 ${!watchAllFields.requiresInstall ? '' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}>📦</span>
              <span className="font-label-sm text-sm font-bold">Solo entrega</span>
            </button>
          </div>

          <div className="bg-inverse-surface text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h3 className="text-lg font-display font-medium text-white/80 mb-4 relative z-10">Resumen Final</h3>
            
            <div className="space-y-3 text-sm relative z-10">
              <div className="flex justify-between">
                <span className="text-white/60">Suministro de Vidrio ({(calculatorOutputs.areaM2).toFixed(2)} m²)</span>
                <span>${calculatorOutputs.basePrice.toLocaleString()}</span>
              </div>
              {selectedHardware && (
                <div className="flex justify-between">
                  <span className="text-white/60">Kit de Herrajes ({selectedHardware.name})</span>
                  <span>${calculatorOutputs.hardwarePrice.toLocaleString()}</span>
                </div>
              )}
              {watchAllFields.requiresInstall && (
                <div className="flex justify-between">
                  <span className="text-white/60">Instalación Certificada</span>
                  <span>${calculatorOutputs.installationPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-white/20 pt-4 mt-6 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-white/60">Total Estimado</span>
                <span className="text-4xl font-display font-bold text-primary-fixed">
                  ${calculatorOutputs.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 flex justify-between bg-black/20 p-3 rounded-lg text-xs">
                <div>
                  <p className="text-white/60 uppercase tracking-widest text-[10px]">Anticipo para iniciar (50%)</p>
                  <p className="font-bold text-base text-white">${(calculatorOutputs.totalPrice / 2).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 uppercase tracking-widest text-[10px]">Saldo a contraentrega (50%)</p>
                  <p className="font-bold text-base text-white">${(calculatorOutputs.totalPrice / 2).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Venta Cruzada (Cross-Selling) */}
          {showCrossSell && (
            <div className="mt-6 bg-secondary/10 border border-secondary/30 rounded-xl p-5 flex items-start gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h4 className="font-bold text-white text-sm">Completa tu baño con un Espejo Flotante</h4>
                <p className="text-xs text-slate-300 mt-1 mb-3">Lleva un espejo decorativo a medida con un <strong className="text-secondary">20% de Descuento</strong> al contratar tu división de baño.</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-secondary rounded focus:ring-secondary/50 bg-[#0A0D14] border-white/20" />
                  <span className="text-sm font-medium text-white">Sí, quiero cotizar también el espejo</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex justify-between items-center mt-8">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="text-slate-400 font-label-sm text-sm flex items-center gap-2 hover:text-white transition-colors">
               ← Atrás
            </button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button type="button" onClick={nextStep} className="bg-primary text-white font-label-sm font-bold text-sm px-8 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
              Siguiente →
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isSubmitting || isSuccess}
              className="bg-primary text-white font-label-sm font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Procesando...' : isSuccess ? '¡Completado!' : 'Finalizar ✓'}
            </button>
          )}
        </div>

      </form>

      {/* Success Popup Modal */}
      {showSuccessPopup && createdQuoteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0D14]/80 backdrop-blur-sm" onClick={() => {}}></div>
          <div className="relative z-10 bg-[#11141D] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center transform animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">¡Cotización Exitosa!</h3>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm">
              Hemos recibido tu solicitud. Nuestro equipo comercial la revisará y pronto nos pondremos en contacto contigo para confirmar medidas y coordinar el servicio.
            </p>
            <a
              href={`/cotizacion/comprobante/${createdQuoteId}`}
              className="w-full bg-primary text-white font-label-sm font-bold py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              Ver Ticket de Cotización 📄
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
