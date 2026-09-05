import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MentorChatModal from '../components/MentorChatModal';

describe('MentorChatModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<MentorChatModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal title, welcome message, and inputs when isOpen is true', () => {
    render(<MentorChatModal isOpen={true} onClose={vi.fn()} />);
    const titleElements = screen.getAllByText(/Gemini AI Chatbot/i);
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<MentorChatModal isOpen={true} onClose={onCloseMock} />);
    const closeBtn = screen.getByLabelText(/Close Chatbot/i);
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
