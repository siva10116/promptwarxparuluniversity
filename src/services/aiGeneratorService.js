import { PROJECT_TEMPLATES } from '../data/projectTemplates';

export async function generateProjectIdeas({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey }) {
  // If API Key is provided, attempt live Gemini API generation
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const liveIdeas = await callGeminiApi({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey });
      if (liveIdeas && liveIdeas.length > 0) {
        return liveIdeas;
      }
    } catch (err) {
      console.warn("Live Gemini API call failed, falling back to dynamic AI engine:", err);
    }
  }

  // Fallback / Default Smart AI Generator Engine
  return generateSmartMockIdeas({ domain, skills, difficulty, teamSize, timeline, keywords });
}

async function callGeminiApi({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey }) {
  const prompt = `You are a Senior University Computer Science Professor and AI Project Mentor.
Generate 3 distinct, highly innovative, A+ grade final year project ideas tailored to the following criteria:
- Domain: ${domain || 'Computer Science / AI'}
- Skills/Tech Stack: ${skills.length > 0 ? skills.join(', ') : 'Python, React, Node.js'}
- Difficulty Level: ${difficulty || 'Intermediate'}
- Team Size: ${teamSize || '2-3 Members'}
- Timeline: ${timeline || '6 Months'}
- Keywords/Interests: ${keywords || 'Healthcare, Automation, Smart Systems'}

Respond ONLY with a valid JSON array of objects. Each object must follow this structure:
[
  {
    "id": "unique-slug-id",
    "title": "Catchy Project Title",
    "tagline": "Sub-header description",
    "domain": "${domain || 'ai-ml'}",
    "difficulty": "${difficulty || 'Intermediate'}",
    "teamSize": "${teamSize || '2-3 Members'}",
    "timeline": "${timeline || '6 Months'}",
    "techStack": ["Tag1", "Tag2", "Tag3"],
    "problemStatement": "Detailed problem description...",
    "solutionOverview": "Proposed solution approach...",
    "innovationScore": 95,
    "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "architectureDiagram": "graph TD\\n  A[Client] --> B[API]\\n  B --> C[(Database)]",
    "vivaQuestions": [
      { "question": "Viva Question 1?", "answer": "Detailed answer...", "category": "Architecture" },
      { "question": "Viva Question 2?", "answer": "Detailed answer...", "category": "Security" }
    ],
    "roadmap": [
      { "phase": "Phase 1", "title": "Setup & Design", "duration": "Weeks 1-4", "tasks": ["Task A", "Task B"] },
      { "phase": "Phase 2", "title": "Core Development", "duration": "Weeks 5-10", "tasks": ["Task C", "Task D"] }
    ],
    "codeBoilerplate": {
      "backend": "// Starter backend code",
      "frontend": "// Starter frontend code",
      "database": "-- Starter SQL schema"
    },
    "reportOutline": [
      { "chapter": "Chapter 1", "title": "Introduction", "contentSummary": "Summary..." },
      { "chapter": "Chapter 2", "title": "Literature Review", "contentSummary": "Summary..." }
    ],
    "innovationBoosters": [
      { "title": "Booster Title", "description": "Booster details..." }
    ]
  }
]`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResult) throw new Error("Empty response from Gemini API");

  return JSON.parse(textResult);
}

function generateSmartMockIdeas({ domain, skills, difficulty, teamSize, timeline, keywords }) {
  // Filter base templates matching domain if applicable
  let matches = [...PROJECT_TEMPLATES];
  if (domain && domain !== 'all') {
    matches = matches.filter(p => p.domain === domain);
    if (matches.length === 0) matches = [...PROJECT_TEMPLATES];
  }

  // Customize matching templates with user inputs (skills, difficulty, keywords)
  const results = matches.map((template, idx) => {
    const customTechStack = Array.from(new Set([...template.techStack, ...skills]));
    const userKeywordText = keywords && keywords.trim() ? ` focusing on "${keywords}"` : '';

    return {
      ...template,
      id: `${template.id}-custom-${idx}-${Date.now()}`,
      difficulty: difficulty || template.difficulty,
      teamSize: teamSize || template.teamSize,
      timeline: timeline || template.timeline,
      techStack: customTechStack.slice(0, 7),
      tagline: `${template.tagline}${userKeywordText}`,
      problemStatement: keywords && keywords.trim() 
        ? `${template.problemStatement} Specifically addresses target use-cases involving ${keywords}.` 
        : template.problemStatement,
      innovationScore: Math.min(99, template.innovationScore + (skills.length > 2 ? 3 : 0))
    };
  });

  // If user provided a specific keyword or domain not in default, synthesize a dynamic custom project idea!
  if (keywords && keywords.trim().length > 3) {
    const mainSkill = skills[0] || 'React';
    const secSkill = skills[1] || 'Python';
    const customIdea = {
      id: `custom-generated-${Date.now()}`,
      title: `Smart ${keywords.charAt(0).toUpperCase() + keywords.slice(1)} Platform & Predictive Analytics Engine`,
      tagline: `Next-generation Intelligent Ecosystem combining ${mainSkill} and ${secSkill} for ${keywords}`,
      domain: domain !== 'all' ? domain : 'ai-ml',
      difficulty: difficulty || 'Intermediate',
      teamSize: teamSize || '2-3 Members',
      timeline: timeline || '6 Months',
      techStack: Array.from(new Set([mainSkill, secSkill, 'PostgreSQL', 'Docker', 'FastAPI'])),
      problemStatement: `Modern implementations in ${keywords} suffer from fragmented workflows, lack of automated predictive intelligence, and high latency in real-time data processing.`,
      solutionOverview: `An end-to-end scalable architecture leveraging ${mainSkill} for the interactive dashboard and ${secSkill} for the high-throughput analytics engine.`,
      innovationScore: 97,
      keyFeatures: [
        `Real-time telemetry & analytics dashboard tailored for ${keywords}`,
        `Automated machine learning pipeline using ${secSkill}`,
        `Role-based administrative control and audit logger`,
        `Exportable analytical reports and automated alert triggers`
      ],
      architectureDiagram: `graph TD
    Client[${mainSkill} Web App] --> Gateway[API Gateway]
    Gateway --> Service[Analytics Engine in ${secSkill}]
    Service --> DB[(PostgreSQL Database)]
    Service --> ML[Predictive AI Model]`,
      vivaQuestions: [
        {
          question: `How does your solution scale when handling high user traffic for ${keywords}?`,
          answer: `We implement stateless API microservices with horizontal auto-scaling and Redis caching layer to offload repetitive database queries.`,
          category: 'System Scalability'
        },
        {
          question: `Why did you select ${mainSkill} over alternative frameworks?`,
          answer: `${mainSkill} provides virtual DOM optimization, robust component reusability, and seamless ecosystem integration required for real-time dashboards.`,
          category: 'Technology Selection'
        }
      ],
      roadmap: [
        { phase: 'Phase 1', title: 'System Specification & Schema Design', duration: 'Weeks 1-4', tasks: ['Database ER diagram', 'API specification contract'] },
        { phase: 'Phase 2', title: 'Core Analytics Engine', duration: 'Weeks 5-10', tasks: [`Developing ${secSkill} ingestion service`, 'Unit testing core business logic'] },
        { phase: 'Phase 3', title: 'Frontend Interface & Integration', duration: 'Weeks 11-16', tasks: [`Building ${mainSkill} interactive UI`, 'Connecting live API websockets'] },
        { phase: 'Phase 4', title: 'Validation & Thesis Report', duration: 'Weeks 17-24', tasks: ['Performance benchmarking', 'Writing final documentation report'] }
      ],
      codeBoilerplate: {
        backend: `# ${secSkill} Analytics Engine - server.py
from fastapi import FastAPI

app = FastAPI(title="${keywords} Intelligence API")

@app.get("/api/v1/metrics")
def get_metrics():
    return {"status": "active", "target": "${keywords}", "efficiency": "98.4%"}`,
        frontend: `// ${mainSkill} Starter Component
import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl">
      <h2 className="text-2xl font-bold">Smart ${keywords} Dashboard</h2>
      <p className="text-slate-400 mt-2">Powered by ${mainSkill} & ${secSkill}</p>
    </div>
  );
}`,
        database: `-- Database Schema
CREATE TABLE analytics_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
      },
      reportOutline: [
        { chapter: 'Chapter 1', title: 'Introduction & Project Background', contentSummary: `Introduction to ${keywords} challenges.` },
        { chapter: 'Chapter 2', title: 'Literature Review', contentSummary: 'Comparative study of contemporary state-of-the-art solutions.' },
        { chapter: 'Chapter 3', title: 'Architecture & System Design', contentSummary: 'System topology and component interactions.' }
      ],
      innovationBoosters: [
        { title: 'Real-time WebSocket Streaming', description: 'Enable instantaneous bidirectional push updates without client polling.' }
      ]
    };
    results.unshift(customIdea);
  }

  return results;
}

export async function askMentorQuestion({ question, projectContext, apiKey }) {
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert University Professor mentoring a final year Computer Science / IT student on their project titled "${projectContext?.title || 'Final Year Project'}".
Project Tech Stack: ${projectContext?.techStack?.join(', ') || 'General'}
Problem Statement: ${projectContext?.problemStatement || 'N/A'}

Student Question: "${question}"

Provide a concise, practical, highly encouraging answer (with code snippets or architecture tips if relevant) that will help the student excel in their viva defense and project implementation.`
            }]
          }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Mentor Response Generated.";
      }
    } catch (e) {
      console.warn("Live mentor API call failed:", e);
    }
  }

  // Fallback Smart Mentor Assistant Rules
  const qLower = question.toLowerCase();
  if (qLower.includes('viva') || qLower.includes('professor') || qLower.includes('examiner') || qLower.includes('question')) {
    return `🎓 **Mentor Tip for Viva Defense**:
Professors typically ask three major focus areas:
1. **Why this tech stack?** (Be ready to compare your tech choice against traditional alternatives).
2. **Where is your baseline comparison?** (Always show metrics demonstrating why your project is an improvement over existing tools).
3. **What happens under heavy load?** (Mention database indexing, caching, or asynchronous queue workers).

*Pro Tip*: Practice explaining your System Architecture Diagram in under 90 seconds!`;
  }

  if (qLower.includes('database') || qLower.includes('sql') || qLower.includes('mongo') || qLower.includes('postgres')) {
    return `💾 **Database Architecture Guidance**:
For **${projectContext?.title || 'your project'}**:
- If you need relational integrity, complex JOIN queries, and structured data: Use **PostgreSQL**.
- If you need flexible schemas, JSON document storage, or rapid prototyping: Use **MongoDB**.
- Don't forget to add indexes on your foreign keys and frequently queried fields before demo day!`;
  }

  if (qLower.includes('report') || qLower.includes('thesis') || qLower.includes('synopsis') || qLower.includes('ieee')) {
    return `📄 **Report & Thesis Structuring Advice**:
Ensure your final year project report includes:
1. **Abstract** (250 words max summarizing problem, methodology, and key quantitative result).
2. **System Architecture Diagram** (Use clear data flow labels).
3. **Performance Metrics** (Include graphs showing speed, accuracy, or latency improvement).
4. **Literature Survey Table** comparing 3 research papers against your project.`;
  }

  return `🤖 **Mentor Recommendation for ${projectContext?.title || 'Your Project'}**:
To ensure an A+ grade:
1. Focus on delivering a solid **Minimum Viable Product (MVP)** early.
2. Maintain clean Git commit histories and comprehensive README documentation.
3. Prepare a backup offline demo video in case of Wi-Fi issues during your final presentation!`;
}
