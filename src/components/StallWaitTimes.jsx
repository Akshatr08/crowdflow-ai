import React, { useMemo } from 'react';

const StallWaitTimes = ({ stalls = [] }) => {
  const { listSorted, recommendation } = useMemo(() => {
    if (!stalls.length) return { listSorted: [], recommendation: null };
    
    const updatedStalls = [...stalls];
    updatedStalls.sort((a, b) => a.score - b.score);
    const best = updatedStalls[0];
    
    let explanation = `Optimal choice. `;
    if (best.density === 'low') explanation += `Benefits from low crowd density and `;
    else explanation += `Despite ${best.density} crowds, `;
    
    if (best.distance < 100) explanation += `is very close (${best.distance}m) `;
    else explanation += `is reasonably close (${best.distance}m) `;
    
    explanation += `with a manageable wait.`;
    
    const listSort = [...stalls].sort((a, b) => a.waitTime - b.waitTime);
    
    return { listSorted: listSort, recommendation: { bestStall: best, text: explanation } };
  }, [stalls]);

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="section-title">Smart Concessions Routing</div>
      
      {recommendation && (
        <div style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '12px', padding: '16px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '100%', background: 'var(--accent-bg)', filter: 'blur(5px)', animation: 'slideRight 3s infinite' }} />
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <span>⭐</span> <span className="shiny-text" style={{ fontWeight: 700 }}>AI TOP RECOMMENDATION</span>
          </h4>
          <div style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
            {recommendation.bestStall.name}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', fontStyle: 'italic', marginBottom: '8px' }}>
            "{recommendation.text}"
          </p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>📍 {recommendation.bestStall.distance}m</span>
            <span>⏳ {recommendation.bestStall.waitTime}m</span>
            <span style={{ textTransform: 'capitalize' }}>👥 {recommendation.bestStall.density}</span>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {listSorted.map((stall) => {
          const isRec = recommendation && recommendation.bestStall.id === stall.id;
          return (
            <div key={stall.id} style={{ background: isRec ? 'var(--accent-bg)' : 'var(--bg-card-inner)', border: `1px solid ${isRec ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
              <div>
                <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '4px' }}>{stall.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', gap: '10px' }}>
                  <span><span style={{ color: stall.density === 'high' ? 'var(--accent-danger)' : stall.density === 'medium' ? 'var(--accent-warning)' : 'var(--text-main)', textTransform: 'capitalize' }}>{stall.density}</span></span>
                  <span>{stall.distance}m</span>
                </p>
              </div>
              <div style={{ color: stall.waitTime > 10 ? 'var(--accent-danger)' : 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {stall.waitTime}m
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StallWaitTimes;
