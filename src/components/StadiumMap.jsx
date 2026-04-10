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
 * 
 * Architectural SVG schematic representing the stadium sectors and pitch.
 * Visualizes real-time crowd saturation and risk distribution using 
 * deterministic data tokens.
 */
const StadiumMap = ({ zones = [] }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  const handleSelect = useCallback((zone) => setSelectedZone(zone), []);
  const handleClose = useCallback(() => setSelectedZone(null), []);

  return (
    <div
      className="glass-card"
      style={{ height: '100%', position: 'relative', overflow: 'hidden', padding: 0 }}
    >
      {/* HUD Header */}
      <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
        <h3 className="section-title">Architectural Sector Topography</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tactical Command View — click a stand to inspect.
        </p>
      </div>

      {/* Legend */}
      <div
        role="img"
        aria-label="Density Legend"
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

      {/* SVG Arena */}
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(circle at center, var(--bg-card) 0%, transparent 80%)'
        }}
        onClick={(e) => { if (e.target.tagName !== 'path') handleClose(); }}
      >
        {/* Field / Pitch Markings */}
        <ellipse cx="400" cy="300" rx="230" ry="160" fill="var(--bg-card-inner)" stroke="var(--border-subtle)" strokeWidth="1" />
        <circle cx="400" cy="300" r="40" fill="none" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="170" y1="300" x2="630" y2="300" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Stadium Stands (Paths) */}
        {zones.map(zone => {
          const conf = mapConfig[zone.id];
          if (!conf) return null;

          const styleConf = DENSITY_STYLES[zone.density] ?? DENSITY_STYLES.low;
          const isSelected = selectedZone?.id === zone.id;

          return (
            <g key={zone.id} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleSelect(zone); }}>
              <path
                d={conf.path}
                fill={styleConf.bg}
                fillOpacity={isSelected ? 0.9 : styleConf.opacity}
                stroke={isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}
                strokeWidth={isSelected ? 3 : 1}
                className={styleConf.pulse ? 'animate-pulse' : ''}
                style={{
                  transition: 'all 0.4s ease',
                  filter: isSelected ? 'drop-shadow(0 0 10px rgba(56,189,248,0.5))' : 'none'
                }}
              />
              <text
                x={conf.labelPos.x}
                y={conf.labelPos.y}
                textAnchor="middle"
                style={{
                  fill: 'var(--text-main)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                  opacity: 0.8
                }}
              >
                {conf.labelRef}
              </text>
            </g>
          );
        })}
      </svg>

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
  );
};

export default React.memo(StadiumMap);
