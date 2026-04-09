import React, { useState, useMemo } from 'react';
import { mockVenues } from '../constants/mockData';

// Google Maps Embed API — uses the venue city + name as a query
// No API key required for basic embeds (iframe mode)
const MapEmbed = ({ venue }) => {
  const query = encodeURIComponent(`${venue.name}, ${venue.city}`);
  return (
    <iframe
      title={`Map showing location of ${venue.name} in ${venue.city}`}
      width="100%"
      height="160"
      style={{ border: 0, borderRadius: '8px', marginTop: '16px' }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_MAPS_API_KEY || ''}&q=${query}`}
      aria-label={`Google Maps location for ${venue.name}`}
    />
  );
};

const VenueCard = ({ venue }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="glass-card venue-card"
      aria-label={`Venue: ${venue.name}`}
      style={{
        borderTop: `4px solid ${venue.online ? 'var(--accent-success)' : 'var(--border-subtle)'}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>{venue.name}</h3>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: '20px',
          background: venue.online ? 'rgba(52,211,153,0.15)' : 'rgba(148,163,184,0.1)',
          color: venue.online ? 'var(--accent-success)' : 'var(--text-muted)',
          border: `1px solid ${venue.online ? 'var(--accent-success)' : 'var(--border-subtle)'}`,
          flexShrink: 0
        }}>
          {venue.online ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
        📍 {venue.city}
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem', marginBottom: '16px' }}>
        {[
          { label: 'Capacity',      value: venue.capacity.toLocaleString() },
          { label: 'Active Nodes',  value: venue.online ? String(venue.activeNodes) : '—' },
          { label: 'Load',          value: venue.online ? `${Math.round((venue.activeNodes / venue.capacity) * 100)}%` : '—' },
          { label: 'Status',        value: venue.online ? 'Operational' : 'System Offline' },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: 'var(--bg-card-inner)', padding: '10px 12px', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>{label}</span>
            <strong style={{ color: 'var(--text-main)' }}>{value}</strong>
          </div>
        ))}
      </div>

      {/* Capacity fill bar */}
      {venue.online && (
        <div
          role="meter"
          aria-label={`${venue.name} node utilization`}
          aria-valuenow={venue.activeNodes}
          aria-valuemin={0}
          aria-valuemax={venue.capacity}
          style={{ width: '100%', height: '4px', background: 'var(--bg-card-inner)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}
        >
          <div style={{
            height: '100%',
            width: `${Math.min(100, (venue.activeNodes / venue.capacity) * 100)}%`,
            background: 'var(--accent-primary)',
            transition: 'width 0.6s ease'
          }} />
        </div>
      )}

      {/* Map toggle */}
      <button
        type="button"
        className="btn-primary"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls={`map-${venue.id}`}
        style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
      >
        {expanded ? 'Hide Map' : '📍 View on Google Maps'}
      </button>

      {/* Collapsible Google Maps Embed */}
      {expanded && (
        <div id={`map-${venue.id}`}>
          {import.meta.env.VITE_MAPS_API_KEY ? (
            <MapEmbed venue={venue} />
          ) : (
            <div style={{
              marginTop: '16px', padding: '20px',
              background: 'var(--bg-card-inner)', borderRadius: '8px',
              textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)'
            }}>
              <p>📍 <strong style={{ color: 'var(--text-main)' }}>{venue.name}</strong></p>
              <p style={{ margin: '4px 0 12px' }}>{venue.city}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name} ${venue.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${venue.name} in Google Maps (opens in new tab)`}
                style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}
              >
                Open in Google Maps ↗
              </a>
              <p style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                Add VITE_MAPS_API_KEY to .env for embedded maps
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

const Venues = () => {
  const [search, setSearch] = useState('');
  const [showOffline, setShowOffline] = useState(true);

  const filteredVenues = useMemo(() =>
    mockVenues.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase())
        || v.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = showOffline || v.online;
      return matchSearch && matchStatus;
    }),
    [search, showOffline]
  );

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header + Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Network Venues</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label htmlFor="venue-search" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Search venues
          </label>
          <input
            id="venue-search"
            type="search"
            placeholder="Search venue or city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search venues by name or city"
            style={{
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card-inner)',
              color: 'var(--text-main)', outline: 'none', fontSize: '0.88rem'
            }}
          />
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowOffline(v => !v)}
            aria-pressed={!showOffline}
            aria-label={showOffline ? 'Currently showing all venues. Click to hide offline venues.' : 'Currently hiding offline venues. Click to show all.'}
          >
            {showOffline ? 'Hide Offline' : 'Show All'}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <p aria-live="polite" aria-atomic="true" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        Showing <strong style={{ color: 'var(--text-main)' }}>{filteredVenues.length}</strong> of {mockVenues.length} venues
        {search && <> matching "<strong style={{ color: 'var(--accent-primary)' }}>{search}</strong>"</>}
      </p>

      {/* Venue Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredVenues.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '40px 0', gridColumn: '1/-1', textAlign: 'center' }}>
            No venues match your search.
          </p>
        ) : (
          filteredVenues.map(venue => <VenueCard key={venue.id} venue={venue} />)
        )}
      </div>
    </div>
  );
};

export default Venues;
