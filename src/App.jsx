import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IdeaGenerator from './components/IdeaGenerator';
import IdeaCard from './components/IdeaCard';
import ProjectBlueprint from './components/ProjectBlueprint';
import SavedProjects from './components/SavedProjects';
import MentorChat from './components/MentorChat';
import ApiKeyModal from './components/ApiKeyModal';
import { generateProjectIdeas } from './services/aiGeneratorService';
import { exportProjectPDF, exportProjectMarkdown } from './services/pdfExporter';
import { PROJECT_TEMPLATES } from './data/projectTemplates';
import { Sparkles, GraduationCap, Award, Compass, Zap, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [projects, setProjects] = useState(PROJECT_TEMPLATES);
  const [selectedProject, setSelectedProject] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Load saved projects & API key from localStorage on initial mount
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem('projectspark_saved');
      if (storedSaved) {
        setSavedProjects(JSON.parse(storedSaved));
      }
      const storedKey = localStorage.getItem('projectspark_apikey');
      if (storedKey) {
        setApiKey(storedKey);
      }
    } catch (e) {
      console.warn("Error reading localStorage:", e);
    }
  }, []);

  // Sync saved projects to localStorage
  const saveSavedProjectsToStorage = (updated) => {
    setSavedProjects(updated);
    try {
      localStorage.setItem('projectspark_saved', JSON.stringify(updated));
    } catch (e) {
      console.warn("Error writing to localStorage:", e);
    }
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    try {
      localStorage.setItem('projectspark_apikey', key);
    } catch (e) {
      console.warn("Error saving API key:", e);
    }
  };

  const handleGenerate = async (params) => {
    setIsGenerating(true);
    try {
      const ideas = await generateProjectIdeas({ ...params, apiKey });
      setProjects(ideas);
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSaveProject = (project) => {
    const exists = savedProjects.some(p => p.id === project.id);
    if (exists) {
      const updated = savedProjects.filter(p => p.id !== project.id);
      saveSavedProjectsToStorage(updated);
    } else {
      const updated = [...savedProjects, project];
      saveSavedProjectsToStorage(updated);
    }
  };

  const handleDeleteSavedProject = (projectId) => {
    const updated = savedProjects.filter(p => p.id !== projectId);
    saveSavedProjectsToStorage(updated);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300`}>
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedProjects.length}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Hero & Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Hero Banner (Visible on Generator tab) */}
        {activeTab === 'generator' && (
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>AI-Powered Final Year Project Generator & Advisor</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Turn Your Skills Into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">A+ Grade</span> Final Year Project
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Get personalized IEEE-ready project ideas complete with full architecture diagrams, step-by-step implementation roadmaps, viva defense prep Q&A, and starter boilerplate code.
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-2">
              <div className="flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>30+ Project Templates</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>IEEE Synopsis & Viva Q&A</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Architecture Diagram Generator</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: Generator */}
        {activeTab === 'generator' && (
          <div>
            <IdeaGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />

            {/* Ideas Grid */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Recommended Project Blueprints</span>
                </h3>
                <span className="text-xs text-slate-400">{projects.length} Blueprints Available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <IdeaCard
                    key={project.id}
                    project={project}
                    onSelect={setSelectedProject}
                    onSave={handleToggleSaveProject}
                    isSaved={savedProjects.some(p => p.id === project.id)}
                    onExportPDF={exportProjectPDF}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Saved Projects */}
        {activeTab === 'saved' && (
          <SavedProjects
            savedProjects={savedProjects}
            onSelect={setSelectedProject}
            onDelete={handleDeleteSavedProject}
            onExportPDF={exportProjectPDF}
            onExportMD={exportProjectMarkdown}
          />
        )}

        {/* VIEW 3: AI Mentor Chat */}
        {activeTab === 'chat' && (
          <MentorChat
            selectedProject={selectedProject}
            apiKey={apiKey}
          />
        )}

      </main>

      {/* Selected Project Blueprint Modal */}
      {selectedProject && (
        <ProjectBlueprint
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSave={handleToggleSaveProject}
          isSaved={savedProjects.some(p => p.id === selectedProject.id)}
          onExportPDF={exportProjectPDF}
          onExportMD={exportProjectMarkdown}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 mt-16 text-center text-xs text-slate-500">
        <p>ProjectSpark AI — Empowering Final Year Engineering & Computer Science Students worldwide.</p>
      </footer>

    </div>
  );
}
