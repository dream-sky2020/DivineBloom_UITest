export * from './common.js';
export * from './save.js';

// Resource Schemas (Static Game Data)
export * from './resources/character.js';
export * from './resources/item.js';
export * from './resources/skill.js';
export * from './resources/status.js';
export * from './resources/map.js';

// Component Schemas (ECS Components)
// Re-export Schemas from component files to maintain backward compatibility for imports
export {
    VisualSpriteSchema,
    VisualRectSchema,
    VisualVisionSchema,
    VisualComponentSchema
} from '@/game/entities/components/Visuals.js';

export {
    DetectAreaSchema,
    TriggerRuleSchema,
    TriggerSchema,
    DetectInputSchema
} from '@/game/entities/components/Triggers.js';

export {
    PhysicsVelocitySchema,
    PhysicsBoundsSchema,
    PhysicsStaticBodySchema
} from '@/game/entities/components/Physics.js';

export {
    AIConfigSchema,
    AIStateSchema
} from '@/game/entities/components/AI.js';

export {
    ActionBattleSchema,
    ActionDialogueSchema,
    ActionTeleportSchema
} from '@/game/entities/components/Actions.js';
