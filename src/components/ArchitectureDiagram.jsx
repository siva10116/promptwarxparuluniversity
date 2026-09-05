import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, Maximize2, RefreshCw } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0f172a',
    primaryColor: '#6366f1',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#818cf8',
    lineColor: '#38bdf8',
    secondaryColor: '#10b981',
    tertiaryColor: '#f59e0b'
  },
  securityLevel: 'loose'
});

export default function ArchitectureDiagram({ chartCode }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!chartCode) return;
      try {
        setRenderError(false);
        const uniqueId = `mermaid-${Math.floor(Math.random() * 100000)}`;
        const { svg } = await mermaid.render(uniqueId, chartCode.trim());
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          setRenderError(true);
        }
      }
    };

    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [chartCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chartCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white relative">
      
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h4 className="text-sm font-bold text-slate-200">System Architecture Topology</h4>
          <p className="text-[11px] text-slate-400">Auto-generated Mermaid data-flow & component diagram</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Mermaid Code'}</span>
          </button>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rendered SVG Container */}
      {renderError ? (
        <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-xl font-mono text-xs text-amber-300 whitespace-pre-wrap overflow-x-auto">
          <p className="font-bold text-amber-400 mb-2">Mermaid Source Code Preview:</p>
          {chartCode}
        </div>
      ) : (
        <div 
          ref={containerRef}
          className={`flex justify-center items-center overflow-x-auto p-4 bg-slate-900/60 rounded-xl border border-slate-800/50 min-h-[220px] ${
            isZoomed ? 'fixed inset-4 z-50 bg-slate-950/95 border-indigo-500 overflow-auto p-10 flex-col justify-center' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}

      {isZoomed && (
        <button
          onClick={() => setIsZoomed(false)}
          className="fixed top-8 right-8 z-50 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-2xl"
        >
          Close Fullscreen
        </button>
      )}

    </div>
  );
}
