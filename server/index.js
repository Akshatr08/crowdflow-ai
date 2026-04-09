import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initialZones, initialStalls } from './dataStructs.js';

dotenv.config();

const app = express();

// ==========================================
// ENTERPRISE SECURITY MIDDLEWARE LAYER
// ==========================================

// 1. Helmet: Enforces strict HTTP security headers (HSTS, No-Sniff, XSS protections)
app.use(helmet());

// 2. Strict CORS Strategy: Rejects unauthorized cross-origin requests immediately
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
}));

app.use(express.json());

// 3. DDOS Protection: Global Rate Limiting across all API routes (15 mins, 500 requests max)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// 4. API Billing Protection: Strict LLM Chat Rate Limiter (Max 10 messages per minute)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: "Security enforcement: Rate limit exceeded. Please wait 60 seconds before issuing commands." }
});

// ==========================================
// SIMULATION ENGINE (HARDWARE MODELING)
// ==========================================

let zones = [...initialZones];
let stalls = [...initialStalls];

// Background Node Topological Tick Processor
setInterval(() => {
  const densities = ['low', 'medium', 'high'];
  zones = zones.map(z => ({
    ...z,
    density: Math.random() > 0.7 ? densities[Math.floor(Math.random() * densities.length)] : z.density
  }));
}, 2500);

// Background Concession Matrix Interpolation
setInterval(() => {
  const densities = ['low', 'medium', 'high'];
  const densityPenalty = { 'low': 0, 'medium': 5, 'high': 12 };
  
  stalls = stalls.map(stall => {
    const d = densities[Math.floor(Math.random() * densities.length)];
    let mult = 1; if(d==='medium') mult=2.5; if(d==='high') mult=4.5;
    let wait = Math.floor(stall.baseTime * mult) + Math.floor(Math.random()*3);
    let s = wait + (stall.distance / 20) + densityPenalty[d];
    return { ...stall, density: d, waitTime: wait, score: Math.round(s) };
  });
}, 4000);

// ==========================================
// REST PIPELINES
// ==========================================

app.get('/api/zones', (req, res) => res.json(zones));
app.get('/api/stalls', (req, res) => res.json(stalls));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return res.status(400).json({ error: "Missing authentic GEMINI_API_KEY. Operating in offline failsafe."});
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an enterprise AI operator. Provide concise, action-oriented tactical answers.
    --- LIVE SYSTEM CONTEXT ---
    ${context}
    --- OPERATOR QUERY: ${message}`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
    
  } catch (err) {
    console.error("Critical AI Processing Error:", err);
    res.status(500).json({ error: "AI Pipeline Fault: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Enterprise Backend Layer routing secure traffic on port ${PORT}`);
});
