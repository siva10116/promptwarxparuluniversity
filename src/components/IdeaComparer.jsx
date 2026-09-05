import React, { useState } from 'react';
import { Columns, Sparkles, Check, ArrowRight, Award, ShieldCheck, Cpu, Clock, HelpCircle } from 'lucide-react';

export default function IdeaComparer({ projects, onSelectProject }) {
  const [selectedIds, setSelectedIds] = useState(
    projects.slice(0, 2).map(p => p.id)
  );

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedProjects = projects.filter(p => selectedIds.includes(p.id));

  return (
    <div className="bg-[#121c38] border border-[#2a3c6b] rounded-3xl p-6 sm:p-8 shadow-2xl max-w-6xl mx-auto text-white">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-[#2a3c6b]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-full mb-2">
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side Blueprint Comparison</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold">Project Decision Matrix</h3>
          <p className="text-xs text-slate-400 mt-1">Select up to 3 project ideas to compare feasibility, professor approval rate, and IEEE research potential.</p>
        </div>
      </div>

      {/* Idea Selector Chips */}
      <div className="my-6">
        <label className="block text-xs font-mono font-bold text-slate-400 mb-3 uppercase">
          Select Ideas to Compare (Max 3):
        </label>
        <div className="flex flex-wrap gap-2">
          {projects.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isSelected
                    ? 'bg-[#FF6A3D] text-[#12203A] font-bold shadow-md'
                    : 'bg-[#0b1329] border border-[#2a3c6b] text-slate-300 hover:border-slate-500'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span className="truncate max-w-[180px]">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${comparedProjects.length} gap-6 mt-6`}>
        {comparedProjects.map((project) => (
          <div key={project.id} className="bg-[#0b1329] border border-[#2a3c6b] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-[10px] uppercase rounded">
                  {project.domain}
                </span>
                <span className="text-xs font-bold text-[#5FD6A0]">
                  Score: {project.innovationScore}/100
                </span>
              </div>

              <h4 className="font-extrabold text-base text-white mb-2 leading-snug">{project.title}</h4>
              <p className="text-xs italic text-slate-400 mb-4 line-clamp-2">"{project.tagline}"</p>

              {/* Metrics Table */}
              <div className="space-y-3 pt-3 border-t border-[#2a3c6b] text-xs">
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Difficulty:</span>
                  <span className="font-bold text-amber-400">{project.difficulty}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-mono text-slate-200">{project.duration || project.timeline}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Professor Approval:</span>
                  <span className="font-bold text-emerald-400">95% High</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">IEEE Publication:</span>
                  <span className="font-bold text-indigo-300">
                    {project.difficulty === 'Advanced' ? 'IEEE Conference' : 'National Journal'}
                  </span>
                </div>

              </div>

              {/* Core Features Preview */}
              <div className="mt-4 pt-3 border-t border-[#2a3c6b] text-xs">
                <span className="font-mono text-slate-400 block mb-2 font-bold">Key Technical Scope:</span>
                <ul className="space-y-1.5 text-slate-300">
                  {(project.features || project.keyFeatures || []).slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D] shrink-0 mt-1.5" />
                      <span className="line-clamp-2">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <button
              onClick={() => onSelectProject(project)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition"
            >
              <span>Explore Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
