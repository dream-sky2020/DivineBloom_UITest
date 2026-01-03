export const maps = {
    'demo_plains': {
        id: 'demo_plains',
        name: 'Demo Plains',
        // World bounds (currently view based, but let's define logical size)
        // The current game engine seems to fit canvas to window, so 'width'/'height' are dynamic
        // But for a map system, we usually want fixed world coordinates.
        // Let's assume the current logic relies on screen size for some things, 
        // but for spawning we should use relative or safe absolute coordinates.

        // Playable area constraints
        constraints: {
            minYRatio: 0.35 // top 35% is sky/unwalkable
        },

        spawnPoint: { x: 100, y: 400 },

        background: {
            groundColor: '#bbf7d0',
            decorations: [
                // Using yRatio to adapt to screen height as per original code style
                { type: 'rect', x: 80, yRatio: 0.55, width: 140, height: 18, color: 'rgba(0,0,0,0.10)' },
                { type: 'rect', x: 260, yRatio: 0.70, width: 200, height: 18, color: 'rgba(0,0,0,0.10)' }
            ]
        },

        spawners: [
            {
                // Chasers (Wolf)
                enemyIds: [203],
                count: 1,
                area: { x: 300, y: 300, w: 500, h: 300 },
                options: { aiType: 'chase', visionRadius: 200, speed: 110 }
            },
            {
                // Fleers (Bat)
                enemyIds: [202],
                count: 1,
                area: { x: 300, y: 300, w: 500, h: 300 },
                options: { aiType: 'flee', visionRadius: 150, speed: 130 }
            },
            {
                // Wanderers (Slime)
                enemyIds: [201],
                count: 1,
                area: { x: 300, y: 300, w: 500, h: 300 },
                options: { aiType: 'wander', visionRadius: 100, speed: 60 }
            },
            {
                // Guards (Heavy Guard)
                enemyIds: [204],
                count: 1,
                area: { x: 300, y: 300, w: 500, h: 300 },
                options: { aiType: 'chase', visionType: 'hybrid', visionAngle: 75, visionRadius: 250, speed: 90, suspicionTime: 1.5 }
            },
            {
                // Patrol (Elite Guard) - Pure Cone Vision
                // Group encounter: 1 Heavy Guard (204) + 2 Wolves (203)
                enemyIds: [204, 203, 203, 202],
                count: 1,
                area: { x: 500, y: 300, w: 200, h: 200 },
                options: { aiType: 'chase', visionType: 'cone', visionAngle: 60, visionRadius: 300, speed: 70, suspicionTime: 2.0 }
            },
            {
                // Timid Slime (Flee with hesitation)
                enemyIds: [201, 201],
                count: 2,
                area: { x: 100, y: 500, w: 200, h: 200 },
                options: { aiType: 'flee', visionRadius: 180, speed: 100, suspicionTime: 1.0 }
            },
            {
                // Skittish Bird (Flee with long observation)
                enemyIds: [202, 202],
                count: 2,
                area: { x: 600, y: 100, w: 200, h: 200 },
                options: { aiType: 'flee', visionType: 'cone', visionAngle: 120, visionRadius: 220, speed: 140, suspicionTime: 2.5 }
            }
        ]
    }
}

