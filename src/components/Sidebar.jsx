import React, { useId } from 'react';

const NAV_GROUPS = [
  {
    title: 'Strategic Overview',
    items: [
      { id: 'dashboard', label: 'Tactical Base' },
      { id: 'venues',    label: 'Venue Index' },
    ]
  },
  {
    title: 'Precision Intelligence',
    items: [
      { id: 'hardware',  label: 'Edge Sensors' },
      { id: 'analytics', label: 'Traffic Analysis' },
    ]
  },
  {
    title: 'System & Audit',
    items: [
      { id: 'audit',     label: 'Tactical Log' },
      { id: 'settings',  label: 'Parameters' },
    ]
  }
];

// Inline SVG icon set — aria-hidden on all (decorative)
const SvgIcon = ({ name }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
    venues:    <><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/></>,
    hardware:  <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
    analytics: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    audit:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {icons[name] ?? null}
    </svg>
  );
};

const Sidebar = ({ activeTab, setActiveTab, evacMode, setEvacMode, connected }) => {
  const navId = useId();

  return (
    <div
      role="navigation"
      aria-label="StadiumOS navigation"
      style={{
        width: '260px', height: '100vh',
        background: 'var(--bg-card)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 0'
      }}
    >
      {/* Brand */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h1
          className="shiny-text"
          style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}
        >
          CROWDFLOW<span style={{ color: 'var(--accent-primary)' }}>.AI</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Tactical Command Grid
        </p>
        {/* Connection status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <div
            aria-hidden="true"
            style={{ width: 6, height: 6, borderRadius: '50%', background: connected ? 'var(--accent-success)' : 'var(--accent-warning)' }}
            className={connected ? 'animate-pulse' : ''}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {connected ? 'Live stream connected' : 'Offline mode'}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav id={navId} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 12px', overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 style={{ 
              padding: '0 16px', 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              color: 'var(--text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              marginBottom: '4px'
            }}>
              {group.title}
            </h3>
            {group.items.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={tab.label}
                  className={`sidebar-nav-btn${isActive ? ' sidebar-nav-btn--active' : ''}`}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: isActive ? 'var(--bg-card-inner)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all var(--transition-fast)',
                    position: 'relative',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  {isActive && (
                    <div
                      aria-hidden="true"
                      style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', background: 'var(--accent-primary)', borderRadius: '0 4px 4px 0' }}
                    />
                  )}
                  <SvgIcon name={tab.id} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* EVAC Mode Toggle */}
      <div style={{ padding: '0 24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <button
          type="button"
          id="evac-toggle"
          onClick={() => setEvacMode(prev => !prev)}
          aria-pressed={evacMode}
          aria-label={evacMode ? 'Cancel evacuation mode' : 'Initiate evacuation mode'}
          className={evacMode ? 'evac-btn evac-btn--active animate-pulse' : 'evac-btn'}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            background: evacMode ? 'var(--accent-primary)' : 'var(--bg-main)',
            color: evacMode ? '#fff' : 'var(--text-main)',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${evacMode ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.5px'
          }}
        >
          <span aria-hidden="true">{evacMode ? '⚠' : '🚨'}</span>
          {evacMode ? 'CANCEL OVERRIDE' : 'INITIATE EVAC MODE'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
