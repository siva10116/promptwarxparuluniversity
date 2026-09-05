import { DEFAULT_IDEAS } from '../data/projectTemplates';

export async function generateProjectIdeas({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey }) {
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const liveIdeas = await callGeminiApi({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey });
      if (liveIdeas && liveIdeas.length > 0) {
        return liveIdeas;
      }
    } catch (err) {
      console.warn("Live Gemini API call failed, falling back to smart generator:", err);
    }
  }

  return generateSmartMockIdeas({ domain, skills, difficulty, teamSize, timeline, keywords });
}

async function callGeminiApi({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey }) {
  const prompt = `You are a Senior Engineering University Professor & Capstone Mentor.
Generate 3 distinct, highly innovative, A+ grade final year project ideas matching:
- Domain/Interests: ${domain || 'Computer Science / Engineering'}
- Skills/Tools: ${skills.length > 0 ? skills.join(', ') : 'Python, React, Node.js'}
- Difficulty: ${difficulty || 'Intermediate'}
- Team Size: ${teamSize || '2-3 Members'}
- Duration/Timeline: ${timeline || '3-4 months'}
- Focus Keywords: ${keywords || 'Automation, AI, Smart Systems'}

Respond ONLY with a valid JSON array of 3 objects matching this schema:
[
  {
    "id": "slug-id",
    "title": "Project Title",
    "tagline": "Catchy short tagline",
    "domain": "Domain Name",
    "difficulty": "${difficulty || 'Intermediate'}",
    "duration": "${timeline || '3-4 months'}",
    "teamSize": "${teamSize || '2-3 Members'}",
    "problem": "One clear sentence describing the problem.",
    "features": ["Core Feature 1", "Core Feature 2", "Core Feature 3"],
    "techStack": ["Tool1", "Tool2", "Tool3", "Tool4"],
    "roadmap": [
      { "phase": "Phase 1: Planning", "detail": "Setup architecture and DB schema." },
      { "phase": "Phase 2: MVP Core", "detail": "Develop main engine microservices." },
      { "phase": "Phase 3: Integration", "detail": "Connect frontend dashboard." },
      { "phase": "Phase 4: Evaluation", "detail": "Performance metrics & IEEE thesis." }
    ],
    "extensions": ["Extension idea 1", "Extension idea 2"],
    "whyFit": "One sentence explaining why this fits the student's tech stack.",
    "innovationScore": 95,
    "architectureDiagram": "graph TD\\n  Client[React App] --> API[FastAPI]\\n  API --> DB[(Database)]",
    "vivaQuestions": [
      { "question": "Why this tech stack?", "answer": "Detailed justification...", "category": "Architecture" }
    ],
    "codeBoilerplate": {
      "backend": "# Backend starter script",
      "frontend": "// Frontend starter component",
      "database": "-- Database schema migration"
    },
    "reportOutline": [
      { "chapter": "Chapter 1", "title": "Introduction", "contentSummary": "Background & scope." },
      { "chapter": "Chapter 2", "title": "Literature Survey", "contentSummary": "Comparative review." }
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
    throw new Error(`Gemini HTTP error status: ${response.status}`);
  }

  const data = await response.json();
  const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResult) throw new Error("Empty response from Gemini API");

  return JSON.parse(textResult);
}

function generateSmartMockIdeas({ domain, skills, difficulty, teamSize, timeline, keywords }) {
  let matches = [...DEFAULT_IDEAS];

  return matches.map((template, idx) => {
    const mergedTech = Array.from(new Set([...template.techStack, ...skills]));
    const userKeywordText = keywords && keywords.trim() ? ` focusing on "${keywords}"` : '';

    return {
      ...template,
      id: `${template.id}-custom-${idx}-${Date.now()}`,
      difficulty: difficulty || template.difficulty,
      duration: timeline || template.duration,
      teamSize: teamSize || template.teamSize,
      techStack: mergedTech.slice(0, 6),
      tagline: `${template.tagline}${userKeywordText}`,
      whyFit: skills.length > 0 
        ? `Builds directly on your experience with ${skills.slice(0, 2).join(' and ')}.`
        : template.whyFit,
      innovationScore: Math.min(99, template.innovationScore + (skills.length > 2 ? 2 : 0))
    };
  });
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
              text: `You are an expert Engineering Professor mentoring a student on their final year capstone project titled "${projectContext?.title || 'Project'}".
Tech Stack: ${projectContext?.techStack?.join(', ') || 'General'}
Problem: ${projectContext?.problem || projectContext?.problemStatement || 'N/A'}

Student Question: "${question}"

Keep answer under 120 words. Be concrete, practical, and highly encouraging.`
            }]
          }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Mentor answer ready.";
      }
    } catch (e) {
      console.warn("Live mentor API call failed:", e);
    }
  }

  const qLower = question.toLowerCase();
  if (qLower.includes('viva') || qLower.includes('professor') || qLower.includes('examiner') || qLower.includes('question')) {
    return `🎓 **Mentor Viva Defense Tip**:
Professors focus heavily on 3 areas:
1. **Tech Choice Rationale**: Be ready to justify why you chose ${projectContext?.techStack?.[0] || 'your framework'} over alternative options.
2. **Quantitative Metrics**: Show baseline latency/accuracy metrics comparing your tool against current methods.
3. **Scalability**: Explain your database indexing and caching layer.`;
  }

  if (qLower.includes('week') || qLower.includes('first') || qLower.includes('start') || qLower.includes('begin')) {
    return `🛠️ **Week 1 Priority**:
1. Finalize your System Architecture Diagram and API data models.
2. Setup the Git repository with a clean folder structure (frontend, backend, database migrations).
3. Build a small Hello World API route and connect it to your database.`;
  }

  return `🤖 **Mentor Advice for ${projectContext?.title || 'Your Project'}**:
To ensure an A+ grade:
1. Build a functional Minimum Viable Product (MVP) before adding complex extra features.
2. Keep clean Git commit logs and document your setup commands in the README.
3. Prepare a backup offline video demo for your final presentation day!`;
}
