'use client';

import React from 'react';
import { saveWhatsAppNumber } from '../actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md font-bold shadow-md hover:bg-primary/90 transition disabled:opacity-50"
    >
      {pending ? 'Guardando...' : 'Guardar Número'}
    </button>
  );
}

export function GeneralSettingsForm({ currentNumber }: { currentNumber: string }) {
  return (
    <form action={saveWhatsAppNumber} className="bg-white/80 backdrop-blur border border-outline-variant/50 p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="font-display font-bold text-on-surface text-lg">Número de WhatsApp</h3>
        <p className="text-sm text-on-surface-variant mt-1 mb-4">Este es el número al que los clientes enviarán el ticket de cotización al finalizar.</p>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1 max-w-sm">
            <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Celular (con código de país sin '+')</label>
            <input 
              type="text" 
              name="whatsappNumber" 
              defaultValue={currentNumber} 
              required
              placeholder="Ej. 573000000000"
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
