import { EntityManager } from '@/game/entities/EntityManager'
import { PlayerConfig } from '@/data/assets'

export class ScenarioLoader {
    /**
     * 加载场景实体 (Player, Enemies, NPCs)
     * @param {object} engine 
     * @param {object} mapData 
     * @param {string} entryId 
     * @returns {object} 返回创建的关键实体引用 (如 player)
     */
    static load(engine, mapData, entryId = 'default') {
        const result = {
            player: null,
            entities: []
        }

        if (!mapData) return result

        // 1. Create Player
        // 默认位置，会被 spawn point 覆盖
        const player = EntityManager.createPlayer({
            x: 200,
            y: 260,
            scale: PlayerConfig.scale
        })
        result.entities.push(player)
        result.player = player

        // Set Player Spawn from Entry Point
        let spawn = mapData.spawnPoint
        if (mapData.entryPoints && mapData.entryPoints[entryId]) {
            spawn = mapData.entryPoints[entryId]
        }

        if (spawn) {
            player.position.x = spawn.x
            player.position.y = spawn.y
        }

        // 2. Spawn Enemies
        if (mapData.spawners) {
            mapData.spawners.forEach(spawner => {
                for (let i = 0; i < spawner.count; i++) {
                    let x = 0, y = 0
                    if (spawner.area) {
                        x = spawner.area.x + Math.random() * spawner.area.w
                        y = spawner.area.y + Math.random() * spawner.area.h
                    } else {
                        x = 300
                        y = 300
                    }

                    const group = spawner.enemyIds.map(id => ({ id }))
                    const enemyData = {
                        x, y,
                        battleGroup: group,
                        options: {
                            ...spawner.options,
                            minYRatio: mapData.constraints?.minYRatio,
                        }
                    }

                    const enemyEntity = EntityManager.createEnemy(enemyData)
                    result.entities.push(enemyEntity)
                }
            })
        }

        // 3. Spawn NPCs
        if (mapData.npcs) {
            mapData.npcs.forEach(data => {
                const npcData = {
                    x: data.x,
                    y: data.y,
                    config: {
                        ...data,
                        x: undefined,
                        y: undefined
                    }
                }

                const npcEntity = EntityManager.createNPC(npcData)
                result.entities.push(npcEntity)
            })
        }

        return result
    }

    /**
     * 从保存状态恢复实体
     * @param {object} engine 
     * @param {object} state 
     * @returns {object} { player, entities }
     */
    static restore(engine, state) {
        const result = {
            player: null,
            entities: []
        }

        if (state.entities) {
            state.entities.forEach(item => {
                const entity = EntityManager.create(engine, item.type, item.data, {
                    player: null
                })

                if (entity) {
                    result.entities.push(entity)
                    if (entity.type === 'player') {
                        result.player = entity
                    }
                }
            })
        }

        // Fallback: recreate player if missing
        if (!result.player) {
            console.warn('Player not found in save state, recreating...')
            const player = EntityManager.createPlayer({
                x: 200,
                y: 260,
                scale: PlayerConfig.scale
            })
            result.entities.push(player)
            result.player = player
        }

        return result
    }
}

