import React, { useState } from 'react';
import { X, Sparkles, Network, CheckSquare, Code2, HelpCircle, BookOpen, Download, Bookmark, FileText, Check, Rocket } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';
import CodeBoilerplate from './CodeBoilerplate';
import confetti from 'canvas-confetti';

export default function ProjectBlueprint({ project, onClose, onSave, isSaved, onExportPDF, onExportMD }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [completedTasks, setCompletedTasks] = useState({});

  if (!project) return null;

  const toggleTask = (phaseIdx, taskIdx) => {
    const key = `${phaseIdx}-${taskIdx}`;
    const newCompleted = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(newCompleted);

    // Trigger confetti burst if user completes all tasks in a phase!
    if (!completedTasks[key]) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full uppercase tracking-wider">
                {project.domain}
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full">
                {project.difficulty}
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Innovation Score: {project.innovationScore}/100</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{project.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 italic mt-1 font-serif">"{project.tagline}"</p>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onSave(project)}
              className={`p-2.5 rounded-xl border transition ${
                isSaved
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Save to My Projects"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-emerald-400' : ''}`} />
            </button>

            <button
              onClick={() => onExportPDF(project)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto bg-slate-950/80 border-b border-slate-800 px-6 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Features', icon: Sparkles },
            { id: 'architecture', label: 'System Architecture', icon: Network },
            { id: 'roadmap', label: 'Implementation Roadmap', icon: CheckSquare },
            { id: 'code', label: 'Starter Boilerplate', icon: Code2 },
            { id: 'viva', label: 'Viva Defense Prep', icon: HelpCircle },
            { id: 'thesis', label: 'IEEE Synopsis Outline', icon: BookOpen },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900/60">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Problem Statement Box */}
                <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Real-World Problem Statement</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.problemStatement}</p>
                </div>

                {/* Proposed Solution Box */}
                <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Proposed Solution Architecture</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.solutionOverview}</p>
                </div>

              </div>

              {/* Core Features Grid */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Key Project Features & Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="p-1 bg-indigo-500/20 text-indigo-400 rounded-md shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Innovation Boosters */}
              {project.innovationBoosters && (
                <div className="p-5 bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-500/30 rounded-2xl">
                  <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <Rocket className="w-4 h-4 text-purple-400" />
                    <span>Innovation Boosters for A+ Grade</span>
                  </h3>
                  <div className="space-y-2">
                    {project.innovationBoosters.map((b, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-bold text-purple-200">{b.title}: </span>
                        <span className="text-slate-300">{b.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: System Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <ArchitectureDiagram chartCode={project.architectureDiagram} />
            </div>
          )}

          {/* TAB 3: Implementation Roadmap */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">Phase-by-Phase Execution Plan</h3>
                <span className="text-xs text-slate-400">Click checkboxes to track your progress</span>
              </div>

              <div className="space-y-4">
                {project.roadmap.map((phase, pIdx) => (
                  <div key={pIdx} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-bold text-[11px] rounded-md">
                          {phase.phase}
                        </span>
                        <h4 className="font-bold text-sm text-slate-200">{phase.title}</h4>
                      </div>
                      <span className="text-xs text-indigo-400 font-mono font-semibold">{phase.duration}</span>
                    </div>

                    <div className="space-y-2">
                      {phase.tasks.map((task, tIdx) => {
                        const key = `${pIdx}-${tIdx}`;
                        const isDone = !!completedTasks[key];
                        return (
                          <div
                            key={tIdx}
                            onClick={() => toggleTask(pIdx, tIdx)}
                            className={`flex items-center space-x-3 p-2.5 rounded-xl border transition cursor-pointer ${
                              isDone
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                            />
                            <span className={`text-xs ${isDone ? 'line-through text-slate-400' : ''}`}>{task}</span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: Code Boilerplate */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <CodeBoilerplate boilerplate={project.codeBoilerplate} />
            </div>
          )}

          {/* TAB 5: Viva Prep */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                <p className="font-bold mb-1">🎓 Professor Defense & Viva Tip:</p>
                <p>Review these anticipated examiner questions before your demo day to defend your architectural design decisions confidently.</p>
              </div>

              <div className="space-y-3">
                {project.vivaQuestions.map((viva, idx) => (
                  <div key={idx} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded-md">
                        {viva.category}
                      </span>
                      <span className="text-slate-500">Question #{idx + 1}</span>
                    </div>
                    <p className="font-extrabold text-sm text-slate-100">Q: {viva.question}</p>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                      <span className="font-bold text-emerald-400">Model Defense Answer: </span>
                      {viva.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Thesis & Synopsis Outline */}
          {activeTab === 'thesis' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-200">IEEE Thesis / Report Chapter Outline</h3>
                <button
                  onClick={() => onExportMD(project)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-indigo-300 transition"
                >
                  Download Markdown (.md)
                </button>
              </div>

              <div className="space-y-3">
                {project.reportOutline.map((chap, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-indigo-400 font-bold mr-2">{chap.chapter}:</span>
                      <span className="font-extrabold text-white text-sm">{chap.title}</span>
                    </div>
                    <p className="text-slate-400 text-xs max-w-md">{chap.contentSummary}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onExportMD(project)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={() => onExportPDF(project)}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete PDF Report</span>
          </button>
        </div>

      </div>
    </div>
  );
}
