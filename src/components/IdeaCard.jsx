import React from 'react';
import { Sparkles, Bookmark, FileText, ArrowRight, ShieldCheck, Clock, Users, Cpu } from 'lucide-react';

export default function IdeaCard({ project, onSelect, onSave, isSaved, onExportPDF }) {
  return (
    <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between text-white">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          
          {/* Domain & Difficulty Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wide">
              {project.domain}
            </span>
            <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
              project.difficulty === 'Advanced'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : project.difficulty === 'Intermediate'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {project.difficulty}
            </span>
          </div>

          {/* Innovation Score Circle / Pill */}
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-extrabold shadow-sm shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{project.innovationScore}/100</span>
          </div>

        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(project)}
          className="text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition cursor-pointer mb-2 leading-snug"
        >
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="text-xs italic text-slate-400 mb-4 line-clamp-2">
          "{project.tagline}"
        </p>

        {/* Problem Statement Snippet */}
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 mb-5 text-xs text-slate-300">
          <p className="font-semibold text-slate-400 mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Problem Addressed:</span>
          </p>
          <p className="line-clamp-2 text-slate-300">{project.problemStatement}</p>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-[11px] font-mono text-indigo-200">
              {tech}
            </span>
          ))}
        </div>

        {/* Meta Stats Row */}
        <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{project.timeline}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{project.teamSize}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex space-x-2">
          <button
            onClick={() => onSave(project)}
            className={`p-2.5 rounded-xl border transition ${
              isSaved
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
            }`}
            title={isSaved ? "Saved to your workspace" : "Save project"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-400' : ''}`} />
          </button>

          <button
            onClick={() => onExportPDF(project)}
            className="p-2.5 bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl transition"
            title="Download PDF Proposal Synopsis"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
          </button>
        </div>

        <button
          onClick={() => onSelect(project)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/20 transition group-hover:shadow-indigo-500/30"
        >
          <span>Explore Blueprint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
