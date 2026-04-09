import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Venues from './Venues';
import Analytics from './Analytics';
import Settings from './Settings';
import Operator from './Operator';
import Hardware from './Hardware';
import Audit from './Audit';
import Notifications from './Notifications';
import { fetchLiveZones, fetchLiveStalls } from '../services/api';
import './Dashboard.css';

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Global Data State
  const [zones, setZones] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [theme, setTheme] = useState('dark');

  const prevZonesRef = useRef([]);
  const prevBestStallRef = useRef(null);

  // Apply Theme globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (msg, type) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, msg, type }]);
    
    // Log to audit history with fixed timestamp
    const nowStr = new Date().toLocaleTimeString();
    setAuditLogs(prev => [{ time: nowStr, msg, type }, ...prev]);
    
    setTimeout(() => removeNotification(id), 6000);
  };

  // State refs to prevent alert spamming loops
  const alertedZones = useRef(new Set());
  const prevBestStallRef = useRef(null);

  // Detect overcrowded zones globally (debounced)
  useEffect(() => {
    if (zones.length > 0) {
      zones.forEach(zone => {
        const isAlerted = alertedZones.current.has(zone.id);
        if (zone.density === 'high' && !isAlerted) {
          addNotification(`${zone.name} is now heavily congested.`, 'warning');
          alertedZones.current.add(zone.id);
        } else if (zone.density !== 'high' && isAlerted) {
          // Reset the alert state once it drops below high
          alertedZones.current.delete(zone.id);
        }
      });
    }
  }, [zones]);

  // Detect better stall options globally
  useEffect(() => {
    if (stalls.length > 0) {
      const sortedStalls = [...stalls].sort((a, b) => a.score - b.score);
      const best = sortedStalls[0];

      if (prevBestStallRef.current && prevBestStallRef.current.id !== best.id) {
        addNotification(`Update: ${best.name} is now the most optimal route.`, 'success');
      }
      prevBestStallRef.current = best;
    }
  }, [stalls]);

  // Polling logic
  useEffect(() => {
    const getZones = async () => {
      const data = await fetchLiveZones();
      if (data.length) setZones(data);
    };
    getZones();
    const interval = setInterval(getZones, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getStalls = async () => {
      const data = await fetchLiveStalls();
      if (data.length) setStalls(data);
    };
    getStalls();
    const interval = setInterval(getStalls, 4000);
    return () => clearInterval(interval);
  }, []);

  // Render Engine
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard zones={zones} stalls={stalls} />;
      case 'venues': return <Venues />;
      case 'hardware': return <Hardware />;
      case 'analytics': return <Analytics />;
      case 'audit': return <Audit auditLogs={auditLogs} />;
      case 'settings': return <Settings theme={theme} toggleTheme={toggleTheme} />;
      case 'operator': return <Operator />;
      default: return <Dashboard zones={zones} stalls={stalls} />;
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <Notifications notifications={notifications} removeNotification={removeNotification} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AppLayout;
