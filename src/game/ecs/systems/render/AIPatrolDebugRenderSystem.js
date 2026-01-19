import { world } from '@/game/ecs/world'

/**
 * AI Patrol Debug Render System
 * 负责渲染：AI 的游荡范围 (出生点 + 巡逻半径)
 * 层级：调试层 (Layer 12)
 * 
 * Required Components:
 * @property {object} position
 * @property {object} aiConfig
 */

const aiEntities = world.with('aiConfig', 'position')

export const AIPatrolDebugRenderSystem = {
    // 调试层级，位于视野 (15) 之下，背景 (10) 之上
    LAYER: 12,

    /**
     * @param {import('@/game/ecs/GameEngine').Renderer2D} renderer 
     */
    draw(renderer) {
        if (!renderer || !renderer.ctx || !renderer.camera) return

        const ctx = renderer.ctx
        const camera = renderer.camera
        const viewW = renderer.width || 0
        const viewH = renderer.height || 0
        const cullMargin = 300

        for (const entity of aiEntities) {
            const { aiConfig, position } = entity
            
            // 如果没有家位置或巡逻半径，不渲染
            if (!aiConfig.homePosition || !aiConfig.patrolRadius) continue

            const homeX = aiConfig.homePosition.x
            const homeY = aiConfig.homePosition.y
            
            // 剔除屏幕外的
            if (homeX < camera.x - cullMargin ||
                homeX > camera.x + viewW + cullMargin ||
                homeY < camera.y - cullMargin ||
                homeY > camera.y + viewH + cullMargin) {
                continue
            }

            const screenHomeX = homeX - camera.x
            const screenHomeY = homeY - camera.y

            ctx.save()
            
            // 1. 绘制巡逻范围虚线圆
            ctx.beginPath()
            ctx.setLineDash([5, 5])
            ctx.arc(screenHomeX, screenHomeY, aiConfig.patrolRadius, 0, Math.PI * 2)
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)' // 绿色 (green-500)
            ctx.lineWidth = 1
            ctx.stroke()

            // 2. 绘制家(出生点)标记
            ctx.beginPath()
            ctx.setLineDash([])
            ctx.arc(screenHomeX, screenHomeY, 3, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(34, 197, 94, 0.8)'
            ctx.fill()
            
            // 3. 绘制从 AI 到家的连接线，直观显示距离
            const screenAiX = position.x - camera.x
            const screenAiY = position.y - camera.y
            
            ctx.beginPath()
            ctx.moveTo(screenHomeX, screenHomeY)
            ctx.lineTo(screenAiX, screenAiY)
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)'
            ctx.setLineDash([2, 2])
            ctx.stroke()

            ctx.restore()
        }
    }
}
