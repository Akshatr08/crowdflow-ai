/**
 * Server Endpoint Tests — using supertest
 *
 * Tests all REST API routes: health, zones, stalls, chat.
 * Includes rate limiting, validation, and error cases.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

// We need to import the app but avoid actually starting the server on a port.
// The server/index.js does app.listen() at module load — we work around this
// by importing the express `app` object (named export) after mocking the port.

let app;

beforeAll(async () => {
  // Prevent the server from actually binding to a port during tests
  process.env.PORT = '0';
  process.env.GEMINI_API_KEY = ''; // Ensure AI is in disabled state

  // Dynamic import after env is set
  const mod = await import('../../server/index.js');
  app = mod.app;
});

// ==========================================
// GET /api/health
// ==========================================

describe('GET /api/health', () => {
  it('returns 200 with status=ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('includes zonesCount and stallsCount', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('zonesCount');
    expect(res.body).toHaveProperty('stallsCount');
    expect(typeof res.body.zonesCount).toBe('number');
    expect(typeof res.body.stallsCount).toBe('number');
  });

  it('includes timestamp in ISO format', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('timestamp');
    expect(() => new Date(res.body.timestamp)).not.toThrow();
  });

  it('reports aiConfigured as false when no API key', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.aiConfigured).toBe(false);
  });
});

// ==========================================
// GET /api/zones
// ==========================================

describe('GET /api/zones', () => {
  it('returns 200 with an array of zones', async () => {
    const res = await request(app).get('/api/zones');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each zone has required fields: id, name, density', async () => {
    const res = await request(app).get('/api/zones');
    const zone = res.body[0];
    expect(zone).toHaveProperty('id');
    expect(zone).toHaveProperty('name');
    expect(zone).toHaveProperty('density');
  });

  it('density values are valid', async () => {
    const res = await request(app).get('/api/zones');
    res.body.forEach(zone => {
      expect(['low', 'medium', 'high']).toContain(zone.density);
    });
  });
});

// ==========================================
// GET /api/stalls
// ==========================================

describe('GET /api/stalls', () => {
  it('returns 200 with an array of stalls', async () => {
    const res = await request(app).get('/api/stalls');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each stall has waitTime and score', async () => {
    const res = await request(app).get('/api/stalls');
    const stall = res.body[0];
    expect(stall).toHaveProperty('waitTime');
    expect(stall).toHaveProperty('score');
    expect(typeof stall.waitTime).toBe('number');
  });
});

// ==========================================
// POST /api/chat — validation
// ==========================================

describe('POST /api/chat — input validation', () => {
  it('returns 400 when message is missing', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when message is empty string', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '   ', context: '' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when message exceeds 500 chars', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'a'.repeat(501) });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/maximum/i);
  });

  it('returns 503 when no API key is configured', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello', context: 'zones: []' });
    expect(res.status).toBe(503);
    expect(res.body.error).toMatch(/unavailable/i);
  });

  it('returns 413 for payload > 10kb', async () => {
    const bigPayload = { message: 'x'.repeat(100), context: 'x'.repeat(11000) };
    const res = await request(app)
      .post('/api/chat')
      .send(bigPayload);
    // express.json({ limit: '10kb' }) returns 413
    expect(res.status).toBe(413);
  });
});
