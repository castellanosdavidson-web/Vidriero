'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-500/10 transition-colors w-full mt-2"
    >
      <LogOut className="w-4 h-4" />
      Cerrar Sesión
    </button>
  );
}
