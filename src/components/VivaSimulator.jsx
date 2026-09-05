import React, { useState } from 'react';
import { Flame, Award, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, HelpCircle, GraduationCap, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateLiveVivaQuiz } from '../services/aiGeneratorService';

const STATIC_VIVA_QUIZ_BANKS = [
  {
    id: 1,
    category: 'Architecture & System Design',
    question: 'Why did you choose your specific database (e.g., PostgreSQL / MongoDB) over alternative storage solutions?',
    options: [
      'PostgreSQL offers ACID compliance, complex relational JOINs, and strong structured schema safety for patient/user logs.',
      'We picked it randomly because it was listed in the tutorial.',
      'MongoDB was chosen because SQL databases cannot handle more than 1,000 rows.',
      'It was the default database provided by the hosting service.'
    ],
    correctIdx: 0,
    explanation: 'Examiners expect technical justification based on ACID compliance, query complexity, indexing efficiency, and schema constraints.'
  },
  {
    id: 2,
    category: 'AI & Machine Learning Reliability',
    question: 'How does your system prevent or mitigate AI hallucinations and ungrounded outputs in medical or analytical summaries?',
    options: [
      'We use Retrieval-Augmented Generation (RAG) with vector databases to restrict responses to verified knowledge documents with strict similarity thresholds.',
      'We ask the AI prompt to promise not to lie.',
      'AI models never hallucinate if temperature is set to 0.5.',
      'We manually proofread every AI generated output before saving to database.'
    ],
    correctIdx: 0,
    explanation: 'RAG combined with semantic vector search (Chroma/Qdrant) and temperature constraints is the standard IEEE-level answer for hallucination mitigation.'
  },
  {
    id: 3,
    category: 'Scalability & Performance',
    question: 'What happens to your application server latency when 5,000 concurrent users request data simultaneously?',
    options: [
      'Stateless REST microservices behind a load balancer with Redis caching and DB indexing handle concurrent reads without thread deadlock.',
      'The server automatically buys more RAM from Google Cloud.',
      'All 5,000 requests are queued sequentially on a single thread.',
      'The database will instantly crash and require manual reboot.'
    ],
    correctIdx: 0,
    explanation: 'Demonstrating knowledge of Redis caching, database indexing, horizontal scaling, and stateless APIs shows professor-grade architectural maturity.'
  },
  {
    id: 4,
    category: 'Security & Compliance',
    question: 'How are sensitive student or user credentials and API tokens secured in transit and at rest?',
    options: [
      'TLS 1.3 encryption in transit, bcrypt password hashing, and AES-256 encrypted environment variables.',
      'Saved as plain text inside GitHub public repository files.',
      'Encoded using base64 string conversion.',
      'Stored inside browser local storage without key obfuscation.'
    ],
    correctIdx: 0,
    explanation: 'Base64 is encoding, not encryption. Examiners expect TLS 1.3, bcrypt/Argon2 password hashing, and AES-256 for resting data.'
  }
];

export default function VivaSimulator({ selectedProject }) {
  const [questions, setQuestions] = useState(STATIC_VIVA_QUIZ_BANKS);
  const [isGeneratingLive, setIsGeneratingLive] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIdx] || STATIC_VIVA_QUIZ_BANKS[0];

  const handleSelectOption = (idx) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);
    if (selectedOpt === currentQ.correctIdx) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setSubmitted(false);
    setQuizFinished(false);
  };

  const handleGenerateLiveAIQuiz = async () => {
    setIsGeneratingLive(true);
    try {
      const liveQuiz = await generateLiveVivaQuiz({
        projectTitle: selectedProject?.title || 'Smart Engineering System',
        techStack: selectedProject?.techStack || ['React', 'Python', 'PostgreSQL']
      });

      if (liveQuiz && Array.isArray(liveQuiz) && liveQuiz.length > 0) {
        setQuestions(liveQuiz);
        setIsLiveMode(true);
        handleRestart();
      }
    } catch (e) {
      console.warn("Live quiz generation fallback to static bank:", e);
    } finally {
      setIsGeneratingLive(false);
    }
  };

  const readinessPercent = Math.round((score / questions.length) * 100);

  return (
    <div className="bg-[#121c38] border border-[#2a3c6b] rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2a3c6b]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="font-extrabold text-xl">Professor Viva & Defense Simulator</h3>
              <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                isLiveMode 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {isLiveMode ? '⚡ LIVE GEMINI EXAMINER' : 'STANDARD QUIZ BANK'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedProject ? `Testing defense readiness for: "${selectedProject.title}"` : 'Test your defense answers against real university examiner questions'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleGenerateLiveAIQuiz}
            disabled={isGeneratingLive}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-[#6344f5] to-indigo-600 hover:from-[#5233e4] hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition disabled:opacity-50"
            title="Generate Live Custom Examiner Questions using Gemini API"
          >
            {isGeneratingLive ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating AI Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Live AI Viva</span>
              </>
            )}
          </button>

          <button
            onClick={handleRestart}
            className="p-2.5 bg-[#1b284d] hover:bg-[#253769] border border-[#2a3c6b] rounded-xl text-slate-300 transition"
            title="Restart Simulator"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!quizFinished ? (
        <div className="mt-6 space-y-6">
          
          {/* Question Counter Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-bold">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="px-3 py-1 bg-[#1b284d] border border-[#2a3c6b] rounded-full text-indigo-300">
              Category: {currentQ.category || 'General Defense'}
            </span>
          </div>

          {/* Question Text */}
          <div className="p-5 bg-[#0b1329] border border-[#2a3c6b] rounded-2xl shadow-inner">
            <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              Q: {currentQ.question}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === currentQ.correctIdx;
              
              let btnStyle = "bg-[#0b1329]/80 border-[#2a3c6b] text-slate-300 hover:border-indigo-500";
              if (isSelected) {
                btnStyle = "bg-indigo-600/20 border-indigo-500 text-white font-semibold";
              }
              if (submitted) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-950/60 border-rose-500 text-rose-300";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition flex items-start space-x-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {submitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {submitted && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (when submitted) */}
          {submitted && (
            <div className="p-4 bg-[#1b284d] border border-indigo-500/30 rounded-2xl text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Professor Feedback & Defense Rationale:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-end pt-2">
            {!submitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOpt === null}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-orange-500/20 disabled:opacity-40 transition"
              >
                Submit Answer for Scoring
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition"
              >
                <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'View Final Readiness Score'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Results Screen */
        <div className="mt-8 text-center space-y-6 py-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 border-4 border-emerald-400/30 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
            <Award className="w-10 h-10 text-slate-950" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white">Viva Practice Complete!</h3>
            <p className="text-slate-400 text-xs mt-1">Here is your estimated Defense Readiness Score for presentation day.</p>
          </div>

          {/* Score Badge */}
          <div className="p-6 bg-[#0b1329] border border-[#2a3c6b] rounded-3xl max-w-sm mx-auto">
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
              {readinessPercent}%
            </span>
            <p className="text-xs text-slate-300 font-semibold mt-2">
              {readinessPercent >= 75
                ? '🎓 Excellent! You are ready to confidently defend your architecture in front of the examination board.'
                : '📚 Good Effort! Review the architecture blueprint and sample questions to boost your defense score.'}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs shadow-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Viva Defense Quiz</span>
          </button>
        </div>
      )}

    </div>
  );
}
