import { z } from 'zod';
import { ID } from '@/data/schemas/common'; // Fix import path to point to common.js

// --- Actions Schema Definitions ---

export const ActionBattleSchema = z.object({
  // Allow string OR number for ID
  group: z.array(z.object({ id: ID })).default([]),
  uuid: z.string().optional()
});

export const ActionDialogueSchema = z.object({
  scriptId: z.string().default('error_missing_id')
});

export const ActionTeleportSchema = z.object({
  mapId: z.string().default('demo_plains'),
  entryId: z.string().default('default')
});

// --- Actions Factory ---

export const Actions = {
  /**
   * 战斗行为组件
   * @param {Array} [group] - 战斗组ID列表
   * @param {string} [uuid] - 实体唯一ID
   */
  Battle(group, uuid) {
    if (!ActionBattleSchema) return { group: [], uuid: undefined };

    const result = ActionBattleSchema.safeParse({ group, uuid });
    if (result.success) {
      return result.data;
    } else {
      console.error('[Actions] Battle validation failed', result.error);
      return { group: [], uuid: undefined };
    }
  },

  /**
   * 对话行为组件
   * @param {string} scriptId - 对话脚本ID
   */
  Dialogue(scriptId) {
    if (!ActionDialogueSchema) return { scriptId: 'error' };

    const result = ActionDialogueSchema.safeParse({ scriptId });
    if (result.success) {
      return result.data;
    } else {
      console.error('[Actions] Dialogue validation failed', result.error);
      return { scriptId: 'error' };
    }
  },

  /**
   * 传送行为组件
   * @param {string} mapId - 目标地图ID
   * @param {string} entryId - 目标入口ID
   */
  Teleport(mapId, entryId) {
    if (!ActionTeleportSchema) return { mapId: 'error', entryId: 'error' };

    const result = ActionTeleportSchema.safeParse({ mapId, entryId });
    if (result.success) {
      return result.data;
    } else {
      console.error('[Actions] Teleport validation failed', result.error);
      return { mapId: 'error', entryId: 'error' };
    }
  }
}
