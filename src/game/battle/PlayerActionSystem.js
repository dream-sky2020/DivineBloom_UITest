/**
 * 玩家指令处理系统 (Player Action System)
 */

/**
 * 执行玩家动作
 * @param {Object} facade BattleFacade 实例
 * @param {string} actionType 动作类型 (attack, skill, item, defend, etc.)
 * @param {any} payload 动作负载 (skillId, itemId, action object 等)
 * @param {Object} state 状态对象 { actor, boostLevel, partySlots }
 * @param {Object} config 配置与依赖 { context, skillsDb, itemsDb }
 * @param {Object} callbacks 回调函数 { log, onRunAway, onEndTurn, onPerformSwitch, onWaitInput }
 */
export const executePlayerAction = async (facade, actionType, payload, state, config, callbacks) => {
    const { actor, boostLevel, partySlots } = state;
    const { context, skillsDb, itemsDb } = config;
    const { log, onRunAway, onEndTurn, onPerformSwitch, onWaitInput } = callbacks;

    if (!actor || !actor.isPlayer) return;

    let consumeTurn = true;
    let actionExecuted = false;

    // 计算能量倍率 (Boost System)
    let energyMult = 1.0;
    let consumedEnergy = 0;
    if (boostLevel > 0) {
        energyMult = 1.0 + (boostLevel * 0.5);
        consumedEnergy = boostLevel;
        log('battle.energyConsume', { name: actor.name, energy: consumedEnergy });
    }

    const actionContext = { ...context, energyMult };

    // 标准化动作格式
    let action = { type: actionType };
    if (typeof payload === 'object' && payload !== null) {
        action = { ...action, ...payload };
    } else {
        action.skillId = payload; // 兼容旧版
    }

    // 根据类型处理逻辑
    if (actionType === 'item') {
        if (!action.itemId) return;
        
        // 消耗物品
        if (actionContext.consumeItem) {
            actionContext.consumeItem(action.itemId, 1);
        }

        const item = itemsDb[action.itemId];
        if (item && item.consumeTurn === false) consumeTurn = false;
        
        log('battle.useItem', { user: actor.name, item: item.name });
        facade.handleItemEffect(action.itemId, action.targetId, actor, actionContext);
        actionExecuted = true;

    } else if (actionType === 'skill') {
        const skill = skillsDb[action.skillId];
        if (!facade.canUseSkill(actor, skill, context)) {
            log('battle.notEnoughMp');
            return; 
        }
        // 支付消耗
        facade.skill.paySkillCost(actor, skill, context);
        
        // 扣除能量
        if (consumedEnergy > 0) {
            actor.energy = Math.max(0, (actor.energy || 0) - consumedEnergy);
        }
        
        const result = facade.executeAction(actor, action, actionContext);
        consumeTurn = result.consumeTurn;
        actionExecuted = true;

    } else if (actionType === 'attack') {
        if (consumedEnergy > 0) {
            actor.energy = Math.max(0, (actor.energy || 0) - consumedEnergy);
        }
        const result = facade.executeAction(actor, action, actionContext);
        consumeTurn = result.consumeTurn;
        actionExecuted = true;

    } else if (actionType === 'defend') {
        actor.isDefending = true;
        log('battle.defending', { name: actor.name });
        actionExecuted = true;

    } else if (actionType === 'switch') {
        const slotIndex = partySlots.findIndex(s => s.front && s.front.id === actor.id);
        if (slotIndex !== -1) {
            const slot = partySlots[slotIndex];
            if (slot && slot.back && slot.back.currentHp > 0) {
                onPerformSwitch(slotIndex);
                actionExecuted = true;
            } else {
                log('battle.cannotSwitch');
                return;
            }
        }

    } else if (actionType === 'skip') {
        actor.energy = Math.min(6, (actor.energy || 0) + 1);
        log('battle.skipTurn', { name: actor.name });
        actionExecuted = true;

    } else if (actionType === 'reorganize') {
        log('battle.reorganize', { name: actor.name });
        actionExecuted = true;

    } else if (actionType === 'run') {
        onRunAway();
        return;
    }

    if (actionExecuted) {
        if (consumeTurn) {
            onEndTurn(actor);
        } else {
            onWaitInput();
        }
    }
};
