import React, { useState } from 'react';
import { ProjectRequest, Role, Difficulty } from '../types';
import { ROLES, DIFFICULTIES } from '../constants';
import { Briefcase, Layers, BarChart3, Loader2, Check, ArrowRight } from 'lucide-react';

interface ProjectFormProps {
  onSubmit: (request: ProjectRequest) => void;
  isLoading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, isLoading }) => {
  const [role, setRole] = useState<Role>(ROLES[0]);
  const [industry, setIndustry] = useState<string>('');
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);

  const toggleDifficulty = (level: Difficulty) => {
    setDifficulties(prev => 
      prev.includes(level) 
        ? prev.filter(d => d !== level)
        : [...prev, level]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDifficulties = difficulties.length > 0 ? difficulties : ['Medium'] as Difficulty[];
    onSubmit({ role, industry, difficulties: finalDifficulties });
  };

  return (
    <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-1 shadow-2xl relative z-10">
      <div className="bg-dark-800/80 rounded-xl p-8 md:p-10">
        <form onSubmit={handleSubmit}>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-mono text-brand-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Target Role
              </label>
              <div className="relative group">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-dark-900 text-white px-5 py-3.5 rounded-lg border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all appearance-none cursor-pointer hover:border-slate-600"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block text-xs font-mono text-brand-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3 h-3" /> Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. FinTech (Optional)"
                className="w-full bg-dark-900 text-white px-5 py-3.5 rounded-lg border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600 hover:border-slate-600"
              />
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-10">
            <label className="block text-xs font-mono text-brand-400 mb-3 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-3 h-3" /> Complexity Levels
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((level) => {
                const isSelected = difficulties.includes(level);
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleDifficulty(level)}
                    className={`relative py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center font-medium text-sm ${
                      isSelected
                        ? 'bg-brand-500/10 border-brand-500 text-brand-400'
                        : 'bg-dark-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {level}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5">
                        <Check className="w-3 h-3 text-brand-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-dark-900 hover:bg-brand-50 font-bold text-lg py-4 rounded-xl transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                Generate Project Proposals <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;