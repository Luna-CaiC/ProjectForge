import React from 'react';
import { ProjectIdea } from '../types';
import { Lightbulb, Rocket, Clock, ArrowLeft, Download, Code } from 'lucide-react';
import { jsPDF } from "jspdf";

interface ProjectSelectionProps {
  projects: ProjectIdea[];
  onSelect: (project: ProjectIdea) => void;
  onBack: () => void;
  isBuildingId: string | null; 
}

const ProjectSelection: React.FC<ProjectSelectionProps> = ({ projects, onSelect, onBack, isBuildingId }) => {

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("Project Proposals", 105, yPos, { align: "center" });
    yPos += 15;

    projects.forEach((project, index) => {
      // Title
      doc.setFontSize(16);
      doc.setTextColor(13, 148, 136); // teal-600
      doc.text(`${index + 1}. ${project.title} [${project.difficulty}]`, 14, yPos);
      yPos += 8;

      // Meta
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Type: ${project.type} | Est. Hours: ${project.estimatedHours}h`, 14, yPos);
      yPos += 8;

      // Tagline
      doc.setFontSize(12);
      doc.setTextColor(50);
      doc.setFont("helvetica", "italic");
      doc.text(`"${project.tagline}"`, 14, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;

      // Description (wrapped)
      doc.setFontSize(11);
      doc.setTextColor(20);
      const descLines = doc.splitTextToSize(project.description, 180);
      doc.text(descLines, 14, yPos);
      yPos += (descLines.length * 6) + 5;

      // Tech Stack
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Tech Stack:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(project.keyTech.join(", "), 40, yPos);
      yPos += 20; 
    });

    doc.save("project-proposals.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-white font-mono text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> RETURN_TO_CONFIG
        </button>
        
        <h2 className="text-3xl font-display font-bold text-white text-center flex-1">Select Project Path</h2>
        
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-slate-200 rounded-lg font-medium transition-colors text-sm border border-slate-700"
        >
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={`flex flex-col glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:bg-slate-800/80 group border-l-4 ${
              project.type === 'Practical' ? 'border-l-emerald-500' : 'border-l-violet-500'
            }`}
          >
            {/* Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    project.type === 'Practical' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-violet-400'
                  }`}>
                    {project.type}
                  </span>
                  <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-700/50 text-slate-300 border border-slate-600">
                    {project.difficulty} Level
                  </span>
                </div>
                <div className="flex items-center text-slate-500 text-xs font-mono">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {project.estimatedHours}h
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-brand-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-400 text-sm font-medium italic">"{project.tagline}"</p>
            </div>

            {/* Body */}
            <div className="p-8 pt-2 flex-grow flex flex-col">
              <p className="text-slate-300 leading-relaxed text-sm mb-6 flex-grow border-t border-slate-700/50 pt-4">
                {project.description}
              </p>

              <div className="mb-6">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Code className="w-3 h-3" /> Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.keyTech.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 bg-dark-900 text-slate-300 rounded border border-slate-700 text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelect(project)}
                disabled={!!isBuildingId}
                className={`w-full py-3.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                   !!isBuildingId && isBuildingId !== project.id ? 'opacity-30 cursor-not-allowed' : ''
                } ${
                  project.type === 'Practical' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white' 
                    : 'bg-violet-500/10 border-violet-500/50 text-violet-400 hover:bg-violet-500 hover:text-white'
                }`}
              >
                {isBuildingId === project.id ? (
                   "Generating Blueprint..."
                ) : (
                  <>
                    Generate Blueprint <Rocket className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelection;