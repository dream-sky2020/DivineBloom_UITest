/**
 * 状态效果数据库 (Buffs/Debuffs)
 * ID 规则:
 * 1-99: 异常状态 (Debuffs)
 * 100-199: 增益状态 (Buffs)
 */

// 使用 Vite 的 glob 导入功能自动加载 ./status 下的所有 .js 文件
// eager: true 确保是同步加载，保持 statusDb 的直接可用性
const modules = import.meta.glob('./status/*.js', { eager: true })

export const statusDb = {}

// 聚合所有模块导出的状态数据
for (const path in modules) {
  const mod = modules[path]
  // 合并模块的默认导出到 statusDb
  Object.assign(statusDb, mod.default || mod)
}
