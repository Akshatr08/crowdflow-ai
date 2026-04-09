import { simulatedStalls, simulatedZones } from '../constants/mockData';

// Secure Environment Variable Binding
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Sanitize user input for chat messages.
 * Allows natural language (spaces, apostrophes, question marks, punctuation)
 * while blocking script injection characters.
 */
export const sanitizeInput = (input) => {
  // Strip HTML/script tags and dangerous chars, but preserve NLP-friendly punctuation
  return input
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/[`${}\\]/g, '')          // strip template literals and shell chars
    .replace(/[\x00-\x1F\x7F]/g, '')   // strip control characters
    .trim()
    .slice(0, 500);                     // enforce max length
};

/**
 * Create a mock zone state for offline fallback.
 */
const mockZonesFallback = () => {
  const densities = ['low', 'medium', 'high'];
  return simulatedZones.map(z => ({
    ...z,
    density: Math.random() > 0.6 ? densities[Math.floor(Math.random() * densities.length)] : z.density
  }));
};

/**
 * Create a mock stall state for offline fallback.
 */
const mockStallsFallback = () => {
  const densities = ['low', 'medium', 'high'];
  const densityPenalty = { low: 0, medium: 5, high: 12 };
  return simulatedStalls.map(stall => {
    const d = densities[Math.floor(Math.random() * densities.length)];
    const mult = d === 'high' ? 4.5 : d === 'medium' ? 2.5 : 1;
    const wait = Math.floor(stall.baseTime * mult) + Math.floor(Math.random() * 3);
    const score = wait + (stall.distance / 20) + densityPenalty[d];
    return { ...stall, density: d, waitTime: wait, score: Math.round(score) };
  });
};

export const fetchLiveZones = async (signal) => {
  try {
    const res = await fetch(`${API_URL}/zones`, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return [];
    return mockZonesFallback();
  }
};

export const fetchLiveStalls = async (signal) => {
  try {
    const res = await fetch(`${API_URL}/stalls`, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return [];
    return mockStallsFallback();
  }
};

/**
 * Send a chat message. Returns an async generator that yields text chunks.
 * Falls back to local NLP logic if the server is unreachable.
 */
export async function* fetchChatStream(message, zones, stalls) {
  const cleanMessage = sanitizeInput(message);

  const context = JSON.stringify({
    zones: zones.map(z => ({ id: z.id, name: z.name, density: z.density })),
    stalls: stalls.map(s => ({ id: s.id, name: s.name, waitTime: s.waitTime, density: s.density }))
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: cleanMessage, context }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.chunk) yield json.chunk;
            if (json.done || json.error) return;
          } catch {
            // malformed SSE chunk, skip
          }
        }
      }
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      yield '(Request timed out. Please try again.)';
      return;
    }

    // --- Offline Local NLP Fallback ---
    const request = message.toLowerCase();
    const sortedByWait = [...stalls].sort((a, b) => a.waitTime - b.waitTime);
    const bestFood = sortedByWait[0];
    const worstFood = sortedByWait[sortedByWait.length - 1];
    const highDensity = zones.filter(z => z.density === 'high');
    const clearRegions = zones.filter(z => z.density === 'low');

    if (request.includes('food') || request.includes('eat') || request.includes('stall') || request.includes('fast')) {
      let msg = `(Offline Mode) Fastest option: **${bestFood?.name}** — ${bestFood?.waitTime} min wait.`;
      if (worstFood) msg += ` Avoid **${worstFood.name}** (${worstFood.waitTime} min backlog).`;
      yield msg;
      return;
    }

    if (request.includes('crowd') || request.includes('density') || request.includes('busy') || request.includes('route')) {
      let msg = `(Offline Mode) Scanning ${zones.length} active zones. `;
      if (highDensity.length > 0) {
        msg += `**ALERT**: Congestion at ${highDensity.map(h => h.name).join(', ')}. `;
      }
      if (clearRegions.length > 0) {
        msg += `Clear routes: ${clearRegions.map(h => h.name).join(', ')}.`;
      }
      yield msg;
      return;
    }

    yield `(Offline Mode) Monitoring ${zones.length} zones and ${stalls.length} concession points. Ask about "stalls", "food" wait times, or "crowd" density.`;
  }
}

export { API_URL, mockZonesFallback, mockStallsFallback };
