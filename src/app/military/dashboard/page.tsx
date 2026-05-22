'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Target, 
  Database, 
  Activity, 
  Radio, 
  Search, 
  LogOut,
  AlertTriangle,
  Crosshair,
  Lock,
  Box
} from 'lucide-react';
import Link from 'next/link';
import { RadarSystem } from '@/components/military/RadarSystem';

export default function MilitaryDashboardPage() {
  const [securityNoticeOpen, setSecurityNoticeOpen] = useState(true);
  const [sessionTime, setSessionTime] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    // Session timer
    const timer = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          // Force logout logic could go here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Disable context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearInterval(timer);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-300 font-mono flex relative">
      {/* Security Overlay */}
      {securityNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-red-600 max-w-lg w-full p-8 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
            <div className="flex items-center gap-4 text-red-600 mb-6">
              <ShieldAlert size={48} className="animate-pulse" />
              <h2 className="text-3xl font-bold tracking-widest uppercase">Security Clearance Required</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              This system contains CLASSIFIED information up to LEVEL 3 (SECRET). 
              Unauthorized access is a federal offense punishable by law. 
              All actions are logged and monitored.
            </p>
            <div className="bg-red-950/30 border border-red-900/50 p-4 mb-8 text-xs font-mono text-red-400">
              IP: 192.168.X.X<br/>
              LOCATION: UNKNOWN<br/>
              ENCRYPTION: AES-256-GCM
            </div>
            <button 
              onClick={() => setSecurityNoticeOpen(false)}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-4 tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              Acknowledge & Proceed
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-red-900/30 fixed h-full hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-red-900/30">
          <div className="flex items-center gap-3 text-red-500 font-bold tracking-widest">
            <ShieldAlert className="w-6 h-6" />
            <span>MFD CMD</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-green-500 tracking-[0.2em]">SYSTEM ACTIVE</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<Activity size={18} />} label="COMMAND CENTER" active />
          <SidebarItem icon={<Crosshair size={18} />} label="OPERATIONS" />
          <SidebarItem icon={<Box size={18} />} label="LOGISTICS" />
          <SidebarItem icon={<Database size={18} />} label="INVENTORY" />
          <SidebarItem icon={<Radio size={18} />} label="COMMUNICATIONS" />
          <SidebarItem icon={<Lock size={18} />} label="SECURITY" />
        </nav>

        <div className="p-4 border-t border-red-900/30">
          <div className="mb-4 px-4 py-2 bg-red-950/20 border border-red-900/30 rounded text-xs text-red-400">
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold">DEFCON 4</p>
              <span className="font-mono text-red-500">{formatTime(sessionTime)}</span>
            </div>
            <p className="opacity-70">Readiness Normal</p>
          </div>
          <Link href="/military" className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-950/30 rounded transition-colors text-xs uppercase tracking-widest">
            <LogOut size={16} />
            <span>Terminate Session</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 bg-[linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Tactical Overview</h1>
            <p className="text-xs text-gray-500 tracking-wider mt-1">SECURE CONNECTION // ENCRYPTED AES-256</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">USER ID</p>
              <p className="text-sm font-bold text-red-500">CMDR. SHEPARD</p>
            </div>
            <div className="w-10 h-10 bg-red-900/20 border border-red-500/50 rounded flex items-center justify-center text-red-500 font-bold">
              CS
            </div>
          </div>
        </header>

        {/* HUD Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HudCard 
            title="ACTIVE MISSIONS" 
            value="07" 
            status="green"
            icon={<Target className="text-red-500" />} 
          />
          <HudCard 
            title="RATION PRODUCTION" 
            value="12.4K" 
            status="green"
            icon={<Box className="text-red-500" />} 
          />
          <HudCard 
            title="R&D PROJECTS" 
            value="23" 
            status="yellow"
            icon={<Database className="text-red-500" />} 
          />
          <HudCard 
            title="THREAT LEVEL" 
            value="LOW" 
            status="green"
            icon={<ShieldAlert className="text-red-500" />} 
          />
        </div>

        <div className="mb-8">
          <RadarSystem />
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Feed / Map Placeholder */}
          <div className="lg:col-span-2 bg-black/50 border border-white/10 p-1 relative overflow-hidden h-96 group">
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(32,255,77,0.1)_25%,rgba(32,255,77,0.1)_26%,transparent_27%,transparent_74%,rgba(32,255,77,0.1)_75%,rgba(32,255,77,0.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(32,255,77,0.1)_25%,rgba(32,255,77,0.1)_26%,transparent_27%,transparent_74%,rgba(32,255,77,0.1)_75%,rgba(32,255,77,0.1)_76%,transparent_77%,transparent)] bg-[size:50px_50px]"></div>
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-bold tracking-wider animate-pulse">LIVE FEED</span>
              <span className="text-xs text-green-500 font-mono">SAT-LINK: CONNECTED</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border border-green-500/30 rounded-full flex items-center justify-center relative animate-spin-slow">
                <div className="w-48 h-48 border border-green-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-green-500/30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-[1px] h-full bg-green-500/30 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            
            {/* Blips */}
            <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-700"></div>
          </div>

          {/* System Logs */}
          <div className="bg-black/50 border border-white/10 p-6 flex flex-col">
            <h3 className="font-bold text-white mb-4 tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              SYSTEM LOGS
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
              <LogEntry time="14:02:22" level="INFO" msg="Supply chain synchronization complete." />
              <LogEntry time="13:55:10" level="WARN" msg="Sector 7 inventory below threshold." color="text-yellow-500" />
              <LogEntry time="13:42:05" level="INFO" msg="User authentication verified." />
              <LogEntry time="12:30:00" level="CRIT" msg="Unauthorized access attempt blocked." color="text-red-500" />
              <LogEntry time="12:29:55" level="INFO" msg="Firewall updated successfully." />
              <LogEntry time="11:15:20" level="INFO" msg="Production batch #9923 initiated." />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3 border-l-2 transition-all ${
        active 
          ? 'border-red-500 bg-red-900/10 text-white' 
          : 'border-transparent text-gray-500 hover:text-red-400 hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="font-bold text-xs tracking-widest">{label}</span>
    </a>
  );
}

function HudCard({ title, value, status, icon }: any) {
  return (
    <div className="bg-black/60 border border-white/10 p-5 relative overflow-hidden group hover:border-red-500/50 transition-colors">
      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <h3 className="text-gray-500 text-[10px] font-bold tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className="text-[10px] text-gray-400 uppercase">Status: Optimal</span>
      </div>
    </div>
  );
}

function LogEntry({ time, level, msg, color = 'text-gray-400' }: any) {
  return (
    <div className="border-b border-white/5 pb-2">
      <div className="flex justify-between mb-1">
        <span className="text-gray-600">[{time}]</span>
        <span className={`${color === 'text-red-500' || color === 'text-yellow-500' ? 'font-bold' : ''} ${color}`}>{level}</span>
      </div>
      <p className="text-gray-300 opacity-80">{msg}</p>
    </div>
  );
}
