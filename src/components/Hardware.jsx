import React, { useState, useEffect } from 'react';

const Hardware = () => {
  const [nodes, setNodes] = useState([]);

  // Initialize and tick fake nodes
  useEffect(() => {
    const initial = Array.from({ length: 144 }, (_, i) => ({
      id: i,
      status: Math.random() > 0.95 ? 'offline' : Math.random() > 0.85 ? 'latency' : 'online',
      type: i % 8 === 0 ? 'turnstile' : i % 5 === 0 ? 'camera' : 'sensor'
    }));
    setNodes(initial);

    const itv = setInterval(() => {
      setNodes(prev => prev.map(n => {
         if(Math.random() < 0.05) {
             return { ...n, status: Math.random() > 0.9 ? 'offline' : Math.random() > 0.7 ? 'latency' : 'online' };
         }
         return n;
      }));
    }, 1500);
    return () => clearInterval(itv);
  }, []);

  const getStatusColor = (status) => {
      if(status === 'online') return 'var(--accent-success)';
      if(status === 'latency') return 'var(--accent-warning)';
      return 'var(--accent-danger)';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>IoT Hardware Matrix</h2>
      
      <div style={{ display: 'flex', gap: '24px' }}>
          <div className="glass-card" style={{ flex: 1 }}>
              <p style={{ color: 'var(--text-muted)' }}>Online Nodes</p>
              <h3 style={{ color: 'var(--text-main)', fontSize: '2rem' }}>{nodes.filter(n => n.status === 'online').length}</h3>
          </div>
          <div className="glass-card" style={{ flex: 1 }}>
              <p style={{ color: 'var(--text-muted)' }}>Latency Warning ( >300ms )</p>
              <h3 style={{ color: 'var(--accent-warning)', fontSize: '2rem' }}>{nodes.filter(n => n.status === 'latency').length}</h3>
          </div>
          <div className="glass-card" style={{ flex: 1 }}>
              <p style={{ color: 'var(--text-muted)' }}>Offline / Disconnected</p>
              <h3 style={{ color: 'var(--accent-danger)', fontSize: '2rem' }}>{nodes.filter(n => n.status === 'offline').length}</h3>
          </div>
      </div>

      <div className="glass-card" style={{ flex: 1, overflowY: 'auto' }}>
         <h4 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Network Visualization</h4>
         <div style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))', 
             gap: '8px' 
         }}>
             {nodes.map(node => (
                 <div 
                    key={node.id} 
                    title={`Node ${node.id} (${node.type}) - ${node.status.toUpperCase()}`}
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '4px',
                        background: getStatusColor(node.status),
                        opacity: node.status === 'offline' ? 0.3 : 0.8,
                        boxShadow: node.status === 'offline' ? 'none' : `0 0 10px ${getStatusColor(node.status)}`,
                        transition: 'all 0.5s ease',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                 />
             ))}
         </div>
      </div>
    </div>
  );
};

export default Hardware;
