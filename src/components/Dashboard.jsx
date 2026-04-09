import React, { useState } from 'react';
import StadiumMap from './StadiumMap';
import Recommendations from './Recommendations';
import ChatAssistant from './ChatAssistant';
import StallWaitTimes from './StallWaitTimes';
import CctvFeed from './CctvFeed';

const Dashboard = ({ zones, stalls }) => {
  // Ordered array of active widgets
  const [layout, setLayout] = useState([
    { id: 'map', span: 2 },
    { id: 'stalls', span: 1 },
    { id: 'recommendations', span: 1 },
    { id: 'cctv', span: 1 },
    { id: 'chat', span: 1 }
  ]);

  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    // Small timeout to allow drag aesthetic before lowering opacity natively
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    e.target.style.opacity = '1';
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    setLayout(prev => {
      const updated = [...prev];
      const grabbed = updated[draggedIdx];
      updated.splice(draggedIdx, 1);
      updated.splice(targetIdx, 0, grabbed);
      return updated;
    });
    setDraggedIdx(null);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIdx(null);
  };

  const renderWidget = (id) => {
    switch (id) {
      case 'map': return <StadiumMap zones={zones} />;
      case 'stalls': return <StallWaitTimes stalls={stalls} />;
      case 'recommendations': return <Recommendations />;
      case 'cctv': return <CctvFeed />;
      case 'chat': return <ChatAssistant stalls={stalls} zones={zones} />;
      default: return null;
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '40px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Central Operations Overview</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--accent-success)', borderRadius: '50%' }} className="animate-pulse" />
          SYSTEM SECURE
        </div>
      </div>

      {/* Draggable Masonry Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gridAutoRows: 'minmax(300px, 400px)',
        gap: '24px',
        paddingBottom: '24px'
      }}>
        {layout.map((widget, index) => (
          <div 
            key={widget.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            style={{ 
              gridColumn: widget.span === 2 ? 'span 2' : 'span 1',
              cursor: 'grab',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
           {/* Draggable Header Handle */}
           <div style={{ background: 'var(--bg-card-inner)', display: 'flex', justifyContent: 'center', padding: '4px', borderRadius: '8px 8px 0 0', border: '1px solid var(--border-subtle)', borderBottom: 'none' }}>
             <div style={{ width: '40px', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px' }} />
           </div>
           
           <div style={{ flex: 1, overflow: 'hidden' }}>
            {renderWidget(widget.id)}
           </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
