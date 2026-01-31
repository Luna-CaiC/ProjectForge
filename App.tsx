import React, { useState } from 'react';
import Hero from './components/Hero';
import ProjectForm from './components/ProjectForm';
import ProjectSelection from './components/ProjectSelection';
import BlueprintView from './components/BlueprintView';
import InterviewPrep from './components/InterviewPrep';
import { generateProjects, generateBlueprint, generateInterviewQA } from './services/geminiService';
import { ProjectRequest, ProjectIdea, ProjectBlueprint, InterviewPrep as InterviewPrepType } from './types';
import { Layout } from 'lucide-react';

type ViewState = 'HOME' | 'SELECTION' | 'BLUEPRINT' | 'INTERVIEW';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  
  // Loading states
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [buildingProjectId, setBuildingProjectId] = useState<string | null>(null); 
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);

  // Data State
  const [currentRequest, setCurrentRequest] = useState<ProjectRequest | null>(null);
  const [generatedProjects, setGeneratedProjects] = useState<ProjectIdea[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewPrepType | null>(null);

  // Handlers
  const handleGenerateProjects = async (request: ProjectRequest) => {
    setIsFormLoading(true);
    setCurrentRequest(request);
    try {
      const projects = await generateProjects(request);
      setGeneratedProjects(projects);
      setView('SELECTION');
    } catch (error) {
      alert("Something went wrong generating ideas. Please try again.");
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleSelectProject = async (project: ProjectIdea) => {
    setBuildingProjectId(project.id);
    setSelectedProject(project);
    try {
      if (currentRequest) {
        const bp = await generateBlueprint(project, currentRequest.role);
        setBlueprint(bp);
        setView('BLUEPRINT');
      }
    } catch (error) {
      alert("Could not generate blueprint. Please try again.");
    } finally {
      setBuildingProjectId(null);
    }
  };

  const handleProceedToInterview = async () => {
    if (!selectedProject || !blueprint) return;
    
    setIsInterviewLoading(true);
    try {
      const allTech = blueprint.techStack;
      const data = await generateInterviewQA(selectedProject.title, selectedProject.description, allTech);
      setInterviewData(data);
      setView('INTERVIEW');
    } catch (error) {
      alert("Could not generate interview questions. Please try again.");
    } finally {
      setIsInterviewLoading(false);
    }
  };

  // Navigation Logic
  const handleBackToPreferences = () => {
    setView('HOME');
  };

  const handleBackToSelection = () => {
    setView('SELECTION');
    // Clear blueprint to ensure clean state if they select a different one
    setBlueprint(null);
    setSelectedProject(null);
  };

  const handleBackToBlueprint = () => {
    setView('BLUEPRINT');
  };

  const handleReset = () => {
    setView('HOME');
    setGeneratedProjects([]);
    setSelectedProject(null);
    setBlueprint(null);
    setInterviewData(null);
    setCurrentRequest(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-100">
      {/* Simple Header */}
      <header className="bg-dark-900/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
          <div className="bg-white text-dark-900 p-1.5 rounded-lg group-hover:bg-brand-400 transition-colors">
            <Layout className="w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold text-white tracking-tight group-hover:text-brand-400 transition-colors">ProjectForge</span>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400 font-mono border border-white/5">BETA_V2</div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative">
        {view === 'HOME' && (
          <div className="animate-in fade-in duration-700">
            <Hero />
            <div className="px-4 pb-20 -mt-10">
              <ProjectForm onSubmit={handleGenerateProjects} isLoading={isFormLoading} />
            </div>
          </div>
        )}

        {view === 'SELECTION' && (
          <div className="animate-in slide-in-from-right-10 fade-in duration-500">
            <ProjectSelection 
              projects={generatedProjects} 
              onSelect={handleSelectProject} 
              onBack={handleBackToPreferences}
              isBuildingId={buildingProjectId}
            />
          </div>
        )}

        {view === 'BLUEPRINT' && blueprint && (
          <div className="animate-in slide-in-from-right-10 fade-in duration-500">
            <BlueprintView 
              blueprint={blueprint} 
              onProceed={handleProceedToInterview} 
              onBack={handleBackToSelection}
              isLoading={isInterviewLoading} 
            />
          </div>
        )}

        {view === 'INTERVIEW' && interviewData && (
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <InterviewPrep 
              data={interviewData} 
              onReset={handleReset} 
              onBack={handleBackToBlueprint}
            />
          </div>
        )}
      </main>

      <footer className="bg-dark-900 border-t border-white/5 py-8 text-center text-slate-600 text-xs font-mono">
        <p>PROJECT_FORGE // POWERED_BY_GEMINI // {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;