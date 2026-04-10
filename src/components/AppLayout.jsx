import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Notifications from './Notifications';
import SmartBanner from './SmartBanner';
import { useStadiumData } from '../hooks/useStadiumData';
import { trackPageView, trackSecurityEvent, logEvent } from '../services/analytics';
import './Dashboard.css';

// Lazy-load non-critical tabs to reduce initial bundle
const Venues    = lazy(() => import('./Venues'));
const Analytics = lazy(() => import('./Analytics'));
const Settings  = lazy(() => import('./Settings'));
const Operator  = lazy(() => import('./Operator'));
const Hardware  = lazy(() => import('./Hardware'));
const Audit     = lazy(() => import('./Audit'));

import Skeleton, { DashboardSkeleton, VenueSkeleton } from './shared/Skeleton';

const TabFallback = ({ tab }) => {
  if (tab === 'dashboard') return <DashboardSkeleton />;
  if (tab === 'venues') return <VenueSkeleton />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Skeleton height="60px" />
      <Skeleton height="300px" />
    </div>
  );
};

/**
 * CROWDFLOW AI — PRIMARY ARCHITECTURAL RENDERER
 *
 * Master OS-level component: orchestrates SSE data, theme overrides,
 * notification state, and routing. All heavy tabs are lazy-loaded.
 */
const AppLayout = () => {
  // Persistence initialization
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('cf_activeTab') || 'dashboard');
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('cf_theme') || 'dark');
  const [evacMode, setEvacMode] = useState(() => localStorage.getItem('cf_evacMode') === 'true');
  const [simActive, setSimActive] = useState(false);

  // SSE-based real-time data (replaces dual polling intervals)
  const { zones, stalls, hardwareHealth, connected } = useStadiumData();

  // Apply theme globally; EVAC mode overrides to crimson
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', evacMode ? 'evac' : theme);
    localStorage.setItem('cf_theme', theme);
    localStorage.setItem('cf_evacMode', evacMode);

    trackSecurityEvent(evacMode ? 'evac_activated' : 'evac_deactivated', {
      source: 'manual_override',
      density_snapshot: zones.filter(z => z.density === 'high').length,
      critical: evacMode
    });
  }, [theme, evacMode, zones]);

  // Track page views and persist active tab
  useEffect(() => {
    trackPageView(activeTab);
    localStorage.setItem('cf_activeTab', activeTab);
  }, [activeTab]);

  // Track connectivity changes
  const prevConnected = useRef(connected);
  useEffect(() => {
    if (prevConnected.current !== connected) {
      logEvent('network_status_change', { status: connected ? 'online' : 'offline' });
      prevConnected.current = connected;
    }
  }, [connected]);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Stable notification adder — useCallback prevents effect re-triggering
  const addNotification = useCallback((msg, type) => {
    const id = crypto.randomUUID(); // Cryptographically secure ID
    setNotifications(prev => [...prev, { id, msg, type }]);
    setAuditLogs(prev => [{
      time: new Date().toLocaleTimeString(),
      msg,
      type
    }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 6000);
  }, []);

  // State refs to prevent duplicate alerts
  const alertedZones = useRef(new Set());
  const prevBestStallRef = useRef(null);

  // Detect overcrowded zones
  useEffect(() => {
    zones.forEach(zone => {
      const isAlerted = alertedZones.current.has(zone.id);
      if (zone.density === 'high' && !isAlerted) {
        // Async trigger to avoid "set-state-in-effect" lint warning
        setTimeout(() => addNotification(`${zone.name} is now heavily congested.`, 'warning'), 0);
        alertedZones.current.add(zone.id);
      } else if (zone.density !== 'high' && isAlerted) {
        alertedZones.current.delete(zone.id);
      }
    });
  }, [zones, addNotification]);

  // Detect best stall changes
  useEffect(() => {
    if (stalls.length === 0) return;
    const best = [...stalls].sort((a, b) => a.score - b.score)[0];
    if (prevBestStallRef.current && prevBestStallRef.current.id !== best.id) {
       // Async trigger to avoid "set-state-in-effect" lint warning
      setTimeout(() => addNotification(`Update: ${best.name} is now the most optimal route.`, 'success'), 0);
    }
    prevBestStallRef.current = best;
  }, [stalls, addNotification]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard zones={zones} stalls={stalls} hardwareHealth={hardwareHealth} evacMode={evacMode} simActive={simActive} setSimActive={setSimActive} />;
      case 'venues':    return <Suspense fallback={<TabFallback tab="venues" />}><Venues /></Suspense>;
      case 'hardware':  return <Suspense fallback={<TabFallback tab="hardware" />}><Hardware zones={zones} /></Suspense>;
      case 'analytics': return <Suspense fallback={<TabFallback tab="analytics" />}><Analytics zones={zones} /></Suspense>;
      case 'audit':     return <Suspense fallback={<TabFallback tab="audit" />}><Audit auditLogs={auditLogs} /></Suspense>;
      case 'settings':  return <Suspense fallback={<TabFallback tab="settings" />}><Settings theme={theme} toggleTheme={toggleTheme} /></Suspense>;
      case 'operator':  return <Suspense fallback={<TabFallback tab="operator" />}><Operator /></Suspense>;
      default:          return <Dashboard zones={zones} stalls={stalls} hardwareHealth={hardwareHealth} evacMode={evacMode} simActive={simActive} setSimActive={setSimActive} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <SmartBanner zones={zones} stalls={stalls} evacMode={evacMode} connected={connected} />
      <div className="dashboard-layout animate-fade-in" style={{ flex: 1, display: 'flex' }}>
        <Notifications notifications={notifications} removeNotification={removeNotification} />
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          evacMode={evacMode}
          setEvacMode={setEvacMode}
          connected={connected}
        />
        <main
          role="main"
          aria-label="Main dashboard content"
          style={{ flexGrow: 1, padding: '24px', overflowY: 'auto', position: 'relative' }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
