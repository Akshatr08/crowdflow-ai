import React, { useState, useEffect } from 'react';

const CctvFeed = () => {
  const [pos, setPos] = useState({ x: 20, y: 30, w: 40, h: 50 });

  // Simulate scanning movement
  useEffect(() => {
    const itv = setInterval(() => {
      setPos({
        x: Math.random() * 60 + 10,
        y: Math.random() * 40 + 10,
        w: Math.random() * 20 + 20,
        h: Math.random() * 30 + 30
      });
    }, 2000);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      {/* Feed Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card-inner)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 8, height: 8, background: 'var(--accent-danger)', borderRadius: '50%' }} className="animate-pulse" />
          CAM-04 [LIVE]
        </h3>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>AI_TRACKING: ONLINE</span>
      </div>

      {/* Camera Viewport */}
      <div style={{ flex: 1, position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>
        
        {/* Grain / Noise Simulation */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', pointerEvents: 'none' }} />
        
        {/* CRT Scanline */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', animation: 'scanline 4s linear infinite', boxShadow: '0 0 10px rgba(255,255,255,0.2)', pointerEvents: 'none' }} />

        {/* Ambient Dark Content (Faux silhouettes) */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10%', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px', opacity: 0.3, filter: 'blur(3px)' }}>
          <div style={{ width: '40px', height: '120px', background: 'var(--text-muted)', borderRadius: '20px 20px 0 0' }} />
          <div style={{ width: '50px', height: '140px', background: 'var(--text-muted)', borderRadius: '25px 25px 0 0' }} />
          <div style={{ width: '35px', height: '110px', background: 'var(--text-muted)', borderRadius: '15px 15px 0 0' }} />
        </div>

        {/* AI Bounding Box */}
        <div style={{
          position: 'absolute',
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${pos.w}%`,
          height: `${pos.h}%`,
          border: '1px solid var(--accent-success)',
          backgroundColor: 'rgba(52, 211, 153, 0.05)',
          transition: 'all 2s cubic-bezier(0.25, 1, 0.5, 1)',
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 10px rgba(52, 211, 153, 0.2), 0 0 10px rgba(52, 211, 153, 0.2)'
        }}>
           <div style={{ position: 'absolute', top: '-20px', left: '-1px', background: 'var(--accent-success)', color: '#000', fontSize: '0.65rem', padding: '2px 6px', fontWeight: 'bold', fontFamily: 'monospace' }}>
             PERSON [98%]
           </div>
           {/* Corner ticks */}
           <div style={{ position:'absolute', top:0, left:0, width:10, height:10, borderTop:'2px solid var(--accent-success)', borderLeft:'2px solid var(--accent-success)' }} />
           <div style={{ position:'absolute', top:0, right:0, width:10, height:10, borderTop:'2px solid var(--accent-success)', borderRight:'2px solid var(--accent-success)' }} />
           <div style={{ position:'absolute', bottom:0, left:0, width:10, height:10, borderBottom:'2px solid var(--accent-success)', borderLeft:'2px solid var(--accent-success)' }} />
           <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderBottom:'2px solid var(--accent-success)', borderRight:'2px solid var(--accent-success)' }} />
        </div>

        <div style={{ position: 'absolute', bottom: '12px', left: '16px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {new Date().toISOString().replace('T', ' ').substring(0, 19)} Z
        </div>
      </div>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(10000%); }
        }
      `}</style>
    </div>
  );
};

export default CctvFeed;
