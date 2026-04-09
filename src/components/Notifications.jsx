import React from 'react';

const Notifications = ({ notifications = [], removeNotification }) => {
  if (notifications.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}>
      {notifications.map(n => (
        <div key={n.id} className="animate-fade-in glass-card" style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          borderLeft: `4px solid ${n.type === 'warning' ? 'var(--accent-warning)' : 'var(--accent-primary)'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          pointerEvents: 'auto',
          position: 'relative'
        }}>
          <button 
            onClick={() => removeNotification(n.id)} 
            style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
          >
            ×
          </button>
          <div style={{ fontSize: '1.2rem', marginTop: '2px' }}>
            {n.type === 'warning' ? '⚠️' : '💡'}
          </div>
          <div style={{ paddingRight: '12px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
              {n.type === 'warning' ? 'System Alert' : 'Network Update'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
              {n.msg}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
