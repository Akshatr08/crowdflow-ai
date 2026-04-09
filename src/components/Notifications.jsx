import React from 'react';

const TYPE_META = {
  warning: { label: 'System Alert',   icon: '⚠',  accent: 'var(--accent-warning)' },
  success: { label: 'Network Update', icon: '✦',  accent: 'var(--accent-success)' },
  info:    { label: 'Info',           icon: 'ℹ',  accent: 'var(--accent-primary)' },
};

const Notifications = ({ notifications = [], removeNotification }) => {
  if (notifications.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="System notifications"
      aria-live="polite"
      aria-relevant="additions removals"
      style={{
        position: 'fixed',
        top: '16px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '320px',
        pointerEvents: 'none'
      }}
    >
      {notifications.map(n => {
        const meta = TYPE_META[n.type] ?? TYPE_META.info;
        return (
          <div
            key={n.id}
            role="alert"
            aria-atomic="true"
            className="animate-fade-in glass-card"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              borderLeft: `4px solid ${meta.accent}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              pointerEvents: 'auto',
              position: 'relative',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)'
            }}
          >
            <button
              type="button"
              onClick={() => removeNotification(n.id)}
              aria-label={`Dismiss notification: ${n.msg}`}
              style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'transparent', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: '1.1rem', lineHeight: 1, padding: '2px 5px',
                borderRadius: '4px'
              }}
            >
              ×
            </button>

            <span aria-hidden="true" style={{ fontSize: '1rem', marginTop: '1px', flexShrink: 0 }}>
              {meta.icon}
            </span>

            <div style={{ paddingRight: '16px', flex: 1 }}>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {meta.label}
              </h4>
              <p style={{ margin: 0, fontSize: '0.79rem', lineHeight: '1.45', color: 'var(--text-muted)' }}>
                {n.msg}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
