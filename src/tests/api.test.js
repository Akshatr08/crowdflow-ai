/**
 * Unit Tests — API Service
 *
 * Tests fetchLiveZones, fetchLiveStalls, and fetchChatStream
 * including server-down fallback to mock data.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchLiveZones, fetchLiveStalls, fetchChatStream } from '../services/api';

// ==========================================
// Fetch mock helpers
// ==========================================

/**
 * Makes global.fetch return a successful JSON response.
 */
const mockFetchOk = (data) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
    body: null,
  });
};

/**
 * Makes global.fetch throw a network error.
 */
const mockFetchFail = () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ==========================================
// fetchLiveZones
// ==========================================

describe('fetchLiveZones', () => {
  it('returns server data when fetch succeeds', async () => {
    const serverZones = [
      { id: 1, name: 'North Gate', density: 'high' },
      { id: 2, name: 'South Gate', density: 'low'  },
    ];
    mockFetchOk(serverZones);

    const result = await fetchLiveZones();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('North Gate');
  });

  it('falls back to mock data when server is down', async () => {
    mockFetchFail();
    const result = await fetchLiveZones();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    // Mock data always has a density field
    expect(result[0]).toHaveProperty('density');
  });

  it('returns empty array on AbortError', async () => {
    global.fetch = vi.fn().mockRejectedValue(
      Object.assign(new Error('Aborted'), { name: 'AbortError' })
    );
    const result = await fetchLiveZones();
    expect(result).toEqual([]);
  });

  it('falls back when response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    const result = await fetchLiveZones();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

// ==========================================
// fetchLiveStalls
// ==========================================

describe('fetchLiveStalls', () => {
  it('returns server data when fetch succeeds', async () => {
    const serverStalls = [
      { id: 1, name: 'Burger Stand', waitTime: 5, score: 8, density: 'low', baseTime: 3, distance: 80 },
    ];
    mockFetchOk(serverStalls);

    const result = await fetchLiveStalls();
    expect(result[0].name).toBe('Burger Stand');
  });

  it('generates valid fallback stalls when server is down', async () => {
    mockFetchFail();
    const result = await fetchLiveStalls();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Each stall must have required fields
    const stall = result[0];
    expect(stall).toHaveProperty('name');
    expect(stall).toHaveProperty('waitTime');
    expect(stall).toHaveProperty('score');
    expect(stall).toHaveProperty('density');
    expect(['low', 'medium', 'high']).toContain(stall.density);
  });

  it('returns empty array on AbortError', async () => {
    global.fetch = vi.fn().mockRejectedValue(
      Object.assign(new Error('Aborted'), { name: 'AbortError' })
    );
    const result = await fetchLiveStalls();
    expect(result).toEqual([]);
  });
});

// ==========================================
// fetchChatStream — Offline Fallback Logic
// ==========================================

const MOCK_ZONES = [
  { id: 1, name: 'North Gate', density: 'high' },
  { id: 2, name: 'South Gate', density: 'low'  },
];
const MOCK_STALLS = [
  { id: 1, name: 'Burger Hub',   waitTime: 12, density: 'medium' },
  { id: 2, name: 'Vegan Grill',  waitTime: 3,  density: 'low'    },
  { id: 3, name: 'Beer Station', waitTime: 20, density: 'high'   },
];

const collectStream = async (gen) => {
  let text = '';
  for await (const chunk of gen) {
    text += chunk;
  }
  return text;
};

describe('fetchChatStream — offline NLP fallback', () => {
  beforeEach(() => {
    // Force server to be unreachable
    mockFetchFail();
  });

  it('answers food queries with fastest stall name', async () => {
    const stream = fetchChatStream('What food is fastest?', MOCK_ZONES, MOCK_STALLS);
    const response = await collectStream(stream);
    // Vegan Grill has the lowest waitTime (3 min)
    expect(response).toContain('Vegan Grill');
  });

  it('answers crowd queries with high-density zone names', async () => {
    const stream = fetchChatStream('How busy is it?', MOCK_ZONES, MOCK_STALLS);
    const response = await collectStream(stream);
    expect(response).toContain('North Gate');
  });

  it('returns default help message for unknown queries', async () => {
    const stream = fetchChatStream('Hello there', MOCK_ZONES, MOCK_STALLS);
    const response = await collectStream(stream);
    expect(response).toContain('Offline Mode');
    expect(response).toContain(String(MOCK_ZONES.length));
  });

  it('stall query identifies worst stall too', async () => {
    const stream = fetchChatStream('tell me about stalls', MOCK_ZONES, MOCK_STALLS);
    const response = await collectStream(stream);
    // Should mention best stall
    expect(response).toContain('Vegan Grill');
  });

  it('handles empty zones and stalls gracefully', async () => {
    const stream = fetchChatStream('What is the crowd like?', [], []);
    const response = await collectStream(stream);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});
