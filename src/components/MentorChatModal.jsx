import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, HelpCircle, BookOpen, MessageSquare, RefreshCw } from 'lucide-react';
import { askMentorQuestion } from '../services/aiGeneratorService';

export default function MentorChatModal({ isOpen, onClose, selectedProject }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mentor',
      text: selectedProject 
        ? `Hello! I am your AI Capstone Mentor. How can I help you build or defend **"${selectedProject.title}"**? Ask me about architecture, tech choices, literature reviews, or viva questions!`
        : `Hello! I am your AI Capstone Mentor. Ask me any question about project selection, tech stack comparison, viva defense prep, or implementation steps!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
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

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    try {
      const responseText = await askMentorQuestion({
        question: query,
        projectContext: selectedProject
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
    } finally {
      setIsTyping(false);
    }
  };

  const suggestPrompts = [
    "What viva questions will examiners ask about this tech stack?",
    "Should I choose Postgres or MongoDB for this project?",
    "How do I write the Literature Survey section?",
    "What features will give this project an A+ grade?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn text-white">
      <div className="bg-[#121c38] border border-[#2a3c6b] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0b1329] border-b border-[#2a3c6b] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6344f5] to-indigo-600 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center space-x-2 text-white">
                <span>IdeaForge AI Chatbot</span>
                <span className="w-2 h-2 rounded-full bg-[#5FD6A0] animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">
                {selectedProject ? `Context: ${selectedProject.title}` : '24/7 Capstone & Viva Guidance'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1b284d] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggest Prompts */}
        <div className="flex overflow-x-auto gap-2 px-4 py-2.5 bg-[#0e172e] border-b border-[#2a3c6b]/60 scrollbar-none">
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
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-[#FF6A3D] text-[#12203A]'
                  : 'bg-[#6344f5] text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[84%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#FF6A3D] text-[#12203A] font-medium rounded-tr-none'
                  : 'bg-[#0b1329] border border-[#2a3c6b] text-slate-200 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="block text-[10px] text-slate-400 mt-1.5 text-right opacity-70">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
              <Bot className="w-4 h-4 text-[#6344f5] animate-bounce" />
              <span>Mentor is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#0b1329] border-t border-[#2a3c6b] flex items-center space-x-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask chatbot about architecture, viva defense, tech choices..."
            className="flex-1 px-4 py-2.5 bg-[#121c38] border border-[#2a3c6b] rounded-full text-xs text-white focus:outline-none focus:border-[#6344f5]"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isTyping}
            className="p-2.5 bg-[#6344f5] hover:bg-[#5233e4] text-white rounded-full disabled:opacity-40 transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
