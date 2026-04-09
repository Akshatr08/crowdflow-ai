import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'venues', icon: '🏟️', label: 'Venues' },
    { id: 'hardware', icon: '📡', label: 'Hardware' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'audit', icon: '📋', label: 'Audit Log' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo shiny-text">CrowdFlow AI.</div>
      
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.icon}</span> {tab.label}
        </div>
      ))}
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div 
          className={`nav-item ${activeTab === 'operator' ? 'active' : ''}`}
          onClick={() => setActiveTab('operator')}
        >
          <span>👤</span> Operator
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
