"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Credenciales inválidas o usuario no encontrado');
      setIsPending(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0D14] p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      
      <div className="w-full max-w-md">
        <div className="bg-[#11141D]/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 relative z-10">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto flex items-center justify-center mb-6">
              <img src="/vitroclic-icon.svg" alt="VitroClic Logo" width={64} height={64} />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-widest text-white uppercase">VITROCLIC</h1>
            <p className="font-body-sm text-sm text-slate-400 mt-2 font-light">Acceso restringido para administradores</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label-sm text-xs font-bold text-slate-300 uppercase tracking-wider" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vitroclic.com"
                required
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-label-sm text-xs font-bold text-slate-300 uppercase tracking-wider" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full font-label-sm text-sm font-bold bg-primary text-white py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,88,190,0.3)] hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPending ? 'Autenticando...' : 'Acceder al Sistema'}
            </button>
            
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm font-label-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 mt-4">
                <span>⚠️</span> {error}
              </div>
            )}
          </form>
          
        </div>
      </div>
    </div>
  );
}
