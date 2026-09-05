import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getEffectiveApiKey,
  converseWithMentorChatbot,
  generateProjectIdeas,
  generateLiveVivaQuiz
} from '../services/aiGeneratorService';

describe('AI Generator Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should resolve default Gemini API key when no custom key is provided', () => {
    const key = getEffectiveApiKey();
    expect(key).toBeDefined();
    expect(typeof key).toBe('string');
    expect(key.startsWith('AQ.Ab8RN')).toBe(true);
  });

  it('should prioritize explicit custom key when provided', () => {
    const customKey = 'CUSTOM_GEMINI_KEY_123456';
    const key = getEffectiveApiKey(customKey);
    expect(key).toBe(customKey);
  });

  it('should retrieve key stored in localStorage if custom key argument is missing', () => {
    localStorage.setItem('ideaforge_custom_gemini_key', 'STORED_KEY_987654');
    const key = getEffectiveApiKey();
    expect(key).toBe('STORED_KEY_987654');
  });

  it('should call converseWithMentorChatbot and return structured markdown reply', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Gemini AI assistant reply for testing.' }]
            }
          }
        ]
      })
    });

    const reply = await converseWithMentorChatbot({
      question: 'Explain React state management',
      history: [{ sender: 'user', text: 'Hello' }],
      geminiKey: 'TEST_KEY_123'
    });

    expect(reply).toBe('Gemini AI assistant reply for testing.');
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should generate project ideas and parse valid JSON array', async () => {
    const mockData = [
      {
        id: 'test-project',
        title: 'AI Smart Traffic',
        tagline: 'Automated signal control',
        domain: 'AI & Machine Learning',
        difficulty: 'Intermediate',
        duration: '3 months',
        teamSize: '2 Members',
        problem: 'Traffic congestion',
        features: ['Feature A', 'Feature B'],
        techStack: ['Python', 'OpenCV'],
        roadmap: [],
        extensions: [],
        whyFit: 'Fits AI skills',
        innovationScore: 92,
        architectureDiagram: 'graph TD',
        vivaQuestions: [],
        codeBoilerplate: { backend: '', frontend: '', database: '' },
        reportOutline: []
      }
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockData) }]
            }
          }
        ]
      })
    });

    const ideas = await generateProjectIdeas({
      domain: 'AI & Machine Learning',
      skills: ['Python'],
      difficulty: 'Intermediate',
      teamSize: '2 Members',
      timeline: '3 months',
      keywords: 'Traffic',
      geminiKey: 'TEST_KEY'
    });

    expect(Array.isArray(ideas)).toBe(true);
    expect(ideas.length).toBe(1);
    expect(ideas[0].title).toBe('AI Smart Traffic');
  });

  it('should generate viva quiz questions successfully', async () => {
    const mockQuiz = [
      {
        id: 1,
        category: 'Architecture',
        question: 'Why Python?',
        options: ['Fast AI dev', 'Option B', 'Option C', 'Option D'],
        correctIdx: 0,
        explanation: 'Python has extensive AI libraries.'
      }
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockQuiz) }]
            }
          }
        ]
      })
    });

    const quiz = await generateLiveVivaQuiz({
      projectTitle: 'Smart Traffic',
      techStack: ['Python'],
      geminiKey: 'TEST_KEY'
    });

    expect(Array.isArray(quiz)).toBe(true);
    expect(quiz[0].question).toBe('Why Python?');
  });
});
