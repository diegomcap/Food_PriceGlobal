'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Globe2, 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Plane,
  Ship,
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { GlobalAlerts } from '@/components/global/GlobalAlerts';
import { GlobalWeather } from '@/components/global/GlobalWeather';
import { GlobalESG } from '@/components/global/GlobalESG';
import { GlobalSimulator } from '@/components/global/GlobalSimulator';
import { GlobalDashboard as GlobalStatsSummary } from '@/components/global/GlobalDashboard';

export default function GlobalDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <Link href="/global" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">FoodPrice</h1>
              <span className="text-xs text-blue-300 font-medium tracking-wider">GLOBAL</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="Visão Geral" active />
          <SidebarItem icon={Plane} label="Frete Aéreo" />
          <SidebarItem icon={Ship} label="Frete Marítimo" />
          <SidebarItem icon={Package} label="Cargas Ativas" />
          <SidebarItem icon={Users} label="Parceiros" />
          <SidebarItem icon={TrendingUp} label="Analytics" />
          <div className="pt-4 mt-4 border-t border-blue-800">
            <SidebarItem icon={Settings} label="Configurações" />
          </div>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <Link href="/global/login" className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-blue-800/50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair do Sistema</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-700">
              <LayoutDashboard className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800">Dashboard Global</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar remessa, container..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
            
            <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin Global</p>
                <p className="text-xs text-slate-500">Logistics Manager</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                AG
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Cargas em Trânsito" 
              value="1,284" 
              trend="+12%" 
              trendUp 
              icon={Package} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Volume Diário (Ton)" 
              value="45.2k" 
              trend="+5.4%" 
              trendUp 
              icon={TrendingUp} 
              color="bg-cyan-500" 
            />
            <StatCard 
              title="Atrasos Operacionais" 
              value="23" 
              trend="-2%" 
              trendUp={false} 
              icon={Clock} 
              color="bg-orange-500" 
            />
            <StatCard 
              title="Alertas Críticos" 
              value="5" 
              trend="Ação Requerida" 
              icon={AlertTriangle} 
              color="bg-red-500" 
            />
          </div>

          <div className="space-y-8 mb-8">
             <GlobalStatsSummary />
             <GlobalAlerts />
             <GlobalWeather />
             <GlobalESG />
             <GlobalSimulator />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* World Map Placeholder */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Rotas Ativas em Tempo Real</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver Mapa Completo</button>
              </div>
              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-50 grayscale"></div>
                <div className="relative z-10 text-slate-400 font-medium flex flex-col items-center">
                  <Globe2 className="w-12 h-12 mb-2 opacity-50" />
                  <span>Mapa Interativo de Rotas</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Remessas Recentes</h3>
              <div className="space-y-4">
                <ActivityItem 
                  id="#TRK-9821" 
                  route="Shanghai → Santos" 
                  status="Em Trânsito" 
                  statusColor="text-blue-600 bg-blue-50" 
                  icon={Ship}
                />
                <ActivityItem 
                  id="#AIR-2231" 
                  route="Miami → Frankfurt" 
                  status="Despachado" 
                  statusColor="text-green-600 bg-green-50" 
                  icon={Plane}
                />
                <ActivityItem 
                  id="#TRK-1102" 
                  route="Rotterdam → London" 
                  status="Atrasado" 
                  statusColor="text-red-600 bg-red-50" 
                  icon={Ship}
                />
                <ActivityItem 
                  id="#AIR-5543" 
                  route="Tokyo → Sydney" 
                  status="Chegada Prevista" 
                  statusColor="text-orange-600 bg-orange-50" 
                  icon={Plane}
                />
                <ActivityItem 
                  id="#TRK-3321" 
                  route="Santos → Lisbon" 
                  status="Em Trânsito" 
                  statusColor="text-blue-600 bg-blue-50" 
                  icon={Ship}
                />
              </div>
              <button className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Ver Todo o Histórico
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-blue-200 hover:text-white hover:bg-blue-800/50'}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
    </button>
  );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg shadow-blue-500/10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        {trendUp !== undefined && (
          <span className={`font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
        {trendUp === undefined && (
          <span className="font-bold text-slate-600">{trend}</span>
        )}
        <span className="text-slate-400">vs. mês anterior</span>
      </div>
    </div>
  );
}

function ActivityItem({ id, route, status, statusColor, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{route}</p>
          <p className="text-xs text-slate-500">{id}</p>
        </div>
      </div>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}
