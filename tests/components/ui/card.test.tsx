import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render correctly', () => {
      render(<Card data-testid="card">Card Content</Card>);
      const card = screen.getByTestId('card');

      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card Content');
    });

    it('should apply default styles', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveClass('rounded-xl');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('bg-card');
      expect(card).toHaveClass('text-card-foreground');
      expect(card).toHaveClass('shadow');
    });

    it('should accept custom className', () => {
      render(
        <Card className="custom-card" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card).toHaveClass('custom-card');
      // Should still have default classes
      expect(card).toHaveClass('rounded-xl');
    });

    it('should forward ref correctly', () => {
      const ref = vi.fn();
      render(<Card ref={ref}>Content</Card>);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardHeader', () => {
    it('should render correctly', () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
      const header = screen.getByTestId('card-header');

      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header Content');
    });

    it('should apply flex column layout', () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);
      const header = screen.getByTestId('card-header');

      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('flex-col');
      expect(header).toHaveClass('space-y-1.5');
      expect(header).toHaveClass('p-6');
    });
  });

  describe('CardTitle', () => {
    it('should render correctly', () => {
      render(<CardTitle data-testid="card-title">Title Text</CardTitle>);
      const title = screen.getByTestId('card-title');

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title Text');
    });

    it('should apply title styles', () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>);
      const title = screen.getByTestId('card-title');

      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('leading-none');
      expect(title).toHaveClass('tracking-tight');
    });
  });

  describe('CardDescription', () => {
    it('should render correctly', () => {
      render(<CardDescription data-testid="card-description">Description</CardDescription>);
      const description = screen.getByTestId('card-description');

      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Description');
    });

    it('should apply description styles', () => {
      render(<CardDescription data-testid="card-description">Desc</CardDescription>);
      const description = screen.getByTestId('card-description');

      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('should render correctly', () => {
      render(<CardContent data-testid="card-content">Content Text</CardContent>);
      const content = screen.getByTestId('card-content');

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content Text');
    });

    it('should apply content padding', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);
      const content = screen.getByTestId('card-content');

      expect(content).toHaveClass('p-6');
      expect(content).toHaveClass('pt-0');
    });
  });

  describe('CardFooter', () => {
    it('should render correctly', () => {
      render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);
      const footer = screen.getByTestId('card-footer');

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer Content');
    });

    it('should apply footer flex layout', () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
      const footer = screen.getByTestId('card-footer');

      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('items-center');
      expect(footer).toHaveClass('p-6');
      expect(footer).toHaveClass('pt-0');
    });
  });

  describe('Complete Card Composition', () => {
    it('should render all card parts together', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Main content goes here</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      );

      const card = screen.getByTestId('full-card');
      expect(card).toBeInTheDocument();

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Main content goes here')).toBeInTheDocument();
      expect(screen.getByText('Footer actions')).toBeInTheDocument();
    });

    it('should work with nested interactive elements', () => {
      render(
        <Card data-testid="interactive-card">
          <CardHeader>
            <CardTitle>Question</CardTitle>
          </CardHeader>
          <CardContent>
            <button>Answer</button>
          </CardContent>
        </Card>
      );

      const button = screen.getByRole('button', { name: /answer/i });
      expect(button).toBeInTheDocument();
    });

    it('should support custom attributes', () => {
      render(
        <Card data-testid="card" aria-label="Information card" role="article">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('aria-label', 'Information card');
      expect(card).toHaveAttribute('role', 'article');
    });
  });

  describe('Styling Flexibility', () => {
    it('should allow overriding default styles with custom classes', () => {
      render(
        <Card className="border-none bg-red-500" data-testid="custom-card">
          Custom Card
        </Card>
      );
      const card = screen.getByTestId('custom-card');

      // Custom classes should be present
      expect(card).toHaveClass('bg-red-500');
      expect(card).toHaveClass('border-none');
    });

    it('should support all card parts with custom styles', () => {
      render(
        <Card data-testid="styled-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
            <CardDescription className="custom-description">Description</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Content</CardContent>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Title').closest('div')).toHaveClass('custom-title');
      expect(screen.getByText('Description').closest('div')).toHaveClass('custom-description');
      expect(screen.getByText('Content').closest('div')).toHaveClass('custom-content');
      expect(screen.getByText('Footer').closest('div')).toHaveClass('custom-footer');
    });
  });
});
