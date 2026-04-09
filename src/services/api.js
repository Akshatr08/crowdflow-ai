import { simulatedStalls, simulatedZones } from '../constants/mockData';

// Secure Environment Variable Binding
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchLiveZones = async () => {
  try {
    const res = await fetch(`${API_URL}/zones`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    // Fallback: Standalone Mock Mode allows execution without local backend
    const densities = ['low', 'medium', 'high'];
    return simulatedZones.map(z => ({
      ...z,
      density: Math.random() > 0.6 ? densities[Math.floor(Math.random() * densities.length)] : z.density
    }));
  }
};

export const fetchLiveStalls = async () => {
  try {
    const res = await fetch(`${API_URL}/stalls`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    // Fallback: Standalone Mock Mode allows execution without local backend
    const densities = ['low', 'medium', 'high'];
    const densityPenalty = { 'low': 0, 'medium': 5, 'high': 12 };
    return simulatedStalls.map(stall => {
      const d = densities[Math.floor(Math.random() * densities.length)];
      let mult = 1; if(d==='medium') mult=2.5; if(d==='high') mult=4.5;
      let wait = Math.floor(stall.baseTime * mult) + Math.floor(Math.random()*3);
      let s = wait + (stall.distance / 20) + densityPenalty[d];
      return { ...stall, density: d, waitTime: wait, score: Math.round(s) };
    });
  }
};

export const fetchChatResponse = async (message, zones, stalls) => {
  try {
    const context = `
      Active Stadium Zones: ${JSON.stringify(zones)}
      Active Concession Stalls: ${JSON.stringify(stalls)}
    `;

    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });
    
    if (!res.ok) {
        throw new Error('Backend unlinked or Gemini Key missing.');
    }
    const data = await res.json();
    return data.reply;
  } catch (err) {
    // Robust local fallback NLP allowing AI to work offline
    const request = message.toLowerCase();
    
    // Mathematical analysis of stalls
    const bestFood = [...stalls].sort((a,b) => a.waitTime - b.waitTime)[0];
    const worstFood = [...stalls].sort((a,b) => b.waitTime - a.waitTime)[0];
    
    // Mathematical analysis of zones
    const highDensity = zones.filter(z => z.density === 'high');
    const clearRegions = zones.filter(z => z.density === 'low');

    if (request.includes('food') || request.includes('eat') || request.includes('stall') || request.includes('fast')) {
        let msg = `(Offline Logic) Based on deterministic routing calculations, your fastest active option is **${bestFood?.name}** with a ${bestFood?.waitTime} minute wait limit. `;
        if (worstFood) msg += `I strongly advise actively routing individuals away from ${worstFood.name} as it experiences critical ${worstFood.waitTime}m bottlenecks.`;
        return msg;
    }
    
    if (request.includes('crowd') || request.includes('density') || request.includes('busy') || request.includes('route')) {
        let msg = `(Offline Logic) Analyzing current topological grids across ${zones.length} active zones. `;
        if(highDensity.length > 0) {
            msg += `**CRITICAL ALERT**: Immediate congestion detected at ${highDensity.map(h => h.name).join(', ')}. Disperse traffic immediately. `;
        }
        if(clearRegions.length > 0) {
            msg += `Safe routes are available through ${clearRegions.map(h => h.name).join(' and ')}.`;
        }
        return msg;
    }

    return `(Offline Parameter Activated) Local AI routines are parsing ${zones.length} zones and ${stalls.length} concession points. Ask me about active "stalls", shortest "food" wait times, or current "crowd" density routes for a diagnostic breakdown.`;
  }
};
