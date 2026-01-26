import { world } from '@world2d/world'
import { Visuals } from '@schema/visuals'
import { createLogger } from '@/utils/logger'

const logger = createLogger('VisualRenderSystem')

/**
 * Sprite Render System
 * 负责渲染：实体 Sprite (角色, 道具等)
 * 层级：中间层 (Layer 20)，需要 Y 轴排序
 * 
 * Required Components:
 * @property {object} position
 * @property {object} visual
 */

const renderEntities = world.with('position').any('visual', 'sprite')

export const VisualRenderSystem = {
  // 定义渲染层级 (Z-Index)
  LAYER: 20,

  /**
   * 更新动画帧
   * @param {number} dt 
   */
  update(dt) {
    for (const entity of world.with('animation')) {
      this.updateAnimation(entity, dt)
    }
  },

  updateAnimation(entity, dt) {
    const { animation } = entity
    if (!animation || animation.paused) return

    const state = animation.animations[animation.currentState]
    if (!state || state.frames.length <= 1) {
      animation.frameIndex = 0
      return
    }

    animation.timer += dt * animation.speedMultiplier

    const currentFrame = state.frames[animation.frameIndex]
    const frameDuration = (currentFrame?.duration || 100) / 1000 // 转为秒

    if (animation.timer >= frameDuration) {
      animation.timer -= frameDuration
      animation.frameIndex++

      if (animation.frameIndex >= state.frames.length) {
        if (state.loop !== false) {
          animation.frameIndex = 0
        } else {
          animation.frameIndex = state.frames.length - 1
        }
      }
    }
  },

  /**
   * @param {import('@world2d/GameEngine').Renderer2D} renderer 
   */
  draw(renderer) {
    // 1. 收集实体
    const entities = []
    for (const entity of renderEntities) {
      if (!entity.position) continue;
      if (!entity.sprite && !entity.visual) continue;

      // 仅排除 background_ground 类型
      if (entity.type === 'background_ground') continue;

      entities.push(entity)
    }

    // ... 排序逻辑保持不变 ...
    entities.sort((a, b) => {
      const zA = a.zIndex || 0
      const zB = b.zIndex || 0
      if (zA !== zB) return zA - zB
      if (zA === 0) return a.position.y - b.position.y
      return 0
    })

    // ... 剔除与绘制 ...
    const viewW = renderer.width || 9999
    const viewH = renderer.height || 9999
    const camera = renderer.camera
    if (!camera) return;

    const cullMargin = 100
    const isVisible = (pos) => {
      if (typeof pos.x !== 'number' || typeof pos.y !== 'number') return false;
      return !(pos.x < camera.x - cullMargin ||
        pos.x > camera.x + viewW + cullMargin ||
        pos.y < camera.y - cullMargin ||
        pos.y > camera.y + viewH + cullMargin)
    }

    for (const entity of entities) {
      if (!isVisible(entity.position)) continue
      this.drawVisual(renderer, entity)
    }
  },

  drawVisual(renderer, entity) {
    // 优先使用新的 sprite 组件，兼容旧的 visual 组件
    const sprite = entity.sprite || entity.visual;
    const { position, animation } = entity;

    if (!sprite || sprite.visible === false) return;

    // --- Rect Support ---
    if (sprite.type === 'rect' || entity.rect) {
      const rect = entity.rect || sprite;
      const camera = renderer.camera
      renderer.ctx.fillStyle = sprite.tint || rect.color || 'magenta'
      renderer.ctx.globalAlpha = sprite.opacity !== undefined ? sprite.opacity : 1.0;
      
      renderer.ctx.fillRect(
        position.x + (sprite.offsetX || 0) - (camera?.x || 0),
        position.y + (sprite.offsetY || 0) - (camera?.y || 0),
        rect.width || 10,
        rect.height || 10
      )
      renderer.ctx.globalAlpha = 1.0;
      return
    }

    // --- Sprite Support ---
    if (!sprite.id) return;

    const def = Visuals[sprite.id]
    if (!def) {
      renderer.drawCircle(position.x, position.y, 10, 'red')
      return
    }

    const texture = renderer.assetManager.getTexture(def.assetId)
    if (!texture) return

    // 获取当前帧索引
    let frameIndex = 0;
    if (animation) {
      frameIndex = animation.frameIndex;
    } else if (sprite.frameIndex !== undefined) {
      frameIndex = sprite.frameIndex; // 兼容旧逻辑
    }

    // 获取当前动画定义以获取 frameId
    const animName = animation?.currentState || sprite.state || 'default'
    const animDef = def.animations[animName] || def.animations['default'] || def.animations['idle']
    
    let frameId = 0
    if (animDef && animDef.frames.length > 0) {
      const idx = Math.min(frameIndex, animDef.frames.length - 1);
      frameId = animDef.frames[idx];
    }

    let sx = 0, sy = 0, sw = 0, sh = 0
    if (def.layout.type === 'grid') {
      const cols = def.layout.cols || 1
      const rows = def.layout.rows || 1
      const tileW = def.layout.width || (texture.width ? texture.width / cols : 32)
      const tileH = def.layout.height || (texture.height ? texture.height / rows : 32)
      const col = frameId % cols
      const row = Math.floor(frameId / cols)
      sx = col * tileW
      sy = row * tileH
      sw = tileW
      sh = tileH
    } else {
      sx = 0; sy = 0; sw = texture.width; sh = texture.height
    }

    const spriteDef = {
      sx, sy, sw, sh,
      ax: def.anchor?.x ?? 0.5,
      ay: def.anchor?.y ?? 1.0
    }

    // 应用颜色和偏移
    const drawPos = {
      x: position.x + (sprite.offsetX || 0),
      y: position.y + (sprite.offsetY || 0)
    };

    const scale = sprite.scale !== undefined ? sprite.scale : 1.0
    
    // 如果有 tint/opacity，可能需要更复杂的绘制逻辑，目前 drawSprite 可能不支持
    // 这里先简单处理 scale
    renderer.drawSprite(texture, spriteDef, drawPos, scale)
  }
}

