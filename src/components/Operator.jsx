import React, { useState, useEffect } from 'react';

const Operator = () => {
  const [sessionTime, setSessionTime] = useState(0);

  // Real logic applying an active session clock to the operator
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div className="glass-card" style={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px', border: '2px solid var(--accent-primary)' }}>
          <span style={{ fontSize: '3rem' }}>👤</span>
        </div>
        <h2 className="shiny-text" style={{ fontSize: '1.4rem', marginBottom: '4px' }}>System Admin</h2>
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 'bold' }}>● ONLINE - LEVEL 4 CLEARANCE</p>
        
        <div style={{ width: '100%', marginTop: '24px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '12px' }}>SESSION METRICS</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-main)' }}>Active Time:</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(sessionTime)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-main)' }}>Overrides:</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operator;
