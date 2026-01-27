import { z } from 'zod';

/**
 * Inspector Component Schema
 */
export const InspectorSchema = z.object({
    tagName: z.string().nullable().default(null),
    tagColor: z.string().nullable().default(null),
    groups: z.array(z.any()).default([]),
    fields: z.array(z.any()).default([]),
    allowDelete: z.boolean().default(true),
    priority: z.number().default(0),
    hitPriority: z.number().default(0),
    editorBox: z.object({
        w: z.number().default(32),
        h: z.number().default(32),
        anchorX: z.number().default(0.5),
        anchorY: z.number().default(1.0),
        offsetX: z.number().default(0),
        offsetY: z.number().default(0),
        scale: z.number().default(1.0)
    }).default({
        w: 32,
        h: 32,
        anchorX: 0.5,
        anchorY: 1.0,
        offsetX: 0,
        offsetY: 0,
        scale: 1.0
    })
});

/**
 * Inspector Component
 * 
 * 专门为编辑器设计的元数据组件。
 * 它存储了实体属性在 UI 上的展示方式、中文名称、提示信息等。
 */
export const Inspector = {
    /**
     * 创建 Inspector 组件
     * @param {Partial<z.infer<typeof InspectorSchema>>} data 配置信息
     */
    create(data = {}) {
        const result = InspectorSchema.safeParse(data);
        if (!result.success) {
            console.warn('[Inspector] Validation failed, using defaults', result.error);
            return InspectorSchema.parse({});
        }
        return result.data;
    }
};

/**
 * 统一的编辑器属性字段，可合并到各实体的 INSPECTOR_FIELDS 中
 */
export const EDITOR_INSPECTOR_FIELDS = [
    { path: 'inspector.hitPriority', label: '点击优先级', type: 'number', tip: '数字越大越优先被选中', props: { step: 1 }, group: '编辑器配置' },
    { path: 'inspector.editorBox.w', label: '交互宽', type: 'number', props: { min: 0 }, group: '编辑器配置' },
    { path: 'inspector.editorBox.h', label: '交互高', type: 'number', props: { min: 0 }, group: '编辑器配置' },
    { path: 'inspector.editorBox.scale', label: '交互缩放', type: 'number', props: { step: 0.1, min: 0 }, group: '编辑器配置' },
    { path: 'inspector.editorBox.offsetX', label: '交互偏移 X', type: 'number', group: '编辑器配置' },
    { path: 'inspector.editorBox.offsetY', label: '交互偏移 Y', type: 'number', group: '编辑器配置' }
];
