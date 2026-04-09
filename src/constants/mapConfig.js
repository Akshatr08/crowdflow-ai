/**
 * Enterprise Constants: SVG Architectural Map Layer
 * 
 * Defines high-fidelity SVG path data for a realistic 8-sector stadium model.
 * Each path represents a distinct seating stand (North, South, East, West, etc.)
 */
export const mapConfig = {
    // North Stand (Top)
    1: { 
        id: 1, 
        labelRef: 'N', 
        path: "M280,100 Q400,60 520,100 L500,180 Q400,150 300,180 Z",
        labelPos: { x: 400, y: 120 }
    },
    // South Stand (Bottom)
    2: { 
        id: 2, 
        labelRef: 'S', 
        path: "M280,500 Q400,540 520,500 L500,420 Q400,450 300,420 Z",
        labelPos: { x: 400, y: 480 }
    },
    // West Stand (Left)
    3: { 
        id: 3, 
        labelRef: 'W', 
        path: "M100,180 Q60,300 100,420 L180,400 Q150,300 180,200 Z",
        labelPos: { x: 120, y: 300 }
    },
    // East Stand (Right)
    4: { 
        id: 4, 
        labelRef: 'E', 
        path: "M700,180 Q740,300 700,420 L620,400 Q650,300 620,200 Z",
        labelPos: { x: 680, y: 300 }
    },
    // Northwest Sector
    5: { 
        id: 5, 
        labelRef: 'NW', 
        path: "M150,110 Q200,80 260,100 L280,180 Q230,165 205,195 Z",
        labelPos: { x: 210, y: 140 }
    },
    // Southeast Sector
    6: { 
        id: 6, 
        labelRef: 'SE', 
        path: "M650,490 Q600,520 540,500 L520,420 Q570,435 595,405 Z",
        labelPos: { x: 590, y: 460 }
    }
};
