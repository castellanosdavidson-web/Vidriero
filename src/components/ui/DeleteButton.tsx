'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

export function DeleteButton() {
  return (
    <button 
      type="submit" 
      className="p-2 text-on-surface-variant hover:text-error bg-surface border border-outline-variant/50 rounded-lg transition" 
      onClick={(e) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esto?')) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 size={16} />
    </button>
  );
}
