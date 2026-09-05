import React, { useState } from 'react';
import { DOMAINS, POPULAR_TECH } from '../data/projectTemplates';
import { Sparkles, Brain, Globe, Smartphone, Shield, Cloud, Cpu, Link as LinkIcon, Activity, DollarSign, Plus, Check, Search, Filter } from 'lucide-react';

const ICON_MAP = {
  Sparkles, Brain, Globe, Smartphone, Shield, Cloud, Cpu, Link: LinkIcon, Activity, DollarSign
};

export default function IdeaGenerator({ onGenerate, isGenerating }) {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedTech, setSelectedTech] = useState(['React', 'Python']);
  const [customTechInput, setCustomTechInput] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [teamSize, setTeamSize] = useState('2-3 Members');
  const [timeline, setTimeline] = useState('6 Months');
  const [keywords, setKeywords] = useState('');

  const toggleTech = (tech) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter(t => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleAddCustomTech = (e) => {
    e.preventDefault();
    if (customTechInput.trim() && !selectedTech.includes(customTechInput.trim())) {
      setSelectedTech([...selectedTech, customTechInput.trim()]);
      setCustomTechInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      domain: selectedDomain,
      skills: selectedTech,
      difficulty,
      teamSize,
      timeline,
      keywords
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-10 text-white">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Final Year Project Generator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          What kind of project do you want to build?
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Select your interests, tech stack, and difficulty level. Our AI mentor will craft A+ grade ideas with full implementation blueprints.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Domain Selector Grid */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>1. Select Primary Field / Domain</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DOMAINS.map((domain) => {
              const IconComp = ICON_MAP[domain.icon] || Sparkles;
              const isSelected = selectedDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-600/30 to-purple-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <IconComp className={`w-6 h-6 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">{domain.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Tech Stack Selector Chips */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            2. Choose Your Preferred Tech Stack & Tools
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {POPULAR_TECH.map((tech) => {
              const isSelected = selectedTech.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 opacity-40" />}
                  <span>{tech}</span>
                </button>
              );
            })}
          </div>

          {/* Add Custom Tech Input */}
          <div className="flex items-center space-x-2 max-w-md">
            <input
              type="text"
              placeholder="Add custom tech (e.g., GraphQL, Solidity, PyTorch)..."
              value={customTechInput}
              onChange={(e) => setCustomTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTech(e)}
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomTech}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* 3. Parameters Grid (Difficulty, Team Size, Timeline) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Complexity Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner / Feasible (3 Months)</option>
              <option value="Intermediate">Intermediate (Standard FYP)</option>
              <option value="Advanced">Advanced / Research-Grade (IEEE level)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Team Structure
            </label>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Solo Project">Solo Student Project</option>
              <option value="2-3 Members">2 - 3 Team Members</option>
              <option value="4+ Members">4+ Team Members</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Available Timeline
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="3 Months">3 Months (Short Semester)</option>
              <option value="6 Months">6 Months (Standard Full Year)</option>
              <option value="9 Months">9 Months (Extended Thesis)</option>
            </select>
          </div>
        </div>

        {/* 4. Custom Interests & Keywords */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>4. Custom Keywords / Specific Focus Area (Optional)</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. Healthcare voice assistant, Autonomous drone path planning, Crypto fraud detection..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-600/25 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI is Crafting Tailored Ideas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <span>Generate Project Blueprints</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
