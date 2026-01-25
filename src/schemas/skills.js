/**
 * 技能数据库
 * ID 规则:
 * 100-199: 物理攻击技能 (Physical)
 * 200-299: 魔法攻击技能 (Magic)
 * 300-399: 治疗/辅助技能 (Support)
 * 400-499: 被动技能 (Passive)
 * 1000+: Boss/Enemy Skills
 */

// 使用 Vite 的 glob 导入功能自动加载 @data/skills 下的所有 .js 文件
// eager: true 确保是同步加载，保持 skillsDb 的直接可用性
const modules = import.meta.glob('@data/skills/*.js', { eager: true })
import { SkillSchema, createMapValidator, EntityRegistry } from './index.js'
import { tagsDb } from './tags.js' // 确保标签注册表先初始化
import { itemsDb } from './items.js' // 技能可能消耗物品
import { statusDb } from './status.js' // 技能效果可能引用状态

const rawSkillsDb = {}

// 聚合所有模块导出的技能数据
for (const path in modules) {
  const mod = modules[path]
  // 合并模块的默认导出到 skillsDb
  Object.assign(rawSkillsDb, mod.default || mod)
}

// 注册所有技能 ID
EntityRegistry.register('skills', Object.keys(rawSkillsDb));

// 运行时校验
const validateSkills = createMapValidator(SkillSchema, 'SkillsDb');
export const skillsDb = validateSkills(rawSkillsDb);
