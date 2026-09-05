import React from 'react';
import { Flame, Bookmark, MessageSquare, Key, Columns, GraduationCap, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, savedCount, onOpenApiKeyModal }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0b1329]/90 backdrop-blur-md border-b border-[#2a3c6b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => setActiveTab('generator')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-[#0b1329] rounded-[14px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#FF6A3D] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg text-white tracking-tight">
                IdeaForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A3D] to-amber-400">AI</span>
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/30">
                CAPSTONE FORGE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-mono">Final Year Project & Defense Advisor</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#121c38] p-1.5 rounded-2xl border border-[#2a3c6b]">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1b284d]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Project Forge</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'viva'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1b284d]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Viva Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('comparer')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'comparer'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1b284d]'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-indigo-400" />
            <span>Idea Comparer</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition relative ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1b284d]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedCount})</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121c38] border border-[#2a3c6b] text-slate-300 hover:text-white transition"
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Gemini API Key</span>
          </button>
        </div>

      </div>
    </header>
  );
}
