/**
 * 标签数据库 (Tags)
 * 记录游戏中使用的各种标签及其属性（颜色、描述等）
 */

// 使用 Vite 的 glob 导入功能自动加载 ./tags 下的所有 .js 文件
const modules = import.meta.glob('./tags/*.js', { eager: true })
import { TagSchema, createMapValidator, TagRegistry } from './schemas/index.js'

const rawTagsDb = {}

// 聚合所有模块导出的标签数据
for (const path in modules) {
  const mod = modules[path]
  // 合并模块的默认导出到 tagsDb
  Object.assign(rawTagsDb, mod.default || mod)
}

// 注册所有标签到注册表，供其他 Schema 校验引用
TagRegistry.register(Object.keys(rawTagsDb));

// 运行时校验
const validateTags = createMapValidator(TagSchema, 'TagsDb');
export const tagsDb = validateTags(rawTagsDb);
