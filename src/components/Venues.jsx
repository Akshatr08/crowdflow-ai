import React, { useState, useMemo } from 'react';
import { mockVenues } from '../constants/mockData';

const Venues = () => {
  const [search, setSearch] = useState('');
  const [showOffline, setShowOffline] = useState(true);

  // Real logic applying filters to the mock dataset
  const filteredVenues = useMemo(() => {
    return mockVenues.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = showOffline ? true : v.online;
      return matchSearch && matchStatus;
    });
  }, [search, showOffline]);

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Network Venues</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Search venue or city..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-inner)', color: 'var(--text-main)', outline: 'none' }} 
          />
          <button 
            className="btn-primary" 
            onClick={() => setShowOffline(!showOffline)}
            style={{ background: showOffline ? 'var(--bg-card-inner)' : 'var(--accent-primary)', color: showOffline ? 'var(--text-main)' : '#000' }}
          >
            {showOffline ? 'Hide Offline' : 'Show All'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredVenues.map(venue => (
          <div key={venue.id} className="glass-card" style={{ transition: 'transform 0.2s', cursor: 'pointer', borderTop: `4px solid ${venue.online ? 'var(--accent-success)' : 'var(--border-subtle)'}` }}>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>{venue.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>📍 {venue.city}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Capacity</span><br/>
                <strong style={{ color: 'var(--text-main)' }}>{venue.capacity.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status</span><br/>
                <strong style={{ color: venue.online ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                  {venue.online ? `${venue.activeNodes} Active Nodes` : 'SYSTEM OFFLINE'}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues;
