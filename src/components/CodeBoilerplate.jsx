import React, { useState } from 'react';
import { Copy, Check, Download, Code, Server, Database } from 'lucide-react';

export default function CodeBoilerplate({ boilerplate }) {
  const [activeTab, setActiveTab] = useState('backend');
  const [copied, setCopied] = useState(false);

  if (!boilerplate) return null;

  const getCodeContent = () => {
    if (activeTab === 'backend') return boilerplate.backend || '// Backend code placeholder';
    if (activeTab === 'frontend') return boilerplate.frontend || '// Frontend code placeholder';
    if (activeTab === 'database') return boilerplate.database || '-- Database schema placeholder';
    return '';
  };

  const getFilename = () => {
    if (activeTab === 'backend') return 'main_service.py';
    if (activeTab === 'frontend') return 'App_Starter.jsx';
    if (activeTab === 'database') return 'schema_migration.sql';
    return 'starter_code.txt';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const code = getCodeContent();
    const filename = getFilename();
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden text-white">
      
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        
        {/* Tab selector buttons */}
        <div className="flex items-center space-x-1">
          {boilerplate.backend && (
            <button
              onClick={() => setActiveTab('backend')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'backend'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Backend API</span>
            </button>
          )}

          {boilerplate.frontend && (
            <button
              onClick={() => setActiveTab('frontend')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'frontend'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Frontend App</span>
            </button>
          )}

          {boilerplate.database && (
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'database'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>DB Schema</span>
            </button>
          )}
        </div>

        {/* Copy & Download Actions */}
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-[11px] font-mono text-slate-400 mr-2">{getFilename()}</span>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 rounded-lg text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download</span>
          </button>
        </div>

      </div>

      {/* Code Display Area */}
      <div className="p-4 overflow-x-auto max-h-96 font-mono text-xs text-indigo-100 bg-slate-950 leading-relaxed selection:bg-indigo-500 selection:text-white">
        <pre>{getCodeContent()}</pre>
      </div>

    </div>
  );
}
