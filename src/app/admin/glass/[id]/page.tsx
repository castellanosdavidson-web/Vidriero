import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { GlassForm } from '../_components/GlassForm';
import { notFound } from 'next/navigation';

export default async function EditGlassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const glass = await prisma.glassType.findUnique({
    where: { id }
  });

  if (!glass) {
    notFound();
  }

  return (
    <div className="pb-24 max-w-2xl mx-auto font-body-md text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex items-center px-4 h-16 max-w-2xl gap-3">
        <Link href="/admin/glass" className="text-primary text-xl">←</Link>
        <h1 className="font-display font-bold tracking-tight text-primary">Editar Vidrio</h1>
      </header>

      <main className="mt-24 px-4">
        <GlassForm glass={glass} />
      </main>
    </div>
  );
}
