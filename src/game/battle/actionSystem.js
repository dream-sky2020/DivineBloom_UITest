import { skillsDb } from '@schema/skills';
import { itemsDb } from '@schema/items';
import * as TargetSystem from './targetSystem';
import * as EffectSystem from './effectSystem';
import * as DamageSystem from './damageSystem';
import * as SkillSystem from './skillSystem';

/**
 * 执行战斗动作
 * @param {Object} actor 执行动作的单位
 * @param {Object} action 动作描述 { type, skillId, targetId, ... }
 * @param {Object} context 战斗上下文 { log, enemies, partySlots, ... }
 * @returns {Object} 结果 { consumeTurn: boolean }
 */
export const executeAction = (actor, action, context) => {
    const { log, enemies, partySlots } = context;
    let targetType = 'single';
    let effects = [];
    let skillData = null;
    let consumeTurn = true; // Default to consuming turn

    // --- Energy System Consumption ---
    let energyMult = 1.0;
    // Check energy boost (either manually set for player via boostLevel, or existing energy for AI)
    // For Player, boostLevel logic handles the deduction before calling this, but for AI/Generic
    // we might need to handle it.
    // However, the Store logic passed `energyMult` in context or handled it before.
    // Let's assume context.energyMult is passed if manual boost was used, 
    // OR we consume actor.energy if it's an AI/automatic action.
    
    // Logic adaptation:
    // If context has explicit energyMult, use it.
    // Else if actor has energy and is NOT player (AI logic), consume it.
    
    if (context.energyMult !== undefined) {
        energyMult = context.energyMult;
    } else if ((actor.energy || 0) > 0) {
        energyMult = 1.0 + (actor.energy * 0.5);
        if (log) log('battle.energyConsume', { name: actor.name, energy: actor.energy });
        actor.energy = 0;
    }
    
    const actionContext = { ...context, energyMult };

    // 1. Prepare Action Data
    if (action.type === 'custom_skill') {
        targetType = action.targetType || 'single';
        effects = action.effects || [];
        if (action.consumeTurn === false) consumeTurn = false;

        // Custom Log
        if (action.logKey && log) {
            let targetName = '';
            if (action.targetId) {
                const t = TargetSystem.findPartyMember(partySlots, action.targetId) || enemies.find(e => e.uuid === action.targetId || e.id === action.targetId);
                if (t) targetName = t.name;
            }
            log(action.logKey, { name: actor.name, target: targetName });
        }

    } else if (action.type === 'skill') {
        skillData = skillsDb[action.skillId];
        if (!skillData) return { consumeTurn: false }; // Fail safe

        targetType = skillData.targetType || 'single';
        effects = skillData.effects || [];
        if (skillData.consumeTurn === false) consumeTurn = false;

        if (log) log('battle.useSkill', { user: actor.name, skill: skillData.name });

    } else if (action.type === 'attack') {
        targetType = 'enemy';
        effects = [{ type: 'damage', value: 1, scaling: 'atk' }];
    }

    // Override targetType if specified in action (AI overrides DB)
    if (action.targetType) targetType = action.targetType;

    // 2. Resolve Targets (Context Aware)
    const targets = TargetSystem.resolveTargets({
        partySlots,
        enemies,
        actor,
        targetId: action.targetId
    }, targetType);

    // Attack specific log
    if (action.type === 'attack' && targets.length > 0 && log) {
        log('battle.attacks', { attacker: actor.name, target: targets[0].name });
    }

    // 3. Apply Effects
    if (skillData && skillData.chain) {
         // Chain Logic via SkillSystem
         const initialTarget = enemies.find(e => e.uuid === action.targetId || e.id === action.targetId);
         const hits = SkillSystem.resolveChainSequence(skillData, initialTarget, enemies);

         hits.forEach(({ target, multiplier, hitIndex }) => {
             let damageDealt = 0;
             skillData.effects.forEach(eff => {
                 const finalEffect = { ...eff };
                 if (finalEffect.type === 'damage') {
                     finalEffect.value *= multiplier;
                 }
                 const val = EffectSystem.processEffect(finalEffect, target, actor, skillData, actionContext, true);
                 if (finalEffect.type === 'damage') damageDealt += val;
             });

             if (log) log('battle.chainHit', { count: hitIndex, target: target.name, amount: damageDealt });
         });
    } else if (skillData && skillData.randomHits) {
         // Random Sequence Logic
         const hits = SkillSystem.resolveRandomSequence(skillData, enemies);

         hits.forEach(({ target, hitIndex }) => {
             let damageDealt = 0;
             skillData.effects.forEach(eff => {
                 const val = EffectSystem.processEffect(eff, target, actor, skillData, actionContext, true);
                 if (eff.type === 'damage') damageDealt += val;
             });

             if (log) log('battle.randomHit', { count: hitIndex, target: target.name, amount: damageDealt });
         });
    } else {
        // Standard Processing
        targets.forEach(target => {
            let lastResult = 0;
            // For basic attacks, use the constructed effects list
            // For skills, use skillData.effects (which is same as effects variable usually, but explicit is good)
            const effectsToProcess = (skillData && skillData.effects) ? skillData.effects : effects;

            effectsToProcess.forEach(eff => {
                // If it's a basic attack, we calculate damage specifically to use the DamageSystem fully
                if (action.type === 'attack' && eff.type === 'damage') {
                    const dmg = DamageSystem.calculateDamage(actor, target, null, null, energyMult);
                    DamageSystem.applyDamage(target, dmg, actionContext);
                    lastResult = dmg;
                } else {
                    lastResult = EffectSystem.processEffect(eff, target, actor, skillData, actionContext, false, lastResult);
                }
            });
        });
    }

    return { consumeTurn };
};

/**
 * 处理物品使用效果
 */
export const handleItemEffect = (itemId, targetId, actor, context) => {
    const item = itemsDb[itemId];
    if (!item || !item.effects) return;
    
    const { partySlots, enemies } = context;

    const targets = TargetSystem.resolveTargets({
        partySlots,
        enemies,
        actor,
        targetId
    }, item.targetType);

    // Apply all effects to all targets
    targets.forEach(target => {
        item.effects.forEach(effect => {
            EffectSystem.processEffect(effect, target, actor, null, context);
        });
    });
};
