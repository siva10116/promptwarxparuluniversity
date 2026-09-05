import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';

describe('Navbar Component', () => {
  const defaultProps = {
    activeTab: 'generator',
    setActiveTab: vi.fn(),
    onOpenChatbot: vi.fn(),
    savedCount: 3
  };

  it('renders brand title and logo correctly', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText(/IdeaForge/i)).toBeInTheDocument();
  });

  it('renders navigation tabs and highlights active tab', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Forge Project Ideas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Viva Simulator/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Idea Comparer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Saved Projects/i })).toBeInTheDocument();
  });

  it('calls setActiveTab when tab is clicked', () => {
    render(<Navbar {...defaultProps} />);
    const savedTab = screen.getByRole('button', { name: /Saved Projects/i });
    fireEvent.click(savedTab);
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('saved');
  });

  it('renders saved count badge when savedCount > 0', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('triggers onOpenChatbot when AI Chatbot button is clicked', () => {
    render(<Navbar {...defaultProps} />);
    const chatbotBtn = screen.getByRole('button', { name: /Open Gemini AI Chatbot Assistant/i });
    fireEvent.click(chatbotBtn);
    expect(defaultProps.onOpenChatbot).toHaveBeenCalled();
  });
});
