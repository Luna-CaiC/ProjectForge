import React, { useState } from 'react';
import { InterviewPrep as InterviewPrepType } from '../types';
import { MessageSquare, Star, Code, ChevronDown, ChevronUp, RefreshCcw, ArrowLeft } from 'lucide-react';

interface InterviewPrepProps {
  data: InterviewPrepType;
  onReset: () => void;
  onBack: () => void;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ data, onReset, onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white font-mono text-sm transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> RETURN_TO_BLUEPRINT
      </button>

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl mb-6 shadow-glow">
           <MessageSquare className="w-8 h-8 text-brand-400" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Interview Preparation</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
          Own the conversation. <br/>
          Anticipate the tough questions, articulate your engineering decisions, and demonstrate your expertise.
        </p>
      </div>

      <div className="space-y-4">
        {data.questions.map((qa, index) => (
          <div 
            key={index} 
            className={`bg-dark-800/40 rounded-xl border transition-all duration-300 ${
              openIndex === index 
                ? 'border-brand-500/50 shadow-lg bg-dark-800/80' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <button 
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-start justify-between p-6 text-left"
            >
              <div className="flex gap-5">
                <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold font-mono ${
                  openIndex === index ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      qa.category === 'Technical' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      qa.category === 'Behavioral' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {qa.category}
                    </span>
                  </div>
                  <h3 className={`font-bold text-lg leading-snug transition-colors ${
                    openIndex === index ? 'text-white' : 'text-slate-300'
                  }`}>{qa.question}</h3>
                </div>
              </div>
              {openIndex === index ? <ChevronUp className="text-brand-400 flex-shrink-0 mt-2" /> : <ChevronDown className="text-slate-600 flex-shrink-0 mt-2" />}
            </button>

            {openIndex === index && (
              <div className="p-6 pt-0 pl-[4.5rem]">
                 <div className="bg-dark-900/50 p-6 rounded-lg border border-slate-700/50 relative">
                   <div className="flex items-center gap-2 mb-4 text-brand-400 font-bold text-xs uppercase tracking-widest">
                     <Star className="w-3 h-3" /> Answer Strategy
                   </div>
                   <p className="text-slate-300 leading-relaxed whitespace-pre-line mb-6 text-sm">
                     {qa.answer}
                   </p>
                   
                   <div className="border-t border-slate-800 pt-4">
                     <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                       <Code className="w-3 h-3" /> Key Concepts
                     </h4>
                     <div className="flex flex-wrap gap-2">
                       {qa.keyPoints.map((point, i) => (
                         <span key={i} className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700 font-medium">
                           {point}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center border-t border-slate-800 pt-10">
        <button 
          onClick={onReset}
          className="group inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
        >
          <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Start a new project
        </button>
      </div>
    </div>
  );
};

export default InterviewPrep;