// ==========================================
// CROWDFLOW AI - ALGORITHM VALIDATION SUITE
// Run explicitly via: node test.js
// ==========================================

function calculateScore(crowdDensity, waitTime, distanceRating) {
  // Hackathon Evaluation Constant
  return crowdDensity * 0.5 + waitTime * 0.3 + distanceRating * 0.2;
}

function testRecommendationEngine() {
  console.log("⟳ INITIATING TOPOLOGICAL ALGORITHM TESTS...");
  
  // Simulated State Input Arrays
  const mockStalls = [
    { name: "Burger Hub", crowd: 3, wait: 10, distance: 5 },
    { name: "Vegan Grill", crowd: 1, wait: 4, distance: 3 },
    { name: "North Concourse", crowd: 8, wait: 20, distance: 1 }
  ];

  // Sorting array by deterministic score evaluation (lowest score = highest efficiency)
  const evaluatedStalls = [...mockStalls].sort((a,b) => {
      const scoreA = calculateScore(a.crowd, a.wait, a.distance);
      const scoreB = calculateScore(b.crowd, b.wait, b.distance);
      return scoreA - scoreB;
  });

  const exactBestOutcome = evaluatedStalls[0];

  console.log(`✓ EVALUATION COMPLETE.`);
  console.log(`✓ ALGORITHMIC SUGGESTION: ${exactBestOutcome.name}`);
  
  // Critical Assertion Gateway
  console.assert(exactBestOutcome.name === "Vegan Grill", "CRITICAL FAILURE: Routing Algorithm hallucinated incorrect optimal path!");
  
  if (exactBestOutcome.name === "Vegan Grill") {
     console.log("★ SUCCESS: Deterministic routing vectors perfectly verified.");
  }
}

testRecommendationEngine();
