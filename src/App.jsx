import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import VivaSimulator from "./components/VivaSimulator";
import IdeaComparer from "./components/IdeaComparer";
import ArchitectureDiagram from "./components/ArchitectureDiagram";
import CodeBoilerplate from "./components/CodeBoilerplate";
import ApiKeyModal from "./components/ApiKeyModal";
import { INTERESTS, SKILLS, DIFFICULTIES, TEAM_SIZES, DEFAULT_IDEAS } from "./data/projectTemplates";
import { generateProjectIdeas, askMentorQuestion } from "./services/aiGeneratorService";
import { exportProjectPDF, exportProjectMarkdown } from "./services/pdfExporter";
import {
  Flame, PenTool, Bookmark, BookmarkCheck, Loader2, Send, ChevronRight,
  ChevronLeft, X, Plus, ListChecks, ArrowRight, RefreshCw, Sparkles,
  Download, FileText, Key, Network, Code2, HelpCircle, Check, BookOpen, GraduationCap, Columns
} from "lucide-react";

const DURATIONS = ["6–8 weeks", "3–4 months", "6+ months"];

function Chip({ label, active, onClick }) {
  return (
    <button type="button" className={"bp-chip" + (active ? " bp-chip-active" : "")} onClick={onClick}>
      {label}
    </button>
  );
}

function Segment({ options, value, onChange }) {
  return (
    <div className="bp-segment">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={"bp-segment-btn" + (value === opt ? " bp-segment-btn-active" : "")}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TitleBlock({ domain, difficulty, duration }) {
  return (
    <div className="bp-titleblock">
      <div className="bp-titleblock-field">
        <span className="bp-label">Domain</span>
        <span className="bp-value">{domain || "—"}</span>
      </div>
      <div className="bp-titleblock-field">
        <span className="bp-label">Difficulty</span>
        <span className="bp-value">{difficulty || "—"}</span>
      </div>
      <div className="bp-titleblock-field">
        <span className="bp-label">Duration</span>
        <span className="bp-value">{duration || "—"}</span>
      </div>
    </div>
  );
}

function IdeaSheet({ idea, index, total, saved, onToggleSave, onOpen, onExportPDF }) {
  return (
    <div className="bp-sheet">
      <div className="bp-sheet-header">
        <span className="bp-sheet-no">Sheet {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            className="bp-pin"
            title="Export PDF"
            onClick={(e) => { e.stopPropagation(); onExportPDF(idea); }}
          >
            <Download size={15} />
          </button>
          <button
            type="button"
            className="bp-pin"
            aria-label={saved ? "Remove from saved sheets" : "Save this sheet"}
            onClick={onToggleSave}
          >
            {saved ? <BookmarkCheck size={17} className="text-[#FF6A3D]" /> : <Bookmark size={17} />}
          </button>
        </div>
      </div>
      <h3 className="bp-sheet-title">{idea.title}</h3>
      <p className="bp-sheet-tagline">{idea.tagline}</p>
      <p className="bp-sheet-problem">{idea.problem || idea.problemStatement}</p>

      <ul className="bp-feature-list">
        {(idea.features || idea.keyFeatures || []).map((f, i) => (
          <li key={i}><span className="bp-tick" />{f}</li>
        ))}
      </ul>

      <div className="bp-tagrow">
        {(idea.techStack || []).map((t, i) => (
          <span className="bp-tag" key={i}>{t}</span>
        ))}
      </div>

      <TitleBlock domain={idea.domain} difficulty={idea.difficulty} duration={idea.duration || idea.timeline} />

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#3E6E9E]/20">
        <button type="button" className="bp-open-link" onClick={onOpen}>
          Explore Blueprint <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function DetailSheet({ idea, saved, onToggleSave, onBack, thread, onAsk, chatLoading, onExportPDF, onExportMD }) {
  const [question, setQuestion] = useState("");
  const [activeTab, setActiveTab] = useState("roadmap");

  function submit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || chatLoading) return;
    onAsk(q);
    setQuestion("");
  }

  return (
    <div className="bp-detail">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button type="button" className="bp-back" onClick={onBack}>
          <ChevronLeft size={16} /> Back to sheets
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onExportMD(idea)}
            className="bp-savedbtn"
            title="Download Markdown Blueprint"
          >
            <FileText size={14} /> Export MD
          </button>
          <button
            type="button"
            onClick={() => onExportPDF(idea)}
            className="bp-cta"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="bp-detail-headrow">
        <div>
          <h2 className="bp-detail-title">{idea.title}</h2>
          <p className="bp-detail-tagline">{idea.tagline}</p>
        </div>
        <button
          type="button"
          className="bp-pin bp-pin-large"
          aria-label={saved ? "Remove from saved sheets" : "Save this sheet"}
          onClick={onToggleSave}
        >
          {saved ? <BookmarkCheck size={20} className="text-[#FF6A3D]" /> : <Bookmark size={20} />}
          <span>{saved ? "Saved" : "Save sheet"}</span>
        </button>
      </div>

      <TitleBlock domain={idea.domain} difficulty={idea.difficulty} duration={idea.duration || idea.timeline} />

      <p className="bp-detail-problem">{idea.problem || idea.problemStatement}</p>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#3E6E9E]/40 mb-6 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center space-x-1.5 px-4 py-2 font-mono text-xs border-b-2 transition ${
            activeTab === 'roadmap'
              ? 'border-[#FF6A3D] text-[#FF6A3D] font-bold bg-[#FF6A3D]/10'
              : 'border-transparent text-[#8FB4D1] hover:text-white'
          }`}
        >
          <ListChecks size={14} />
          <span>Roadmap & Features</span>
        </button>

        {idea.architectureDiagram && (
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-1.5 px-4 py-2 font-mono text-xs border-b-2 transition ${
              activeTab === 'architecture'
                ? 'border-[#FF6A3D] text-[#FF6A3D] font-bold bg-[#FF6A3D]/10'
                : 'border-transparent text-[#8FB4D1] hover:text-white'
            }`}
          >
            <Network size={14} />
            <span>Architecture Diagram</span>
          </button>
        )}

        {idea.codeBoilerplate && (
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1.5 px-4 py-2 font-mono text-xs border-b-2 transition ${
              activeTab === 'code'
                ? 'border-[#FF6A3D] text-[#FF6A3D] font-bold bg-[#FF6A3D]/10'
                : 'border-transparent text-[#8FB4D1] hover:text-white'
            }`}
          >
            <Code2 size={14} />
            <span>Starter Code</span>
          </button>
        )}

        {idea.vivaQuestions && idea.vivaQuestions.length > 0 && (
          <button
            onClick={() => setActiveTab('viva')}
            className={`flex items-center space-x-1.5 px-4 py-2 font-mono text-xs border-b-2 transition ${
              activeTab === 'viva'
                ? 'border-[#FF6A3D] text-[#FF6A3D] font-bold bg-[#FF6A3D]/10'
                : 'border-transparent text-[#8FB4D1] hover:text-white'
            }`}
          >
            <HelpCircle size={14} />
            <span>Viva Defense Prep</span>
          </button>
        )}
      </div>

      {/* Tab 1: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bp-detail-grid">
          <div className="bp-detail-col">
            <h4 className="bp-section-heading">Build roadmap</h4>
            <ol className="bp-roadmap">
              {(idea.roadmap || []).map((step, i) => (
                <li key={i} className="bp-roadmap-step">
                  <span className="bp-roadmap-num">{i + 1}</span>
                  <div>
                    <div className="bp-roadmap-phase">{step.phase}</div>
                    <div className="bp-roadmap-detail">{step.detail}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bp-detail-col">
            <h4 className="bp-section-heading">Core features</h4>
            <ul className="bp-feature-list">
              {(idea.features || idea.keyFeatures || []).map((f, i) => (
                <li key={i}><span className="bp-tick" />{f}</li>
              ))}
            </ul>

            <h4 className="bp-section-heading">Tech stack</h4>
            <div className="bp-tagrow">
              {(idea.techStack || []).map((t, i) => (
                <span className="bp-tag" key={i}>{t}</span>
              ))}
            </div>

            {idea.extensions && idea.extensions.length > 0 && (
              <>
                <h4 className="bp-section-heading">Ways to extend it</h4>
                <ul className="bp-feature-list">
                  {idea.extensions.map((f, i) => (
                    <li key={i}><span className="bp-tick bp-tick-measure" />{f}</li>
                  ))}
                </ul>
              </>
            )}

            {idea.whyFit && (
              <div className="bp-note">
                <span className="bp-note-label">Why this fits you</span>
                <p>{idea.whyFit}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Architecture */}
      {activeTab === 'architecture' && idea.architectureDiagram && (
        <div className="mb-10">
          <ArchitectureDiagram chartCode={idea.architectureDiagram} />
        </div>
      )}

      {/* Tab 3: Starter Code */}
      {activeTab === 'code' && idea.codeBoilerplate && (
        <div className="mb-10">
          <CodeBoilerplate boilerplate={idea.codeBoilerplate} />
        </div>
      )}

      {/* Tab 4: Viva Prep */}
      {activeTab === 'viva' && idea.vivaQuestions && (
        <div className="mb-10 space-y-4">
          <div className="p-3 bg-[#FF6A3D]/10 border border-[#FF6A3D]/30 text-[#FF6A3D] text-xs font-mono">
            <strong>🎓 Professor Defense Tip:</strong> Review these examiner questions before presentation day.
          </div>
          {idea.vivaQuestions.map((v, i) => (
            <div key={i} className="p-4 bg-[#12324F] border border-[#3E6E9E] rounded text-xs space-y-2">
              <span className="px-2 py-0.5 bg-[#FF6A3D] text-[#12203A] font-bold text-[10px] uppercase font-mono">
                {v.category || 'Defense'}
              </span>
              <p className="font-bold text-sm text-white">Q: {v.question}</p>
              <p className="text-[#8FB4D1] leading-relaxed"><strong className="text-[#5FD6A0]">Answer:</strong> {v.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI Mentor Chat */}
      <div className="bp-chat">
        <h4 className="bp-section-heading flex items-center justify-between">
          <span>Ask about this project</span>
          <span className="text-[11px] text-[#5FD6A0]">AI Mentor Active</span>
        </h4>
        <div className="bp-chat-thread">
          {thread.length === 0 && (
            <p className="bp-chat-empty">Ask about scope, a specific feature, database choice, or what to build first — the mentor answers with this project in mind.</p>
          )}
          {thread.map((m, i) => (
            <div key={i} className={"bp-chat-msg " + (m.role === "user" ? "bp-chat-user" : "bp-chat-mentor")}>
              <span className="bp-chat-role">{m.role === "user" ? "You" : "Mentor"}</span>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          ))}
          {chatLoading && (
            <div className="bp-chat-msg bp-chat-mentor">
              <span className="bp-chat-role">Mentor</span>
              <p className="bp-chat-typing"><Loader2 size={14} className="bp-spin text-[#FF6A3D]" /> Thinking…</p>
            </div>
          )}
        </div>
        <form className="bp-chat-form" onSubmit={submit}>
          <input
            className="bp-chat-input"
            placeholder="e.g. What database or framework should I start with in week one?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" className="bp-chat-send" disabled={chatLoading || !question.trim()} aria-label="Send question">
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}

export default function IdeaForgeApp() {
  const [activeTab, setActiveTab] = useState("generator");
  const [screen, setScreen] = useState("home");
  const [previousScreen, setPreviousScreen] = useState("results");

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customSkills, setCustomSkills] = useState([]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[0]);

  const [ideas, setIdeas] = useState(DEFAULT_IDEAS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [savedIdeas, setSavedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  const [chatThreads, setChatThreads] = useState({});
  const [chatLoading, setChatLoading] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem("ideaforge_saved_ideas");
      if (storedSaved) setSavedIdeas(JSON.parse(storedSaved));

      const storedKey = localStorage.getItem("ideaforge_gemini_key");
      if (storedKey) setApiKey(storedKey);
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  }, []);

  const saveSavedIdeasToStorage = (updated) => {
    setSavedIdeas(updated);
    try {
      localStorage.setItem("ideaforge_saved_ideas", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    try {
      localStorage.setItem("ideaforge_gemini_key", key);
    } catch (e) {
      console.warn("Error saving API key:", e);
    }
  };

  function toggleInterest(item) {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function toggleSkill(item) {
    setSelectedSkills((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function addCustomSkill() {
    const v = customSkillInput.trim();
    if (v && !customSkills.includes(v)) setCustomSkills((prev) => [...prev, v]);
    setCustomSkillInput("");
  }

  function removeCustomSkill(item) {
    setCustomSkills((prev) => prev.filter((x) => x !== item));
  }

  function isSaved(idea) {
    return savedIdeas.some((s) => s.title === idea.title);
  }

  function toggleSave(idea) {
    const exists = savedIdeas.some((s) => s.title === idea.title);
    let updated;
    if (exists) {
      updated = savedIdeas.filter((s) => s.title !== idea.title);
    } else {
      updated = [...savedIdeas, idea];
    }
    saveSavedIdeasToStorage(updated);
  }

  function openDetail(idea, from) {
    setPreviousScreen(from);
    setSelectedIdea(idea);
    setScreen("detail");
  }

  async function generateIdeas() {
    setError("");
    setLoading(true);
    setScreen("loading");

    try {
      const generated = await generateProjectIdeas({
        domain: selectedInterests[0] || "Web & AI",
        skills: [...selectedSkills, ...customSkills],
        difficulty,
        teamSize,
        timeline: duration,
        keywords: selectedInterests.join(", "),
        apiKey
      });

      setIdeas(generated);
      setScreen("results");
    } catch (e) {
      setError("Couldn't draft ideas right now — mentor desk is busy. Using default templates.");
      setIdeas(DEFAULT_IDEAS);
      setScreen("results");
    } finally {
      setLoading(false);
    }
  }

  async function askMentor(idea, questionText) {
    const key = idea.title;
    setChatThreads((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { role: "user", text: questionText }],
    }));
    setChatLoading(true);

    try {
      const text = await askMentorQuestion({
        question: questionText,
        projectContext: idea,
        apiKey
      });

      setChatThreads((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), { role: "mentor", text: text.trim() }],
      }));
    } catch (e) {
      setChatThreads((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), { role: "mentor", text: "Couldn't reach mentor right now. Please try again." }],
      }));
    } finally {
      setChatLoading(false);
    }
  }

  const canGenerate = selectedInterests.length > 0 || selectedSkills.length > 0 || customSkills.length > 0;

  return (
    <div className="bp-app">
      <style>{`
        .bp-app {
          --bg: #0b1329;
          --bg-panel: #121c38;
          --bg-panel-2: #1b284d;
          --line: #2a3c6b;
          --line-soft: rgba(158,199,230,0.16);
          --ink: #EAF3FA;
          --ink-dim: #8FB4D1;
          --marker: #FF6A3D;
          --marker-dim: rgba(255,106,61,0.14);
          --measure: #5FD6A0;
          font-family: 'IBM Plex Sans', sans-serif;
          background: var(--bg);
          color: var(--ink);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .bp-grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(var(--line-soft) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-soft) 1px, transparent 1px),
            linear-gradient(rgba(158,199,230,0.28) 1px, transparent 1px),
            linear-gradient(90deg, rgba(158,199,230,0.28) 1px, transparent 1px);
          background-size: 28px 28px, 28px 28px, 168px 168px, 168px 168px;
          opacity: 0.55;
        }
        .bp-shell { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; padding: 0 24px 80px; }

        .bp-header {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px; border-bottom: 1px solid var(--line-soft);
          background: rgba(11,19,41,0.92); backdrop-filter: blur(8px);
        }
        .bp-brand { display: flex; align-items: center; gap: 10px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 15px; cursor: pointer; }
        .bp-brand-sub { color: var(--ink-dim); font-size: 12px; font-family: 'IBM Plex Mono', monospace; margin-left: 10px; border-left: 1px solid var(--line-soft); padding-left: 10px; }
        .bp-savedbtn {
          display: flex; align-items: center; gap: 6px; background: transparent; color: var(--ink);
          border: 1px solid var(--line); padding: 8px 14px; font-family: 'IBM Plex Mono', monospace; font-size: 13px;
          cursor: pointer; transition: border-color 150ms, color 150ms;
        }
        .bp-savedbtn:hover { border-color: var(--marker); color: var(--marker); }
        .bp-savedbtn:disabled { opacity: 0.4; cursor: not-allowed; }

        .bp-hero { padding: 64px 24px 40px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 48px; align-items: center; }
        .bp-hero-title { font-size: 3rem; line-height: 1.08; font-weight: 700; margin: 0 0 20px; max-width: 14ch; }
        .bp-hero-sub { color: var(--ink-dim); font-size: 1.05rem; line-height: 1.6; max-width: 46ch; margin: 0 0 32px; }
        .bp-cta {
          display: inline-flex; align-items: center; gap: 8px; background: var(--marker); color: #12203A;
          border: none; padding: 14px 24px; font-size: 15px; font-weight: 600; cursor: pointer;
          transition: transform 120ms, background 150ms;
        }
        .bp-cta:hover { background: #ff7f52; }
        .bp-cta:active { transform: translateY(1px); }

        .bp-hero-sketch {
          position: relative; border: 1px solid var(--line); padding: 20px; background: var(--bg-panel);
        }
        .bp-hero-sketch::before, .bp-hero-sketch::after {
          content: ''; position: absolute; width: 16px; height: 16px; pointer-events: none;
        }
        .bp-hero-sketch::before { top: -1px; left: -1px; border-top: 2px solid var(--marker); border-left: 2px solid var(--marker); }
        .bp-hero-sketch::after { bottom: -1px; right: -1px; border-bottom: 2px solid var(--marker); border-right: 2px solid var(--marker); }
        .bp-hero-sketch-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-dim); margin-bottom: 12px; }
        .bp-hero-sketch-line { height: 10px; background: var(--line-soft); margin-bottom: 10px; }
        .bp-hero-sketch-line.w60 { width: 60%; }
        .bp-hero-sketch-line.w80 { width: 80%; }
        .bp-hero-sketch-line.w40 { width: 40%; }

        .bp-section-title { font-size: 1.4rem; font-weight: 700; margin: 0 0 6px; }
        .bp-section-desc { color: var(--ink-dim); margin: 0 0 24px; max-width: 60ch; }

        .bp-form { padding: 24px 0 8px; border-top: 1px solid var(--line-soft); margin-top: 24px; }
        .bp-field-group { margin-bottom: 28px; }
        .bp-label { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-dim); display: block; margin-bottom: 10px; }
        .bp-chiprow { display: flex; flex-wrap: wrap; gap: 8px; }
        .bp-chip {
          border: 1px solid var(--line); background: transparent; color: var(--ink);
          padding: 8px 14px; border-radius: 999px; font-size: 13.5px; cursor: pointer;
          transition: border-color 150ms, background 150ms, color 150ms;
        }
        .bp-chip:hover { border-color: var(--ink-dim); }
        .bp-chip-active { background: var(--marker-dim); border-color: var(--marker); color: var(--ink); }
        .bp-custom-row { display: flex; gap: 8px; margin-top: 12px; }
        .bp-custom-input {
          flex: 1; max-width: 260px; background: transparent; border: 1px solid var(--line); color: var(--ink);
          padding: 8px 12px; font-size: 13.5px; font-family: 'IBM Plex Sans', sans-serif;
        }
        .bp-custom-input::placeholder { color: var(--ink-dim); }
        .bp-custom-add {
          border: 1px solid var(--line); background: transparent; color: var(--ink); padding: 8px 12px; cursor: pointer;
          display: flex; align-items: center; gap: 4px;
        }
        .bp-custom-add:hover { border-color: var(--marker); color: var(--marker); }
        .bp-custom-chip { display: inline-flex; align-items: center; gap: 6px; }
        .bp-custom-chip button { background: none; border: none; color: inherit; cursor: pointer; display: flex; padding: 0; }

        .bp-constraints { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .bp-segment { display: flex; border: 1px solid var(--line); overflow: hidden; }
        .bp-segment-btn {
          flex: 1; background: transparent; color: var(--ink-dim); border: none; border-right: 1px solid var(--line-soft);
          padding: 10px 8px; font-size: 12.5px; cursor: pointer; font-family: 'IBM Plex Mono', monospace;
        }
        .bp-segment-btn:last-child { border-right: none; }
        .bp-segment-btn-active { background: var(--bg-panel-2); color: var(--ink); }

        .bp-generate-row { margin-top: 36px; display: flex; align-items: center; gap: 16px; }
        .bp-generate-btn {
          display: inline-flex; align-items: center; gap: 8px; background: var(--marker); color: #12203A;
          border: none; padding: 14px 26px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 150ms;
        }
        .bp-generate-btn:hover:not(:disabled) { background: #ff7f52; }
        .bp-generate-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .bp-hint { color: var(--ink-dim); font-size: 13px; }
        .bp-error { border: 1px solid var(--marker); background: var(--marker-dim); color: var(--ink); padding: 14px 16px; margin-top: 20px; font-size: 14px; }

        .bp-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 0; gap: 24px; }
        .bp-draw-rect { width: 160px; height: 100px; }
        .bp-draw-rect rect {
          fill: none; stroke: var(--marker); stroke-width: 2;
          stroke-dasharray: 520; stroke-dashoffset: 520;
          animation: bp-draw 1.6s ease-in-out infinite;
        }
        @keyframes bp-draw { 0% { stroke-dashoffset: 520; } 60% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -520; } }
        .bp-loading-text { font-family: 'IBM Plex Mono', monospace; color: var(--ink-dim); font-size: 14px; }

        .bp-results-top { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; margin-bottom: 20px; }
        .bp-again-btn {
          display: inline-flex; align-items: center; gap: 6px; background: transparent; color: var(--ink-dim);
          border: 1px solid var(--line); padding: 8px 14px; font-size: 13px; cursor: pointer;
        }
        .bp-again-btn:hover { border-color: var(--marker); color: var(--marker); }

        .bp-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 20px; animation: bp-reveal 420ms ease-out; }
        @keyframes bp-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .bp-sheet { position: relative; border: 1px solid var(--line); background: var(--bg-panel); padding: 22px; display: flex; flex-direction: column; }
        .bp-sheet::before, .bp-sheet::after { content: ''; position: absolute; width: 12px; height: 12px; pointer-events: none; }
        .bp-sheet::before { top: -1px; left: -1px; border-top: 1px solid var(--ink-dim); border-left: 1px solid var(--ink-dim); }
        .bp-sheet::after { bottom: -1px; right: -1px; border-bottom: 1px solid var(--ink-dim); border-right: 1px solid var(--ink-dim); }
        .bp-sheet-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .bp-sheet-no { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-dim); }
        .bp-pin { background: none; border: none; color: var(--ink-dim); cursor: pointer; display: flex; padding: 2px; }
        .bp-pin:hover { color: var(--marker); }
        .bp-pin-large { flex-direction: column; align-items: center; gap: 4px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; }
        .bp-sheet-title { font-size: 1.2rem; font-weight: 700; margin: 0 0 6px; }
        .bp-sheet-tagline { color: var(--ink-dim); font-size: 13.5px; margin: 0 0 12px; }
        .bp-sheet-problem { font-size: 14px; line-height: 1.55; margin: 0 0 16px; }

        .bp-feature-list { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .bp-feature-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; line-height: 1.5; }
        .bp-tick { width: 8px; height: 8px; margin-top: 5px; flex-shrink: 0; background: var(--marker); }
        .bp-tick-measure { background: var(--measure); }

        .bp-tagrow { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
        .bp-tag { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; border: 1px solid var(--line); padding: 4px 8px; color: var(--ink-dim); }

        .bp-titleblock { display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft); margin-bottom: 16px; }
        .bp-titleblock-field { padding: 8px 10px; border-right: 1px solid var(--line-soft); display: flex; flex-direction: column; gap: 4px; }
        .bp-titleblock-field:last-child { border-right: none; }
        .bp-titleblock .bp-label { margin: 0; font-size: 10.5px; }
        .bp-value { font-size: 13px; }

        .bp-open-link { margin-top: auto; align-self: flex-start; display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--marker); font-size: 13.5px; cursor: pointer; padding: 0; }
        .bp-open-link:hover { text-decoration: underline; }

        .bp-detail { margin-top: 24px; }
        .bp-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: var(--ink-dim); font-size: 13.5px; cursor: pointer; padding: 0; margin-bottom: 24px; }
        .bp-back:hover { color: var(--marker); }
        .bp-detail-headrow { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
        .bp-detail-title { font-size: 1.9rem; font-weight: 700; margin: 0 0 8px; }
        .bp-detail-tagline { color: var(--ink-dim); font-size: 15px; margin: 0; }
        .bp-detail-problem { font-size: 15px; line-height: 1.6; max-width: 70ch; margin: 20px 0 32px; }

        .bp-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 40px; }
        .bp-section-heading { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--ink-dim); margin: 0 0 14px; }
        .bp-detail-col .bp-section-heading:not(:first-child) { margin-top: 26px; }

        .bp-roadmap { list-style: none; margin: 0; padding: 0; position: relative; }
        .bp-roadmap-step { display: flex; gap: 16px; padding-bottom: 22px; position: relative; }
        .bp-roadmap-step:not(:last-child)::before { content: ''; position: absolute; left: 13px; top: 28px; bottom: 0; width: 1px; background: var(--line-soft); }
        .bp-roadmap-num { width: 27px; height: 27px; border: 1px solid var(--marker); color: var(--marker); font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bp-roadmap-phase { font-weight: 600; margin-bottom: 4px; font-size: 14.5px; }
        .bp-roadmap-detail { color: var(--ink-dim); font-size: 13.5px; line-height: 1.55; }

        .bp-note { border: 1px solid var(--marker); background: var(--marker-dim); padding: 14px 16px; margin-top: 22px; }
        .bp-note-label { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--marker); display: block; margin-bottom: 6px; }
        .bp-note p { margin: 0; font-size: 13.5px; line-height: 1.55; }

        .bp-chat { border-top: 1px solid var(--line-soft); padding-top: 28px; }
        .bp-chat-thread { display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px; max-width: 70ch; }
        .bp-chat-empty { color: var(--ink-dim); font-size: 13.5px; }
        .bp-chat-msg { border: 1px solid var(--line-soft); padding: 10px 14px; }
        .bp-chat-role { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-dim); display: block; margin-bottom: 4px; }
        .bp-chat-msg p { margin: 0; font-size: 13.5px; line-height: 1.55; }
        .bp-chat-user { background: var(--bg-panel-2); }
        .bp-chat-mentor { background: transparent; }
        .bp-chat-typing { display: flex; align-items: center; gap: 6px; color: var(--ink-dim); }
        .bp-spin { animation: bp-spin 1s linear infinite; }
        @keyframes bp-spin { to { transform: rotate(360deg); } }
        .bp-chat-form { display: flex; gap: 8px; max-width: 70ch; }
        .bp-chat-input { flex: 1; background: transparent; border: 1px solid var(--line); color: var(--ink); padding: 10px 14px; font-size: 14px; font-family: 'IBM Plex Sans', sans-serif; }
        .bp-chat-input::placeholder { color: var(--ink-dim); }
        .bp-chat-send { background: var(--marker); border: none; color: #12203A; padding: 0 16px; cursor: pointer; display: flex; align-items: center; }
        .bp-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

        .bp-empty-state { text-align: center; padding: 100px 20px; color: var(--ink-dim); }
        .bp-empty-state h3 { color: var(--ink); font-size: 1.2rem; margin-bottom: 8px; }

        @media (max-width: 760px) {
          .bp-hero { grid-template-columns: 1fr; padding-top: 48px; }
          .bp-hero-title { font-size: 2.1rem; max-width: none; }
          .bp-constraints { grid-template-columns: 1fr; }
          .bp-detail-grid { grid-template-columns: 1fr; gap: 32px; }
          .bp-titleblock { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="bp-grid-bg" />

      {/* Production Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'generator') setScreen('results');
          if (tab === 'saved') setScreen('saved');
        }}
        savedCount={savedIdeas.length}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <div className="bp-shell pt-6">
        
        {/* VIEW 1: Generator & Main Screens */}
        {activeTab === 'generator' && (
          <>
            {screen === "home" && (
              <section className="bp-hero">
                <div>
                  <h1 className="bp-hero-title">Turn what you know into what you'll build.</h1>
                  <p className="bp-hero-sub">
                    Tell it your interests and skills. IdeaForge AI drafts three capstone project blueprints,
                    each complete with architecture diagrams, a build roadmap, starter code, and viva prep Q&A.
                  </p>
                  <button type="button" className="bp-cta" onClick={() => setScreen("form")}>
                    Start drafting <ArrowRight size={17} />
                  </button>
                </div>
                <div className="bp-hero-sketch">
                  <div className="bp-hero-sketch-label">Sheet 01 / 03 — preview</div>
                  <div className="bp-hero-sketch-line w80" />
                  <div className="bp-hero-sketch-line w60" />
                  <div className="bp-hero-sketch-line w40" />
                  <div className="bp-hero-sketch-line w60" style={{ marginTop: 18 }} />
                  <div className="bp-hero-sketch-line w80" />
                </div>
              </section>
            )}

            {screen === "form" && (
              <section className="bp-form">
                <h2 className="bp-section-title">Set up your sheet</h2>
                <p className="bp-section-desc">Pick as many as apply — the more specific, the sharper the ideas.</p>

                <div className="bp-field-group">
                  <span className="bp-label">Interests</span>
                  <div className="bp-chiprow">
                    {INTERESTS.map((i) => (
                      <Chip key={i} label={i} active={selectedInterests.includes(i)} onClick={() => toggleInterest(i)} />
                    ))}
                  </div>
                </div>

                <div className="bp-field-group">
                  <span className="bp-label">Skills</span>
                  <div className="bp-chiprow">
                    {SKILLS.map((s) => (
                      <Chip key={s} label={s} active={selectedSkills.includes(s)} onClick={() => toggleSkill(s)} />
                    ))}
                    {customSkills.map((s) => (
                      <span className="bp-chip bp-chip-active bp-custom-chip" key={s}>
                        {s}
                        <button type="button" onClick={() => removeCustomSkill(s)} aria-label={`Remove ${s}`}>
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="bp-custom-row">
                    <input
                      className="bp-custom-input"
                      placeholder="Add another skill…"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                    />
                    <button type="button" className="bp-custom-add" onClick={addCustomSkill}>
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>

                <div className="bp-field-group bp-constraints">
                  <div>
                    <span className="bp-label">Difficulty</span>
                    <Segment options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
                  </div>
                  <div>
                    <span className="bp-label">Timeline</span>
                    <Segment options={DURATIONS} value={duration} onChange={setDuration} />
                  </div>
                  <div>
                    <span className="bp-label">Team size</span>
                    <Segment options={TEAM_SIZES} value={teamSize} onChange={setTeamSize} />
                  </div>
                </div>

                <div className="bp-generate-row">
                  <button type="button" className="bp-generate-btn" disabled={!canGenerate} onClick={generateIdeas}>
                    <PenTool size={16} /> Generate 3 ideas
                  </button>
                  {!canGenerate && <span className="bp-hint">Pick at least one interest or skill first.</span>}
                </div>

                {error && <div className="bp-error">{error}</div>}
              </section>
            )}

            {screen === "loading" && (
              <div className="bp-loading">
                <svg className="bp-draw-rect" viewBox="0 0 160 100">
                  <rect x="4" y="4" width="152" height="92" />
                </svg>
                <span className="bp-loading-text">Drafting your options…</span>
              </div>
            )}

            {screen === "results" && (
              <section>
                <div className="bp-results-top">
                  <div>
                    <h2 className="bp-section-title">Three sheets, drafted for you</h2>
                    <p className="bp-section-desc" style={{ marginBottom: 0 }}>Open one to see the full build plan, architecture, code, and viva questions.</p>
                  </div>
                  <button type="button" className="bp-again-btn" onClick={() => setScreen("form")}>
                    <RefreshCw size={14} /> Draft again
                  </button>
                </div>
                <div className="bp-results-grid">
                  {ideas.map((idea, i) => (
                    <IdeaSheet
                      key={idea.title + i}
                      idea={idea}
                      index={i}
                      total={ideas.length}
                      saved={isSaved(idea)}
                      onToggleSave={() => toggleSave(idea)}
                      onOpen={() => openDetail(idea, "results")}
                      onExportPDF={exportProjectPDF}
                    />
                  ))}
                </div>
              </section>
            )}

            {screen === "detail" && selectedIdea && (
              <DetailSheet
                idea={selectedIdea}
                saved={isSaved(selectedIdea)}
                onToggleSave={() => toggleSave(selectedIdea)}
                onBack={() => setScreen(previousScreen)}
                thread={chatThreads[selectedIdea.title] || []}
                chatLoading={chatLoading}
                onAsk={(q) => askMentor(selectedIdea, q)}
                onExportPDF={exportProjectPDF}
                onExportMD={exportProjectMarkdown}
              />
            )}
          </>
        )}

        {/* VIEW 2: Viva Defense Simulator */}
        {activeTab === 'viva' && (
          <VivaSimulator selectedProject={selectedIdea} />
        )}

        {/* VIEW 3: Side-by-Side Idea Comparer */}
        {activeTab === 'comparer' && (
          <IdeaComparer projects={ideas} onSelectProject={(idea) => openDetail(idea, "results")} />
        )}

        {/* VIEW 4: Saved Sheets */}
        {(activeTab === 'saved' || screen === 'saved') && activeTab === 'saved' && (
          savedIdeas.length === 0 ? (
            <div className="bp-empty-state">
              <ListChecks size={28} style={{ marginBottom: 12 }} />
              <h3>No sheets pinned yet</h3>
              <p>Save an idea from your results and it'll turn up here.</p>
            </div>
          ) : (
            <section>
              <h2 className="bp-section-title" style={{ marginTop: 24 }}>Saved sheets</h2>
              <p className="bp-section-desc">Ideas you've pinned across sessions of drafting.</p>
              <div className="bp-results-grid">
                {savedIdeas.map((idea, i) => (
                  <IdeaSheet
                    key={idea.title + i}
                    idea={idea}
                    index={i}
                    total={savedIdeas.length}
                    saved={true}
                    onToggleSave={() => toggleSave(idea)}
                    onOpen={() => openDetail(idea, "saved")}
                    onExportPDF={exportProjectPDF}
                  />
                ))}
              </div>
            </section>
          )
        )}

      </div>

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

    </div>
  );
}
