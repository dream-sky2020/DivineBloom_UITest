// Use dynamic imports for lazy loading
export const maps = {
    village: () => import('./maps/village').then(m => m.village),
    forest: () => import('./maps/forest').then(m => m.forest),
    demo_plains: () => import('./maps/demo_plains').then(m => m.demo_plains)
}

// Helper to get map data
export const getMapData = async (mapId) => {
    const loader = maps[mapId]
    if (!loader) return null
    return await loader()
}
