import React, { useState } from 'react';
import { Bookmark, ArrowRight, Trash2, FileText, Download, CheckCircle2, Sparkles } from 'lucide-react';

export default function SavedProjects({ savedProjects, onSelect, onDelete, onExportPDF, onExportMD }) {
  const [projectStatus, setProjectStatus] = useState({});

  const handleStatusChange = (projectId, newStatus) => {
    setProjectStatus(prev => ({ ...prev, [projectId]: newStatus }));
  };

  if (!savedProjects || savedProjects.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center text-white max-w-2xl mx-auto my-10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">No Saved Projects Yet</h3>
        <p className="text-slate-400 text-xs mb-6">
          Generate project ideas using our AI generator and save your favorites to manage blueprints and track progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Saved Project Workspace</h2>
          <p className="text-xs text-slate-400">Manage your saved final year project ideas and track implementation status.</p>
        </div>
        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs rounded-full">
          {savedProjects.length} Projects Saved
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedProjects.map((project) => {
          const currentStatus = projectStatus[project.id] || 'Blueprint Ready';
          return (
            <div key={project.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 uppercase">
                    {project.domain}
                  </span>
                  
                  {/* Status Dropdown */}
                  <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-emerald-400 focus:outline-none"
                  >
                    <option value="Idea Saved">Idea Saved</option>
                    <option value="Blueprint Ready">Blueprint Ready</option>
                    <option value="In Development">In Development</option>
                    <option value="Viva Ready">Viva Defense Ready</option>
                  </select>
                </div>

                <h3 className="text-lg font-extrabold text-white hover:text-indigo-300 transition cursor-pointer" onClick={() => onSelect(project)}>
                  {project.title}
                </h3>
                <p className="text-xs italic text-slate-400 mt-1 line-clamp-2">"{project.tagline}"</p>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 5).map(tech => (
                  <span key={tech} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-indigo-200">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex space-x-1">
                  <button
                    onClick={() => onDelete(project.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onExportPDF(project)}
                    className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition"
                    title="Download PDF Synopsis"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onExportMD(project)}
                    className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition"
                    title="Download Markdown"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onSelect(project)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
                >
                  <span>Open Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
