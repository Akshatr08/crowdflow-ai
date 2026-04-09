/**
 * Enterprise Constants: Map Coordinates Layer
 * 
 * Defines highly scalable CSS absolute positional mapping for dynamically plotting topological zones.
 * Extracted from component logic to adhere to strict React rendering anti-patterns.
 */
export const mapConfig = {
    1: { id: 1, pos: { top: '10%', left: '42%', width: '16%', height: '15%' }, labelRef: 'N' }, // North Gate
    2: { id: 2, pos: { bottom: '10%', left: '42%', width: '16%', height: '15%' }, labelRef: 'S' }, // South Gate
    3: { id: 3, pos: { top: '27%', left: '10%', width: '15%', height: '46%' }, labelRef: 'W' }, // West Concourse
    4: { id: 4, pos: { top: '27%', right: '10%', width: '15%', height: '46%' }, labelRef: 'E' }, // East Concourse
    5: { id: 5, pos: { top: '15%', left: '18%', width: '15%', height: '15%', radius: '100% 0 0 0' }, labelRef: 'NW' }, // Northwest
    6: { id: 6, pos: { bottom: '15%', right: '18%', width: '15%', height: '15%', radius: '0 0 100% 0' }, labelRef: 'SE' } // Southeast
};
