import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, Bot, User, Sparkles, HelpCircle, BookOpen, MessageSquare,
  RefreshCw, Key, Download, Copy, Check, RotateCcw, Sliders, Database, ChevronDown, ChevronUp
} from 'lucide-react';
import { converseWithMentorChatbot } from '../services/aiGeneratorService';

export default function MentorChatModal({ isOpen, onClose, selectedProject, savedIdeas = [], currentIdeas = [], userProfile = {} }) {
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('ideaforge_custom_gemini_key') || '';
  });
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const defaultWelcomeMessage = {
    id: 1,
    sender: 'mentor',
    text: selectedProject 
      ? `Hello! I am your **IdeaForge AI Conversational Mentor**. I have loaded your project data for **"${selectedProject.title}"** (Tech Stack: ${selectedProject.techStack?.join(', ')}).\n\nAsk me anything about system architecture, database choices, literature surveys, starter code, or Viva defense questions!`
      : `Hello! I am your **IdeaForge AI Conversational Mentor**. I am grounded on your saved blueprints (${savedIdeas.length} saved), active interests, and system templates.\n\nHow can I assist your final year engineering capstone project today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('ideaforge_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error loading stored chat history:", e);
    }
    return [defaultWelcomeMessage];
  });

  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('ideaforge_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn("Error persisting chat history:", e);
    }
  }, [messages]);

  const handleSaveApiKey = (key) => {
    setCustomApiKey(key);
    try {
      localStorage.setItem('ideaforge_custom_gemini_key', key);
    } catch (e) {
      console.warn("Error saving custom API key:", e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear conversation history and restart mentor chat?")) {
      const reset = [defaultWelcomeMessage];
      setMessages(reset);
      localStorage.removeItem('ideaforge_chat_history');
    }
  };

  const handleExportChat = () => {
    const textContent = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([textContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ideaforge-chatbot-transcript-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    const query = inputQuestion.trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuestion('');
    setIsTyping(true);

    try {
      // Pass full multi-turn history and grounded user context to conversational RAG engine
      const historyTurns = updatedMessages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const responseText = await converseWithMentorChatbot({
        question: query,
        history: historyTurns.slice(-10), // keep last 10 turns for token efficiency
        userContext: {
          selectedProject,
          savedIdeas,
          currentIdeas,
          userProfile
        },
        apiKey: customApiKey
      });

      const mentorMsg = {
        id: Date.now() + 1,
        sender: 'mentor',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mentorMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'mentor',
          text: "⚠️ Conversation service encountered a network hiccup. Please check your Gemini API key or connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestPrompts = selectedProject ? [
    `What 5 tricky viva questions will examiners ask about "${selectedProject.title}"?`,
    `Explain the system architecture flow for ${selectedProject.title}`,
    `Should I use SQL or NoSQL database for this project?`,
    `Draft an IEEE Literature Survey outline for ${selectedProject.title}`
  ] : [
    "Recommend an A+ grade AI/ML final year project for my skills",
    "What viva questions do professors ask about React & Python backends?",
    "How do I structure the System Architecture chapter in my report?",
    "Compare side-by-side my saved blueprints"
  ];

  // Basic Markdown Formatter for Chat Messages
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold text replacements
      let formattedLine = line;
      const parts = formattedLine.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="text-amber-300 font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc space-y-1 my-0.5">
            {lineContent}
          </li>
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="ml-2 font-mono text-xs my-1 text-slate-200">
            {lineContent}
          </div>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-1'}>
          {lineContent}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-white">
      <div className="bg-[#121c38] border border-[#2a3c6b] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0b1329] border-b border-[#2a3c6b] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6A3D] via-indigo-600 to-[#6344f5] flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center space-x-2 text-white">
                <span>IdeaForge AI Conversational Bot</span>
                <span className="px-2 py-0.5 rounded-full bg-[#5FD6A0]/20 text-[#5FD6A0] border border-[#5FD6A0]/30 text-[10px] font-mono">
                  Gemini + RAG
                </span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center space-x-1">
                <Database className="w-3 h-3 text-indigo-400" />
                <span>
                  {selectedProject 
                    ? `Active: ${selectedProject.title.slice(0, 28)}...` 
                    : `Grounded on ${savedIdeas.length} saved projects & RAG index`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setShowKeySettings(!showKeySettings)}
              className={`p-2 rounded-xl border text-xs font-mono flex items-center space-x-1 transition ${
                customApiKey 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-[#1b284d] border-[#2a3c6b] text-slate-300 hover:text-white'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-4 h-4 text-[#FF6A3D]" />
              <span className="hidden sm:inline">{customApiKey ? 'Key Connected' : 'API Key'}</span>
            </button>

            <button
              onClick={handleExportChat}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1b284d] transition"
              title="Export Conversation (.md)"
            >
              <Download className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={handleClearHistory}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-[#1b284d] transition"
              title="Restart Conversation"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1b284d] transition"
              aria-label="Close Chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible API Key Bar */}
        {showKeySettings && (
          <div className="p-3 bg-[#0e172e] border-b border-[#2a3c6b] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Key className="w-4 h-4 text-[#FF6A3D] shrink-0" />
              <span className="text-slate-300 whitespace-nowrap">Gemini API Key:</span>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="AQ.Ab8RN... or VITE_GEMINI_API_KEY"
                className="w-full sm:w-64 px-3 py-1.5 bg-[#121c38] border border-[#2a3c6b] rounded-lg text-white font-mono focus:outline-none focus:border-[#FF6A3D]"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Key stored locally in browser storage. Multi-turn AI chat uses Gemini 1.5 Flash.
            </p>
          </div>
        )}

        {/* Grounded User Data Banner */}
        <div className="px-4 py-2 bg-[#172445] border-b border-[#2a3c6b]/60 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#5FD6A0] animate-pulse" />
            <span><strong>RAG Context Loaded:</strong> Active Project + {savedIdeas.length} Saved Sheets + System Knowledge Corpus</span>
          </div>
          <span className="font-mono text-[10px] text-indigo-300 hidden sm:inline">NLP Vector Search Enabled</span>
        </div>

        {/* Quick Suggest Prompts */}
        <div className="flex overflow-x-auto gap-2 px-4 py-2 bg-[#0e172e] border-b border-[#2a3c6b]/60 scrollbar-none">
          {suggestPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputQuestion(prompt)}
              className="px-3 py-1 bg-[#1b284d] hover:bg-[#253769] border border-[#2a3c6b] rounded-full text-[11px] font-medium text-slate-300 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 group ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-[#FF6A3D] text-[#12203A]'
                  : 'bg-gradient-to-br from-[#6344f5] to-indigo-700 text-white shadow-md'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`relative max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#FF6A3D] text-[#12203A] font-medium rounded-tr-none shadow-md'
                  : 'bg-[#0b1329] border border-[#2a3c6b] text-slate-200 rounded-tl-none shadow-sm'
              }`}>
                {renderFormattedText(msg.text)}

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/30 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'mentor' && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="ml-2 hover:text-white transition flex items-center space-x-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Copied</span>
                        </>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
              <Bot className="w-4 h-4 text-[#FF6A3D] animate-bounce" />
              <span className="font-mono">IdeaForge Mentor is generating RAG response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3.5 bg-[#0b1329] border-t border-[#2a3c6b] flex items-center space-x-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask chatbot about your projects, viva defense, system architecture, database choices..."
            className="flex-1 px-4 py-3 bg-[#121c38] border border-[#2a3c6b] rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6A3D] placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isTyping}
            className="p-3 bg-[#FF6A3D] hover:bg-[#ff7f52] text-[#12203A] font-bold rounded-2xl disabled:opacity-40 transition shadow-lg flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
