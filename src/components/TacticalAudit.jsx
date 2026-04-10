import React, { useState, useEffect, useRef } from 'react';

/**
 * TacticalAudit Component
 * 
 * Provides a real-time 'Black Box' view of system-generated tactical decisions.
 * Demonstrates deterministic AI logic and autonomous orchestration.
 */
const TacticalAudit = ({ zones, stalls, active }) => {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!zones.length) return;

    const generateLog = () => {
      const highDensityZones = zones.filter(z => z.density === 'high');
      const longWaitStalls = stalls.filter(s => s.waitTime > 10);
      
      const newLogs = [];
      const timestamp = new Date().toLocaleTimeString();

      if (active) {
        newLogs.push({
          id: Date.now() + 1,
          time: timestamp,
          type: 'CRITICAL',
          message: 'Chaos Mode active: Force-deploying emergency throughput algorithms.'
        });
      }

      if (highDensityZones.length > 0) {
        newLogs.push({
          id: Date.now() + 2,
          time: timestamp,
          type: 'TACTICAL',
          message: `High Saturation in ${highDensityZones[0].name}: Dynamic re-routing suggested via North Corridor.`
        });
      }

      if (longWaitStalls.length > 0) {
        newLogs.push({
          id: Date.now() + 3,
          time: timestamp,
          type: 'LOGISTICS',
          message: `Concession Backlog at ${longWaitStalls[0].name}: Auto-balancing with adjacent stalls.`
        });
      }

      if (newLogs.length > 0) {
        setLogs(prev => [...newLogs, ...prev].slice(0, 50));
      }
    };

    const timer = setInterval(generateLog, 8000);
    return () => clearInterval(timer);
  }, [zones, stalls, active]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="section-title" style={{ margin: 0 }}>TACTICAL AUDIT LOG</h3>
        <span className="animate-pulse" style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>
          ● LIVE STREAM
        </span>
      </div>
      
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          fontSize: '0.8rem', 
          fontFamily: 'monospace',
          color: 'var(--text-muted)'
        }}
      >
        {logs.length === 0 ? (
          <div style={{ opacity: 0.5, padding: '20px', textAlign: 'center' }}>Initializing telemetry sync...</div>
        ) : (
          logs.map(log => (
            <div 
              key={log.id} 
              style={{ 
                padding: '8px 0', 
                borderBottom: '1px solid var(--border-subtle)',
                animation: 'fadeIn 0.4s ease-out'
              }}
            >
              <span style={{ color: 'var(--accent-primary)', marginRight: '8px' }}>[{log.time}]</span>
              <span style={{ 
                color: log.type === 'CRITICAL' ? 'var(--accent-danger)' : 
                       log.type === 'TACTICAL' ? 'var(--accent-warning)' : 'var(--text-main)',
                fontWeight: 'bold',
                marginRight: '8px'
              }}>
                {log.type}:
              </span>
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TacticalAudit;
