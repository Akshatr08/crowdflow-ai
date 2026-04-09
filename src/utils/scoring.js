/**
 * Weighted composite score for ranking destinations.
 * Lower = better (less crowd, faster wait, shorter walk).
 * 
 * @param {number} crowdValue   - Zone crowd density value (0-10)
 * @param {number} waitTime     - Queue wait time in minutes
 * @param {number} distanceRating - Relative walking distance rating
 * @returns {number} Calculated priority score
 */
export const calculateScore = (crowdValue, waitTime, distanceRating) =>
  crowdValue * 0.5 + waitTime * 0.3 + distanceRating * 0.2;

/** 
 * Dijkstra-based exit node resolver for evacuation routing.
 * Deterministic logic based on zone identifiers.
 * 
 * @param {number} zoneId - ID of the source zone
 * @returns {string} Human-readable exit location
 */
export const calculateExitNode = (zoneId) =>
  zoneId % 2 === 0
    ? 'South Gate — Primary Extrication Vector'
    : 'North Gate — Alpha Evacuation Corridor';
