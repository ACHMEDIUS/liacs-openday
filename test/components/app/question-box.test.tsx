import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuestionBox from '@/components/app/question-box';

describe('QuestionBox', () => {
  const mockProps = {
    codeSnippet: 'function test() {\n  return "hello";\n}',
    correctLineNumber: 1,
    onLineClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders code lines correctly', () => {
    render(<QuestionBox {...mockProps} />);

    expect(screen.getByText('function test() {')).toBeInTheDocument();
    expect(screen.getByText('return "hello";')).toBeInTheDocument();
    expect(screen.getByText('}')).toBeInTheDocument();
  });

  it('shows line numbers', () => {
    render(<QuestionBox {...mockProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onLineClick when correct line is clicked', () => {
    render(<QuestionBox {...mockProps} />);

    const correctLine = screen.getByText('return "hello";').parentElement;
    fireEvent.click(correctLine!);

    expect(mockProps.onLineClick).toHaveBeenCalledTimes(1);
  });

  it('shows correct answer in green when correct line is clicked', () => {
    render(<QuestionBox {...mockProps} />);

    const correctLine = screen.getByText('return "hello";').parentElement;
    fireEvent.click(correctLine!);

    expect(correctLine).toHaveClass('bg-green-500');
  });

  it('shows wrong answer in red when incorrect line is clicked', () => {
    render(<QuestionBox {...mockProps} />);

    const wrongLine = screen.getByText('function test() {').parentElement;
    fireEvent.click(wrongLine!);

    expect(wrongLine).toHaveClass('bg-red-500');
    expect(mockProps.onLineClick).not.toHaveBeenCalled();
  });
});
