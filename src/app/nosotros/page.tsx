import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Nosotros y Términos Legales - Vidriero',
  description: 'Conoce más sobre Vidriero, nuestra misión y términos legales.',
};

export default function NosotrosPage() {
  return (
    <div className="bg-[#0A0D14] font-body-md text-slate-200 min-h-screen flex flex-col selection:bg-primary selection:text-white relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

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
            <Link className="text-slate-400 hover:text-white transition-colors font-medium text-sm tracking-wide" href="/catalogo">Catálogo de Sistemas</Link>
            <Link className="text-white hover:text-primary transition-colors font-medium text-sm tracking-wide" href="/nosotros">Nosotros</Link>
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

      <main className="flex-1 pt-32 pb-32 px-margin-mobile md:px-margin-desktop max-w-[900px] mx-auto w-full relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Acerca de Vidriero</h1>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            Nuestra visión es transformar la manera en que se cotiza y se contrata el suministro de sistemas arquitectónicos en vidrio en Colombia.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#11141D]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl space-y-16">
          
          {/* Nosotros */}
          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-primary">01.</span> Quiénes Somos
            </h2>
            <div className="space-y-4 text-slate-300 font-light leading-relaxed">
              <p>
                Vidriero nace como la solución definitiva para la fricción que existe entre arquitectos, constructores, y dueños de hogar al momento de buscar suministro e instalación de cristales de seguridad. 
              </p>
              <p>
                Integramos la tecnología con el trabajo de la manufactura para entregar cotizaciones en tiempo récord, calculando de manera transparente costos de lámina cruda, templado, laminado y herrajes de importación. Nuestro ecosistema favorece un trato justo y una logística impecable desde el taller hasta tu obra.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-primary">02.</span> Contacto y Atención
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="text-2xl">✉️</div>
              <div>
                <h3 className="text-white font-bold mb-1">Correo Electrónico Central</h3>
                <p className="text-slate-400 text-sm mb-3">Para soporte, garantías y cotizaciones corporativas de alto volumen:</p>
                <a href="mailto:vidrierocontactcenter@gmail.com" className="text-primary hover:text-white font-bold text-lg transition-colors">
                  vidrierocontactcenter@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Términos Legales */}
          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-primary">03.</span> Términos y Condiciones Legales
            </h2>
            <div className="space-y-4 text-slate-400 font-light text-sm leading-relaxed bg-[#0A0D14]/50 p-6 rounded-2xl border border-white/5">
              <p>
                <strong>1. Sobre el Algoritmo de Cotización:</strong> Las cotizaciones generadas por nuestra plataforma en línea son estimaciones de alta precisión basadas en dimensiones teóricas proporcionadas por el usuario. Sin embargo, toda orden de fabricación está sujeta a una rectificación de medidas en obra por nuestro equipo técnico. Si hay una diferencia entre la medida ingresada y la real, el valor total podrá ser ajustado.
              </p>
              <p>
                <strong>2. Área Mínima de Facturación:</strong> Debido a las limitantes de los hornos de templado y los procesos industriales de transformación, se cobrará una superficie mínima de facturación por cada pieza de cristal. Las piezas por debajo de este umbral se redondearán al mínimo establecido por la fábrica.
              </p>
              <p>
                <strong>3. Modelo Financiero y Pagos:</strong> Todo proyecto requiere un anticipo obligatorio del 50% para dar inicio a los cortes y al proceso de transformación térmica del cristal. El 50% restante deberá ser cancelado de forma estricta contraentrega o finalización de la instalación pactada.
              </p>
              <p>
                <strong>4. Garantías:</strong> Otorgamos garantía directa sobre la integridad del vidrio templado y laminado en condiciones normales de uso, y sobre el ajuste de los herrajes en acero inoxidable. La garantía perderá validez si los sistemas sufren impactos contundentes, alteraciones en la estructura arquitectónica o limpiezas con ácidos abrasivos que afecten los perfiles y bisagras.
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-white/5 py-10 text-center text-slate-500 text-sm font-light relative z-10">
        <p>© 2026 VIDRIERO. Plataforma Avanzada de Suministro Arquitectónico.</p>
      </footer>
    </div>
  );
}
