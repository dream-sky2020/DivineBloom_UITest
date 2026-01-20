/**
 * Inspector Component
 * 
 * 专门为编辑器设计的元数据组件。
 * 它存储了实体属性在 UI 上的展示方式、中文名称、提示信息等。
 */
export const Inspector = {
    /**
     * 创建 Inspector 组件
     * @param {Object} config 配置信息
     * @param {Array} config.groups 分组显示 (可选)
     * @param {Array} config.fields 字段映射
     * 
     * field 结构:
     * {
     *   path: string,    // 对应实体的属性路径，如 'position.x'
     *   label: string,   // 中文显示名称
     *   type: string,    // UI 类型: 'text', 'number', 'checkbox', 'select', 'asset'
     *   tip: string,     // 悬浮注释/帮助文本
     *   options: Array,  // 如果是 select 类型，提供的选项
     *   props: Object    // 传给 input 的额外属性，如 { min: 0, max: 100, step: 1 }
     * }
     */
    create({ groups = [], fields = [] } = {}) {
        return {
            groups,
            fields
        };
    }
};
