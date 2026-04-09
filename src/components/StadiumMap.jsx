import React, { useState, useCallback } from 'react';
import { mapConfig } from '../constants/mapConfig';

const DENSITY_STYLES = {
  high:   { bg: 'var(--accent-danger)',  opacity: 0.8, pulse: true,  label: 'Critical' },
  medium: { bg: 'var(--accent-warning)', opacity: 0.6, pulse: false, label: 'Moderate' },
  low:    { bg: 'var(--accent-success)', opacity: 0.3, pulse: false, label: 'Clear'    },
};

// Deterministic node counts based on zone id (no Math.random in render)
const stableNodeCount = (zoneId) => 10 + (zoneId * 17) % 50;
const stableStaffCount = (density, zoneId) =>
  density === 'high' ? 8 + (zoneId % 5) : 2 + (zoneId % 3);

/**
 * @component StadiumMap
 * Accessibility: every zone node is a <button> with keyboard support.
 * Density is conveyed via colour + text label (not colour alone).
 */
const StadiumMap = ({ zones = [] }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  const handleSelect = useCallback((zone) => setSelectedZone(zone), []);
  const handleClose = useCallback(() => setSelectedZone(null), []);

  const handleKeyDown = useCallback((e, zone) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedZone(zone);
    }
  }, []);

  return (
    <div
      className="glass-card"
      style={{ height: '100%', position: 'relative', overflow: 'hidden', padding: 0 }}
    >
      {/* HUD Header */}
      <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Live Sector Topography</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Interactive tactical map — select a zone node.
        </p>
      </div>

      {/* Legend — colour + text label, not colour alone */}
      <div
        role="img"
        aria-label="Map legend: green = Clear, amber = Moderate, red = Critical"
        style={{
          position: 'absolute', top: 20, right: 24, zIndex: 10,
          display: 'flex', gap: '12px',
          background: 'var(--bg-card-inner)',
          padding: '8px 12px', borderRadius: '20px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {Object.entries(DENSITY_STYLES).reverse().map(([key, s]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.bg, flexShrink: 0 }} aria-hidden="true" />
            {s.label}
          </div>
        ))}
      </div>

      {/* Map Arena */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: 'radial-gradient(circle at center, var(--bg-card) 0%, transparent 70%)'
      }}>
        {/* Playfield centre */}
        <div style={{
          position: 'absolute', width: '30%', height: '42%',
          background: 'var(--bg-card-inner)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)'
        }} aria-hidden="true" />

        {/* Zone Nodes — fully keyboard-accessible buttons */}
        {zones.map(zone => {
          const conf = mapConfig[zone.id];
          if (!conf) return null;

          const styleConf = DENSITY_STYLES[zone.density] ?? DENSITY_STYLES.low;
          const isSelected = selectedZone?.id === zone.id;

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => handleSelect(zone)}
              onKeyDown={(e) => handleKeyDown(e, zone)}
              aria-pressed={isSelected}
              aria-label={`Zone: ${zone.name} — ${styleConf.label} density`}
              style={{
                position: 'absolute',
                ...conf.pos,
                borderRadius: conf.radius || '8px',
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-main)',
                transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                zIndex: isSelected ? 5 : 2,
                padding: 0,
                outline: 'none'
              }}
            >
              {/* Density colour overlay */}
              <div
                className={styleConf.pulse ? 'animate-pulse' : ''}
                style={{
                  position: 'absolute', inset: 2,
                  backgroundColor: styleConf.bg,
                  opacity: styleConf.opacity,
                  borderRadius: conf.radius ? 'inherit' : '4px',
                  transition: 'background-color 1s ease, opacity 1s ease'
                }}
                aria-hidden="true"
              />
              <span style={{ position: 'relative', zIndex: 2, fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-main)', opacity: 0.85, textAlign: 'center', lineHeight: 1.2, pointerEvents: 'none' }}>
                {conf.labelRef}
              </span>
            </button>
          );
        })}

        {/* Zone Inspector Panel */}
        {selectedZone && (() => {
          const styleConf = DENSITY_STYLES[selectedZone.density] ?? DENSITY_STYLES.low;
          return (
            <div
              className="animate-fade-in glass-card"
              role="dialog"
              aria-label={`Zone details: ${selectedZone.name}`}
              aria-modal="false"
              style={{
                position: 'absolute', bottom: '24px', left: '24px',
                width: '280px', padding: '20px', zIndex: 20,
                background: 'var(--bg-card-inner)',
                borderLeft: `4px solid ${styleConf.bg}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedZone.name}</h4>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close zone details"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '2px 6px', borderRadius: '4px' }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Density row — colour + text */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current State:</span>
                  <span style={{ color: styleConf.bg, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    {styleConf.label} ({selectedZone.density})
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  role="meter"
                  aria-label={`Capacity: ${selectedZone.density}`}
                  aria-valuenow={selectedZone.density === 'high' ? 92 : selectedZone.density === 'medium' ? 55 : 15}
                  aria-valuemin={0} aria-valuemax={100}
                  style={{ width: '100%', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}
                >
                  <div style={{
                    height: '100%',
                    background: styleConf.bg,
                    width: selectedZone.density === 'high' ? '92%' : selectedZone.density === 'medium' ? '55%' : '15%',
                    transition: 'width 1s ease'
                  }} />
                </div>

                {/* Stats — deterministic, not random */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Active nodes: {stableNodeCount(selectedZone.id)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Staff: {stableStaffCount(selectedZone.density, selectedZone.id)}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default React.memo(StadiumMap);
