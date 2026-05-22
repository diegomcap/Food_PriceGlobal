'use client';

export function RadarSystem() {
  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Radar Visualization */}
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex-shrink-0">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-[0_0_50px_rgba(220,38,38,0.2)]"></div>
            
            {/* Grid Circles */}
            <div className="absolute inset-[10%] rounded-full border border-red-900/50"></div>
            <div className="absolute inset-[30%] rounded-full border border-red-900/50"></div>
            <div className="absolute inset-[50%] rounded-full border border-red-900/50"></div>
            <div className="absolute inset-[70%] rounded-full border border-red-900/50"></div>
            
            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-red-900/50"></div>
              <div className="h-full w-[1px] bg-red-900/50 absolute"></div>
            </div>
            
            {/* Rotating Scanner */}
            <div className="absolute inset-0 rounded-full animate-radar-scan overflow-hidden">
              <div className="w-1/2 h-1/2 bg-gradient-to-tl from-red-500/50 to-transparent absolute top-0 left-0 origin-bottom-right transform rotate-0 blur-sm"></div>
            </div>
            
            {/* Blips */}
            <div className="absolute top-[30%] left-[70%] w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] animate-ping-slow"></div>
            <div className="absolute top-[60%] left-[40%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] animate-ping-slow delay-700"></div>
            <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] animate-ping-slow delay-300"></div>
            
            {/* Overlay Text */}
            <div className="absolute bottom-4 left-4 font-mono text-xs text-red-500 animate-pulse">
              SYSTEM: ACTIVE<br/>
              SCANNING...
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase tracking-wider">
              Monitoramento <span className="text-red-500">Global</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed border-l-4 border-red-600 pl-6">
              Nossa tecnologia de rastreamento militar garante integridade total da cadeia de suprimentos em zonas de conflito e áreas de difícil acesso. Utilizamos protocolos criptografados e redundância logística para missão crítica.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg hover:border-red-500/50 transition-colors group">
                <h3 className="text-red-400 font-mono font-bold mb-2 group-hover:text-red-300">PROTOCOLOS OTAN</h3>
                <p className="text-slate-500 text-sm">Conformidade total com padrões STANAG de logística alimentar.</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg hover:border-red-500/50 transition-colors group">
                <h3 className="text-red-400 font-mono font-bold mb-2 group-hover:text-red-300">RAÇÕES TÁTICAS</h3>
                <p className="text-slate-500 text-sm">Desenvolvimento de MREs (Meals Ready-to-Eat) de alta performance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-radar-scan {
          animation: scan 4s linear infinite;
        }
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
