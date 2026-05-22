'use client';

import { Ship, Truck, Plane, Anchor, ShieldCheck, Leaf } from 'lucide-react';

export function TransportSolutions() {
  const solutions = [
    {
      title: 'Transporte Marítimo',
      description: 'Soluções de frete marítimo para grandes volumes, com rotas otimizadas e parcerias com as maiores companhias de navegação do mundo.',
      icon: Ship,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Logística Terrestre',
      description: 'Conexão eficiente entre portos e centros de distribuição através de uma vasta rede rodoviária e ferroviária.',
      icon: Truck,
      color: 'text-emerald-600',
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      title: 'Frete Aéreo',
      description: 'Agilidade para perecíveis de alto valor com nossas soluções de carga aérea expressa para qualquer continente.',
      icon: Plane,
      color: 'text-sky-600',
      gradient: 'from-sky-500 to-blue-500'
    },
    {
      title: 'Gestão Portuária',
      description: 'Serviços especializados em terminais portuários, garantindo agilidade no desembaraço e manuseio de cargas.',
      icon: Anchor,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Segurança e Compliance',
      description: 'Monitoramento 24/7 e conformidade rigorosa com normas internacionais de segurança alimentar e transporte.',
      icon: ShieldCheck,
      color: 'text-red-600',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'Sustentabilidade',
      description: 'Compromisso com a redução da pegada de carbono através de frotas ecoeficientes e otimização logística.',
      icon: Leaf,
      color: 'text-green-600',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <section className="mb-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Soluções Integradas</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Nossa infraestrutura logística conecta produtores e consumidores em todos os continentes, utilizando tecnologias avançadas e práticas sustentáveis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {solutions.map((solution, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden hover:-translate-y-2"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${solution.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            
            <div className={`mb-6 p-4 rounded-xl bg-slate-50 inline-block group-hover:bg-white group-hover:shadow-md transition-all`}>
              <solution.icon className={`w-10 h-10 ${solution.color}`} />
            </div>
            
            <h3 className={`text-2xl font-bold mb-4 ${solution.color} flex items-center gap-2`}>
              {solution.title}
            </h3>
            
            <p className="text-slate-600 leading-relaxed">
              {solution.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
