'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Target, Lock, Database, ChevronRight } from 'lucide-react';

export default function MilitaryPage() {
  return (
    <div className="min-h-screen bg-zinc-950 font-mono text-gray-300">
      {/* Navbar */}
      <nav className="border-b border-red-900/30 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-red-500 font-bold tracking-widest">
            <Shield className="w-6 h-6" />
            MFD DEFENSE
          </div>
          <div className="flex gap-4">
            <Link href="/military/login" className="px-6 py-2 border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-all text-xs tracking-widest uppercase">
              Secure Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-32 px-6 overflow-hidden border-b border-red-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 border border-red-500/30 bg-red-950/30 text-red-400 text-xs tracking-[0.3em] mb-6 animate-pulse">
            CLASSIFIED SYSTEM // LEVEL 3
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tighter">
            ADVANCED MILITARY <br/>
            <span className="text-red-600 text-shadow-red">FOOD SYSTEMS</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide">
            Strategic supply chain management for defense operations. 
            High-performance nutrition, extended shelf-life solutions, and secure logistics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/military/login" className="group px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold tracking-widest text-sm uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3">
              Initialize Access
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#capabilities" className="px-8 py-4 border border-gray-700 hover:border-gray-500 text-gray-300 font-bold tracking-widest text-sm uppercase transition-all">
              View Capabilities
            </Link>
          </div>
        </div>
      </header>

      {/* Capabilities Grid */}
      <section id="capabilities" className="py-24 px-6 bg-zinc-900/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <CapabilityCard 
              icon={<Target className="w-8 h-8 text-red-500" />}
              title="Precision Logistics"
              description="Real-time supply tracking for active combat zones and remote outposts."
            />
            <CapabilityCard 
              icon={<Database className="w-8 h-8 text-red-500" />}
              title="Strategic Reserves"
              description="Automated inventory management for long-term food security and disaster response."
            />
            <CapabilityCard 
              icon={<Lock className="w-8 h-8 text-red-500" />}
              title="Secure Protocols"
              description="End-to-end encrypted supply chain data protection and biometric access control."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-red-900/30 py-12 px-6 bg-black text-center">
        <div className="container mx-auto">
          <p className="text-gray-600 text-xs tracking-widest uppercase">
            &copy; 2024 Military Food Development. Department of Defense Contractor.
            <br/>All rights reserved. Unauthorized access is strictly prohibited.
          </p>
        </div>
      </footer>
    </div>
  );
}

function CapabilityCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-black/40 border border-white/5 p-8 hover:border-red-500/50 transition-colors group">
      <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 tracking-wide group-hover:text-red-400 transition-colors">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
