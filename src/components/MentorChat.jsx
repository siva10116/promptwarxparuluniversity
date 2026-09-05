import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, BookOpen, ShieldCheck, RefreshCw } from 'lucide-react';
import { askMentorQuestion } from '../services/aiGeneratorService';

export default function MentorChat({ selectedProject, apiKey }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mentor',
      text: selectedProject 
        ? `Hello! I am your AI Project Mentor. How can I help you implement or defend **"${selectedProject.title}"**? Ask me anything about architecture, tech choices, literature reviews, or viva defense questions!`
        : `Hello! I am your AI Project Mentor. Select or generate a project, or ask me any general question about final year project selection, viva defense, or architecture planning!`,
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
    scrollToBottom();
  }, [messages, isTyping]);

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
        projectContext: selectedProject,
        apiKey
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
    "What viva questions will my professor ask about this tech stack?",
    "Should I choose Postgres or MongoDB for this project?",
    "How do I write the Literature Survey chapter in my report?",
    "What features will give this project an A+ grade?"
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto flex flex-col h-[75vh] text-white">
      
      {/* Mentor Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base flex items-center space-x-2">
              <span>AI Project Mentor Chat</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-400">
              {selectedProject ? `Context: ${selectedProject.title}` : 'General Project Guidance'}
            </p>
          </div>
        </div>

        {apiKey && (
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full">
            Live Gemini Connected
          </span>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex overflow-x-auto gap-2 py-3 border-b border-slate-800/60 scrollbar-none">
        {suggestPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInputQuestion(prompt)}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-medium text-slate-300 whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 my-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none'
                : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="block text-[10px] text-slate-400 mt-2 text-right opacity-60">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
            <Bot className="w-4 h-4 text-indigo-400 animate-bounce" />
            <span>Mentor is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="pt-3 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask mentor about architecture, viva defense, database choices..."
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isTyping}
          className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl disabled:opacity-40 transition shadow-lg shadow-indigo-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
