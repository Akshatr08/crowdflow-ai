import React, { useState } from 'react';
import { mapConfig } from '../constants/mapConfig';

const StadiumMap = ({ zones = [] }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  const getOverlayStyle = (density) => {
    switch(density) {
      case 'high': return { bg: 'var(--accent-danger)', opacity: 0.8, pulse: true };
      case 'medium': return { bg: 'var(--accent-warning)', opacity: 0.6, pulse: false };
      case 'low': 
      default: return { bg: 'var(--accent-success)', opacity: 0.3, pulse: false };
    }
  };

  return (
    <div className="glass-card" style={{ height: '100%', position: 'relative', overflow: 'hidden', padding: 0 }}>
      {/* HUD Header */}
      <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Live Sector Topography</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interactive tactical map. Select a node.</p>
      </div>
      
      {/* Legend */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 10, display: 'flex', gap: '12px', background: 'var(--bg-card-inner)', padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-main)', textTransform: 'uppercase', fontWeight: 600 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-success)' }}></div> Clear
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-main)', textTransform: 'uppercase', fontWeight: 600 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-warning)' }}></div> Mod
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-main)', textTransform: 'uppercase', fontWeight: 600 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-danger)' }} className="animate-pulse"></div> Max
        </div>
      </div>

      {/* The Map Arena */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, var(--bg-card) 0%, transparent 70%)' }}>
        
        {/* Playfield Center */}
        <div style={{ 
          position: 'absolute', 
          width: '30%', 
          height: '42%', 
          background: 'var(--bg-card-inner)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '16px',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)'
        }} />

        {/* Dynamic Nodes */}
        {zones.map(zone => {
          const conf = mapConfig[zone.id];
          if (!conf) return null;
          
          const styleConfig = getOverlayStyle(zone.density);
          const isSelected = selectedZone?.id === zone.id;

          return (
            <div 
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
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
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                zIndex: isSelected ? 5 : 2
              }}
            >
               {/* Internal colored node representing density */}
               <div className={styleConfig.pulse ? "animate-pulse" : ""} style={{
                 position: 'absolute',
                 inset: 2,
                 backgroundColor: styleConfig.bg,
                 opacity: styleConfig.opacity,
                 borderRadius: conf.radius ? 'inherit' : '4px',
                 transition: 'background-color 1s ease, opacity 1s ease'
               }} />
               <span style={{ position: 'relative', zIndex: 2, fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)', opacity: 0.7 }}>
                 {conf.labelRef}
               </span>
            </div>
          );
        })}

        {/* Detailed Inspector Overlay */}
        {selectedZone && (
          <div className="animate-fade-in glass-card" style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            width: '280px',
            padding: '20px',
            zIndex: 20,
            background: 'var(--bg-card-inner)',
            borderLeft: `4px solid ${selectedZone.density === 'high' ? 'var(--accent-danger)' : selectedZone.density === 'medium' ? 'var(--accent-warning)' : 'var(--accent-success)'}`
          }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedZone.name}</h4>
                <button onClick={() => setSelectedZone(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current State:</span>
                 <span style={{ 
                   color: selectedZone.density === 'high' ? 'var(--accent-danger)' : selectedZone.density === 'medium' ? 'var(--accent-warning)' : 'var(--accent-success)', 
                   fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' 
                 }}>
                   {selectedZone.density} VOLUME
                 </span>
               </div>
               
               <div style={{ width: '100%', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: selectedZone.density === 'high' ? 'var(--accent-danger)' : selectedZone.density === 'medium' ? 'var(--accent-warning)' : 'var(--accent-success)',
                    width: selectedZone.density === 'high' ? '92%' : selectedZone.density === 'medium' ? '55%' : '15%',
                    transition: 'width 1s ease'
                  }} />
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Active Nodes: {Math.floor(Math.random() * 50 + 10)}</span>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Staff Assigned: {selectedZone.density === 'high' ? 12 : 3}</span>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StadiumMap;
