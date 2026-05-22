import React, { useState, useEffect } from 'react';
import { TrendingUp, Factory, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export const GlobalDashboard = () => {
  const [metrics, setMetrics] = useState({
    activeShipments: 1247,
    productionSites: 3456,
    qualityAlerts: 12
  });

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeShipments: Math.max(0, prev.activeShipments + Math.floor(Math.random() * 5) - 2),
        productionSites: Math.max(0, prev.productionSites + (Math.random() > 0.9 ? 1 : 0)),
        qualityAlerts: Math.max(0, Math.floor(Math.random() * 15))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Supply Chain Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 hover:-translate-y-2 transition-transform">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Active Shipments</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{metrics.activeShipments.toLocaleString()}</div>
            <p className="text-slate-500 flex items-center gap-2">
               Currently in transit
               <span className="text-green-500 text-xs flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                 <ArrowUp size={12} /> Live
               </span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-600 hover:-translate-y-2 transition-transform">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <Factory size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Production Sites</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">{metrics.productionSites.toLocaleString()}</div>
            <p className="text-slate-500">Registered worldwide</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-orange-600 hover:-translate-y-2 transition-transform">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Quality Alerts</h3>
            </div>
            <div className="text-4xl font-bold text-orange-600 mb-2">{metrics.qualityAlerts}</div>
            <p className="text-slate-500 flex items-center gap-2">
               Requiring attention
               {metrics.qualityAlerts > 10 && (
                 <span className="text-red-500 text-xs flex items-center font-bold">
                   HIGH PRIORITY
                 </span>
               )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
