import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '@/components/core/loading-spinner';

describe('LoadingSpinner', () => {
  it('renders correctly', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('has the correct styling', () => {
    render(<LoadingSpinner />);

    const container = screen.getByRole('status', { hidden: true }).parentElement;
    expect(container).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'w-full',
      'h-screen',
      'bg-white'
    );
  });
});
