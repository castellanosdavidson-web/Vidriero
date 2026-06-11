import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { RuleForm } from '../../_components/RuleForm';
import { notFound } from 'next/navigation';

export default async function EditRulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rule = await prisma.installationRule.findUnique({
    where: { id }
  });

  if (!rule) {
    notFound();
  }

  return (
    <div className="pb-24 max-w-2xl mx-auto font-body-md text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex items-center px-4 h-16 max-w-2xl gap-3">
        <Link href="/admin/settings" className="text-primary text-xl">←</Link>
        <h1 className="font-display font-bold tracking-tight text-primary">Editar Regla</h1>
      </header>

      <main className="mt-24 px-4">
        <RuleForm rule={rule} />
      </main>
    </div>
  );
}
