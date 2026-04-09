import React, { useMemo } from 'react';

// Fake daily array (24 integer values representing hourly crowd aggregates)
const dailyTraffic = [
  120, 150, 90, 80, 110, 200, 450, 800, 1200, 1500, 1450, 1300, 
  1250, 1600, 1800, 2100, 2400, 2800, 2600, 1900, 1100, 600, 300, 180
];

const Analytics = () => {
  // Real mathematical logic iterating on the fake data
  const metrics = useMemo(() => {
    const total = dailyTraffic.reduce((acc, curr) => acc + curr, 0);
    const average = Math.round(total / dailyTraffic.length);
    const peak = Math.max(...dailyTraffic);
    const peakHour = dailyTraffic.indexOf(peak); // 0-23 format
    
    // Convert military hour string
    const formatHour = (h) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 || 12;
      return `${hr} ${ampm}`;
    };

    return { total, average, peak, peakTime: formatHour(peakHour) };
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Network Analytics Overview</h2>
      
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Average Hourly Flow</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{metrics.average.toLocaleString()}</h3>
        </div>
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Peak Traffic</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--accent-warning)' }}>{metrics.peak.toLocaleString()}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>Occurred at {metrics.peakTime}</p>
        </div>
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Throughput</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{metrics.total.toLocaleString()}</h3>
        </div>
      </div>

      {/* Simulated Chart Bars */}
      <div className="glass-card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: 'auto' }}>24-Hour Network Load</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '4px' }}>
          {dailyTraffic.map((val, i) => {
            const heightPct = (val / metrics.peak) * 100;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${heightPct}%`, 
                  background: heightPct > 80 ? 'var(--accent-danger)' : heightPct > 50 ? 'var(--accent-warning)' : 'var(--accent-success)',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8
                }}></div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px' }}>
          <span>12 AM</span>
          <span>12 PM</span>
          <span>11 PM</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
