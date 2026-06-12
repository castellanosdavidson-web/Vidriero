import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit2 } from 'lucide-react';
import { deleteInstallationRule } from './actions';
import { DeleteButton } from '@/components/ui/DeleteButton';
import { GeneralSettingsForm } from './_components/GeneralSettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const rules = await prisma.installationRule.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const whatsappSetting = await prisma.setting.findUnique({
    where: { key: 'WHATSAPP_NUMBER' }
  });
  const currentWhatsApp = whatsappSetting?.value || '573000000000';

  return (
    <div className="pb-24 max-w-4xl mx-auto font-body-md text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-4 h-16 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-primary text-xl">←</Link>
          <h1 className="font-display font-bold tracking-tight text-primary">Configuración</h1>
        </div>
      </header>

      <main className="mt-20 px-4 space-y-8">
        
        {/* Section: General Settings */}
        <section className="space-y-4">
          <div className="border-b border-outline-variant/30 pb-2">
            <h2 className="font-display text-xl font-bold text-on-surface">Ajustes Generales</h2>
          </div>
          <GeneralSettingsForm currentNumber={currentWhatsApp} />
        </section>

        {/* Section: Reglas de Instalación */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-outline-variant/30 pb-2">
            <div>
              <h2 className="font-display text-xl font-bold text-on-surface">Reglas de Instalación</h2>
              <p className="text-xs text-on-surface-variant">Recargos aplicables al momento de cotizar.</p>
            </div>
            <Link href="/admin/settings/rules/new" className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-label-sm hover:bg-primary/20 transition font-bold">
              <Plus size={16} /> Agregar Regla
            </Link>
          </div>

          {rules.length === 0 ? (
             <p className="text-on-surface-variant text-sm py-4">No hay reglas de instalación configuradas.</p>
          ) : (
            <div className="grid gap-3">
              {rules.map(rule => (
                <div key={rule.id} className="bg-white/80 backdrop-blur border border-outline-variant/50 p-4 rounded-xl flex items-start justify-between shadow-sm">
                  <div>
                    <h3 className="font-display font-bold text-on-surface text-lg">{rule.name}</h3>
                    {rule.description && <p className="text-sm text-on-surface-variant mt-1">{rule.description}</p>}
                    <div className="mt-2 text-xs font-semibold text-primary">
                      {rule.basePrice > 0 && <span>Precio Base: ${rule.basePrice} </span>}
                      {rule.basePrice > 0 && rule.pricePerM2 > 0 && <span> | </span>}
                      {rule.pricePerM2 > 0 && <span>Precio por m²: ${rule.pricePerM2}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                     <div className="flex items-center gap-2">
                      <Link href={`/admin/settings/rules/${rule.id}`} className="p-2 text-on-surface-variant hover:text-primary bg-surface border border-outline-variant/50 rounded-lg transition">
                        <Edit2 size={16} />
                      </Link>
                      <form action={deleteInstallationRule}>
                        <input type="hidden" name="id" value={rule.id} />
                        <DeleteButton />
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
