'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Lock, Fingerprint, Eye, FileKey } from 'lucide-react';

export default function MilitaryLoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/military/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-zinc-950 font-mono">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Radar Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.1),transparent_70%)] animate-pulse"></div>

      <div className="w-full max-w-md bg-zinc-900/90 border border-red-900/50 rounded-sm shadow-[0_0_50px_rgba(220,38,38,0.2)] p-8 relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        
        <div className="text-center mb-8">
          <div className="inline-block p-4 border-2 border-red-600 rounded-full bg-red-950/50 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-500 mb-1 tracking-widest">MFD SYSTEM</h1>
          <p className="text-red-900 text-xs tracking-[0.3em]">MILITARY FOOD DEVELOPMENT</p>
        </div>

        <div className="bg-red-950/30 border border-red-900/50 p-3 mb-8 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-bold tracking-wider">RESTRICTED ACCESS // LEVEL 3+</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-red-700 mb-2 uppercase tracking-wider">Service ID</label>
            <div className="relative group">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-black border border-red-900/50 rounded-sm text-red-500 placeholder-red-900/50 focus:outline-none focus:border-red-500 focus:shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all font-mono uppercase"
                placeholder="XXX-XX-XXXX"
                required
              />
              <FileKey className="w-5 h-5 text-red-900 absolute left-3 top-3.5 group-focus-within:text-red-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-red-700 mb-2 uppercase tracking-wider">Clearance Code</label>
            <div className="relative group">
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-black border border-red-900/50 rounded-sm text-red-500 placeholder-red-900/50 focus:outline-none focus:border-red-500 focus:shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all font-mono"
                placeholder="••••••••••••"
                required
              />
              <Fingerprint className="w-5 h-5 text-red-900 absolute left-3 top-3.5 group-focus-within:text-red-500 transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-red-900/20 hover:bg-red-900/40 border border-red-600 text-red-500 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 group relative overflow-hidden"
          >
            {loading ? (
              <span className="animate-pulse flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Secure Login
                <Eye className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-red-900/30 pt-4">
          <p className="text-[10px] text-red-900/60 uppercase tracking-widest mb-4">
            Unauthorized access is a federal offense punishable by law.
            <br/>System monitors active. IP Logged.
          </p>
          <Link 
            href="/military"
            className="text-red-800 hover:text-red-500 text-xs font-mono transition-colors"
          >
            [ REQUEST ACCESS ]
          </Link>
        </div>
      </div>
    </div>
  );
}
