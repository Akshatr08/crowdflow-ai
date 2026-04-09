import React, { useMemo } from 'react';

const Hardware = ({ zones = [] }) => {
  // Ecological Logic Computation
  const hvacPowerLoad = useMemo(() => {
    if (zones.length === 0) return 0;
    // Map heavy density directly to massive Megawatt HVAC power drains locally
    let load = 0;
    zones.forEach(z => {
      if (z.density === 'high') load += 8.2;
      if (z.density === 'medium') load += 3.4;
      if (z.density === 'low') load += 1.1;
    });
    return load.toFixed(1);
  }, [zones]);
  
  const highDensityCount = zones.filter(z => z.density === 'high').length;
  const systemStress = Math.floor((highDensityCount / zones.length) * 100) || 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>IoT Environmental Command</h2>
      
      {/* Power Ecological Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <p style={{ color: 'var(--text-muted)' }}>Live HVAC MegaWatt Draw</p>
                 <span style={{ padding: '2px 8px', background: systemStress > 50 ? 'var(--accent-danger)' : 'var(--accent-primary)', color: '#000', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px' }}>DYNAMIC</span>
              </div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontFamily: 'monospace' }}>{hvacPowerLoad} MW</h3>
              <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>Automated topological throttling active.</p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Thermal Load Capacity</p>
              <h3 style={{ color: systemStress > 50 ? 'var(--accent-danger)' : 'var(--accent-warning)', fontSize: '2.5rem' }}>{systemStress}%</h3>
              <div style={{ width: '100%', height: '4px', background: 'var(--bg-card-inner)', borderRadius: '2px', overflow: 'hidden' }}>
                 <div style={{ width: `${systemStress}%`, height: '100%', background: systemStress > 50 ? 'var(--accent-danger)' : 'var(--accent-warning)', transition: 'width 1s ease' }} />
              </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Ecological Savings</p>
              <h3 style={{ color: 'var(--accent-success)', fontSize: '2.5rem', fontFamily: 'monospace' }}>14.2%</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Saved via algorithmic low-density power shutdown parameters.</p>
          </div>
      </div>
    </div>
  );
};

export default Hardware;
