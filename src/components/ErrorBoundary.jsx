import React from 'react';

/**
 * @component ErrorBoundary
 * 
 * Catch-all safety net for React component tree failures.
 * Prevents a single component crash from taking down the entire UI.
 * Reports errors to the tactical log for system audits.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(_error, errorInfo) {
    // Integration Point: Log to Sentry/LogRocket in production
    console.error('[CRITICAL_UI_CRASH]', _error, errorInfo);
    
    // Attempt to log to our internal audit system if available
    try {
        const auditLog = JSON.parse(sessionStorage.getItem('stadium_audit_logs') || '[]');
        auditLog.push({
            time: new Date().toLocaleTimeString(),
            type: 'error',
            msg: `UI Crash detected: ${_error.message.slice(0, 100)}`
        });
        sessionStorage.setItem('stadium_audit_logs', JSON.stringify(auditLog.slice(-50)));
    } catch {
        // Fallback if sessionStorage is full/blocked
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: '#040814',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            padding: '40px', 
            borderRadius: '16px', 
            background: 'rgba(239, 68, 68, 0.05)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            maxWidth: '500px'
          }}>
            <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Terminal Error Detected</h1>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              The tactical dashboard encountered an unrecoverable rendering sequence. 
              The error has been logged for architectural review.
            </p>
            <button 
              onClick={this.handleReset}
              style={{
                background: '#38bdf8',
                color: '#040814',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Re-initialize Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
