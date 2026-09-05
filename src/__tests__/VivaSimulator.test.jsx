import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VivaSimulator from '../components/VivaSimulator';

describe('VivaSimulator Component', () => {
  it('renders viva defense examiner simulator interface', () => {
    render(<VivaSimulator selectedIdea={null} />);
    expect(screen.getByText(/Professor Viva & Defense Simulator/i)).toBeInTheDocument();
  });
});
