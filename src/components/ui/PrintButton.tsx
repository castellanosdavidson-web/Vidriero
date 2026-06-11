'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button 
      type="button" 
      onClick={() => window.print()}
      className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:bg-primary/90 transition flex items-center gap-2"
    >
      <Printer size={20} /> Descargar / Imprimir
    </button>
  );
}
