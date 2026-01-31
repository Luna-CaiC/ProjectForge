import React from 'react';
import { Terminal, Cpu } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative text-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Badge removed as requested */}
      
      <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
        Build Tech Project.<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Land your dream job.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
        Bridge the gap between inspiration and implementation. <br/>
        Generate industry-standard project blueprints and master the technical interview.
      </p>
    </div>
  );
};

export default Hero;