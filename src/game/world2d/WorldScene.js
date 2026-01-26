import { EntityManager } from '@world2d/entities/EntityManager'
import { BackgroundRenderSystem } from '@world2d/systems/render/BackgroundRenderSystem'
import { VisualRenderSystem } from '@world2d/systems/render/VisualRenderSystem'
import { PhysicsDebugRenderSystem } from '@world2d/systems/render/PhysicsDebugRenderSystem'
import { AIVisionRenderSystem } from '@world2d/systems/render/AIVisionRenderSystem'
import { AIPatrolDebugRenderSystem } from '@world2d/systems/render/AIPatrolDebugRenderSystem'
import { StatusRenderSystem } from '@world2d/systems/render/StatusRenderSystem'
import { DetectAreaRenderSystem } from '@world2d/systems/render/DetectAreaRenderSystem'
import { PortalDebugRenderSystem } from '@world2d/systems/render/PortalDebugRenderSystem'
import { InputSenseSystem } from '@world2d/systems/sense/InputSenseSystem'
import { AISenseSystem } from '@world2d/systems/sense/AISenseSystem'
import { MousePositionSenseSystem } from '@world2d/systems/sense/MousePositionSenseSystem'
import { PlayerIntentSystem } from '@world2d/systems/intent/PlayerIntentSystem'
import { PlayerControlSystem } from '@world2d/systems/control/PlayerControlSystem'
import { EnemyAIIntentSystem } from '@world2d/systems/intent/EnemyAIIntentSystem'
import { EnemyControlSystem } from '@world2d/systems/control/EnemyControlSystem'
import { MovementSystem } from '@world2d/systems/physics/MovementSystem'
import { CollisionSystem } from '@world2d/systems/physics/CollisionSystem'
import { DetectAreaSystem } from '@world2d/systems/detect/DetectAreaSystem'
import { DetectInputSystem } from '@world2d/systems/detect/DetectInputSystem'
import { TriggerSystem } from '@world2d/systems/event/TriggerSystem'
import { ExecuteSystem } from '@world2d/systems/execute/ExecuteSystem'
import { CameraSystem } from '@world2d/systems/camera/CameraSystem'
import { TimeSystem } from '@world2d/systems/time/TimeSystem'
import { clearWorld, world } from '@world2d/world'
import { GlobalEntity } from '@world2d/entities/definitions/GlobalEntity'
import { EditorGridRenderSystem } from '@world2d/systems/render/EditorGridRenderSystem'
import { EditorInteractionSystem } from '@world2d/systems/editor/EditorInteractionSystem'
import { EditorHighlightRenderSystem } from '@world2d/systems/editor/EditorHighlightRenderSystem'
import { editorManager } from '@/game/editor/core/EditorCore'
import { createLogger } from '@/utils/logger'

const logger = createLogger('WorldScene')

/**
 * @typedef {import('@world2d/GameEngine').GameEngine} GameEngine
 * @typedef {import('@world2d/GameEngine').Renderer2D} Renderer2D
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
     * @param {Function} [onOpenMenu]
     * @param {Object} [stateProvider]
     */
    constructor(engine, onEncounter, initialState = null, mapData = null, entryId = 'default', onSwitchMap = null, onInteract = null, onOpenMenu = null, stateProvider = null) {
        // Clear ECS world on scene init to prevent stale entities
        clearWorld()

        this.engine = engine
        this.onEncounter = onEncounter
        this.onSwitchMap = onSwitchMap
        this.onInteract = onInteract
        this.onOpenMenu = onOpenMenu
        this.stateProvider = stateProvider || {}

        this.mapData = mapData || {}
        this.entryId = entryId

        // 初始化 Environment System
        DetectAreaRenderSystem.init(this.mapData)
        PortalDebugRenderSystem.init(this.mapData)
        AISenseSystem.init?.(this.mapData)

        // 🎯 系统注册表化 (System Registry)
        this.systems = {
            // 逻辑阶段 (Logic Phases)
            logic: {
                sense: [AISenseSystem, DetectAreaSystem, DetectInputSystem, MousePositionSenseSystem],
                intent: [PlayerIntentSystem, EnemyAIIntentSystem],
                decision: [TriggerSystem],
                control: [PlayerControlSystem, EnemyControlSystem],
                physics: [MovementSystem, CollisionSystem],
                execution: [ExecuteSystem]
            },
            // 渲染管线 (Render Pipeline)
            render: [
                BackgroundRenderSystem, // Layer 10
                AIPatrolDebugRenderSystem, // Layer 12
                AIVisionRenderSystem,   // Layer 15
                VisualRenderSystem,     // Layer 20
                StatusRenderSystem,     // Layer 30
                PhysicsDebugRenderSystem, // Layer 110
                DetectAreaRenderSystem,  // Layer 100 (Debug)
                PortalDebugRenderSystem  // Layer 105 (Portal Debug)
            ],
            // 编辑器阶段 (Editor Phases)
            editor: {
                sense: [InputSenseSystem, MousePositionSenseSystem],
                interaction: [EditorInteractionSystem],
                render: [EditorGridRenderSystem, EditorHighlightRenderSystem]
            }
        }

        // 预排序渲染管线
        this._sortRenderPipeline()

        // Time delta for animation
        this.lastDt = 0.016

        // Convenience reference (populated during load)
        this.player = null

        this.editMode = false

        // Initialize Global Entities (Command Queue)
        this._initGlobalEntities()
    }

    /**
     * 对渲染管线按 LAYER 排序
     */
    _sortRenderPipeline() {
        this.systems.render.sort((a, b) => (a.LAYER || 0) - (b.LAYER || 0))
    }

    _initGlobalEntities() {
        const existing = world.with('globalManager').first
        if (!existing) {
            GlobalEntity.create()
        }
    }

    /**
     * Map Loaded Callback
     */
    onMapLoaded(mapData) {
        DetectAreaRenderSystem.init(mapData)
        PortalDebugRenderSystem.init(mapData)
        AISenseSystem.init?.(mapData)
        logger.info('Map systems reinitialized')
    }

    /**
     * 进入编辑模式
     */
    enterEditMode() {
        this.editMode = true
        // 将编辑器渲染系统加入主管线
        this.systems.editor.render.forEach(sys => {
            if (!this.systems.render.includes(sys)) {
                this.systems.render.push(sys)
            }
        })
        this._sortRenderPipeline()
    }

    /**
     * 退出编辑模式
     */
    exitEditMode() {
        this.editMode = false
        // 从主管线移除编辑器渲染系统
        this.systems.render = this.systems.render.filter(s => !this.systems.editor.render.includes(s))

        // 重置交互状态
        EditorInteractionSystem.selectedEntity = null
        EditorInteractionSystem.isDragging = false
        editorManager.selectedEntity = null
    }

    /**
     * Serialize the current scene state (entities)
     */
    serialize() {
        const entitiesData = []
        for (const entity of world) {
            if (entity.globalManager) continue;
            const item = EntityManager.serialize(entity)
            if (item) {
                entitiesData.push(item)
            }
        }
        return {
            isInitialized: true,
            entities: entitiesData
        }
    }

    /**
     * 销毁场景，释放资源防止内存泄漏
     */
    destroy() {
        logger.info('Destroying scene...')

        // 1. 清理引用
        this.player = null
        this.engine = null
        this.stateProvider = null
        this.mapData = null

        // 2. 清理系统
        this.systems.logic = null
        this.systems.render = null
        this.systems.editor = null
        this.systems = null

        // 3. 清理 ECS 世界 (如果这是当前唯一的场景)
        clearWorld()
    }

    /**
     * @param {number} dt 
     */
    update(dt) {
        this.lastDt = dt

        // 1. 始终运行的系统 (动画、时间等)
        VisualRenderSystem.update(dt)
        TimeSystem.update(dt)

        // 2. 编辑器模式逻辑
        if (this.editMode) {
            // 编辑器感官 (Input + Mouse)
            this.systems.editor.sense.forEach(s => s.update(dt, this.engine.input || this.engine))
            // 编辑器交互 (Drag/Select)
            this.systems.editor.interaction.forEach(s => s.update(dt, this.engine, this.stateProvider.gameManager))
        }

        // 3. 编辑器命令处理 (始终执行，不受暂停影响)
        // 这样可以确保编辑器的删除、保存等操作能够立即响应
        ExecuteSystem.update({
            onEncounter: this.onEncounter,
            onSwitchMap: null,
            onInteract: this.onInteract,
            onOpenMenu: this.onOpenMenu,
            gameManager: this.stateProvider.gameManager // 传入 gameManager
        }, this.mapData)

        // 4. 基础游戏逻辑 (受暂停影响)
        const isPaused = this.stateProvider.gameManager && this.stateProvider.gameManager.state.isPaused

        if (!isPaused && !this.isTransitioning) {
            // 如果不在编辑模式，才更新常规输入感知
            if (!this.editMode) {
                InputSenseSystem.update(dt, this.engine.input)
            }

            // 核心逻辑阶段驱动
            const phases = ['sense', 'intent', 'decision', 'control']
            phases.forEach(phase => {
                this.systems.logic[phase].forEach(system => {
                    // MousePositionSenseSystem 需要 engine 对象而不仅仅是 input
                    if (system === MousePositionSenseSystem) {
                        system.update(dt, this.engine)
                    } else {
                        system.update(dt)
                    }
                })
            })

            // 物理阶段 (优先从 SceneConfig 组件读取动态数据)
            const sceneConfigEntity = world.with('sceneConfig').first;
            const mapWidth = sceneConfigEntity ? sceneConfigEntity.sceneConfig.width : (this.mapData.width || 800);
            const mapHeight = sceneConfigEntity ? sceneConfigEntity.sceneConfig.height : (this.mapData.height || 600);

            const physicsOptions = {
                mapBounds: { width: mapWidth, height: mapHeight }
            }
            this.systems.logic.physics.forEach(system => system.update(dt, physicsOptions))

            // 5. 更新相机 (在物理和逻辑之后)
            CameraSystem.update(dt, {
                viewportWidth: this.engine.width,
                viewportHeight: this.engine.height,
                mapBounds: { width: mapWidth, height: mapHeight }
            })
        }

        // 6. 场景管理 (始终运行以处理切换请求)
        this._updateSceneManagement()
    }

    /**
     * 处理场景切换和管理器更新
     */
    _updateSceneManagement() {
        if (this.stateProvider.sceneManager) {
            const transitionEntity = world.with('sceneTransition').first
            if (transitionEntity) {
                const request = transitionEntity.sceneTransition
                this.stateProvider.sceneManager.requestSwitchMap(request.mapId, request.entryId)
                world.removeComponent(transitionEntity, 'sceneTransition')
            }
            this.stateProvider.sceneManager.update()
        }
    }

    /**
     * @param {Renderer2D} renderer 
     */
    draw(renderer) {
        // 同步相机状态到渲染器
        const globalEntity = world.with('camera', 'globalManager').first
        if (globalEntity && globalEntity.camera) {
            renderer.setCamera(globalEntity.camera.x, globalEntity.camera.y)
        }

        // 自动渲染管线驱动
        for (const system of this.systems.render) {
            if (system.draw) {
                system.draw(renderer)
            }
        }
    }
}
