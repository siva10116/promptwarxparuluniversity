export const INTERESTS = [
  "Web Development", "Mobile Apps", "AI & Machine Learning", "Data Science",
  "IoT & Embedded Systems", "Cybersecurity", "Blockchain", "Cloud & DevOps",
  "AR / VR", "Game Development", "Robotics", "HealthTech", "FinTech", "EdTech"
];

export const SKILLS = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", "Flutter",
  "TensorFlow / PyTorch", "Arduino / Raspberry Pi", "SQL", "AWS / GCP",
  "Figma / UI Design", "Solidity", "FastAPI", "Docker", "Go", "PostgreSQL"
];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DURATIONS = ["6–8 weeks", "3–4 months", "6+ months"];
export const TEAM_SIZES = ["Solo", "2–3 people", "4+ people"];

export const DEFAULT_IDEAS = [
  {
    id: 'ai-health-diagnosis',
    title: 'PulseMind: Multi-Modal AI Clinical Assistant & Symptom Analyzer',
    tagline: 'Leveraging RAG, Medical LLMs, and Computer Vision for Early Symptom Triage',
    domain: 'AI & Machine Learning',
    difficulty: 'Advanced',
    duration: '6+ months',
    teamSize: '2–3 people',
    problem: 'Patients often misinterpret lab results and face delayed clinical diagnosis, leading to emergency room congestion.',
    features: [
      'Multi-modal input processing (Symptom audio, ECG images, Blood test PDFs)',
      'RAG pipeline with Qdrant Vector DB ensuring grounded medical citations',
      'Explainable AI (XAI) dashboard visualizing confidence scores'
    ],
    techStack: ['Python', 'FastAPI', 'PyTorch', 'React', 'PostgreSQL', 'LangChain'],
    roadmap: [
      { phase: 'Phase 1: Architecture & Data', detail: 'Literature survey on Medical RAG, setup FastAPI backend & PostgreSQL schema.' },
      { phase: 'Phase 2: Vector & RAG Pipeline', detail: 'Chunking & embedding medical corpus, integrating Qdrant vector database.' },
      { phase: 'Phase 3: Frontend & Vision Model', detail: 'Developing React interactive UI and lab report PDF OCR parser.' },
      { phase: 'Phase 4: Evaluation & Thesis', detail: 'Benchmarking accuracy against baseline and drafting IEEE thesis report.' }
    ],
    extensions: [
      'Edge AI deployment with ONNX Runtime for offline rural clinic tablets.',
      'Multilingual voice triage supporting regional language audio inputs.'
    ],
    whyFit: 'Combines your Python and React skills with high-impact Healthcare AI research.',
    innovationScore: 96,
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
        answer: 'We enforce Retrieval-Augmented Generation (RAG) with strict semantic thresholding, restricting answers to verified PubMed knowledge vectors with medical citations.',
        category: 'AI Reliability'
      },
      {
        question: 'What database indexing strategy is used for fast vector search?',
        answer: 'We utilize HNSW (Hierarchical Navigable Small World) indexing inside Qdrant Vector DB, providing O(log N) search latency.',
        category: 'Data Structures'
      }
    ],
    codeBoilerplate: {
      backend: `# FastAPI Backend Service - main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="PulseMind AI API")

class SymptomRequest(BaseModel):
    symptoms: list[str]
    age: int

@app.post("/api/v1/triage")
async def analyze_symptoms(req: SymptomRequest):
    return {
        "confidence_score": 0.95,
        "recommendation": "Low risk. Suggested GP consultation.",
        "citations": ["PubMed ID: 34182930"]
    }`,
      frontend: `// React Triage Component
import React, { useState } from 'react';

export default function TriageInput() {
  const [symptoms, setSymptoms] = useState('');
  return (
    <div className="p-4 bg-[#12324F] border border-[#3E6E9E] rounded text-white">
      <textarea className="w-full p-2 bg-[#0F2A45] border border-[#3E6E9E]" placeholder="Enter symptoms..." />
      <button className="mt-2 px-4 py-2 bg-[#FF6A3D] text-[#12203A] font-bold">Run Triage</button>
    </div>
  );
}`,
      database: `-- PostgreSQL Migration
CREATE TABLE triage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symptoms TEXT[] NOT NULL,
    ai_confidence NUMERIC(4,3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'Introduction & Problem Formulation', contentSummary: 'Background on clinical triage bottlenecks and scope.' },
      { chapter: 'Chapter 2', title: 'Literature Review', contentSummary: 'Comparative analysis of Rule-based Medical Systems vs. Vector RAG LLMs.' },
      { chapter: 'Chapter 3', title: 'System Architecture', contentSummary: 'Flowchart, ER diagrams, and vector search methodology.' }
    ]
  },
  {
    id: 'cyber-code-auditor',
    title: 'CodeGuardian: AI Static Security Auditor & Automated Patch Generator',
    tagline: 'AST Code Parsing, OWASP Top 10 Vulnerability Scanning & Git Diff Fixes',
    domain: 'Cybersecurity',
    difficulty: 'Advanced',
    duration: '6+ months',
    teamSize: '2–3 people',
    problem: 'Developers introduce security vulnerabilities during rapid feature releases, and manual reviews fail to catch zero-day vectors.',
    features: [
      'Abstract Syntax Tree (AST) parsing with Tree-Sitter for multi-language support',
      'OWASP Top 10 automated vulnerability classifier engine',
      'One-click GitHub Pull Request creation with suggested security patches'
    ],
    techStack: ['Python', 'Tree-Sitter', 'FastAPI', 'React', 'Docker', 'PostgreSQL'],
    roadmap: [
      { phase: 'Phase 1: AST Parser & OWASP Rules', detail: 'Setting up Tree-Sitter for Python/JS code and defining CVE schemas.' },
      { phase: 'Phase 2: AI Repair Generator', detail: 'Fine-tuning LLM for context-aware code diff generation and automated Git commits.' },
      { phase: 'Phase 3: Dashboard & GitHub Action', detail: 'Building React audit report UI and OAuth GitHub Bot webhooks.' },
      { phase: 'Phase 4: Vulnerability Benchmarking', detail: 'Testing on benchmark vulnerability repositories (DVWA) and thesis drafting.' }
    ],
    extensions: [
      'Reinforcement learning from developer PR feedback to refine rule precision.',
      'Container image vulnerability scanner using Trivy integration.'
    ],
    whyFit: 'Leverages your Python and Cybersecurity interests to create a practical open-source tool.',
    innovationScore: 94,
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
        question: 'Why perform AST parsing instead of regular expression matching?',
        answer: 'Regex leads to high false-positive rates. AST parsing converts code into a semantic tree structure, allowing precise data flow analysis and taint tracking.',
        category: 'Compiler Security'
      }
    ],
    codeBoilerplate: {
      backend: `# AST Analyzer - scanner.py
import ast

def scan_eval(code_str: str):
    tree = ast.parse(code_str)
    # Scan AST nodes for dangerous calls
    return [{"type": "CWE-95: Eval Injection", "line": 12}]`,
      frontend: `// React Diff Alert Component
export default function Alert({ alert }) {
  return (
    <div className="p-3 bg-red-950 border border-red-500 rounded text-red-200">
      <strong>{alert.type}</strong> on line {alert.line}
    </div>
  );
}`,
      database: `-- Audit Scan Logs
CREATE TABLE audit_scans (
    id SERIAL PRIMARY KEY,
    repo_url TEXT NOT NULL,
    vuln_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'Static Security Testing Overview', contentSummary: 'Challenges in software supply chain security.' },
      { chapter: 'Chapter 2', title: 'AST Analysis & Rule Modeling', contentSummary: 'Tree-Sitter syntax tree parser and taint tracking.' }
    ]
  },
  {
    id: 'smart-waste-iot-cloud',
    title: 'EcoSort IoT: AI Smart Waste Bin & Route Optimization Platform',
    tagline: 'Edge AI Camera Sensor Bins with Real-Time Fleet Route Planning',
    domain: 'IoT & Embedded Systems',
    difficulty: 'Intermediate',
    duration: '3–4 months',
    teamSize: '2–3 people',
    problem: 'Municipal waste collection relies on static schedules leading to overflowing trash bins and excessive fuel consumption.',
    features: [
      'Real-time waste fill level monitoring via Ultrasonic Sensors & ESP32-CAM',
      'YOLOv8 Edge ML model sorting Plastic, Paper, Metal, and Bio-waste',
      'MQTT Protocol for low-bandwidth telemetry transmission to cloud backend'
    ],
    techStack: ['Python', 'Raspberry Pi', 'YOLOv8', 'Node.js', 'React', 'MQTT', 'Mapbox API'],
    roadmap: [
      { phase: 'Phase 1: Hardware & MQTT Setup', detail: 'Assembling Raspberry Pi + ultrasonic sensors and configuring MQTT broker.' },
      { phase: 'Phase 2: YOLOv8 Training', detail: 'Collecting dataset of trash images and optimizing model for edge hardware.' },
      { phase: 'Phase 3: Route Optimization Dashboard', detail: 'Building Mapbox routing dashboard with Traveling Salesperson solver.' },
      { phase: 'Phase 4: Field Testing & Thesis', detail: 'Simulating bin fill levels under physical conditions and drafting final report.' }
    ],
    extensions: [
      'Solar-powered physical prototype with mini solar panel and LiPo power manager.',
      'Citizen reward mobile app with QR code waste disposal gamification.'
    ],
    whyFit: 'Perfect mix of IoT hardware, Machine Learning, and Web Dashboard development.',
    innovationScore: 92,
    architectureDiagram: `graph TD
    BinSensors[Ultrasonic Sensor + ESP32 CAM] -->|MQTT Broker| Gateway[EMQX MQTT Server]
    Gateway -->|Telemetry Data| Backend[Node.js / Express Server]
    Backend -->|Waste Classifier| Model[YOLOv8 Model Service]
    Backend -->|Store Metrics| DB[(MongoDB TimeSeries)]
    Backend -->|Route Optimizer| MapService[Mapbox Routing Engine]
    MapService -->|Optimized Map Route| App[Sanitation Driver React App]`,
    vivaQuestions: [
      {
        question: 'Why use MQTT instead of HTTP REST for IoT telemetry?',
        answer: 'MQTT has significantly lower overhead (2-byte header), works efficiently over weak cellular networks, and uses pub-sub event distribution.',
        category: 'Networking & IoT'
      }
    ],
    codeBoilerplate: {
      backend: `// Express MQTT Subscriber - server.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  client.subscribe('ecosort/bins/+/telemetry');
});

client.on('message', (topic, payload) => {
  const data = JSON.parse(payload.toString());
  console.log('Bin Fill Data:', data);
});`,
      frontend: `// Fleet Route Map Component
export default function FleetMap() {
  return <div className="h-48 bg-[#16395C] flex items-center justify-center text-slate-300">Mapbox Dynamic Fleet Route</div>;
}`,
      database: `// MongoDB Telemetry Schema
const binSchema = new mongoose.Schema({
  binId: String,
  fillPercentage: Number,
  timestamp: { type: Date, default: Date.now }
});`
    },
    reportOutline: [
      { chapter: 'Chapter 1', title: 'Smart Urban Infrastructure', contentSummary: 'Need for automated waste logistics.' },
      { chapter: 'Chapter 2', title: 'Hardware & IoT Protocols', contentSummary: 'MQTT vs HTTP performance in sensor networks.' }
    ]
  }
];
