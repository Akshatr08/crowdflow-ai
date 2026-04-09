import React, { useState, useCallback } from 'react';
import StadiumMap from './StadiumMap';
import Recommendations from './Recommendations';
import ChatAssistant from './ChatAssistant';
import StallWaitTimes from './StallWaitTimes';
import CctvFeed from './CctvFeed';

const WIDGETS = [
  { id: 'map',             span: 2, label: 'Live Sector Topography' },
  { id: 'stalls',          span: 1, label: 'Stall Wait Times' },
  { id: 'recommendations', span: 1, label: 'AI Routing Analysis' },
  { id: 'cctv',            span: 1, label: 'CCTV Feed' },
  { id: 'chat',            span: 1, label: 'AI Assistant' },
];

/**
 * @component Dashboard
 * Drag-and-drop grid layout with keyboard move support and proper ARIA.
 */
const Dashboard = ({ zones, stalls, evacMode, simActive, setSimActive }) => {
  const [layout, setLayout] = useState(WIDGETS);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const triggerSimulation = async () => {
    if (simActive) return;
    setSimActive(true);
    try {
      await fetch('/api/simulate', { method: 'POST' });
      // Reset local state after 30s to match server expiry
      setTimeout(() => setSimActive(false), 30000);
    } catch (e) {
      console.error('Simulation trigger failed', e);
      setSimActive(false);
    }
  };

  // --- Drag handlers (state-based, no direct DOM mutation) ---
  const handleDragStart = useCallback((e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e, targetIdx) => {
    e.preventDefault();
    setDraggedIdx(null);

    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(fromIdx) || fromIdx === targetIdx) return;

    setLayout(prev => {
      const updated = [...prev];
      const [grabbed] = updated.splice(fromIdx, 1);
      updated.splice(targetIdx, 0, grabbed);
      return updated;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIdx(null);
  }, []);

  // Keyboard alternative: move widget up/down with arrow keys
  const handleKeyMove = useCallback((e, index) => {
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      setLayout(prev => {
        const updated = [...prev];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        return updated;
      });
    }
    if (e.key === 'ArrowDown' && index < layout.length - 1) {
      e.preventDefault();
      setLayout(prev => {
        const updated = [...prev];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        return updated;
      });
    }
  }, [layout.length]);

  const renderWidget = (id) => {
    switch (id) {
      case 'map':             return <StadiumMap zones={zones} />;
      case 'stalls':          return <StallWaitTimes stalls={stalls} />;
      case 'recommendations': return <Recommendations evacMode={evacMode} stalls={stalls} zones={zones} />;
      case 'cctv':            return <CctvFeed />;
      case 'chat':            return <ChatAssistant stalls={stalls} zones={zones} />;
      default:                return null;
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '40px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Central Operations Overview</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={triggerSimulation}
            disabled={simActive}
            className="btn-primary"
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              background: simActive ? 'var(--accent-warning)' : 'var(--bg-card-inner)',
              color: simActive ? '#000' : 'var(--accent-warning)',
              border: `1px solid var(--accent-warning)`,
              opacity: simActive ? 1 : 0.7,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⚠️ {simActive ? 'STRESS TEST ACTIVE (30s)' : 'TRIGGER CHAOS MODE'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '8px', height: '8px', background: simActive ? 'var(--accent-danger)' : 'var(--accent-success)', borderRadius: '50%' }} className="animate-pulse" aria-hidden="true" />
            {simActive ? 'SATURATION SPIKE' : 'SYSTEM SECURE'}
          </div>
        </div>
      </div>

      {/* Drag-and-drop grid with ARIA reorder support */}
      <div
        role="list"
        aria-label="Dashboard widgets — drag to reorder, or use arrow keys when focused"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoRows: 'minmax(300px, 400px)',
          gap: '24px',
          paddingBottom: '24px'
        }}
      >
        {layout.map((widget, index) => {
          const isDragging = draggedIdx === index;
          return (
            <div
              key={widget.id}
              role="listitem"
              aria-label={`Widget: ${widget.label}. Position ${index + 1} of ${layout.length}.`}
              aria-grabbed={isDragging}
              draggable
              tabIndex={0}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onKeyDown={(e) => handleKeyMove(e, index)}
              style={{
                gridColumn: widget.span === 2 ? 'span 2' : 'span 1',
                cursor: 'grab',
                display: 'flex',
                flexDirection: 'column',
                opacity: isDragging ? 0.5 : 1,
                transition: 'opacity 0.2s, transform 0.2s',
                outline: 'none'
              }}
              className="dashboard-widget"
            >
              {/* Drag handle */}
              <div
                aria-hidden="true"
                style={{ background: 'var(--bg-card-inner)', display: 'flex', justifyContent: 'center', padding: '5px', borderRadius: '8px 8px 0 0', border: '1px solid var(--border-subtle)', borderBottom: 'none' }}
              >
                <div style={{ width: '40px', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px' }} />
              </div>

              <div style={{ flex: 1, overflow: 'hidden' }}>
                {renderWidget(widget.id)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
