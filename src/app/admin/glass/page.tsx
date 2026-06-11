import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit2, Box } from 'lucide-react';
import { deleteGlassType } from './actions';
import { DeleteButton } from '@/components/ui/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function GlassCatalogPage() {
  const glassTypes = await prisma.glassType.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="pb-24 max-w-4xl mx-auto font-body-md text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-4 h-16 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-primary text-xl">←</Link>
          <h1 className="font-display font-bold tracking-tight text-primary">Catálogo de Vidrios</h1>
        </div>
        <div>
          <Link href="/admin/glass/new" className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-label-sm shadow-md hover:bg-primary/90 transition">
            <Plus size={16} />
            <span>Nuevo</span>
          </Link>
        </div>
      </header>

      <main className="mt-20 px-4 space-y-4">
        {glassTypes.length === 0 ? (
          <div className="text-center py-12 bg-white/50 border border-dashed border-outline-variant rounded-2xl">
            <div className="flex justify-center mb-4 text-primary/40"><Box size={48} /></div>
            <p className="text-on-surface-variant mb-2">No hay vidrios en el catálogo.</p>
            <Link href="/admin/glass/new" className="text-primary font-bold text-sm">Crear el primer vidrio</Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {glassTypes.map((glass) => {
              let thicknesses: string[] = [];
              let colors: string[] = [];
              try {
                thicknesses = JSON.parse(glass.thicknesses || '[]');
                colors = JSON.parse(glass.colors || '[]');
              } catch(e) {}

              return (
                <div key={glass.id} className="bg-white/80 backdrop-blur border border-outline-variant/50 p-4 rounded-xl flex items-start justify-between shadow-sm hover:border-primary/30 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-on-surface text-lg">{glass.name}</h3>
                      {!glass.isActive && (
                        <span className="bg-error/10 text-error px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">Inactivo</span>
                      )}
                    </div>
                    {glass.description && <p className="text-sm text-on-surface-variant line-clamp-1">{glass.description}</p>}
                    
                    <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-outline-variant/20">
                      <div className="text-xs text-on-surface-variant">
                        <span className="font-semibold text-on-surface">Grosores:</span> {thicknesses.join(', ')}
                      </div>
                      <span className="text-outline-variant">•</span>
                      <div className="text-xs text-on-surface-variant">
                        <span className="font-semibold text-on-surface">Colores:</span> {colors.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                    <span className="font-display font-bold text-primary">${glass.pricePerM2.toLocaleString()}<span className="text-xs font-normal text-on-surface-variant"> /m²</span></span>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/glass/${glass.id}`} className="p-2 text-on-surface-variant hover:text-primary bg-surface border border-outline-variant/50 rounded-lg transition">
                        <Edit2 size={16} />
                      </Link>
                      <form action={deleteGlassType}>
                        <input type="hidden" name="id" value={glass.id} />
                        <DeleteButton />
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
