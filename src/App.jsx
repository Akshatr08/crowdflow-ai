import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="animate-pulse" style={{ color: 'var(--text-main)', fontSize: '2.5rem', letterSpacing: '4px' }}>
          CROWDFLOW <span style={{ color: 'var(--accent-primary)' }}>AI</span>
        </h1>
        <p className="animate-pulse" style={{ marginTop: '20px', color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '1px' }}>
          ▶ Analyzing crowd networks...
        </p>
        <p style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Calibrating layout algorithms and fetching sensor data
        </p>
        <div style={{ marginTop: '30px', width: '300px', height: '2px', background: 'var(--bg-card-inner)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent-primary)', width: '100%', animation: 'slideRight 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AppLayout />
    </div>
  );
}

export default App;
