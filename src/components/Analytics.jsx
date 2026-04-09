import React, { useMemo } from 'react';

/**
 * Deterministic staff count from zone ID — no Math.random()
 * Uses a stable hash: base of 4 + (zoneId * 3) % 8
 */
const deterministicStaffCount = (zoneId) => 4 + (zoneId * 3) % 8;

const STAFF_TYPES = ['SECURITY', 'JANITORIAL', 'MEDIC', 'CROWD CONTROL'];
const deterministicType = (zoneId, idx) => STAFF_TYPES[(zoneId + idx) % STAFF_TYPES.length];

const Analytics = ({ zones = [] }) => {

  // Fixed: no Math.random() inside useMemo — fully deterministic from zone state
  const dispatchManifest = useMemo(() => {
    if (zones.length === 0) return [];

    const congested = zones.filter(z => z.density === 'high');
    const stable = zones.filter(z => z.density === 'low');

    const logs = [];
    congested.forEach((c, ci) => {
      stable.slice(0, 2).forEach((s, si) => {
        logs.push({
          id: `${c.id}-${s.id}`,
          from: s.name,
          to: c.name,
          staffCount: deterministicStaffCount(c.id),
          type: deterministicType(c.id, ci + si)
        });
      });
    });

    return logs;
  }, [zones]);

  const utilizationPct = Math.min(100, dispatchManifest.length * 12);

  // Build zone density distribution for mini bar chart
  const densityCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    zones.forEach(z => { if (counts[z.density] !== undefined) counts[z.density]++; });
    return counts;
  }, [zones]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Resource Load Balancing Engine</h2>

      {/* Zone Density Overview Bar */}
      <div className="glass-card" style={{ padding: '16px 24px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Zone Density Distribution
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { label: 'Clear', key: 'low', color: 'var(--accent-success)' },
            { label: 'Moderate', key: 'medium', color: 'var(--accent-warning)' },
            { label: 'Critical', key: 'high', color: 'var(--accent-danger)' }
          ].map(({ label, key, color }) => (
            <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', color, fontWeight: 700 }}>{densityCounts[key]}</span>
              </div>
              <div
                role="meter"
                aria-label={`${label} zones: ${densityCounts[key]}`}
                aria-valuenow={densityCounts[key]}
                aria-valuemin={0}
                aria-valuemax={zones.length || 1}
                style={{ height: '6px', background: 'var(--bg-card-inner)', borderRadius: '3px', overflow: 'hidden' }}
              >
                <div style={{
                  height: '100%', background: color,
                  width: `${zones.length ? (densityCounts[key] / zones.length) * 100 : 0}%`,
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
        {/* Dispatch Feed */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            Active Personnel Deployments
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Re-routing inactive staff to congested zones in real-time.
          </p>

          <div
            role="log"
            aria-label="Personnel deployment log"
            aria-live="polite"
            style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {dispatchManifest.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                ✓ Network optimally balanced. No re-routes necessary.
              </div>
            ) : (
              dispatchManifest.map(deploy => (
                <div
                  key={deploy.id}
                  className="animate-fade-in"
                  style={{
                    display: 'flex', alignItems: 'center',
                    background: 'var(--bg-card-inner)',
                    padding: '14px 16px', borderRadius: '8px',
                    borderLeft: '3px solid var(--accent-primary)',
                    gap: '14px'
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: '1.1rem', flexShrink: 0 }}>🏃</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', margin: 0 }}>
                      Deploy {deploy.staffCount}× [{deploy.type}]
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                      From{' '}
                      <strong style={{ color: 'var(--accent-success)' }}>{deploy.from}</strong>
                      {' → '}
                      <strong style={{ color: 'var(--accent-danger)' }}>{deploy.to}</strong>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Utilization Ring */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
          <div
            role="meter"
            aria-label={`Global resource utilization: ${utilizationPct}%`}
            aria-valuenow={utilizationPct}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
              width: '160px', height: '160px', position: 'relative',
              borderRadius: '50%',
              background: `conic-gradient(var(--accent-primary) ${utilizationPct * 3.6}deg, var(--bg-card-inner) 0deg)`,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'var(--bg-card)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.6rem' }}>
                {utilizationPct}%
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Utilized
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Global Resource Utilization</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {dispatchManifest.length} active{' '}
              {dispatchManifest.length === 1 ? 'redeployment' : 'redeployments'} in progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
