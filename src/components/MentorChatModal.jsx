import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, Bot, User, Sparkles, HelpCircle, MessageSquare,
  RefreshCw, Key, Download, Copy, Check, RotateCcw, Cpu
} from 'lucide-react';
import { converseWithMentorChatbot } from '../services/aiGeneratorService';

export default function MentorChatModal({ isOpen, onClose }) {
  const [customGeminiKey, setCustomGeminiKey] = useState(() => {
    return localStorage.getItem('ideaforge_custom_gemini_key') || '';
  });

  const [showKeySettings, setShowKeySettings] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const defaultWelcomeMessage = {
    id: 1,
    sender: 'mentor',
    text: `Hello! I am your **Gemini AI Chatbot Assistant**.\n\nI remember your past decisions and context throughout our conversation. Ask me any question — coding, technology, general knowledge, or capstone guidance!`,
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


  const handleSaveGeminiKey = (key) => {
    setCustomGeminiKey(key);
    try {
      localStorage.setItem('ideaforge_custom_gemini_key', key);
    } catch (e) {
      console.warn("Error saving Gemini key:", e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear conversation memory and restart chatbot?")) {
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
    a.download = `gemini-chatbot-transcript-${Date.now()}.md`;
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
      // Send entire conversation history for full multi-turn memory
      const historyTurns = updatedMessages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const responseText = await converseWithMentorChatbot({
        question: query,
        history: historyTurns.slice(-15),
        geminiKey: customGeminiKey
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
          text: `⚠️ **AI API Error**: ${err.message || 'Failed to fetch live API response. Please verify API key.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestPrompts = [
    "Write a Python script for real-time data processing",
    "Explain microservices vs monolith architecture",
    "How do I design a high-throughput SQL database schema?",
    "What are the top 5 questions examiners ask in viva defense?"
  ];

  // Markdown Formatter for Chat Messages
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formattedLine = line;
      const parts = formattedLine.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="text-[#5FD6A0] font-semibold">{part.slice(2, -2)}</strong>;
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6344f5] via-purple-600 to-[#FF6A3D] flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center space-x-2 text-white">
                <span>Gemini AI Chatbot</span>
                <span className="px-2 py-0.5 rounded-full bg-[#5FD6A0]/20 text-[#5FD6A0] border border-[#5FD6A0]/30 text-[10px] font-mono">
                  Live API Multi-turn
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                100% Live AI Responses • Full Multi-turn Memory
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setShowKeySettings(!showKeySettings)}
              className="p-2 rounded-xl border text-xs font-mono flex items-center space-x-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-300 transition hover:bg-emerald-500/20"
              title="Configure API Keys"
            >
              <Key className="w-4 h-4 text-[#FF6A3D]" />
              <span className="hidden sm:inline">API Keys</span>
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

        {/* Collapsible API Key Drawer */}
        {showKeySettings && (
          <div className="p-4 bg-[#0e172e] border-b border-[#2a3c6b] space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Key className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-mono">Gemini API Key:</span>
                <input
                  type="password"
                  value={customGeminiKey}
                  onChange={(e) => handleSaveGeminiKey(e.target.value)}
                  placeholder="AQ.Ab8RN6IGB4BzhBBLEtE7rDz..."
                  className="w-full sm:w-72 px-3 py-1.5 bg-[#121c38] border border-[#2a3c6b] rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded font-mono text-[10px]">
                Active Engine: Google Gemini API
              </span>
            </div>
          </div>
        )}

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
              <Bot className="w-4 h-4 text-[#5FD6A0] animate-bounce" />
              <span className="font-mono">Gemini AI is generating live response...</span>
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
            placeholder="Type your message to Gemini AI..."
            className="flex-1 px-4 py-3 bg-[#121c38] border border-[#2a3c6b] rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#5FD6A0] placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isTyping}
            className="p-3 bg-[#6344f5] hover:bg-[#5233e4] text-white font-bold rounded-2xl disabled:opacity-40 transition shadow-lg flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
