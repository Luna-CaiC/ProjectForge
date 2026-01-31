import React from 'react';
import { ProjectBlueprint } from '../types';
import { Map, Code2, Cpu, ListChecks, ShieldAlert, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

interface BlueprintViewProps {
  blueprint: ProjectBlueprint;
  onProceed: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const BlueprintView: React.FC<BlueprintViewProps> = ({ blueprint, onProceed, onBack, isLoading }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white font-mono text-sm transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> RETURN_TO_SELECTION
      </button>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700/50">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-dark-800 to-dark-900 p-8 md:p-12 relative overflow-hidden border-b border-slate-700">
           {/* Decorative */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-brand-400">
              <Map className="w-5 h-5" />
              <span className="font-mono font-bold tracking-widest uppercase text-xs">Architectural Blueprint</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{blueprint.title}</h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-4xl border-l-2 border-brand-500 pl-6">
              {blueprint.overview}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-16">
          
          {/* Tech Stack */}
          <section>
            <h3 className="flex items-center gap-2 text-xl font-display font-bold text-white mb-6 pb-2 border-b border-slate-800">
              <Code2 className="w-5 h-5 text-brand-400" /> Technology Stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blueprint.techStack.map((stack, idx) => (
                <div key={idx} className="bg-dark-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <h4 className="font-bold text-slate-200 mb-3 text-sm uppercase tracking-wide">{stack.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {stack.tools.map(tool => (
                      <span key={tool} className="text-xs bg-dark-900 border border-slate-700 px-2.5 py-1.5 rounded text-slate-300 font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section>
              <h3 className="flex items-center gap-2 text-xl font-display font-bold text-white mb-6">
                <Cpu className="w-5 h-5 text-brand-400" /> Key Features
              </h3>
              <ul className="space-y-4">
                {blueprint.coreFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 bg-dark-800/30 p-4 rounded-lg border border-slate-800">
                    <div className="min-w-6 h-6 rounded bg-brand-500/10 text-brand-400 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-xl font-display font-bold text-white mb-6">
                <Map className="w-5 h-5 text-brand-400" /> System Architecture
              </h3>
              <div className="bg-dark-900 text-slate-300 p-6 rounded-lg font-mono text-xs leading-relaxed border border-slate-800 shadow-inner">
                {blueprint.architecture}
              </div>
            </section>
          </div>

          {/* Implementation Plan */}
          <section>
            <h3 className="flex items-center gap-2 text-xl font-display font-bold text-white mb-8 pb-2 border-b border-slate-800">
              <ListChecks className="w-5 h-5 text-brand-400" /> Implementation Roadmap
            </h3>
            <div className="space-y-6">
              {blueprint.implementationSteps.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                   <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-dark-800 border border-slate-600 text-slate-300 flex items-center justify-center font-bold text-xs z-10 group-hover:border-brand-500 group-hover:text-brand-400 transition-colors">
                        {idx + 1}
                      </div>
                      {idx !== blueprint.implementationSteps.length - 1 && (
                        <div className="w-px h-full bg-slate-800 my-2 group-hover:bg-slate-700"></div>
                      )}
                   </div>
                   <div className="bg-dark-800/40 p-6 rounded-xl border border-slate-800 flex-1 hover:bg-dark-800/60 transition-colors">
                     <h4 className="font-bold text-white text-lg mb-2">{step.phase}</h4>
                     <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Challenges */}
          <section>
             <h3 className="flex items-center gap-2 text-xl font-display font-bold text-white mb-6 pb-2 border-b border-slate-800">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> Engineering Challenges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blueprint.challengesAndSolutions.map((item, i) => (
                <div key={i} className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-6">
                  <h4 className="font-bold text-amber-500 mb-3 text-sm uppercase tracking-wide">Challenge: {item.challenge}</h4>
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    <p className="text-slate-300 text-sm leading-relaxed"><span className="font-semibold text-emerald-400">Solution:</span> {item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer Action */}
        <div className="p-8 bg-dark-900/50 border-t border-slate-800 text-center">
          <p className="text-slate-500 mb-6 text-sm font-mono">Prove your professional capabilities.</p>
          <button 
            onClick={onProceed}
            disabled={isLoading}
            className="inline-flex items-center gap-3 bg-white text-dark-900 hover:bg-brand-50 text-lg font-bold px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Predict Interview Q&A"} 
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlueprintView;