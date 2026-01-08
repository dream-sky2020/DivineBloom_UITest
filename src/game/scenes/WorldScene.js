import { clearWorld, world } from '@/game/ecs/world'
import { MovementSystem } from '@/game/ecs/systems/MovementSystem'
import { InputSystem } from '@/game/ecs/systems/InputSystem'
import { ConstraintSystem } from '@/game/ecs/systems/ConstraintSystem'
import { RenderSystem } from '@/game/ecs/systems/RenderSystem'
import { EnemyAISystem } from '@/game/ecs/systems/EnemyAISystem'
import { InteractionSystem } from '@/game/ecs/systems/InteractionSystem'
import { ActionSystem } from '@/game/ecs/systems/ActionSystem'
import { EnvironmentSystem } from '@/game/ecs/systems/EnvironmentSystem'
import { getAssetPath } from '@/data/assets'
import { Visuals } from '@/data/visuals'
import { ScenarioLoader } from '@/game/utils/ScenarioLoader'
import { EntityManager } from '@/game/entities/EntityManager'

/**
 * @typedef {import('@/game/GameEngine').GameEngine} GameEngine
 * @typedef {import('@/game/GameEngine').Renderer2D} Renderer2D
 */

export class WorldScene {
    /**
     * @param {GameEngine} engine 
     * @param {Function} [onEncounter]
     * @param {object} [initialState]
     * @param {object} [mapData]
     * @param {string} [entryId]
     * @param {Function} [onSwitchMap]
     * @param {Function} [onInteract]
     */
    constructor(engine, onEncounter, initialState = null, mapData = null, entryId = 'default', onSwitchMap = null, onInteract = null) {
        // Clear ECS world on scene init to prevent stale entities
        clearWorld()

        this.engine = engine
        this.onEncounter = onEncounter
        this.onSwitchMap = onSwitchMap
        this.onInteract = onInteract

        this.mapData = mapData || {}
        this.entryId = entryId

        // 初始化 Environment System
        EnvironmentSystem.init(this.mapData)

        // Time delta for animation
        this.lastDt = 0.016
        this.isLoaded = false

        // Convenience reference (populated during load)
        this.player = null

        if (initialState && initialState.isInitialized) {
            this.restore(initialState)
        } else {
            this._initScenario()
        }
    }

    _initScenario() {
        const { player } = ScenarioLoader.load(this.engine, this.mapData, this.entryId)
        this.player = player
    }

    // Getter for backward compatibility and debug UI
    get gameEntities() {
        // Return an array of all entities in the ECS world
        // Note: miniplex world is iterable or has entities property
        // We return an array to match the old array-based API
        return Array.from(world)
    }

    serialize() {
        // 获取所有需要序列化的实体
        // 这里我们假设所有有 'type' 属性的实体都需要序列化
        // 也可以使用 world.entities 但 miniplex 的迭代方式可能因版本而异，这里使用查询更稳妥
        // 或者直接遍历 world.entities 如果我们确信它是可迭代的
        const entitiesToSave = []

        // Miniplex world is iterable
        for (const entity of world) {
            if (entity.type) {
                entitiesToSave.push({
                    type: entity.type,
                    data: EntityManager.serialize(entity)
                })
            }
        }

        return {
            isInitialized: true,
            entities: entitiesToSave
        }
    }

    restore(state) {
        // clearWorld 已经在 constructor 开头调用过了，但如果是热加载或者手动调用 restore
        clearWorld()

        const { player } = ScenarioLoader.restore(this.engine, state)
        this.player = player
    }

    async load() {
        const requiredVisuals = new Set()
        requiredVisuals.add('default')

        // 扫描现有实体收集所需的 visual 资源
        const visualEntities = world.with('visual')
        for (const e of visualEntities) {
            requiredVisuals.add(e.visual.id)
        }

        if (this.mapData.backgroundId) {
            const bgPath = getAssetPath(this.mapData.backgroundId)
            if (bgPath) {
                await this.engine.assets.loadTexture(this.mapData.backgroundId)
            }
        }

        console.log('Preloading visuals:', Array.from(requiredVisuals))
        await this.engine.assets.preloadVisuals(Array.from(requiredVisuals), Visuals)

        this.isLoaded = true
    }

    /**
     * @param {number} dt 
     */
    update(dt) {
        if (!this.isLoaded) return
        this.lastDt = dt

        // Update Systems
        EnvironmentSystem.update(dt, this.engine)
        InputSystem.update(dt, this.engine.input)
        EnemyAISystem.update(dt)
        MovementSystem.update(dt)
        ConstraintSystem.update(dt)

        InteractionSystem.update({
            input: this.engine.input,
            onEncounter: this.onEncounter,
            onSwitchMap: this.onSwitchMap,
            onInteract: this.onInteract,
            onProximity: null,
            portals: this.mapData.portals
        })

        // Process Action Events
        ActionSystem.update({
            onEncounter: this.onEncounter,
            onSwitchMap: this.onSwitchMap,
            onInteract: this.onInteract
        })

        this.engine.renderer.setCamera(0, 0)
    }

    /**
     * @param {Renderer2D} renderer 
     */
    draw(renderer) {
        // 背景层
        EnvironmentSystem.draw(renderer, this.engine)

        if (!this.isLoaded) return

        // 实体层
        RenderSystem.update(renderer, this.lastDt)
    }
}
