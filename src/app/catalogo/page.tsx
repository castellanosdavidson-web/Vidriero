import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

function getCategoryImage(category: string) {
  if (category === 'Vidrio Templado') return '/images/templado.png';
  if (category === 'Vidrio Laminado') return '/images/laminado.png';
  if (category === 'Espejos y Decoración') return '/images/espejo.png';
  if (category === 'Divisiones de Baño') return '/images/bathroom.png';
  return '/images/hero-bg.png'; // Default fallback
}

export default async function CatalogPage() {
  const glassTypes = await prisma.glassType.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  // Agrupar por categorías de la DB
  const grouped = glassTypes.reduce((acc, glass) => {
    const category = glass.category || 'Otros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(glass);
    return acc;
  }, {} as Record<string, typeof glassTypes>);

  const categories = Object.keys(grouped).sort();

  return (
    <div className="bg-[#0A0D14] font-body-md text-slate-200 min-h-screen flex flex-col selection:bg-primary selection:text-white">
      {/* TopAppBar Navigation Shell - Glassmorphic */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0D14]/70 backdrop-blur-xl border-b border-white/5">
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 max-w-[1400px] mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#003B8A] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(0,88,190,0.4)]">V</div>
            <span className="font-display text-xl font-bold tracking-widest text-white">VIDRIERO</span>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link className="text-slate-400 font-medium text-sm hover:text-white transition-colors tracking-wide" href="/">Inicio</Link>
            <Link className="text-white hover:text-primary transition-colors font-medium text-sm tracking-wide" href="/catalogo">Catálogo de Sistemas</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-medium text-sm tracking-wide" href="/nosotros">Nosotros</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/#cotizador" className="hidden md:inline-flex bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm backdrop-blur-md transition-all border border-white/10 hover:border-white/30">
              Cotizar Proyecto
            </Link>
            <button className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
               ☰
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-32 pb-32 px-margin-mobile md:px-margin-desktop max-w-[1400px] mx-auto w-full relative z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/2"></div>

        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 font-label-sm text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
            Suministro & Instalación
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Catálogo de Sistemas</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Explora nuestra selección de cristales de seguridad y sistemas arquitectónicos. Diseñados tanto para proyectos corporativos como para la comodidad de tu hogar.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-light">
            Aún no hay productos en el catálogo.
          </div>
        ) : (
          <div className="space-y-32">
            {categories.map(category => (
              <section key={category}>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-12 pb-6 border-b border-white/10 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl border border-white/10">
                    {category === 'Vidrio Templado' && '🛡️'}
                    {category === 'Vidrio Laminado' && '🥪'}
                    {category === 'Espejos y Decoración' && '✨'}
                    {category === 'Vidrios Acústicos' && '🔇'}
                    {category === 'Divisiones de Baño' && '🚿'}
                    {!['Vidrio Templado', 'Vidrio Laminado', 'Espejos y Decoración', 'Vidrios Acústicos', 'Divisiones de Baño'].includes(category) && '💎'}
                  </span>
                  {category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {grouped[category].map(glass => {
                    let thicknesses: string[] = [];
                    let colors: string[] = [];
                    try {
                      thicknesses = JSON.parse(glass.thicknesses || '[]');
                      colors = JSON.parse(glass.colors || '[]');
                    } catch(e) {}

                    return (
                      <div key={glass.id} className="group bg-[#11141D]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col relative">
                        <div className="aspect-[4/3] relative overflow-hidden bg-[#0A0D14]">
                          <Image 
                            src={getCategoryImage(glass.category || '')} 
                            alt={glass.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#11141D]/90 via-transparent to-transparent"></div>
                          
                          {/* Price Tag */}
                          <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-bold text-white text-sm shadow-xl border border-white/20">
                            ${glass.pricePerM2.toLocaleString()} /m²
                          </div>
                        </div>
                        
                        <div className="p-8 flex flex-col flex-1 relative z-10 -mt-6">
                          <h3 className="font-display text-2xl font-bold text-white mb-3">{glass.name}</h3>
                          <p className="text-slate-400 text-sm line-clamp-3 mb-8 flex-1 font-light leading-relaxed">
                            {glass.description || 'Sin descripción'}
                          </p>
                          
                          <div className="space-y-4 mb-8 bg-[#0A0D14]/50 rounded-2xl p-5 border border-white/5">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Grosores</span>
                              <span className="font-medium text-slate-300 text-right max-w-[60%]">{Array.isArray(thicknesses) && thicknesses.length > 0 ? thicknesses.join(', ') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Colores</span>
                              <span className="font-medium text-slate-300 text-right max-w-[60%]">{Array.isArray(colors) && colors.length > 0 ? colors.join(', ') : 'N/A'}</span>
                            </div>
                          </div>
                          
                          <Link 
                            href={`/?glass=${glass.id}#cotizador`}
                            className="block w-full py-4 px-4 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white text-center rounded-xl font-bold transition-all duration-300 shadow-lg"
                          >
                            Cotizar Configuración
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-white/5 py-10 text-center text-slate-500 text-sm font-light relative z-10">
        <p>© 2026 VIDRIERO. Plataforma Avanzada de Suministro Arquitectónico.</p>
      </footer>
    </div>
  );
}
