import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IdeaGenerator from '../components/IdeaGenerator';

describe('IdeaGenerator Component', () => {
  const defaultProps = {
    onGenerate: vi.fn(),
    isGenerating: false
  };

  it('renders form elements, domain selector, and submit button', () => {
    render(<IdeaGenerator {...defaultProps} />);
    expect(screen.getByText(/What kind of project do you want to build/i)).toBeInTheDocument();
    expect(screen.getByText(/Tailored Final Year Project Generator/i)).toBeInTheDocument();
    expect(screen.getByText(/All Engineering Domains/i)).toBeInTheDocument();
  });
});
