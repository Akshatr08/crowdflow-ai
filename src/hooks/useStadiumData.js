import { useState, useEffect, useRef, useCallback } from 'react';
import { API_URL, mockZonesFallback, mockStallsFallback } from '../services/api';

/**
 * useStadiumData
 *
 * Replaces dual polling intervals with a single Server-Sent Events connection.
 * Falls back to polling if SSE is not supported or server is unreachable.
 */
export const useStadiumData = () => {
  const [zones, setZones] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);
  const fallbackRef = useRef(null);

  const startFallbackPolling = useCallback(() => {
    setConnected(false);
    if (fallbackRef.current) return; // already polling

    const tick = () => {
      setZones(mockZonesFallback());
      setStalls(mockStallsFallback());
    };

    tick(); // run immediately
    fallbackRef.current = setInterval(tick, 3000);
  }, []);

  const stopFallbackPolling = useCallback(() => {
    if (fallbackRef.current) {
      clearInterval(fallbackRef.current);
      fallbackRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Check SSE support
    if (typeof EventSource === 'undefined') {
      startFallbackPolling();
      return;
    }

    const connect = () => {
      if (esRef.current) {
        esRef.current.close();
      }

      const es = new EventSource(`${API_URL}/stream`);
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        stopFallbackPolling();
      };

      es.onmessage = (event) => {
        try {
          const { zones: z, stalls: s } = JSON.parse(event.data);
          if (Array.isArray(z) && z.length > 0) setZones(z);
          if (Array.isArray(s) && s.length > 0) setStalls(s);
        } catch {
          // malformed frame — ignore
        }
      };

      es.onerror = () => {
        es.close();
        esRef.current = null;
        setConnected(false);
        startFallbackPolling();

        // Retry SSE after 10 seconds
        setTimeout(() => {
          stopFallbackPolling();
          connect();
        }, 10000);
      };
    };

    connect();

    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      stopFallbackPolling();
    };
  }, [startFallbackPolling, stopFallbackPolling]);

  return { zones, stalls, connected };
};
