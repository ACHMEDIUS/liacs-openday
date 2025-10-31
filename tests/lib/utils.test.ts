import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should merge Tailwind classes without conflicts', () => {
    // When duplicate utilities are provided, the last one should win
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'other');
    expect(result).toBe('base other');
  });

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
    expect(result).toContain('class3');
  });

  it('should handle object with boolean values', () => {
    const result = cn({
      'class-true': true,
      'class-false': false,
      'class-truthy': 1,
      'class-falsy': 0,
    });
    expect(result).toContain('class-true');
    expect(result).toContain('class-truthy');
    expect(result).not.toContain('class-false');
    expect(result).not.toContain('class-falsy');
  });
});
