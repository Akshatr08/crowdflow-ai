/**
 * Enterprise Mock Services Data Maps
 * 
 * Holds the fallback structures permitting offline logic routing and presentation views.
 */

export const mockVenues = [
    { id: 1, name: 'Metro Stadium', city: 'New York', capacity: 50000, activeNodes: 420, online: true },
    { id: 2, name: 'Westside Arena', city: 'Los Angeles', capacity: 25000, activeNodes: 110, online: true },
    { id: 3, name: 'Downtown Center', city: 'Chicago', capacity: 18000, activeNodes: 0, online: false },
    { id: 4, name: 'Olympic Track', city: 'London', capacity: 80000, activeNodes: 602, online: true },
    { id: 5, name: 'National Park', city: 'Washington DC', capacity: 41000, activeNodes: 280, online: true }
];
  
export const simulatedZones = [
    { id: 1, name: 'North Gate', x: 400, y: 100, r: 40, density: 'low' },
    { id: 2, name: 'South Gate', x: 400, y: 500, r: 40, density: 'medium' },
    { id: 3, name: 'West Concourse', x: 150, y: 300, r: 45, density: 'high' },
    { id: 4, name: 'East Concourse', x: 650, y: 300, r: 45, density: 'low' },
    { id: 5, name: 'Northwest Section', x: 220, y: 160, r: 50, density: 'medium' },
    { id: 6, name: 'Southeast Section', x: 580, y: 440, r: 50, density: 'low' }
];
  
export const simulatedStalls = [
    { id: 1, name: 'Burger & Fries Stand', baseTime: 5, distance: 120, density: 'low', waitTime: 6, score: 9 },
    { id: 2, name: 'Premium Beer Station', baseTime: 2, distance: 50, density: 'medium', waitTime: 4, score: 7 },
    { id: 3, name: 'Hot Dog Cart', baseTime: 3, distance: 300, density: 'low', waitTime: 3, score: 18 },
    { id: 4, name: 'Vegan Grill', baseTime: 4, distance: 80, density: 'high', waitTime: 18, score: 32 },
];
