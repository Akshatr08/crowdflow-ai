import React from 'react';

/**
 * @component Skeleton
 * A premium glassmorphism animated placeholder for lazy-loaded modules.
 */
const Skeleton = ({ height = '100px', width = '100%', borderRadius = '12px' }) => {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        background: 'var(--bg-card)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          animation: 'skeleton-shimmer 2s infinite linear',
        }}
      />
      <style>{`
        @keyframes skeleton-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export const DashboardSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
    <Skeleton height="350px" />
    <Skeleton height="350px" />
    <Skeleton height="350px" />
    <Skeleton height="350px" />
  </div>
);

export const VenueSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
    {[1,2,3,4,5,6].map(i => <Skeleton key={i} height="280px" />)}
  </div>
);

export default Skeleton;
