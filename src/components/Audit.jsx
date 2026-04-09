import React from 'react';

const Audit = ({ auditLogs = [] }) => {
  const exportAudit = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `crowdflow_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '4px' }}>System Audit Log</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Immutable chronological record of tracking interventions.</p>
          </div>
          <button 
            type="button"
            className="btn-primary" 
            onClick={exportAudit}
            disabled={auditLogs.length === 0}
            aria-label="Export audit logs as JSON"
          >
            Export JSON
          </button>
       </div>

       <div className="glass-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card-inner)', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
             <div style={{ width: '150px' }}>TIMESTAMP</div>
             <div style={{ width: '120px' }}>TYPE</div>
             <div style={{ flex: 1 }}>AUTO-GENERATED REPORT LOG</div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
              {auditLogs.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No alerts have triggered this session.
                  </div>
              ) : (
                  auditLogs.map((log, i) => (
                    <div key={i} className="animate-fade-in audit-row" style={{ 
                        display: 'flex', 
                        padding: '16px 24px', 
                        borderBottom: '1px solid var(--border-subtle)',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        transition: 'background 0.2s',
                        cursor: 'default'
                    }}
                    >
                       <div style={{ width: '150px', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                          {log.time}
                       </div>
                       <div style={{ width: '120px' }}>
                          <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 'bold',
                              background: log.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                              color: log.type === 'warning' ? 'var(--accent-warning)' : 'var(--accent-primary)',
                              textTransform: 'uppercase'
                          }}>
                             {log.type}
                          </span>
                       </div>
                       <div style={{ flex: 1, color: 'var(--text-main)' }}>
                          {log.msg}
                       </div>
                    </div>
                  ))
              )}
          </div>
       </div>
    </div>
  );
};

export default Audit;
