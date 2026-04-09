import React from 'react';

const Recommendations = () => {
  const recs = [
    { title: 'Open Gate 4', desc: 'Wait time at Gate 2 exceeds 15 mins. Opening Gate 4 will disperse load.', priority: 'high' },
    { title: 'Reroute Section B', desc: 'Congestion detected in B. Send push notification to route via C.', priority: 'medium' },
    { title: 'Deploy Staff to East Wing', desc: 'Concession stands are experiencing heavy queues.', priority: 'low' },
  ];

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="section-title">AI Adjustments</div>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {recs.map((rec, i) => (
          <div key={i} style={{ 
            background: 'var(--bg-card-inner)', 
            border: `1px solid ${rec.priority === 'high' ? 'var(--accent-danger)' : 'var(--border-subtle)'}`,
            borderRadius: '10px',
            padding: '16px',
            borderLeft: `4px solid ${rec.priority === 'high' ? 'var(--accent-danger)' : rec.priority === 'medium' ? 'var(--accent-warning)' : 'var(--accent-success)'}`,
            transition: 'all var(--transition-fast)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{rec.title}</h4>
              <span style={{ 
                fontSize: '0.7rem', 
                textTransform: 'uppercase', 
                background: rec.priority === 'high' ? 'var(--bg-card)' : 'transparent',
                color: rec.priority === 'high' ? 'var(--accent-danger)' : 'var(--text-muted)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                {rec.priority}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>{rec.desc}</p>
            <button className="btn-primary" style={{ marginTop: '12px', padding: '6px 12px', fontSize: '0.8rem' }}>
              Execute Action
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
