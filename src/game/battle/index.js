/**
 * Battle System 统一入口
 * 
 * 核心原则：
 * 所有外部对战斗系统的调用都应该通过 BattleFacade 进行
 */

// 导出 Facade 单例（推荐使用）
export { battleFacade } from './BattleFacade'
export { default } from './BattleFacade'

// ==================== 子系统导出 (可选) ====================
// 允许外部访问纯函数工具，但建议优先使用 battleFacade 封装的方法
// 这样未来如果逻辑变更（例如增加全局 Hook），外部调用代码不需要修改

export * from './damageSystem'
export * from './effectSystem'
export * from './skillSystem'
export * from './statusSystem'
export * from './targetSystem'
export * from './timeSystem'
export * from './lootSystem'
export * from './displaySystem'
export * from './ai'
export * from './unitSystem' // New
export * from './actionSystem' // New
export * from './initSystem' // New
export * from './PlayerActionSystem'
export * from './AdjustBoostSystem'
export * from './SetPendingAction'
export * from './StartTurnAction'
export * from './EndTurnSystem'
export * from './ProcessEnemyTurnSystem'
export * from './UpdateATBSystem'
export * from './CheckBattleStatusSystem'
