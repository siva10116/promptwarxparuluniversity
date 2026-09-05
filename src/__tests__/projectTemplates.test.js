import { describe, it, expect } from 'vitest';
import { DEFAULT_IDEAS, INTERESTS, SKILLS, DIFFICULTIES, TEAM_SIZES } from '../data/projectTemplates';

describe('Project Templates Data Module', () => {
  it('should export non-empty DEFAULT_IDEAS array', () => {
    expect(Array.isArray(DEFAULT_IDEAS)).toBe(true);
    expect(DEFAULT_IDEAS.length).toBeGreaterThan(0);
  });

  it('should ensure each project idea has valid required properties', () => {
    DEFAULT_IDEAS.forEach((idea) => {
      expect(idea).toHaveProperty('id');
      expect(idea).toHaveProperty('title');
      expect(idea).toHaveProperty('domain');
      expect(idea).toHaveProperty('difficulty');
      expect(idea).toHaveProperty('problem');
      expect(idea).toHaveProperty('features');
      expect(Array.isArray(idea.features)).toBe(true);
      expect(idea).toHaveProperty('techStack');
      expect(Array.isArray(idea.techStack)).toBe(true);
    });
  });

  it('should contain valid interest options', () => {
    expect(Array.isArray(INTERESTS)).toBe(true);
    expect(INTERESTS).toContain('AI & Machine Learning');
    expect(INTERESTS).toContain('Web Development');
  });

  it('should contain valid skill options', () => {
    expect(Array.isArray(SKILLS)).toBe(true);
    expect(SKILLS).toContain('Python');
    expect(SKILLS).toContain('React');
  });

  it('should contain valid difficulties and team sizes', () => {
    expect(Array.isArray(DIFFICULTIES)).toBe(true);
    expect(DIFFICULTIES).toContain('Intermediate');
    expect(Array.isArray(TEAM_SIZES)).toBe(true);
  });
});
