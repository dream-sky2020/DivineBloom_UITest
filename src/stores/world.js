import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWorldStore = defineStore('world', () => {
    const playerPos = ref(null); // { x, y }
    const enemies = ref(null); // Array of enemy data
    const isInitialized = ref(false);

    const saveState = (player, enemyList) => {
        playerPos.value = { x: player.pos.x, y: player.pos.y };
        
        // Serialize enemies
        enemies.value = enemyList.map(e => ({
            x: e.pos.x,
            y: e.pos.y,
            battleGroup: e.battleGroup,
            options: {
                aiType: e.aiType,
                visionRadius: e.visionRadius,
                visionType: e.visionType,
                // Convert radians back to degrees for consistency if needed, 
                // but MapEnemy constructor converts degrees to radians.
                // Let's store what constructor expects (degrees).
                // e.visionAngle is in radians.
                visionAngle: Math.round(e.visionAngle * (180 / Math.PI)),
                speed: e.speed
            }
        }));
        
        isInitialized.value = true;
    };

    const clearState = () => {
        playerPos.value = null;
        enemies.value = null;
        isInitialized.value = false;
    };

    return {
        playerPos,
        enemies,
        isInitialized,
        saveState,
        clearState
    };
});

