'use client';

import { useEffect, useState } from 'react';

export function InteractiveGlobe() {
  return (
    <div className="w-full h-[450px] flex justify-center items-center relative bg-gradient-to-br from-slate-50 to-slate-200 rounded-3xl overflow-hidden shadow-xl mb-20 border border-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1502920514313-52581002a659?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center"></div>
      
      {/* Globe Container */}
      <div className="relative w-[300px] h-[300px] preserve-3d animate-globe-rotate">
        {/* Globe Sphere */}
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_#4DB6AC,_#26A69A,_#00897B,_#00796B)] shadow-[0_0_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
          {/* Grid Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect x=%220%22 y=%220%22 width=%2250%22 height=%2250%22 fill=%22rgba(255,255,255,0.2)%22/><rect x=%2250%22 y=%2250%22 width=%2250%22 height=%2250%22 fill=%22rgba(255,255,255,0.2)%22/></svg>')] bg-[length:20px_20px]"></div>

          {/* Routes */}
          {[15, 45, 75, 105, 135].map((deg, i) => (
            <div 
              key={i} 
              className="absolute w-full h-full rounded-full"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div className="absolute w-full h-[2px] bg-white/70 top-1/2 left-0"></div>
            </div>
          ))}

          {/* Ships */}
          {[0, -2, -4, -6, -8].map((delay, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 bg-amber-400 rounded-full animate-ship-move"
              style={{ 
                top: `${30 + i * 10}%`,
                animationDelay: `${delay}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes rotate {
          0% { transform: rotateY(0deg) rotateX(15deg); }
          100% { transform: rotateY(360deg) rotateX(15deg); }
        }
        .animate-globe-rotate {
          animation: rotate 20s linear infinite;
        }
        @keyframes move {
          0% { transform: translate(-200px, 0); }
          100% { transform: translate(200px, 0); }
        }
        .animate-ship-move {
          animation: move 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
