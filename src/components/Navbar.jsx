import React from 'react';
import { Flame, Bookmark, MessageSquare, Sparkles, Bot } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, savedCount, onOpenChatbot }) {
  return (
    <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
      {/* Floating White Pill Navbar Container */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-full px-6 py-2.5 shadow-xl shadow-slate-900/10 flex items-center justify-between text-slate-900 transition-all duration-300">
        
        {/* Left: Brand Name */}
        <div 
          onClick={() => setActiveTab('generator')}
          className="flex items-center space-x-2.5 cursor-pointer font-bold text-lg text-slate-900 tracking-tight"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-md">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 text-base">IdeaForge</span>
        </div>

        {/* Center: Floating Pill Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeTab === 'generator'
                ? 'bg-[#6344f5] text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Forge
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeTab === 'viva'
                ? 'bg-[#6344f5] text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Viva Simulator
          </button>

          <button
            onClick={() => setActiveTab('comparer')}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeTab === 'comparer'
                ? 'bg-[#6344f5] text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Comparer
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              activeTab === 'saved'
                ? 'bg-[#6344f5] text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <span>Saved</span>
            {savedCount > 0 && (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                activeTab === 'saved' ? 'bg-white text-[#6344f5]' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right: AI Chatbot Pill Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenChatbot}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold shadow-sm transition-all"
            title="Chat with AI Mentor"
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>AI Chatbot</span>
          </button>
        </div>

      </div>
    </header>
  );
}
