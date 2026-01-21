import { world } from '@/game/ecs/world'

/**
 * Mouse Position Sense System
 * 负责追踪鼠标在屏幕和世界中的位置
 * 并将位置信息更新到全局管理实体的 mousePosition 组件中
 * 
 * Target Entities:
 * @property {object} mousePosition - 鼠标位置组件
 * @property {boolean} globalManager - 全局管理标签
 */

export const MousePositionSenseSystem = {
  update(dt, engine) {
    // 获取输入和相机
    if (!engine || !engine.input || !engine.renderer) {
      return;
    }

    const { input, renderer } = engine;
    const { mouse } = input;
    const { camera } = renderer;

    if (!mouse || !camera) {
      return;
    }

    // 查找全局管理实体
    const globalEntity = world.with('globalManager', 'mousePosition').first;
    
    if (!globalEntity) {
      return;
    }

    // 计算世界坐标
    const worldX = mouse.x + camera.x;
    const worldY = mouse.y + camera.y;

    // 更新鼠标位置组件
    globalEntity.mousePosition.worldX = worldX;
    globalEntity.mousePosition.worldY = worldY;
    globalEntity.mousePosition.screenX = mouse.x;
    globalEntity.mousePosition.screenY = mouse.y;
  }
}
