/**
 * Schema 注册表 (Zod Definitions Registry)
 * 用于统一导出所有的 Zod Schema 定义，供业务逻辑和 ECS 组件校验使用。
 * 注意：此处仅导出定义，不包含具体的数据库实例。
 */

export * from './common.js';
export * from './save.js';
export * from './effects.js';
export * from './config.js';

// Resource Schemas (Static Game Data)
export * from './resources/character.js';
export * from './resources/item.js';
export * from './resources/skill.js';
export * from './resources/status.js';
export * from './resources/map.js';
export * from './resources/tag.js';

// Component Schemas (ECS Components)
export {
    VisualSpriteSchema,
    VisualRectSchema,
    VisualVisionSchema,
    VisualComponentSchema
} from '@world2d/entities/components/Visuals.js';

export {
    DetectAreaSchema,
    TriggerRuleSchema,
    TriggerSchema,
    DetectInputSchema
} from '@world2d/entities/components/Triggers.js';

export {
    PhysicsVelocitySchema,
    PhysicsBoundsSchema,
    ColliderSchema
} from '@world2d/entities/components/Physics.js';

export {
    AIConfigSchema,
    AIStateSchema
} from '@world2d/entities/components/AI.js';

export {
    ActionBattleSchema,
    ActionDialogueSchema,
    ActionTeleportSchema
} from '@world2d/entities/components/Actions.js';

export {
    BattleResultSchema
} from '@world2d/entities/components/BattleResult.js';

// Entity Definition Schemas
export {
    PortalEntitySchema
} from '@world2d/entities/definitions/PortalEntity.js';

export {
    NPCEntitySchema
} from '@world2d/entities/definitions/NPCEntity.js';

export {
    EnemyEntitySchema
} from '@world2d/entities/definitions/EnemyEntity.js';

export {
    PlayerEntitySchema
} from '@world2d/entities/definitions/PlayerEntity.js';

export {
    BackgroundGroundSchema
} from '@world2d/entities/definitions/BackgroundEntity.js';

export {
    DecorationEntitySchema
} from '@world2d/entities/definitions/DecorationEntity.js';

export {
    GlobalEntitySchema
} from '@world2d/entities/definitions/GlobalEntity.js';

export {
    SceneConfigSchema
} from '@world2d/entities/components/SceneConfig.js';

export {
    ObstacleEntitySchema
} from '@world2d/entities/definitions/ObstacleEntity.js';
