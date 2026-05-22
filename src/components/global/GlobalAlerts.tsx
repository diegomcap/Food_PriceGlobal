import React from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';

export const GlobalAlerts = () => {
  const alerts = [
    {
      title: 'Port Congestion - Shanghai',
      desc: 'Waiting time increased to 4 days due to high volume.',
      time: '2h ago',
      type: 'warning',
    },
    {
      title: 'Storm Warning - North Atlantic',
      desc: 'Severe weather conditions affecting shipping routes.',
      time: '4h ago',
      type: 'danger',
    },
    {
      title: 'Customs Clearance - Rotterdam',
      desc: 'System maintenance scheduled for next weekend.',
      time: '6h ago',
      type: 'info',
    }
  ];

  return (
    <section id="alerts" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10 flex items-center justify-center gap-3">
          <AlertTriangle className="text-orange-500" />
          Alertas Logísticos em Tempo Real
        </h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`
              border-l-4 p-6 rounded-r-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4
              ${alert.type === 'danger' ? 'bg-red-50 border-red-500' : 
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'}
            `}>
              <div className={`
                p-2 rounded-full shrink-0
                ${alert.type === 'danger' ? 'bg-red-100 text-red-600' : 
                  alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}
              `}>
                <AlertTriangle size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-lg ${
                    alert.type === 'danger' ? 'text-red-800' : 
                    alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                  }`}>
                    {alert.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <Clock size={12} />
                    <span>{alert.time}</span>
                  </div>
                </div>
                <p className={`text-sm ${
                   alert.type === 'danger' ? 'text-red-700' : 
                   alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                }`}>
                  {alert.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
