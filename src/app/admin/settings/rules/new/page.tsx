import React from 'react';
import Link from 'next/link';
import { RuleForm } from '../../_components/RuleForm';

export default function NewRulePage() {
  return (
    <div className="pb-24 max-w-2xl mx-auto font-body-md text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex items-center px-4 h-16 max-w-2xl gap-3">
        <Link href="/admin/settings" className="text-primary text-xl">←</Link>
        <h1 className="font-display font-bold tracking-tight text-primary">Nueva Regla</h1>
      </header>

      <main className="mt-24 px-4">
        <RuleForm />
      </main>
    </div>
  );
}
