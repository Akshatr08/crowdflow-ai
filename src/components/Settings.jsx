import React, { useState } from 'react';

const Settings = ({ theme, toggleTheme }) => {
  const [threshold, setThreshold] = useState(80);
  const [autoRoute, setAutoRoute] = useState(true);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>System Preferences</h2>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Theme Settings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Appearance Mode</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Switch between JavaScript Dark and Light variants.</p>
          </div>
          <button onClick={toggleTheme} className="btn-primary" style={{ padding: '8px 16px' }}>
            {theme === 'dark' ? 'Enable Light Mode' : 'Enable Dark Mode'}
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

        {/* Threshold Logic */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ color: 'var(--text-main)' }}>Congestion Alert Threshold</h4>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{threshold}%</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Nodes triggering an alert when capacity is breached.</p>
          <input 
            type="range" 
            min="50" max="100" 
            value={threshold} 
            onChange={(e) => setThreshold(e.target.value)} 
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

        {/* Auto Route Logic */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Auto-Suggest Routes</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enable AI to calculate best mathematical routes dynamically.</p>
          </div>
          <button 
            onClick={() => setAutoRoute(!autoRoute)} 
            className="btn-primary" 
            style={{ 
              background: autoRoute ? 'var(--accent-primary)' : 'var(--bg-card-inner)', 
              color: autoRoute ? '#000' : 'var(--text-main)',
              border: `1px solid ${autoRoute ? 'var(--accent-primary)' : 'var(--border-subtle)'}`
            }}
          >
            {autoRoute ? 'ON' : 'OFF'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
