/**
 * @service Analytics
 * 
 * Provides an enterprise-grade tracking layer for the StadiumOS platform.
 * Currently stubbed to console for demo purposes, but matches Firebase/GA4 
 * event structure for instant production cut-over.
 */

const IS_PRODUCTION = import.meta.env.PROD;

/**
 * Logs an event to the selected analytics provider.
 * @param {string} eventName - Snake-case event identifier
 * @param {Object} params - Contextual metadata
 */
export const logEvent = (eventName, params = {}) => {
  // Log context to terminal in development
  if (!IS_PRODUCTION) {
    console.group(`%c[ANALYTICS] ${eventName}`, 'color: #38bdf8; font-weight: bold;');
    console.table(params);
    console.groupEnd();
  }

  // Integration Point: In real production, you would call:
  // firebase.analytics().logEvent(eventName, params);
};

/**
 * Tracks virtual page/tab navigation within the Dashboard.
 * @param {string} tabId - Unique ID of the active navigation item
 */
export const trackPageView = (tabId) => {
  logEvent('page_view', {
    page_title: tabId.charAt(0).toUpperCase() + tabId.slice(1),
    page_path: `/${tabId}`,
    page_location: window.location.href
  });
};

/**
 * Specialized tracker for high-importance tactical security events.
 */
export const trackSecurityEvent = (action, meta = {}) => {
  logEvent('security_tactical_event', {
    action,
    ...meta,
    critical_level: meta.critical ? 'high' : 'normal'
  });
};
