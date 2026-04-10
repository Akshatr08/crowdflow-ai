/**
 * Component Render Tests
 *
 * Tests that key components render correctly, display the right data,
 * and handle edge cases (empty props, evac mode, etc.)
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// jsdom doesn't implement scrollIntoView — mock it globally
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

import Dashboard from '../components/Dashboard';
import Recommendations from '../components/Recommendations';
import StallWaitTimes from '../components/StallWaitTimes';
import Notifications from '../components/Notifications';

// ==========================================
// Mock data
// ==========================================

const MOCK_ZONES = [
  { id: 1, name: 'North Gate', density: 'high' },
  { id: 2, name: 'South Gate', density: 'low'  },
  { id: 3, name: 'West Concourse', density: 'medium' },
];

const MOCK_STALLS = [
  { id: 1, name: 'Burger Hub',   waitTime: 12, score: 18, density: 'medium', baseTime: 5, distance: 120 },
  { id: 2, name: 'Vegan Grill',  waitTime: 3,  score: 7,  density: 'low',    baseTime: 2, distance: 50  },
  { id: 3, name: 'Beer Station', waitTime: 20, score: 32, density: 'high',   baseTime: 4, distance: 300 },
];

// ==========================================
// Dashboard
// ==========================================

describe('Dashboard', () => {
  it('renders the Central Operations heading', () => {
    render(<Dashboard zones={MOCK_ZONES} stalls={MOCK_STALLS} evacMode={false} />);
    expect(screen.getByText(/Central Operations Overview/i)).toBeInTheDocument();
  });

  it('renders the SYSTEM SECURE status badge', () => {
    render(<Dashboard zones={MOCK_ZONES} stalls={MOCK_STALLS} evacMode={false} />);
    expect(screen.getByText(/SYSTEM SECURE/i)).toBeInTheDocument();
  });

  it('renders the draggable widget list', () => {
    render(<Dashboard zones={MOCK_ZONES} stalls={MOCK_STALLS} evacMode={false} />);
    // Target the specific widget list by its aria-label
    const widgetList = screen.getByRole('list', { name: /Dashboard widgets/i });
    expect(widgetList).toBeInTheDocument();
    
    // Target the specific widget elements by their aria-label prefix
    const items = within(widgetList).getAllByLabelText(/Widget: /i);
    // 6 widgets: map, audit, stalls, recommendations, cctv, chat
    expect(items.length).toBe(6);
  });
});

// ==========================================
// Recommendations
// ==========================================

describe('Recommendations', () => {
  it('renders active AI Routing Analysis heading', () => {
    render(<Recommendations evacMode={false} stalls={MOCK_STALLS} zones={MOCK_ZONES} />);
    expect(screen.getByText(/Active AI Routing Analysis/i)).toBeInTheDocument();
  });

  it('shows best stall as optimal route in normal mode', () => {
    render(<Recommendations evacMode={false} stalls={MOCK_STALLS} zones={MOCK_ZONES} />);
    // Vegan Grill has lowest score
    expect(screen.getByText(/Vegan Grill/i)).toBeInTheDocument();
  });

  it('shows DIJKSTRA OVERRIDE when evacMode is true', () => {
    render(<Recommendations evacMode={true} stalls={MOCK_STALLS} zones={MOCK_ZONES} />);
    expect(screen.getByText(/DIJKSTRA OVERRIDE/i)).toBeInTheDocument();
  });

  it('shows Evacuation Corridor exit node text in evac mode', () => {
    render(<Recommendations evacMode={true} stalls={MOCK_STALLS} zones={MOCK_ZONES} />);
    // Multiple elements contain 'Gate' — confirm the routing label is present
    const gateElements = screen.getAllByText(/Gate/i);
    expect(gateElements.length).toBeGreaterThan(0);
    // The heading span should specifically say 'Evacuation Corridor' or 'Extrication Vector'
    const routeLabel = screen.getByText(/Evacuation Corridor|Extrication Vector/i);
    expect(routeLabel).toBeInTheDocument();
  });

  it('renders confidence meter with aria-valuenow', () => {
    render(<Recommendations evacMode={false} stalls={MOCK_STALLS} zones={MOCK_ZONES} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow');
  });

  it('renders with empty stalls gracefully (fallback nodes)', () => {
    render(<Recommendations evacMode={false} stalls={[]} zones={[]} />);
    // Should fall back to static demo nodes, not crash
    expect(screen.getByText(/Optimal Route/i)).toBeInTheDocument();
  });
});

// ==========================================
// Notifications
// ==========================================

describe('Notifications', () => {
  it('renders nothing when notifications array is empty', () => {
    const { container } = render(<Notifications notifications={[]} removeNotification={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a notification message', () => {
    const nots = [{ id: '1', msg: 'North Gate is congested.', type: 'warning' }];
    render(<Notifications notifications={nots} removeNotification={() => {}} />);
    expect(screen.getByText(/North Gate is congested/i)).toBeInTheDocument();
  });

  it('dismiss button has descriptive aria-label', () => {
    const nots = [{ id: '1', msg: 'North Gate is congested.', type: 'warning' }];
    render(<Notifications notifications={nots} removeNotification={() => {}} />);
    const btn = screen.getByRole('button', { name: /Dismiss notification/i });
    expect(btn).toBeInTheDocument();
  });

  it('calls removeNotification with correct id on dismiss', () => {
    const remove = vi.fn();
    const nots = [{ id: 'abc-123', msg: 'Test alert.', type: 'warning' }];
    render(<Notifications notifications={nots} removeNotification={remove} />);
    fireEvent.click(screen.getByRole('button', { name: /Dismiss/i }));
    expect(remove).toHaveBeenCalledWith('abc-123');
  });

  it('renders multiple notifications', () => {
    const nots = [
      { id: '1', msg: 'Alert one.', type: 'warning' },
      { id: '2', msg: 'Alert two.', type: 'success' },
    ];
    render(<Notifications notifications={nots} removeNotification={() => {}} />);
    expect(screen.getByText(/Alert one/i)).toBeInTheDocument();
    expect(screen.getByText(/Alert two/i)).toBeInTheDocument();
  });

  it('each notification has role="alert"', () => {
    const nots = [{ id: '1', msg: 'Critical zone.', type: 'warning' }];
    render(<Notifications notifications={nots} removeNotification={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
