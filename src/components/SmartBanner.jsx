import React, { useState, useEffect, useRef } from 'react';

const BANNER_TYPES = {
  evac:    { color: 'var(--accent-danger)',  border: 'var(--accent-danger)',  bg: 'rgba(239,68,68,0.12)'  },
  warning: { color: 'var(--accent-danger)',  border: 'var(--accent-danger)',  bg: 'rgba(239,68,68,0.10)'  },
  route:   { color: 'var(--accent-primary)', border: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.10)' },
  stable:  { color: 'var(--accent-success)', border: 'var(--border-subtle)',  bg: 'var(--bg-card-inner)'  },
};

const buildSuggestion = (zones, stalls, evacMode) => {
  if (evacMode) {
    return {
      type: 'evac',
      icon: '🚨',
      text: 'PROTOCOL OMEGA ACTIVE: Emergency pathfinding engaged. Proceed to nearest structural exit immediately.'
    };
  }

  const crowdedZones = zones.filter(z => z.density === 'high');
  const fastestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];

  if (crowdedZones.length > 0) {
    return {
      type: 'warning',
      icon: '⚠',
      text: `CONGESTION ALERT: ${crowdedZones.map(z => z.name).join(', ')} approaching critical capacity. Reroute crowd flow now.`
    };
  }

  if (fastestStall) {
    return {
      type: 'route',
      icon: '✦',
      text: `PROACTIVE ROUTING: Lowest wait time detected at ${fastestStall.name} — ${fastestStall.waitTime} min queue. Recommend directing visitors.`
    };
  }

  return {
    type: 'stable',
    icon: '●',
    text: 'SYSTEM STABLE: All physical traffic nodes operating within acceptable baseline variance.'
  };
};

const SmartBanner = ({ zones = [], stalls = [], evacMode, connected }) => {
  const [suggestion, setSuggestion] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const update = () => setSuggestion(buildSuggestion(zones, stalls, evacMode));

    update(); // immediate on data change

    clearInterval(intervalRef.current);
    if (!evacMode) {
      intervalRef.current = setInterval(update, 7000);
    }

    return () => clearInterval(intervalRef.current);
  }, [zones, stalls, evacMode]);

  if (!suggestion) return null;

  const style = BANNER_TYPES[suggestion.type] ?? BANNER_TYPES.stable;

  return (
    <div
      role="status"
      aria-live={suggestion.type === 'evac' || suggestion.type === 'warning' ? 'assertive' : 'polite'}
      aria-label="System banner notification"
      aria-atomic="true"
      className="animate-fade-in"
      style={{
        background: style.bg,
        borderBottom: `1px solid ${style.border}`,
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.83rem',
        fontWeight: 600,
        color: 'var(--text-main)',
        letterSpacing: '0.2px',
        position: 'relative',
        zIndex: 100,
        transition: 'background 0.4s ease'
      }}
    >
      <div
        aria-hidden="true"
        style={{ width: 8, height: 8, borderRadius: '50%', background: style.color, flexShrink: 0 }}
        className={suggestion.type !== 'stable' ? 'animate-pulse' : ''}
      />
      <span aria-hidden="true" style={{ fontSize: '0.9rem' }}>{suggestion.icon}</span>
      <span style={{ fontFamily: 'monospace', color: style.color }}>{suggestion.text}</span>

      {/* Connection badge */}
      {connected === false && (
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--accent-warning)', fontFamily: 'monospace', border: '1px solid var(--accent-warning)', padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>
          OFFLINE MODE
        </span>
      )}
    </div>
  );
};

export default SmartBanner;
