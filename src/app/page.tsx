import React, { Suspense } from 'react';
import QuoteForm from '@/components/quote/QuoteForm';
import prisma from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const glassTypes = await prisma.glassType.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-[#0A0D14] font-body-md text-slate-200 min-h-screen flex flex-col selection:bg-primary selection:text-white">
      {/* TopAppBar Navigation Shell - Glassmorphic */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0D14]/70 backdrop-blur-xl border-b border-white/5">
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#003B8A] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(0,88,190,0.4)]">V</div>
            <span className="font-display text-xl font-bold tracking-widest text-white">VIDRIERO</span>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <a className="text-white font-medium text-sm hover:text-primary transition-colors tracking-wide" href="/">Inicio</a>
            <a className="text-slate-400 hover:text-white transition-colors font-medium text-sm tracking-wide" href="/catalogo">Catálogo de Sistemas</a>
            <a className="text-slate-400 hover:text-white transition-colors font-medium text-sm tracking-wide" href="/nosotros">Nosotros</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#cotizador" className="hidden md:inline-flex bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm backdrop-blur-md transition-all border border-white/10 hover:border-white/30">
              Cotizar Proyecto
            </a>
            <button className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
               ☰
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section - Dark Premium Theme with Background Image */}
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 px-margin-mobile md:px-margin-desktop">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/hero-bg.png" 
              alt="Arquitectura en vidrio" 
              fill 
              className="object-cover object-center opacity-40"
              priority
            />
            {/* Deep gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14]/50 via-transparent to-[#0A0D14]"></div>
          </div>

          <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Hero Copy */}
            <div className="lg:col-span-6 text-center lg:text-left pt-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-fixed font-label-sm text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Precisión Milimétrica
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-[1.1] font-bold tracking-tight">
                El futuro de la <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#4A90E2]">Arquitectura</span> en Vidrio
              </h1>
              <p className="font-body-lg text-lg text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Para tu hogar o tu empresa. Desde una reparación rápida hasta el montaje de fachadas corporativas. Cotiza y ordena sistemas de vidrio premium en tiempo récord.
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-[#0A0D14] flex items-center justify-center text-xs font-bold text-white shadow-lg overflow-hidden relative">
                    <Image src="/images/bathroom.png" alt="User" fill className="object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary border-2 border-[#0A0D14] flex items-center justify-center text-xs font-bold text-white shadow-lg">B2B</div>
                  <div className="w-12 h-12 rounded-full bg-secondary border-2 border-[#0A0D14] flex items-center justify-center text-xs font-bold text-white shadow-lg">B2C</div>
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">+500 Proyectos</p>
                  <p className="text-slate-400">entregados este año</p>
                </div>
              </div>
            </div>

            {/* QuoteForm Container - Glassmorphism */}
            <div className="lg:col-span-6 relative mt-12 lg:mt-0">
              {/* Decorative background blurs behind the form */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
              
              <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-2xl border border-white/10 p-1 sm:p-2">
                <div className="bg-[#11141D]/90 rounded-[22px] p-6 sm:p-8">
                  <Suspense fallback={<div className="h-[400px] flex items-center justify-center text-primary animate-pulse">Iniciando motor de cotización...</div>}>
                    <QuoteForm glassTypes={glassTypes} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid - Dark Mode Premium */}
        <section className="px-margin-mobile md:px-margin-desktop py-24 md:py-32 max-w-[1400px] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl text-white mb-6 font-bold tracking-tight">Ecosistema de Soluciones Integrales</h2>
            <p className="font-body-md text-slate-400 text-lg font-light leading-relaxed">
              Desde el suministro corporativo B2B por m² hasta el ensamblaje de sistemas acústicos europeos llave en mano para el hogar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - With Image */}
            <a href="/catalogo" className="group md:col-span-2 relative bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 min-h-[400px] flex items-end cursor-pointer">
              <Image src="/images/bathroom.png" alt="Divisiones de baño" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/60 to-transparent"></div>
              <div className="relative z-10 p-10 w-full">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">Sistemas Arquitectónicos</div>
                <h3 className="font-display text-3xl mb-3 font-bold text-white group-hover:text-primary transition-colors">Baños y Divisiones Premium →</h3>
                <p className="text-slate-300 max-w-lg leading-relaxed font-light">
                  Sistemas batientes y corredizos en acero inoxidable. Explora nuestro catálogo y cotiza al instante la manufactura e instalación de tus divisiones a medida.
                </p>
              </div>
            </a>

            {/* Feature 2 - Hogar y Espejos */}
            <a href="/catalogo" className="group bg-[#11141D] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-8 ring-1 ring-primary/30 shadow-[0_0_20px_rgba(0,88,190,0.15)]">
                 <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="font-display text-2xl mb-4 font-bold text-white group-hover:text-primary transition-colors">Cristales y Espejos para el Hogar →</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Vidrios transparentes a medida para ventanas, mesas y repisas. Espejos flotantes con luz LED y decoración interior de alta gama.
                </p>
              </div>
            </a>

            {/* Feature 3 - Security */}
            <div className="group bg-[#11141D] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary flex items-center justify-center mb-8 ring-1 ring-secondary/30">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="font-display text-2xl mb-4 font-bold text-white">Vidrios de Seguridad</h3>
              <p className="text-slate-400 font-light leading-relaxed">
                Temple térmico de alto rendimiento y películas PVB para laminados acústicos. Cumplimiento total de la norma NSR-10.
              </p>
            </div>

            {/* Feature 4 - 50/50 Model */}
            <div className="group md:col-span-2 bg-[#11141D] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
               <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between h-full">
                  <div className="flex-1">
                    <h3 className="font-display text-3xl mb-4 font-bold text-white">Modelo Financiero 50/50</h3>
                    <p className="text-slate-400 font-light leading-relaxed mb-8">
                      Cuidamos el flujo de caja del consumidor y el instalador. Anticipa el 50% de la producción para arrancar la orden y liquida el saldo contraentrega con la obra ejecutada a la perfección.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Paso 1</span>
                        <span className="text-white font-bold">50% Anticipo</span>
                      </div>
                      <div className="h-px w-8 bg-white/20"></div>
                      <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Paso 2</span>
                        <span className="text-white font-bold">50% Entrega</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="px-margin-mobile md:px-margin-desktop py-24 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto bg-gradient-to-r from-primary to-[#003B8A] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,88,190,0.3)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-[100px]"></div>
            
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6 relative z-10 font-bold tracking-tight">Soluciones rápidas y a la medida</h2>
            <p className="text-xl text-white/80 mb-12 relative z-10 max-w-2xl mx-auto font-light leading-relaxed">
              Ya sea para la remodelación de tu baño o el suministro corporativo de tu próximo proyecto inmobiliario, estamos listos.
            </p>
            <a href="#cotizador" className="inline-block bg-white text-[#003B8A] px-10 py-5 rounded-full font-bold shadow-2xl hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 relative z-10 tracking-wide">
                Inicia cotización
            </a>
          </div>
        </section>
      </main>
      
      {/* Footer minimalista */}
      <footer className="border-t border-white/5 py-10 text-center text-slate-500 text-sm font-light">
        <p>© 2026 VIDRIERO. Plataforma Avanzada de Suministro Arquitectónico.</p>
      </footer>
    </div>
  );
}
