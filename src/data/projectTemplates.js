export const DOMAINS = [
  { id: 'all', name: 'All Domains', icon: 'Sparkles' },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: 'Brain' },
  { id: 'web-dev', name: 'Web & Full Stack', icon: 'Globe' },
  { id: 'mobile', name: 'Mobile App Development', icon: 'Smartphone' },
  { id: 'cybersecurity', name: 'Cyber Security & Crypto', icon: 'Shield' },
  { id: 'cloud-devops', name: 'Cloud & DevOps', icon: 'Cloud' },
  { id: 'iot', name: 'IoT & Embedded Systems', icon: 'Cpu' },
  { id: 'blockchain', name: 'Blockchain & Web3', icon: 'Link' },
  { id: 'healthcare', name: 'Healthcare Tech', icon: 'Activity' },
  { id: 'fintech', name: 'FinTech & Banking', icon: 'DollarSign' }
];

export const POPULAR_TECH = [
  'Python', 'React', 'Node.js', 'FastAPI', 'TensorFlow', 'PyTorch',
  'Flutter', 'Next.js', 'PostgreSQL', 'MongoDB', 'Docker', 'OpenCV',
  'AWS', 'Solidity', 'TailwindCSS', 'GraphQL', 'Firebase', 'Go', 'Rust'
];

export const PROJECT_TEMPLATES = [
  {
    id: 'ai-health-diagnosis',
    title: 'PulseMind: Multi-Modal AI Clinical Assistant & Symptom Analyzer',
    tagline: 'Leveraging RAG, Medical LLMs, and Computer Vision for Early Symptom Triage & Lab Report Analysis',
    domain: 'ai-ml',
    difficulty: 'Advanced',
    teamSize: '2-3 Members',
    timeline: '6 Months',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'React', 'TailwindCSS', 'PostgreSQL', 'LangChain'],
    problemStatement: 'Patients often misinterpret lab results and face delayed clinical diagnosis. Primary care facilities are overburdened with routine triage, leading to emergency room congestion.',
    solutionOverview: 'An end-to-end intelligent clinical assistant using Retrieval-Augmented Generation (RAG) over medical literature (PubMed/MIMIC-III), Vision-LLMs for radiograph/lab report OCR, and a real-time doctor review portal.',
    innovationScore: 96,
    keyFeatures: [
      'Multi-modal input processing (Symptom audio, ECG images, Blood test PDFs)',
      'RAG pipeline with Vector Database (Qdrant/ChromaDB) ensuring grounded medical evidence',
      'Explainable AI (XAI) dashboard visualizing confidence scores and literature citations',
      'Patient triage queue with automated emergency alert trigger',
      'HIPAA-compliant mock patient record encryption'
    ],
    architectureDiagram: `graph TD
    User([Patient / Doctor]) -->|Uploads Lab PDF / Audio| FE[React Web App]
    FE -->|REST API Request| BE[FastAPI Gateway]
    BE -->|OCR & Embeddings| VisionEngine[OpenCV + Tesseract]
    BE -->|Vector Search| VecDB[(Qdrant Vector DB)]
    BE -->|Contextual Prompt| LLM[Medical Llama-3 / Gemini RAG]
    VecDB -->|Medical Knowledge Base| LLM
    LLM -->|Grounded Diagnosis & Citations| BE
    BE -->|Structured Response| FE`,
    vivaQuestions: [
      {
        question: 'How do you mitigate AI hallucinations in clinical recommendations?',
        answer: 'We enforce Retrieval-Augmented Generation (RAG) with strict semantic thresholding, restricting answers to verified PubMed/MIMIC-III knowledge vectors, and mandating confidence scores with medical citations.',
        category: 'AI / System Reliability'
      },
      {
        question: 'What database indexing strategy is used for fast vector search?',
        answer: 'We utilize HNSW (Hierarchical Navigable Small World) indexing inside Qdrant/ChromaDB, providing O(log N) search performance across high-dimensional medical embeddings.',
        category: 'Database & Data Structures'
      },
      {
        question: 'How is data privacy handled for patient health records?',
        answer: 'All patient identifiers are anonymized using automated NER (Named Entity Recognition) before processing. Data in transit uses TLS 1.3 and stored records are encrypted via AES-256.',
        category: 'Security & Compliance'
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Requirements, Data Pipeline & Architecture',
        duration: 'Weeks 1-4',
        tasks: ['Literature survey on Medical RAG', 'Collection of PubMed abstracts dataset', 'Setup FastAPI & PostgreSQL schema']
      },
      {
        phase: 'Phase 2',
        title: 'Vector Embedding & LLM Pipeline',
        duration: 'Weeks 5-10',
        tasks: ['Chunking & embedding medical corpus', 'Integrating Qdrant Vector DB', 'Building LangChain RAG pipeline']
      },
      {
        phase: 'Phase 3',
        title: 'Frontend Dashboard & Vision Module',
        duration: 'Weeks 11-16',
        tasks: ['Developing React interactive interface', 'Implementing lab report PDF OCR parser', 'Integrating interactive medical charts']
      },
      {
        phase: 'Phase 4',
        title: 'Evaluation, Testing & Thesis',
        duration: 'Weeks 17-24',
        tasks: ['Benchmarking precision/recall against baseline', 'User study with mock doctor feedback', 'Drafting IEEE thesis report']
      }
    ],
    codeBoilerplate: {
      backend: `# FastAPI Backend Service - main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="PulseMind AI API", version="1.0.0")

class SymptomRequest(BaseModel):
    symptoms: list[str]
    age: int
    gender: str

@app.post("/api/v1/triage")
async def analyze_symptoms(request: SymptomRequest):
    # Mock RAG Vector Pipeline Logic
    confidence = 0.94
    recommendation = "Low emergency risk. Suggested consultation with General Practitioner."
    return {
        "status": "success",
        "confidence_score": confidence,
        "recommendation": recommendation,
        "citations": ["PubMed ID: 34182930", "MIMIC-III Guidelines 2024"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
      frontend: `// React Component - SymptomForm.jsx
import React, { useState } from 'react';

export default function SymptomForm() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptoms.split(','), age: 24, gender: 'male' })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-white">
      <h3 className="text-xl font-bold mb-4">PulseMind Triage Input</h3>
      <textarea 
        className="w-full p-3 bg-slate-800 rounded border border-slate-700 mb-4"
        placeholder="Enter symptoms separated by comma (e.g. persistent headache, mild fever)..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-semibold transition"
      >
        {loading ? 'Analyzing with RAG AI...' : 'Run Clinical Triage'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-slate-800/80 rounded border border-emerald-500/30">
          <p className="text-emerald-400 font-bold">Confidence: {(result.confidence_score * 100).toFixed(1)}%</p>
          <p className="mt-2">{result.recommendation}</p>
        </div>
      )}
    </div>
  );
}`,
      database: `-- PostgreSQL Schema - schema.sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE triage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    symptoms TEXT[] NOT NULL,
    ai_confidence NUMERIC(4,3),
    diagnosis_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'Introduction & Problem Formulation', contentSummary: 'Background on clinical triage bottlenecks, project objectives, and scope.' },
      { chapter: 'Chapter 2', title: 'Literature Review', contentSummary: 'Comparative analysis of Rule-based Medical Systems vs. Vector RAG LLM architectures.' },
      { chapter: 'Chapter 3', title: 'System Architecture & Design', contentSummary: 'Flowchart, Entity-Relationship diagrams, vector indexing methodology, and API contract.' },
      { chapter: 'Chapter 4', title: 'Implementation Details', contentSummary: 'FastAPI microservices, LangChain embeddings, and React component breakdown.' },
      { chapter: 'Chapter 5', title: 'Results & Performance Evaluation', contentSummary: 'Evaluation metrics (Accuracy, BLEU/ROUGE score, Vector search latency).' },
      { chapter: 'Chapter 6', title: 'Conclusion & Future Work', contentSummary: 'Summary of contributions, limitations, and future mobile EHR integrations.' }
    ],
    innovationBoosters: [
      { title: 'Edge AI Deployment', description: 'Quantize model using ONNX Runtime for offline inference on low-cost tablet devices in rural clinics.' },
      { title: 'Multilingual Voice Triage', description: 'Integrate Whisper AI to support native voice input in 15+ regional languages.' }
    ]
  },
  {
    id: 'cyber-code-auditor',
    title: 'CodeGuardian: AI-Powered Static Security Auditor & Patch Generator',
    tagline: 'Automated SAST Pipeline with AST Parsing, OWASP Top 10 Vulnerability Detection & One-Click Fixes',
    domain: 'cybersecurity',
    difficulty: 'Advanced',
    teamSize: '2-3 Members',
    timeline: '6 Months',
    techStack: ['Python', 'Tree-Sitter', 'FastAPI', 'React', 'Docker', 'PostgreSQL'],
    problemStatement: 'Developers frequently introduce security vulnerabilities (SQL injection, XSS, hardcoded secrets) during rapid feature development, and manual code reviews fail to catch complex zero-day vectors.',
    solutionOverview: 'A smart SAST (Static Application Security Testing) platform combining AST code parsing, custom regex patterns, and fine-tuned AI code models to detect security bugs and automatically propose clean Git diff patches.',
    innovationScore: 94,
    keyFeatures: [
      'Abstract Syntax Tree (AST) parsing with Tree-sitter for multi-language support (JS, Python, Go)',
      'OWASP Top 10 automated vulnerability classifier',
      'One-click Git PR creation with automated fix suggestions',
      'CI/CD GitHub Action integration',
      'Interactive vulnerability dependency graph'
    ],
    architectureDiagram: `graph LR
    Dev[Developer Commit] --> Git[GitHub Webhook]
    Git --> Server[CodeGuardian Scanner]
    Server --> AST[Tree-Sitter AST Parser]
    AST --> RuleEngine[OWASP Rule Engine]
    RuleEngine --> AI[AI Patch Generator]
    AI --> PR[Auto-Generated Pull Request]
    Server --> DB[(Vulnerability Log DB)]`,
    vivaQuestions: [
      {
        question: 'Why perform AST parsing instead of simple regular expression matching?',
        answer: 'Regex leads to high false-positive rates because it ignores context. AST parsing converts code into a semantic tree structure, allowing precise data flow analysis, taint tracking, and variable scope verification.',
        category: 'Cyber Security & Compiler Theory'
      },
      {
        question: 'How do you handle dangerous code execution when scanning third-party repos?',
        answer: 'Scanning is purely static analysis over syntax trees inside isolated, unprivileged Docker containers with strictly read-only filesystem mounts.',
        category: 'System Design & Isolation'
      }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'AST Parser & OWASP Rules Engine', duration: 'Weeks 1-6', tasks: ['Tree-Sitter setup for Python/JS', 'Defining CVE rule schemas'] },
      { phase: 'Phase 2', title: 'AI Vulnerability Repair Generator', duration: 'Weeks 7-12', tasks: ['Fine-tuning LLM for context-aware code diffs', 'Testing automated Git commit generator'] },
      { phase: 'Phase 3', title: 'Dashboard & GitHub Integration', duration: 'Weeks 13-18', tasks: ['Building React audit report UI', 'OAuth GitHub Bot webhooks'] },
      { phase: 'Phase 4', title: 'Benchmark & Final Paper', duration: 'Weeks 19-24', tasks: ['Testing on vulnerable open-source repos (DVWA)', 'Writing final project thesis'] }
    ],
    codeBoilerplate: {
      backend: `# Python AST Analyzer - scanner.py
import ast

class VulnerabilityVisitor(ast.NodeVisitor):
    def __init__(self):
        self.vulnerabilities = []

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id == 'eval':
            self.vulnerabilities.append({
                "type": "CWE-95: Eval Injection",
                "line": node.lineno,
                "severity": "CRITICAL"
            })
        self.generic_visit(node)

def scan_code(source_code: str):
    tree = ast.parse(source_code)
    visitor = VulnerabilityVisitor()
    visitor.visit(tree)
    return visitor.vulnerabilities`,
      frontend: `// React Code Diff View Component
import React from 'react';

export default function SecurityAlert({ alert }) {
  return (
    <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-lg text-white">
      <div className="flex justify-between items-center">
        <span className="font-bold text-red-400">{alert.type}</span>
        <span className="text-xs bg-red-800 px-2 py-1 rounded">Line {alert.line}</span>
      </div>
      <p className="text-sm mt-2 text-slate-300">Severity: {alert.severity}</p>
    </div>
  );
}`,
      database: `-- Security Audit Log Table
CREATE TABLE audit_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_url TEXT NOT NULL,
    vulnerabilities_found INT DEFAULT 0,
    scan_duration_ms INT,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'Introduction to Static Application Security', contentSummary: 'Rising cybersecurity threats in software supply chain.' },
      { chapter: 'Chapter 2', title: 'Parser & Taint Analysis Methodology', contentSummary: 'Deep dive into Tree-Sitter and control-flow graphs.' },
      { chapter: 'Chapter 3', title: 'System Architecture', contentSummary: 'Scanning microservices and AI diff generation.' },
      { chapter: 'Chapter 4', title: 'Results & Vulnerability Benchmark', contentSummary: 'Benchmark results on benchmark vulnerability datasets.' }
    ],
    innovationBoosters: [
      { title: 'Zero-Day Pattern Learner', description: 'Use reinforcement learning from developer feedback to adapt custom rules dynamically.' }
    ]
  },
  {
    id: 'smart-waste-iot-cloud',
    title: 'EcoSort IoT: AI & Hardware Smart Waste Management & Logistics Platform',
    tagline: 'Edge AI Camera Sensor Bins with Real-Time Fleet Route Optimization for Municipalities',
    domain: 'iot',
    difficulty: 'Intermediate',
    teamSize: '3-4 Members',
    timeline: '6 Months',
    techStack: ['Python', 'Raspberry Pi', 'YOLOv8', 'Node.js', 'React', 'MQTT', 'Mapbox API'],
    problemStatement: 'Municipal waste management suffers from static garbage truck schedules leading to overflowing bins, fuel wastage, and inefficient recycling sorting.',
    solutionOverview: 'An IoT smart bin prototype fitted with ultrasonic fill sensors and ESP32-CAM/YOLOv8 image classification to sort recyclable waste automatically and generate real-time shortest collection routes for sanitation trucks.',
    innovationScore: 92,
    keyFeatures: [
      'Real-time waste level monitoring via Ultrasonic Sensors & ESP32 / Raspberry Pi',
      'YOLOv8 Edge ML model sorting Plastic, Paper, Metal, and Bio-waste',
      'MQTT Protocol for ultra-lightweight telemetry broadcasting',
      'Dynamic sanitation truck route optimization using Dijkstra / Genetic Algorithm on Mapbox',
      'Citizen reward gamification app encouraging eco-friendly disposal'
    ],
    architectureDiagram: `graph TD
    BinSensors[Ultrasonic Sensor + ESP32 CAM] -->|MQTT Broker| Gateway[EMQX MQTT Server]
    Gateway -->|Telemetry Data| Backend[Node.js / Express Server]
    Backend -->|Waste Classifier| Model[YOLOv8 Model Service]
    Backend -->|Store Metrics| DB[(MongoDB TimeSeries)]
    Backend -->|Route Optimizer| MapService[Mapbox Routing Engine]
    MapService -->|Optimized Map Route| App[Sanitation Driver React App]`,
    vivaQuestions: [
      {
        question: 'Why choose MQTT over traditional HTTP REST for IoT bin sensors?',
        answer: 'MQTT has significantly lower overhead (2-byte header vs standard HTTP headers), works efficiently over weak cellular networks, and supports publish-subscribe telemetry.',
        category: 'Networking & IoT'
      },
      {
        question: 'How does the route optimization algorithm adapt to sudden bin overflows?',
        answer: 'The system runs a dynamic Traveling Salesperson Problem (TSP) solver triggered by high-watermark MQTT alerts, updating driver GPS waypoints in real-time.',
        category: 'Algorithms & Operations Research'
      }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Hardware Prototype & MQTT Setup', duration: 'Weeks 1-5', tasks: ['Assembling Raspberry Pi + Ultrasonic Sensor', 'Setting up EMQX MQTT Broker'] },
      { phase: 'Phase 2', title: 'YOLOv8 Waste Classification Training', duration: 'Weeks 6-11', tasks: ['Collecting dataset of trash images', 'Training YOLOv8 model & optimizing for Raspberry Pi'] },
      { phase: 'Phase 3', title: 'Route Optimization & Web Dashboard', duration: 'Weeks 12-18', tasks: ['Building Mapbox routing dashboard', 'Driver web app integration'] },
      { phase: 'Phase 4', title: 'Field Testing & Documentation', duration: 'Weeks 19-24', tasks: ['Testing hardware prototype under simulated fill levels', 'Writing thesis paper'] }
    ],
    codeBoilerplate: {
      backend: `// Express MQTT Telemetry Ingestion - server.js
const express = require('express');
const mqtt = require('mqtt');
const app = express();

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe('ecosort/bins/+/telemetry');
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log(\`Received Telemetry from \${topic}:\`, data);
  // Store to DB & check threshold (> 85% full)
});

app.listen(5000, () => console.log('IoT Server running on port 5000'));`,
      frontend: `// React Mapbox Route View - RouteMap.jsx
import React from 'react';

export default function RouteMap({ bins }) {
  return (
    <div className="p-6 bg-slate-900 rounded-xl text-white">
      <h3 className="text-xl font-bold mb-3">Live Truck Route Optimization</h3>
      <div className="h-64 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
        <p className="text-slate-400">[ Mapbox Fleet Routing View Ready ]</p>
      </div>
    </div>
  );
}`,
      database: `// MongoDB Schema - BinTelemetry.js
const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema({
  binId: { type: String, required: true },
  fillPercentage: Number,
  wasteType: String,
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BinTelemetry', BinSchema);`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'Smart Urban Sanitation Infrastructure', contentSummary: 'Need for automated waste collection.' },
      { chapter: 'Chapter 2', title: 'IoT Protocols & Computer Vision', contentSummary: 'Comparative study of MQTT vs CoAP and CNN models.' },
      { chapter: 'Chapter 3', title: 'Hardware & Platform Design', contentSummary: 'Circuit diagrams, sensor specs, and backend microservices.' },
      { chapter: 'Chapter 4', title: 'Experimental Results', contentSummary: 'Fuel savings percentage and image classification accuracy.' }
    ],
    innovationBoosters: [
      { title: 'Solar Powered Hardware', description: 'Equip physical bin prototype with mini solar cell and lithium power management module.' }
    ]
  },
  {
    id: 'web3-freelance-escrow',
    title: 'TrustWork: Decentralized Smart Contract Freelance Marketplace with AI Arbitration',
    tagline: 'Zero-Commission Web3 Gig Platform with Automated Crypto Escrow and AI Dispute Resolution',
    domain: 'blockchain',
    difficulty: 'Advanced',
    teamSize: '2-3 Members',
    timeline: '6 Months',
    techStack: ['Solidity', 'Ethereum/Polygon', 'Ethers.js', 'React', 'IPFS', 'Next.js', 'Node.js'],
    problemStatement: 'Centralized freelance platforms take high commission fees (up to 20%), enforce arbitrary payout delays, and suffer from biased dispute resolution.',
    solutionOverview: 'A peer-to-peer decentralized freelance platform using Ethereum/Polygon smart contracts for automated milestone escrows, IPFS for censorship-resistant project asset storage, and an AI dispute oracle.',
    innovationScore: 95,
    keyFeatures: [
      'Smart Contract Milestone Escrow with zero platform fee cuts',
      'Decentralized identity (DID) & soulbound reputational badges',
      'IPFS storage integration for job briefs, deliverables, and contracts',
      'Multi-sig dispute resolution with AI evidence summarizer',
      'Web3 Wallet Auth (MetaMask, Coinbase Wallet)'
    ],
    architectureDiagram: `graph LR
    Freelancer[Freelancer Wallet] -->|Submit Deliverable IPFS Hash| Contract[Escrow Smart Contract]
    Client[Client Wallet] -->|Fund Contract ETH/MATIC| Contract
    Contract -->|Auto-Release Funds| Freelancer
    Contract -->|Dispute Trigger| Oracle[AI Dispute Summary Oracle]
    Oracle -->|Voting DAO| Jury[Staked Token Jury]`,
    vivaQuestions: [
      {
        question: 'How do you prevent re-entrancy attacks in your Solidity Escrow contract?',
        answer: 'We utilize OpenZeppelin ReentrancyGuard standard modifiers (nonReentrant) and adhere strictly to the Checks-Effects-Interactions programming pattern.',
        category: 'Blockchain & Smart Contract Security'
      },
      {
        question: 'How is data stored efficiently without high Gas fees?',
        answer: 'Large file assets and deliverables are stored off-chain in IPFS (InterPlanetary File System), storing only immutable 32-byte IPFS CID hashes on the blockchain ledger.',
        category: 'Decentralized Storage & Architecture'
      }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Smart Contract Architecture', duration: 'Weeks 1-6', tasks: ['Writing Solidity Escrow contract', 'Hardhat testing & gas optimization'] },
      { phase: 'Phase 2', title: 'IPFS & Web3 Wallet Auth Integration', duration: 'Weeks 7-12', tasks: ['Pinata IPFS setup', 'Connecting Wagmi/Ethers.js in React'] },
      { phase: 'Phase 3', title: 'Marketplace UI & AI Arbitration', duration: 'Weeks 13-18', tasks: ['Developing job post & proposal dashboard', 'Integrating evidence summary model'] },
      { phase: 'Phase 4', title: 'Polygon Testnet Deployment & Viva Prep', duration: 'Weeks 19-24', tasks: ['Deploying to Polygon Amoy testnet', 'Compiling thesis report'] }
    ],
    codeBoilerplate: {
      backend: `// Solidity Smart Contract - Escrow.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FreelanceEscrow is ReentrancyGuard {
    address payable public freelancer;
    address public client;
    uint256 public amount;
    enum State { Created, Funded, Delivered, Completed, Disputed }
    State public currentState;

    constructor(address payable _freelancer) payable {
        client = msg.sender;
        freelancer = _freelancer;
        amount = msg.value;
        currentState = State.Funded;
    }

    function confirmDelivery() external nonReentrant {
        require(msg.sender == client, "Only client can release payment");
        currentState = State.Completed;
        freelancer.transfer(amount);
    }
}`,
      frontend: `// React Web3 Wallet Connection Component
import React, { useState } from 'react';

export default function WalletConnect() {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-white">
      {account ? (
        <p className="text-emerald-400 font-mono text-sm">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet} className="px-4 py-2 bg-indigo-600 rounded font-semibold">
          Connect Web3 Wallet
        </button>
      )}
    </div>
  );
}`,
      database: `// IPFS Document Metadata Schema
{
  "title": "Full-Stack E-Commerce Website",
  "budgetUSD": 1500,
  "deliverablesHash": "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  "clientAddress": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
}`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'Decentralized Economy & Smart Contracts', contentSummary: 'Challenges in traditional gig platforms.' },
      { chapter: 'Chapter 2', title: 'Ethereum Virtual Machine & Solidity Architecture', contentSummary: 'Gas evaluation and state machines.' },
      { chapter: 'Chapter 3', title: 'System Implementation', contentSummary: 'Smart contract code, IPFS asset storage, Web3 React frontend.' },
      { chapter: 'Chapter 4', title: 'Security Audit & Gas Cost Benchmarks', contentSummary: 'Re-entrancy analysis and gas consumption comparisons.' }
    ],
    innovationBoosters: [
      { title: 'Soulbound Reputation Tokens', description: 'Issue non-transferable ERC-5192 tokens representing verified skill ratings.' }
    ]
  },
  {
    id: 'ai-micro-learning-edtech',
    title: 'AdaptivePulse: AI Gamified Personalized Micro-Learning Platform',
    tagline: 'Dynamic Knowledge Graphs, Automated Quiz Generation & Spaced Repetition Scheduling',
    domain: 'web-dev',
    difficulty: 'Intermediate',
    teamSize: '2-3 Members',
    timeline: '3 Months',
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'OpenAI/Gemini API', 'Prisma'],
    problemStatement: 'One-size-fits-all online courses lead to high drop-out rates because students learn at different paces and struggle with information overload.',
    solutionOverview: 'An adaptive learning management platform that converts long articles/videos into bite-sized micro-modules, automatically builds interactive knowledge graphs, and adjusts review intervals using Spaced Repetition algorithms (SuperMemo SM-2).',
    innovationScore: 91,
    keyFeatures: [
      'AI PDF/Video transcript to bite-sized micro-lesson transformer',
      'SuperMemo SM-2 spaced repetition algorithm for memory retention',
      'Dynamic interactive visual Knowledge Graph of learning nodes',
      'Real-time automated flashcard & quiz generation with instant feedback',
      'Gamified streak counters, XP points, and leaderboard'
    ],
    architectureDiagram: `graph TD
    User[Student] -->|Uploads PDF/Doc| App[React Next.js Frontend]
    App -->|API Request| Node[Node.js Prisma Server]
    Node -->|Summarize & Extract Concepts| AI[AI Micro-Lesson Generator]
    AI -->|Structured Modules & Quizzes| Node
    Node -->|Graph Relations| DB[(PostgreSQL Database)]
    Node -->|Schedule Flashcards| SM2[SuperMemo SM-2 Engine]
    SM2 -->|Daily Deck Push| App`,
    vivaQuestions: [
      {
        question: 'How does the SuperMemo SM-2 spaced repetition algorithm calculate recall intervals?',
        answer: 'The SM-2 algorithm evaluates user recall feedback on a scale of 0-5, updating the Easiness Factor (EF) and multiplying the previous interval accordingly to optimize memory consolidation.',
        category: 'Algorithms & Cognitive Science'
      },
      {
        question: 'What database model handles hierarchical knowledge graph relationships?',
        answer: 'We use a self-referencing directed graph table structure in PostgreSQL with adjacency lists, mapped via Prisma ORM for quick traversal.',
        category: 'Database Architecture'
      }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'SM-2 Algorithm & Database Design', duration: 'Weeks 1-3', tasks: ['Implementing SM-2 math model', 'Designing Prisma database schema'] },
      { phase: 'Phase 2', title: 'AI Content Extraction Engine', duration: 'Weeks 4-7', tasks: ['Integrating PDF text extractor', 'Prompt engineering for flashcard generation'] },
      { phase: 'Phase 3', title: 'Interactive Graph & Gamification UI', duration: 'Weeks 8-10', tasks: ['Creating Cytoscape/Vis.js node network', 'Building XP leaderboard'] },
      { phase: 'Phase 4', title: 'User Testing & Report', duration: 'Weeks 11-12', tasks: ['Conducting study on student retention rates', 'Final thesis submission'] }
    ],
    codeBoilerplate: {
      backend: `// SuperMemo SM-2 Implementation - sm2.js
function calculateSM2(quality, repetitions, previousInterval, previousEF) {
  let ef = previousEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  let interval;
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(previousInterval * ef);
    repetitions += 1;
  }

  return { repetitions, interval, ef };
}

module.exports = { calculateSM2 };`,
      frontend: `// React Flashcard Component - Flashcard.jsx
import React, { useState } from 'react';

export default function Flashcard({ card, onScore }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      onClick={() => setFlipped(!flipped)}
      className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer transition transform hover:scale-105 text-white"
    >
      <p className="text-xs text-indigo-400 uppercase font-semibold mb-2">{flipped ? 'Answer' : 'Question'}</p>
      <p className="text-lg text-center">{flipped ? card.answer : card.question}</p>
    </div>
  );
}`,
      database: `// Prisma Schema snippet
model MicroLesson {
  id          String   @id @default(uuid())
  title       String
  content     String
  prerequisites MicroLesson[] @relation("LessonGraph")
  created_at  DateTime @default(now())
}`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'EdTech Evolution & Cognitive Retention', contentSummary: 'Challenges in traditional online learning.' },
      { chapter: 'Chapter 2', title: 'Spaced Repetition & Graph Theory', contentSummary: 'Mathematical models for learning optimization.' },
      { chapter: 'Chapter 3', title: 'System Implementation', contentSummary: 'Next.js architecture, Prisma DB, and LLM card extraction.' },
      { chapter: 'Chapter 4', title: 'Evaluation & User Study', contentSummary: 'Retention rate improvements in student trial groups.' }
    ],
    innovationBoosters: [
      { title: 'AI Voice Tutor', description: 'Integrate Web Speech API for interactive verbal pop-quizzes during micro-lessons.' }
    ]
  }
];
