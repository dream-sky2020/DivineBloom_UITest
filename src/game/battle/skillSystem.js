import { statusDb } from '@/data/status';

/**
 * 解析连锁技能 (Chain Skill) 的命中序列
 * @param {Object} skill 技能对象
 * @param {Object} initialTarget 初始目标
 * @param {Array} allEnemies 所有敌人列表
 * @returns {Array} 命中序列 [{ target, damageMultiplier, hitIndex }]
 */
export const resolveChainSequence = (skill, initialTarget, allEnemies) => {
    const hits = [];
    const bounceCount = skill.chain || 0;
    const decay = skill.decay || 0.85;
    let multiplier = 1.0;

    // 用于记录已命中的目标 UUID，避免重复（如果设计允许重复可移除）
    const hitIds = new Set();

    let currentTarget = initialTarget;

    // 如果初始目标无效，尝试找一个替补
    if (!currentTarget || currentTarget.currentHp <= 0) {
        currentTarget = allEnemies.find(e => e.currentHp > 0);
    }

    for (let i = 0; i < bounceCount; i++) {
        if (!currentTarget) break;

        // 记录命中
        hitIds.add(currentTarget.uuid);
        hits.push({
            target: currentTarget,
            multiplier: multiplier,
            hitIndex: i + 1
        });

        // 衰减伤害
        multiplier *= decay;

        // 寻找下一个目标 (随机一个没被击中过的活着的目标)
        const candidates = allEnemies.filter(e =>
            e.currentHp > 0 && !hitIds.has(e.uuid)
        );

        if (candidates.length === 0) break;

        // 随机选择
        currentTarget = candidates[Math.floor(Math.random() * candidates.length)];
    }

    return hits;
};

/**
 * 解析随机多次攻击序列 (Random Sequence)
 * @param {Object} skill 技能对象
 * @param {Array} allEnemies 所有敌人列表
 * @returns {Array} 命中序列 [{ target, hitIndex }]
 */
export const resolveRandomSequence = (skill, allEnemies) => {
    const hits = [];
    const count = skill.randomHits || 1;

    for (let i = 0; i < count; i++) {
        // 每次都重新筛选存活的敌人
        const candidates = allEnemies.filter(e => e.currentHp > 0);
        if (candidates.length === 0) break;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        hits.push({
            target: target,
            hitIndex: i + 1
        });
    }
    return hits;
};

/**
 * 检查技能消耗是否满足
 * @param {Object} actor 行动者
 * @param {Object} skill 技能定义
 * @param {Object} context 上下文 (包含 inventory 等)
 * @returns {Boolean}
 */
export const checkSkillCost = (actor, skill, context) => {
    // 1. 优先检查结构化的 costs 数组
    if (skill.costs && skill.costs.length > 0) {
        for (const cost of skill.costs) {
            if (cost.type === 'mp') {
                if (actor.currentMp < cost.amount) return false;
            } else if (cost.type === 'hp') {
                if (actor.currentHp <= cost.amount) return false; // 通常不能自杀
            } else if (cost.type === 'status_duration') {
                // 检查是否有足够的 status 持续时间 (duration)
                const status = actor.statusEffects?.find(s => s.id === cost.id);
                const currentDuration = status ? (Number(status.duration) || 0) : 0;
                if (currentDuration < cost.amount) return false;
            } else if (cost.type === 'item') {
                // 需要 context 提供 inventory
                if (context && context.checkItem) {
                    if (!context.checkItem(cost.id, cost.amount)) return false;
                } else {
                    console.warn('Battle context missing checkItem for item cost');
                    return false;
                }
            }
        }
        return true;
    }

    // 2. 兼容旧的字符串 cost 格式 (例如 "10 MP")
    if (skill.cost && typeof skill.cost === 'string') {
        const parts = skill.cost.split(' ');
        if (parts.length === 2 && parts[1] === 'MP') {
            const amount = parseInt(parts[0], 10);
            if (!isNaN(amount)) {
                return actor.currentMp >= amount;
            }
        }
    }

    return true;
};

/**
 * 判断角色是否可以使用该技能 (综合判断：消耗、状态限制等)
 * @param {Object} actor 
 * @param {Object} skill 
 * @param {Object} context 
 * @returns {Boolean}
 */
export const canUseSkill = (actor, skill, context) => {
    if (!actor || !skill) return false;

    // 1. 检查死亡状态 (通常死亡不能用技能，除非技能是“死亡时触发”或者特殊技能)
    // 但通常由外部控制行动权。这里假设如果有行动权，只需检查消耗和沉默。

    // 2. 检查消耗
    if (!checkSkillCost(actor, skill, context)) return false;

    // 3. 检查沉默/封印状态 (示例：如果有 Silence 状态且技能是 Magic 类型)
    // 假设 status 效果里有 type: 'silence'，或者 statusID 对应沉默
    // 这里暂时留空，等待状态系统完善
    if (actor.statusEffects) {
        const isSilenced = actor.statusEffects.some(s => {
            // 检查状态定义是否有 silence 效果
            // 这里需要 statusDb，但为了避免循环依赖，或者假设 effect.type === 'silence'
            // 暂时简单处理：如果以后有沉默状态，在这里加判断
            return false;
        });

        if (isSilenced && skill.category === 'skillCategories.magic') {
            return false;
        }
    }

    return true;
};

/**
 * 支付技能消耗
 * @param {Object} actor 行动者
 * @param {Object} skill 技能定义
 * @param {Object} context 上下文
 */
export const paySkillCost = (actor, skill, context) => {
    // 1. 结构化 costs
    if (skill.costs && skill.costs.length > 0) {
        for (const cost of skill.costs) {
            if (cost.type === 'mp') {
                actor.currentMp = Math.max(0, actor.currentMp - cost.amount);
            } else if (cost.type === 'hp') {
                actor.currentHp = Math.max(1, actor.currentHp - cost.amount);
            } else if (cost.type === 'status_duration') {
                const status = actor.statusEffects?.find(s => s.id === cost.id);
                if (status) {
                    status.duration = (Number(status.duration) || 0) - cost.amount;
                    if (status.duration <= 0) {
                        // 移除过期的状态
                        if (actor.statusEffects) {
                            const idx = actor.statusEffects.indexOf(status);
                            if (idx !== -1) actor.statusEffects.splice(idx, 1);
                        }
                    }
                }
            } else if (cost.type === 'item') {
                if (context && context.consumeItem) {
                    context.consumeItem(cost.id, cost.amount);
                }
            }
        }
        return;
    }

    // 2. 兼容字符串格式
    if (skill.cost && typeof skill.cost === 'string') {
        const parts = skill.cost.split(' ');
        if (parts.length === 2 && parts[1] === 'MP') {
            const amount = parseInt(parts[0], 10);
            if (!isNaN(amount)) {
                actor.currentMp = Math.max(0, actor.currentMp - amount);
            }
        }
    }
};
