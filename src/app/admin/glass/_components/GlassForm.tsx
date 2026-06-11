'use client';

import React, { useState } from 'react';
import { saveGlassType } from '../actions';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { X } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md font-bold shadow-md hover:bg-primary/90 transition disabled:opacity-50"
    >
      {pending ? 'Guardando...' : 'Guardar Vidrio'}
    </button>
  );
}

// Simple tag input component
function TagInput({ label, tags, setTags, placeholder }: { label: string, tags: string[], setTags: (tags: string[]) => void, placeholder: string }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-label-sm text-on-surface-variant font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-semibold">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-error transition"><X size={14} /></button>
          </span>
        ))}
      </div>
      <input 
        type="text" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
      />
      <p className="text-[10px] text-on-surface-variant">Presiona Enter para agregar.</p>
    </div>
  );
}

export function GlassForm({ glass }: { glass?: any }) {
  const isEditing = !!glass;
  const [thicknesses, setThicknesses] = useState<string[]>(() => {
    try { return glass ? JSON.parse(glass.thicknesses || '[]') : []; } catch(e) { return []; }
  });
  const [colors, setColors] = useState<string[]>(() => {
    try { return glass ? JSON.parse(glass.colors || '[]') : []; } catch(e) { return []; }
  });
  const [isActive, setIsActive] = useState<boolean>(glass ? glass.isActive : true);

  return (
    <form action={saveGlassType} className="space-y-6 bg-white/80 backdrop-blur border border-outline-variant/50 p-6 rounded-2xl shadow-sm">
      <input type="hidden" name="id" value={glass?.id || 'new'} />
      <input type="hidden" name="thicknesses" value={JSON.stringify(thicknesses)} />
      <input type="hidden" name="colors" value={JSON.stringify(colors)} />
      <input type="hidden" name="isActive" value={isActive ? 'true' : 'false'} />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Nombre del Vidrio</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={glass?.name} 
            required
            placeholder="Ej. Cristal Templado"
            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Tipo de Producto</label>
            <select
              name="productType"
              defaultValue={glass?.productType || 'MATERIAL'}
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="MATERIAL">Solo Material (B2B)</option>
              <option value="SYSTEM">Sistema Arquitectónico (B2C)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Categoría</label>
            <select
              name="category"
              defaultValue={glass?.category || 'Vidrio Templado'}
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="Vidrio Crudo">Vidrio Crudo / Flotado</option>
              <option value="Vidrio Templado">Vidrio Templado</option>
              <option value="Vidrio Laminado">Vidrio Laminado</option>
              <option value="Vidrios Acústicos">Vidrios Acústicos / Termo-acústicos</option>
              <option value="Divisiones de Baño">Divisiones de Baño</option>
              <option value="Espejos y Decoración">Espejos y Decoración</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Descripción (Opcional)</label>
          <textarea 
            name="description" 
            defaultValue={glass?.description || ''}
            placeholder="Detalles sobre su uso..."
            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Precio Base por m²</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-on-surface-variant">$</span>
              <input 
                type="number" 
                name="pricePerM2" 
                step="0.01"
                defaultValue={glass?.pricePerM2} 
                required
                className="w-full bg-surface border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Área Mínima de Cobro (m²)</label>
            <input 
              type="number" 
              name="minArea" 
              step="0.01"
              defaultValue={glass?.minArea || 0.30} 
              required
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-label-sm text-on-surface-variant font-medium mb-1">Opciones de Herrajes (JSON)</label>
          <textarea 
            name="hardwareOptions" 
            defaultValue={glass?.hardwareOptions || '[]'}
            placeholder='[{"name": "Acero Inoxidable", "price": 180000}]'
            className="w-full font-mono bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none h-24"
          />
          <p className="text-[10px] text-on-surface-variant mt-1">Ej: [{`{"name":"Acero","price":150000}`}]</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-outline-variant/30 pt-4 mt-4">
          <TagInput 
            label="Grosores Disponibles" 
            tags={thicknesses} 
            setTags={setThicknesses} 
            placeholder="Ej. 4mm, 6mm..." 
          />
          <TagInput 
            label="Colores Disponibles" 
            tags={colors} 
            setTags={setColors} 
            placeholder="Ej. Claro, Bronce..." 
          />
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
            <span className="font-label-sm font-bold text-sm text-on-surface">Estado del Vidrio</span>
            <span className="text-xs text-on-surface-variant">{isActive ? 'Activo (Visible en cotizador)' : 'Inactivo (Oculto)'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Link href="/admin/glass" className="w-full bg-surface border border-outline-variant text-on-surface text-center py-3 rounded-xl font-label-md font-bold hover:bg-outline-variant/20 transition">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
