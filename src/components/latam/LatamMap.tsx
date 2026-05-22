'use client';

export function LatamMap() {
  const countries = [
    { id: 1, name: 'Brasil', color: 'bg-green-600', top: '30%', left: '50%' },
    { id: 2, name: 'Argentina', color: 'bg-blue-600', top: '70%', left: '45%' },
    { id: 3, name: 'Chile', color: 'bg-red-600', top: '70%', left: '35%' },
    { id: 4, name: 'Colômbia', color: 'bg-yellow-500', top: '20%', left: '35%' },
    { id: 5, name: 'Peru', color: 'bg-red-600', top: '35%', left: '30%' },
    { id: 6, name: 'México', color: 'bg-green-700', top: '10%', left: '20%' },
    { id: 7, name: 'Venezuela', color: 'bg-yellow-600', top: '15%', left: '40%' },
    { id: 8, name: 'Uruguai', color: 'bg-blue-400', top: '75%', left: '52%' },
    { id: 9, name: 'Paraguai', color: 'bg-red-500', top: '55%', left: '48%' },
    { id: 10, name: 'Bolívia', color: 'bg-green-500', top: '45%', left: '40%' },
  ];

  return (
    <section className="py-20 bg-orange-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Rede de Distribuição Regional</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Nossa malha logística cobre todo o continente, com centros de distribuição estratégicos e rotas otimizadas.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
          {/* Map Background */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center"></div>
          
          {/* Grid Lines */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDAiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjA1KSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>

          {/* Map Container with 3D effect */}
          <div className="relative w-full h-full perspective-1000">
            <div className="absolute inset-0 flex items-center justify-center transform-style-3d animate-gentle-rotate">
              {/* Central Hub Lines */}
              <div className="absolute w-[600px] h-[600px] border border-orange-200/30 rounded-full animate-pulse-slow"></div>
              <div className="absolute w-[400px] h-[400px] border border-orange-300/30 rounded-full animate-pulse-slow delay-75"></div>
              
              {/* Country Pins */}
              {countries.map((country) => (
                <div
                  key={country.id}
                  className={`absolute w-12 h-12 rounded-full ${country.color} flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transform hover:scale-125 transition-all duration-300 z-10 group`}
                  style={{ top: country.top, left: country.left }}
                >
                  <span className="text-xs">{country.name.substring(0, 2).toUpperCase()}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {country.name}
                  </div>
                  
                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 rounded-full ${country.color} animate-ping opacity-20`}></div>
                </div>
              ))}
              
              {/* Connecting Lines (CSS only representation) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M400,300 L300,400" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                <path d="M400,300 L500,200" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                <path d="M400,300 L350,150" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        @keyframes gentle-rotate {
          0% { transform: rotateX(10deg) rotateY(-5deg); }
          50% { transform: rotateX(5deg) rotateY(5deg); }
          100% { transform: rotateX(10deg) rotateY(-5deg); }
        }
        .animate-gentle-rotate {
          animation: gentle-rotate 20s infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
      `}</style>
    </section>
  );
}
