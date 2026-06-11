'use client';

import React, { useState } from 'react';
import { saveInstallationRule } from '../actions';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md font-bold shadow-md hover:bg-primary/90 transition disabled:opacity-50"
    >
      {pending ? 'Guardando...' : 'Guardar Regla'}
    </button>
  );
}

export function RuleForm({ rule }: { rule?: any }) {
  const [isActive, setIsActive] = useState<boolean>(rule ? rule.isActive : true);

  return (
    <form action={saveInstallationRule} className="space-y-6 bg-white/80 backdrop-blur border border-outline-variant/50 p-6 rounded-2xl shadow-sm">
      <input type="hidden" name="id" value={rule?.id || 'new'} />
      <input type="hidden" name="isActive" value={isActive ? 'true' : 'false'} />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Nombre de la Regla</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={rule?.name} 
            required
            placeholder="Ej. Instalación en segundo piso"
            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Descripción (Opcional)</label>
          <textarea 
            name="description" 
            defaultValue={rule?.description || ''}
            placeholder="Detalles sobre cuándo aplica..."
            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Precio Base Fijo</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-on-surface-variant">$</span>
              <input 
                type="number" 
                name="basePrice" 
                step="0.01"
                defaultValue={rule?.basePrice || 0} 
                className="w-full bg-surface border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">Costo fijo que se suma una sola vez.</p>
          </div>
          <div>
            <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Precio por m²</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-on-surface-variant">$</span>
              <input 
                type="number" 
                name="pricePerM2" 
                step="0.01"
                defaultValue={rule?.pricePerM2 || 0} 
                className="w-full bg-surface border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">Se multiplica por el área total del vidrio.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`w-12 h-6 rounded-full transition-colors relative ${isActive ? 'bg-primary' : 'bg-outline-variant'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isActive ? 'left-7' : 'left-1'}`} />
          </button>
          <div className="flex flex-col">
            <span className="font-label-sm font-bold text-sm text-on-surface">Estado de la Regla</span>
            <span className="text-xs text-on-surface-variant">{isActive ? 'Activa (Se puede aplicar)' : 'Inactiva (Oculta)'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Link href="/admin/settings" className="w-full bg-surface border border-outline-variant text-on-surface text-center py-3 rounded-xl font-label-md font-bold hover:bg-outline-variant/20 transition">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
