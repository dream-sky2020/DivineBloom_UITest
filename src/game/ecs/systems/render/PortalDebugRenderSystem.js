import { world } from '@/game/ecs/world'

/**
 * Portal Debug Render System
 * 负责渲染：传送门与其目的地（Entry Point）之间的连接线，并在目的地打叉标记
 * 特别针对“移动位置”类传送门（同地图传送）
 */

// 查询所有带有传送行为和位置的实体
const portals = world.with('actionTeleport', 'position')

let currentMapData = null

export const PortalDebugRenderSystem = {
    // 渲染层级，放在 Debug 区域
    LAYER: 105,

    /**
     * @param {object} mapData 
     */
    init(mapData) {
        currentMapData = mapData
    },

    /**
     * @param {import('@/game/ecs/GameEngine').Renderer2D} renderer 
     */
    draw(renderer) {
        if (!renderer || !renderer.ctx || !currentMapData || !currentMapData.entryPoints) return

        const ctx = renderer.ctx
        const camera = renderer.camera || { x: 0, y: 0 }

        for (const entity of portals) {
            const { actionTeleport, position, detectArea } = entity
            const { mapId, entryId } = actionTeleport

            // 仅渲染本地传送（目标地图为空，或等于当前地图 ID）
            const isLocal = !mapId || mapId === currentMapData.id
            if (!isLocal) continue

            const entryPoint = currentMapData.entryPoints[entryId]
            if (!entryPoint) {
                // 如果找不到入口点，可能需要警告，但渲染时不打断
                continue
            }

            // 1. 计算起点（传送门中心）
            let startX = position.x
            let startY = position.y
            
            // 如果有检测区域，使用检测区域中心作为连线起点
            if (detectArea && detectArea.offset) {
                startX += detectArea.offset.x
                startY += detectArea.offset.y
            }

            // 2. 计算终点
            const targetX = entryPoint.x
            const targetY = entryPoint.y

            // 转换为屏幕坐标
            const sX = startX - camera.x
            const sY = startY - camera.y
            const tX = targetX - camera.x
            const tY = targetY - camera.y

            ctx.save()

            // 3. 绘制连接线 (紫色虚线)
            ctx.beginPath()
            ctx.setLineDash([5, 5])
            ctx.moveTo(sX, sY)
            ctx.lineTo(tX, tY)
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)' // purple-500
            ctx.lineWidth = 2
            ctx.stroke()

            // 4. 绘制目的地打叉 (X)
            const xSize = 12
            ctx.setLineDash([]) // 实线
            ctx.beginPath()
            // 第一画 \
            ctx.moveTo(tX - xSize, tY - xSize)
            ctx.lineTo(tX + xSize, tY + xSize)
            // 第二画 /
            ctx.moveTo(tX + xSize, tY - xSize)
            ctx.lineTo(tX - xSize, tY + xSize)
            
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.9)'
            ctx.lineWidth = 3
            ctx.lineCap = 'round'
            ctx.stroke()

            // 5. 绘制文字标识
            ctx.fillStyle = 'rgba(168, 85, 247, 1)'
            ctx.font = 'bold 12px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(entryId, tX, tY + xSize + 15)

            ctx.restore()
        }
    }
}
