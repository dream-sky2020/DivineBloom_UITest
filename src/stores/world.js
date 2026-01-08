import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWorldStore = defineStore('world', () => {
    // Current Map State
    const currentMapId = ref('demo_plains');
    const currentMapState = ref(null); // { playerPos, enemies, isInitialized }
    
    // Persistent World State: { mapId: { enemies: [], ... } }
    // Note: We only store "enemies" persistently per map. 
    // Player position is only relevant for the *current* map (or last saved spot).
    // When returning to a map, we spawn at an entry point, not where we were last time (usually).
    const worldStates = ref({}); 

    const saveState = (sceneInstance) => {
        if (!sceneInstance) return;
        
        // Serialize current scene
        const data = sceneInstance.serialize();
        
        // Update current runtime state (used for immediate restoration like battle return)
        currentMapState.value = {
            entities: data.entities,
            isInitialized: true
        };

        // Persist enemy state for this map ID
        // We merge with existing state to preserve other potential map data
        if (!worldStates.value[currentMapId.value]) {
            worldStates.value[currentMapId.value] = {};
        }
        worldStates.value[currentMapId.value].entities = data.entities;
    };

    const loadMap = (mapId) => {
        // Switch ID
        currentMapId.value = mapId;
        
        // Try to load persisted state for this map
        const persisted = worldStates.value[mapId];
        
        // 即使没有持久化数据，也要清空 currentMapState，防止残留上一张地图的状态
        // 如果有持久化数据，我们只恢复 enemies，playerPos 为 null 让场景使用出生点
        currentMapState.value = persisted && persisted.entities ? {
            isInitialized: true,
            entities: persisted.entities
        } : null;
    };

    const applyBattleResult = (result, enemyUuid) => {
        // Update both currentMapState and worldStates for consistency
        if (!currentMapState.value || !currentMapState.value.entities) return;

        const handleEntities = (entities) => {
             // 深度克隆以避免修改引用
            const newList = JSON.parse(JSON.stringify(entities));
            
            if (result === 'victory') {
                // 过滤掉被击败的敌人
                // 我们的 entities 结构是 { type: 'enemy', data: { options: { uuid: ... } } }
                return newList.filter(e => {
                    if (e.type !== 'enemy') return true; // 保留非敌人实体
                    return e.data.options.uuid !== enemyUuid;
                });
            } else if (result === 'flee') {
                // 找到敌人并标记眩晕
                const enemy = newList.find(e => e.type === 'enemy' && e.data.options.uuid === enemyUuid);
                if (enemy) {
                    if (!enemy.data.options) enemy.data.options = {};
                    enemy.data.options.isStunned = true;
                    enemy.data.options.stunnedTimer = 3.0;
                }
                return newList;
            }
            return newList;
        };

        // 1. Update Current
        currentMapState.value.entities = handleEntities(currentMapState.value.entities);

        // 2. Update Persisted
        if (worldStates.value[currentMapId.value]) {
            worldStates.value[currentMapId.value].entities = handleEntities(worldStates.value[currentMapId.value].entities);
        }
    };

    const clearState = () => {
        currentMapId.value = 'demo_plains';
        currentMapState.value = null;
        worldStates.value = {};
    };

    return {
        currentMapId,
        currentMapState,
        worldStates,
        saveState,
        loadMap,
        applyBattleResult,
        clearState
    };
});

