/**
 * Battle System 统一外部接口 (Facade)
 * 
 * 设计目标：
 * 1. 统一战斗子系统（伤害、技能、效果等）的访问入口
 * 2. 管理战斗系统与外部（UI、Store、World）的交互
 * 3. 提供回调机制处理副作用（如播放音效、显示特效）
 */

import * as DamageSystem from './damageSystem'
import * as EffectSystem from './effectSystem'
import * as SkillSystem from './skillSystem'
import * as StatusSystem from './statusSystem'
import * as TargetSystem from './targetSystem'
import * as TimeSystem from './timeSystem'
import * as LootSystem from './lootSystem'
import * as DisplaySystem from './displaySystem'
import * as AI from './ai'
import * as UnitSystem from './unitSystem' // New
import * as ActionSystem from './actionSystem' // New
import * as InitSystem from './initSystem' // New
import * as PlayerActionSystem from './PlayerActionSystem'
import * as AdjustBoostSystem from './AdjustBoostSystem'
import * as SetPendingActionSystem from './SetPendingAction'
import * as StartTurnAction from './StartTurnAction'
import * as EndTurnSystem from './EndTurnSystem'
import * as ProcessEnemyTurnSystem from './ProcessEnemyTurnSystem'
import * as UpdateATBSystem from './UpdateATBSystem'
import * as CheckBattleStatusSystem from './CheckBattleStatusSystem'
import { createLogger } from '@/utils/logger'

const logger = createLogger('BattleFacade')

class BattleFacade {
    constructor() {
        // 外部回调注册表
        this._callbacks = {
            onBattleStart: null,
            onBattleEnd: null,
            onTurnStart: null,
            onTurnEnd: null,
            onAction: null,      // 动作发生时（攻击、技能）
            onDamage: null,      // 造成伤害时
            onHeal: null,        // 造成治疗时
            onEffect: null,      // 效果应用时
            playSound: null,     // 播放音效
            playAnimation: null, // 播放动画
            log: null            // 战斗日志
        }

        // 系统模块引用（作为命名空间暴露）
        this.damage = DamageSystem
        this.effect = EffectSystem
        this.skill = SkillSystem
        this.status = StatusSystem
        this.target = TargetSystem
        this.time = TimeSystem
        this.loot = LootSystem
        this.display = DisplaySystem
        this.ai = AI
        this.unit = UnitSystem
        this.action = ActionSystem
        this.init = InitSystem
        this.playerAction = PlayerActionSystem
        this.adjustBoost = AdjustBoostSystem
        this.setPending = SetPendingActionSystem
        this.startTurn = StartTurnAction
        this.endTurn = EndTurnSystem
        this.processEnemy = ProcessEnemyTurnSystem
        this.updateATB = UpdateATBSystem
        this.checkStatus = CheckBattleStatusSystem
    }

    // ==================== 回调管理 ====================

    /**
     * 注册外部回调函数
     * @param {Object} callbacks 
     */
    registerCallbacks(callbacks) {
        logger.info('Registering battle callbacks', Object.keys(callbacks))
        Object.assign(this._callbacks, callbacks)
    }

    /**
     * 触发外部回调
     * @param {string} type 回调类型
     * @param  {...any} args 参数
     */
    trigger(type, ...args) {
        const callback = this._callbacks[type]
        if (callback && typeof callback === 'function') {
            try {
                return callback(...args)
            } catch (e) {
                logger.error(`Error in battle callback: ${type}`, e)
            }
        }
        return null
    }

    // ==================== 核心计算代理 (Facade Methods) ====================
    // 这些方法封装了底层系统的调用，方便统一拦截和日志

    /**
     * 创建单位
     */
    createUnit(dbId, isPlayer = false) {
        return this.unit.createUnit(dbId, isPlayer)
    }

    /**
     * 恢复单位状态
     */
    hydrateUnit(state, isPlayer) {
        return this.unit.hydrateUnit(state, isPlayer)
    }

    /**
     * 执行战斗动作
     */
    executeAction(actor, action, context) {
        return this.action.executeAction(actor, action, context)
    }

    /**
     * 处理物品使用
     */
    handleItemEffect(itemId, targetId, actor, context) {
        return this.action.handleItemEffect(itemId, targetId, actor, context)
    }

    /**
     * 计算伤害
     * @param {Object} attacker 攻击者
     * @param {Object} target 目标
     * @param {Object|null} skill 技能数据
     * @param {Object|null} effect 效果数据
     * @param {number} damageMultiplier 伤害倍率 (如能量系统加成)
     */
    calculateDamage(attacker, target, skill = null, effect = null, damageMultiplier = 1.0) {
        return this.damage.calculateDamage(attacker, target, skill, effect, damageMultiplier)
    }

    /**
     * 应用伤害（并触发回调）
     * @param {Object} target 目标
     * @param {number} amount 伤害数值
     * @param {Object} context 上下文
     * @param {boolean} silent 是否静默
     */
    applyDamage(target, amount, context, silent = false) {
        const result = this.damage.applyDamage(target, amount, context, silent)
        
        // 触发伤害回调（用于 UI飘字等）
        // 注意：底层 applyDamage 只返回实际扣减的 HP 数值
        if (result > 0) {
            this.trigger('onDamage', { target, amount: result })
        }
        
        return result
    }

    /**
     * 检查技能可用性
     */
    canUseSkill(actor, skill, context) {
        return this.skill.canUseSkill(actor, skill, context)
    }

    /**
     * 解析目标
     */
    resolveTargets(context, targetType) {
        return this.target.resolveTargets(context, targetType)
    }

    /**
     * 计算掉落
     */
    calculateDrops(enemy) {
        return this.loot.calculateDrops(enemy)
    }

    /**
     * 获取单位显示数据
     */
    getUnitDisplayData(unit, context) {
        return this.display.getUnitDisplayData(unit, context)
    }

    // ==================== 工具方法 ====================

    /**
     * 获取 AI 动作
     */
    getEnemyAction(enemyId, context) {
        return this.ai.getEnemyAction(enemyId, context)
    }

    /**
     * 初始化战斗单位（包括敌人和玩家队伍）
     */
    setupBattle(options) {
        return this.init.setupBattle(this, options);
    }

    /**
     * 战斗开始时的统一处理
     */
    onBattleStart(allUnits, context) {
        return this.init.onBattleStart(this, allUnits, context);
    }
}

// 创建单例
export const battleFacade = new BattleFacade()
export default battleFacade
