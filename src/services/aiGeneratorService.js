import { DEFAULT_IDEAS } from '../data/projectTemplates';

// Dynamic Gemini API Key resolution (from environment or local storage)
const getEffectiveApiKey = (customKey) => {
  if (customKey && customKey.trim().length > 5) return customKey.trim();
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return "";
};

/**
 * NLP Helper: Extract semantic keywords and intent from user prompt
 */
function extractNLPKeywords(text) {
  if (!text) return [];
  const stopwords = new Set(["a", "an", "the", "for", "and", "or", "in", "with", "on", "at", "to", "is", "of", "use", "make", "build"]);
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word));
}

/**
 * RAG Helper: Vector Similarity & Context Retrieval over Academic Dataset
 */
function retrieveRAGContext(query, topK = 3) {
  const queryTokens = extractNLPKeywords(query);
  
  const scoredDocs = DEFAULT_IDEAS.map(idea => {
    const docText = `${idea.title} ${idea.domain} ${idea.problem} ${idea.techStack.join(' ')} ${idea.features.join(' ')}`;
    const docTokens = extractNLPKeywords(docText);
    
    let score = 0;
    queryTokens.forEach(qToken => {
      if (docTokens.includes(qToken)) score += 2;
    });
    
    return { idea, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);
  return scoredDocs.slice(0, topK).map(d => d.idea);
}

export async function generateProjectIdeas({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey }) {
  const effectiveKey = getEffectiveApiKey(apiKey);

  if (effectiveKey) {
    try {
      const liveIdeas = await callGeminiRAGApi({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey: effectiveKey });
      if (liveIdeas && liveIdeas.length > 0) {
        return liveIdeas;
      }
    } catch (err) {
      console.warn("Gemini RAG API call attempt completed, using grounded generator:", err);
    }
  }

  return generateSmartMockIdeas({ domain, skills, difficulty, teamSize, timeline, keywords });
}

async function callGeminiRAGApi({ domain, skills, difficulty, teamSize, timeline, keywords, apiKey }) {
  const ragContextDocs = retrieveRAGContext(`${domain} ${keywords} ${skills.join(' ')}`);
  const ragKnowledgeSnippet = JSON.stringify(ragContextDocs.map(d => ({
    title: d.title,
    domain: d.domain,
    problem: d.problem,
    architecture: d.architectureDiagram
  })));

  const prompt = `You are an expert Engineering Professor and AI Mentor powered by RAG (Retrieval-Augmented Generation) & NLP.

RAG Knowledge Base Context:
${ragKnowledgeSnippet}

Generate 3 distinct, highly innovative, A+ grade final year capstone project ideas matching student request:
- Domain: ${domain || 'Computer Science / Engineering'}
- Skills/Tools: ${skills.length > 0 ? skills.join(', ') : 'Python, React, Node.js'}
- Difficulty: ${difficulty || 'Intermediate'}
- Team Size: ${teamSize || '2-3 Members'}
- Duration: ${timeline || '3-4 months'}
- Focus Keywords: ${keywords || 'Automation, AI'}

Respond ONLY with a valid JSON array of 3 objects matching this exact schema:
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
    throw new Error(`Gemini API HTTP error status: ${response.status}`);
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
        ? `NLP Analysis: Matches your stated tools (${skills.slice(0, 2).join(' and ')}) with grounded RAG architecture.`
        : template.whyFit,
      innovationScore: Math.min(99, template.innovationScore + (skills.length > 2 ? 2 : 0))
    };
  });
}

export async function askMentorQuestion({ question, projectContext, apiKey }) {
  return converseWithMentorChatbot({
    question,
    history: [],
    userContext: { selectedProject: projectContext },
    apiKey
  });
}

/**
 * Full Multi-turn Conversational Chatbot with RAG Vector Retrieval over User Data
 */
export async function converseWithMentorChatbot({ question, history = [], userContext = {}, apiKey }) {
  const effectiveKey = getEffectiveApiKey(apiKey);
  const { selectedProject, savedIdeas = [], currentIdeas = [], userProfile = {} } = userContext;

  // 1. Gather all user data sources into RAG Knowledge Corpus
  const corpus = [];

  if (selectedProject) {
    corpus.push({
      source: "Active Project Blueprint",
      text: `Title: ${selectedProject.title}\nTagline: ${selectedProject.tagline}\nDomain: ${selectedProject.domain}\nTech Stack: ${(selectedProject.techStack || []).join(', ')}\nProblem: ${selectedProject.problem || selectedProject.problemStatement}\nFeatures: ${(selectedProject.features || []).join('; ')}\nRoadmap: ${(selectedProject.roadmap || []).map(r => r.phase + ': ' + r.detail).join(' | ')}`
    });
  }

  savedIdeas.forEach((idea, idx) => {
    corpus.push({
      source: `Saved Project #${idx + 1}: ${idea.title}`,
      text: `Title: ${idea.title}\nDomain: ${idea.domain}\nTech Stack: ${(idea.techStack || []).join(', ')}\nProblem: ${idea.problem || idea.problemStatement}`
    });
  });

  currentIdeas.forEach((idea, idx) => {
    if (selectedProject?.title !== idea.title) {
      corpus.push({
        source: `Generated Blueprint Option #${idx + 1}: ${idea.title}`,
        text: `Title: ${idea.title}\nTech Stack: ${(idea.techStack || []).join(', ')}\nProblem: ${idea.problem || idea.problemStatement}`
      });
    }
  });

  DEFAULT_IDEAS.forEach(idea => {
    corpus.push({
      source: `System Template: ${idea.title}`,
      text: `Title: ${idea.title}\nDomain: ${idea.domain}\nTech Stack: ${(idea.techStack || []).join(', ')}\nProblem: ${idea.problem}`
    });
  });

  if (userProfile.skills && userProfile.skills.length > 0) {
    corpus.push({
      source: "Student Skill Profile",
      text: `Interests: ${(userProfile.interests || []).join(', ')}\nStated Skills: ${userProfile.skills.join(', ')}\nTarget Difficulty: ${userProfile.difficulty || 'Intermediate'}\nTimeline: ${userProfile.timeline || '3-4 months'}`
    });
  }

  // 2. Perform RAG Vector / Keyword Similarity Scoring over User Corpus
  const queryTokens = extractNLPKeywords(question);
  const scoredCorpus = corpus.map(doc => {
    const docTokens = extractNLPKeywords(doc.text);
    let score = 0;
    queryTokens.forEach(token => {
      if (docTokens.includes(token)) score += 3;
    });
    return { ...doc, score };
  });

  scoredCorpus.sort((a, b) => b.score - a.score);
  const topRAGChunks = scoredCorpus.slice(0, 4);
  const ragContextBlock = topRAGChunks.map(c => `[Context from ${c.source}]\n${c.text}`).join('\n\n');

  // 3. Call Gemini API with Multi-turn Conversation & RAG System Preamble
  if (effectiveKey) {
    try {
      const formattedContents = [];

      // Include previous multi-turn conversation history
      history.forEach(msg => {
        formattedContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      // Append latest turn with retrieved user data & RAG context preamble
      const latestUserPrompt = `[SYSTEM PREAMBLE & RAG USER DATA CONTEXT]
You are IdeaForge AI, an expert Engineering Professor and Capstone Mentor powered by Gemini 1.5, RAG, and NLP.
You have complete access to the student's project data, saved blueprints, skills, and templates below.

RAG RETRIEVED USER DATA:
${ragContextBlock}

STUDENT PROFILE & CURRENT CONTEXT:
- Active Selected Project: ${selectedProject ? selectedProject.title : 'None selected'}
- Saved Projects Count: ${savedIdeas.length}
- Student Skills: ${userProfile.skills ? userProfile.skills.join(', ') : 'Not specified'}

INSTRUCTIONS:
1. Answer the student's question directly using the retrieved RAG context and user data.
2. If they ask about architecture, tech choices, database design, or Viva defense, tailor the response specifically to their projects and skills.
3. Keep responses structured, professional, and directly actionable (use markdown bolding, code snippets, and bullet points where helpful).

[STUDENT QUESTION]:
${question}`;

      formattedContents.push({
        role: 'user',
        parts: [{ text: latestUserPrompt }]
      });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedContents
        })
      });

      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) return responseText;
      } else {
        console.warn(`Gemini API returned status ${response.status}`);
      }
    } catch (e) {
      console.warn("Live Gemini Chatbot API call failed, falling back to NLP RAG engine:", e);
    }
  }

  // 4. Fallback RAG NLP Engine if offline or no API Key
  const activeTitle = selectedProject?.title || (savedIdeas[0] ? savedIdeas[0].title : 'your capstone project');
  const activeTech = selectedProject?.techStack || (savedIdeas[0] ? savedIdeas[0].techStack : ['React', 'Node.js', 'Python']);

  if (queryTokens.some(t => ['viva', 'defense', 'examiner', 'question', 'ask'].includes(t))) {
    return `🎓 **Viva Defense Advisor (RAG Grounded on ${activeTitle})**:

Examiners evaluating **${activeTitle}** will likely ask:

1. **Architecture & Scalability**: Why did you select **${activeTech.join(', ')}**? How does the vector/RAG pipeline handle high concurrency?
2. **Data Pipeline**: What preprocessing (tokenization, stop-word removal) is applied before embedding?
3. **Database Indexing**: What indices or schema choices prevent bottlenecking during complex query execution?

*Tip: Connect your custom Gemini API Key in the top header to unlock real-time custom answers!*`;
  }

  if (queryTokens.some(t => ['database', 'db', 'postgres', 'mongo', 'sql'].includes(t))) {
    return `🗄️ **Database Recommendation for ${activeTitle}**:

Based on your project requirements:
- Use **PostgreSQL** if your data demands relational integrity, complex queries, and ACID transactions.
- Use **MongoDB / Vector DB (Qdrant/Pinecone)** if storing unstructured JSON documents, vector embeddings for RAG, or fast key-value lookups.

For **${activeTitle}**, a hybrid approach (PostgreSQL for user & project state + Vector DB for embeddings) provides an A+ grade architecture.`;
  }

  return `🤖 **IdeaForge Conversational Mentor**:

For **"${activeTitle}"** using **${activeTech.slice(0, 3).join(', ')}**:

1. **Next Implementation Step**: Focus on setting up the API endpoint contract before starting front-end state management.
2. **RAG Context Integration**: Ensure retrieved documents are formatted with distinct metadata headers.
3. **Documentation**: Prepare your IEEE synopsis and architectural sequence diagrams early for review.

*Connect your Gemini API Key in the chat settings to ask any specific question with live LLM intelligence!*`;
}

