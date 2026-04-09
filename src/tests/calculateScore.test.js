/**
 * Unit Tests — calculateScore & routing algorithm
 *
 * Tests the core scoring function used by the Recommendations engine
 * and the sanitizeInput utility from the API service.
 */

import { describe, it, expect } from 'vitest';
import { calculateScore } from '../utils/scoring';
import { sanitizeInput } from '../services/api';

// ==========================================
// calculateScore Tests
// ==========================================

describe('calculateScore', () => {
  it('applies correct weights: C×0.5, W×0.3, D×0.2', () => {
    // crowd=10, wait=10, dist=10  →  10*0.5 + 10*0.3 + 10*0.2 = 10
    expect(calculateScore(10, 10, 10)).toBeCloseTo(10);
  });

  it('returns 0 for all-zero inputs', () => {
    expect(calculateScore(0, 0, 0)).toBe(0);
  });

  it('crowd weight dominates (0.5) over distance weight (0.2)', () => {
    const highCrowd = calculateScore(10, 0, 0);   // 5
    const highDist  = calculateScore(0, 0, 10);   // 2
    expect(highCrowd).toBeGreaterThan(highDist);
  });

  it('lower score is better — VIP Lounge beats Burger Stand', () => {
    const burgerScore = calculateScore(8, 12, 5);  // ~8.6
    const vipScore    = calculateScore(1, 2, 8);   // ~2.7
    expect(vipScore).toBeLessThan(burgerScore);
  });

  it('sorts stall array correctly — lowest score first', () => {
    const nodes = [
      { name: 'Burger Hub',    crowd: 3, wait: 10, dist: 5 },
      { name: 'Vegan Grill',   crowd: 1, wait: 4,  dist: 3 },
      { name: 'North Concourse', crowd: 8, wait: 20, dist: 1 },
    ];
    const sorted = [...nodes].sort(
      (a, b) => calculateScore(a.crowd, a.wait, a.dist) - calculateScore(b.crowd, b.wait, b.dist)
    );
    expect(sorted[0].name).toBe('Vegan Grill');
    expect(sorted[sorted.length - 1].name).toBe('North Concourse');
  });

  it('handles decimal inputs without loss of precision', () => {
    const score = calculateScore(2.5, 3.5, 1.0);
    expect(score).toBeCloseTo(2.5 * 0.5 + 3.5 * 0.3 + 1.0 * 0.2);
  });
});

// ==========================================
// sanitizeInput Tests
// ==========================================

describe('sanitizeInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).not.toContain('<script>');
    expect(sanitizeInput('<b>bold</b>')).toBe('bold');
  });

  it('strips backticks and dollar signs (template injection)', () => {
    const result = sanitizeInput('`${process.env.SECRET}`');
    expect(result).not.toContain('`');
    expect(result).not.toContain('$');
  });

  it('strips backslashes', () => {
    expect(sanitizeInput('path\\to\\file')).not.toContain('\\');
  });

  it('preserves natural language — question marks, apostrophes, spaces', () => {
    const input = "What's the fastest stall right now?";
    const result = sanitizeInput(input);
    expect(result).toContain("What");
    expect(result).toContain("fastest");
    expect(result).toContain("?");
  });

  it('preserves exclamation marks and hyphens', () => {
    const result = sanitizeInput('Show me crowd data! North-east sector.');
    expect(result).toContain('!');
    expect(result).toContain('-');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });

  it('enforces 500 character max length', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long).length).toBe(500);
  });

  it('strips control characters (null bytes, etc.)', () => {
    const result = sanitizeInput('hello\x00world\x1F');
    expect(result).toBe('helloworld');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});
