import { createLogger } from '@/utils/logger';

const logger = createLogger('PanelLayoutService');
const STORAGE_KEY = 'editor_layout_v1';

export class PanelLayoutService {
    static save(layout) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
        } catch (e) {
            logger.error('Failed to save layout', e);
        }
    }

    static load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            logger.error('Failed to load layout', e);
            return null;
        }
    }

    /**
     * 核心移动逻辑：统一处理面板迁移
     */
    static movePanel(layout, { panelId, sourceSide, sourceGroupId, targetSide, targetGroupId, position }) {
        logger.info(`Moving panel ${panelId} to ${targetSide}/${targetGroupId}`);

        if (sourceSide && sourceGroupId) {
            const sourceGroup = layout[sourceSide].find(g => g.id === sourceGroupId);
            if (sourceGroup) {
                sourceGroup.panels = sourceGroup.panels.filter(id => id !== panelId);
                if (sourceGroup.activeId === panelId) {
                    sourceGroup.activeId = sourceGroup.panels[0] || null;
                }
                if (sourceGroup.panels.length === 0) {
                    layout[sourceSide] = layout[sourceSide].filter(g => g.id !== sourceGroupId);
                }
            }
        }

        this.removePanelEverywhere(layout, panelId, [targetGroupId]);

        if (position === 'tabs' && targetGroupId) {
            const targetGroup = layout[targetSide].find(g => g.id === targetGroupId);
            if (targetGroup) {
                if (!targetGroup.panels.includes(panelId)) targetGroup.panels.push(panelId);
                targetGroup.activeId = panelId;
            }
        } else {
            const newGroup = {
                id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                activeId: panelId,
                panels: [panelId]
            };
            if (targetGroupId) {
                const targetIndex = layout[targetSide].findIndex(g => g.id === targetGroupId);
                const insertIndex = position === 'top' ? targetIndex : targetIndex + 1;
                layout[targetSide].splice(insertIndex, 0, newGroup);
            } else {
                layout[targetSide].push(newGroup);
            }
        }
    }

    static removePanelEverywhere(layout, panelId, excludeGroupIds = []) {
        ['left', 'right'].forEach(side => {
            layout[side].forEach(group => {
                if (!excludeGroupIds.includes(group.id)) {
                    group.panels = group.panels.filter(id => id !== panelId);
                    if (group.activeId === panelId) group.activeId = group.panels[0] || null;
                }
            });
            layout[side] = layout[side].filter(g => g.panels.length > 0);
        });
    }
}
