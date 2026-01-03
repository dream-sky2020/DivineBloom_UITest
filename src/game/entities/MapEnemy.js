import { makeSprite } from '@/game/GameEngine'

/**
 * @typedef {import('@/game/GameEngine').GameEngine} GameEngine
 * @typedef {import('@/game/GameEngine').Renderer2D} Renderer2D
 */

export class MapEnemy {
  /**
   * @param {GameEngine} engine 
   * @param {number} x 
   * @param {number} y 
   * @param {Array<object>} battleGroup - Array of enemy definitions for battle
   * @param {object} [options] - AI options { player, aiType, visionRadius, speed }
   */
  constructor(engine, x, y, battleGroup, options = {}) {
    this.engine = engine
    this.pos = { x, y }
    this.battleGroup = battleGroup || []

    // AI Configuration
    this.player = options.player || null
    this.aiType = options.aiType || 'wander' // 'wander', 'chase', 'flee'
    this.visionRadius = options.visionRadius || 120
    this.visionType = options.visionType || 'circle' // 'circle', 'cone'
    this.visionAngle = (options.visionAngle || 90) * (Math.PI / 180) // Convert deg to rad

    // Visuals
    this.scale = 2
    this.speed = options.speed || 80

    // Internal State
    this.moveTimer = 0
    this.moveDir = { x: 0, y: 0 }
    this.facing = { x: 1, y: 0 } // Normalized facing direction
    this.state = 'idle' // 'idle', 'alert'

    // Collider radius
    this.radius = 20
  }

  /**
   * @param {number} dt 
   */
  update(dt) {
    // Update Facing if moving
    const lenSq = this.moveDir.x * this.moveDir.x + this.moveDir.y * this.moveDir.y
    if (lenSq > 0.001) {
      const len = Math.sqrt(lenSq)
      this.facing.x = this.moveDir.x / len
      this.facing.y = this.moveDir.y / len
    }

    // Check distance to player
    let distToPlayer = Infinity
    if (this.player) {
      const dx = this.player.pos.x - this.pos.x
      const dy = this.player.pos.y - this.pos.y
      distToPlayer = Math.sqrt(dx * dx + dy * dy)
    }

    // AI Logic
    const canSee = this._canSeePlayer(distToPlayer)

    if (canSee) {
      this.state = 'alert'

      if (this.aiType === 'chase') {
        this._behaviorChase(dt)
      } else if (this.aiType === 'flee') {
        this._behaviorFlee(dt)
      } else {
        // Wander types ignore player or just look at them
        this._behaviorWander(dt)
      }
    } else {
      this.state = 'idle'
      this._behaviorWander(dt)
    }

    // Apply movement
    this.pos.x += this.moveDir.x * this.speed * dt
    this.pos.y += this.moveDir.y * this.speed * dt

    this._clampPosition()
  }

  _canSeePlayer(dist) {
    if (!this.player) return false
    if (dist > this.visionRadius) return false

    if (this.visionType === 'cone') {
      const dx = this.player.pos.x - this.pos.x
      const dy = this.player.pos.y - this.pos.y
      // normalize vector to player
      // dist is known to be > 0 here (unless on top of each other)
      const nx = dx / (dist || 1)
      const ny = dy / (dist || 1)

      // dot product: a.b = |a||b|cos(theta) -> cos(theta) since normalized
      const dot = nx * this.facing.x + ny * this.facing.y

      // Check if angle is within half of vision angle
      // cos is decreasing in [0, PI], so dot > threshold means angle < limit
      const threshold = Math.cos(this.visionAngle / 2)
      return dot >= threshold
    }

    return true
  }

  _behaviorChase(dt) {
    if (!this.player) return

    const dx = this.player.pos.x - this.pos.x
    const dy = this.player.pos.y - this.pos.y
    const angle = Math.atan2(dy, dx)

    this.moveDir.x = Math.cos(angle)
    this.moveDir.y = Math.sin(angle)
  }

  _behaviorFlee(dt) {
    if (!this.player) return

    const dx = this.player.pos.x - this.pos.x
    const dy = this.player.pos.y - this.pos.y
    const angle = Math.atan2(dy, dx)

    // Move opposite direction
    this.moveDir.x = -Math.cos(angle)
    this.moveDir.y = -Math.sin(angle)
  }

  _behaviorWander(dt) {
    this.moveTimer -= dt
    if (this.moveTimer <= 0) {
      this.moveTimer = 2 + Math.random() * 2 // Change direction every 2-4s
      const angle = Math.random() * Math.PI * 2
      this.moveDir.x = Math.cos(angle)
      this.moveDir.y = Math.sin(angle)

      // 30% chance to stop
      if (Math.random() < 0.3) {
        this.moveDir.x = 0
        this.moveDir.y = 0
      }
    }
  }

  _clampPosition() {
    const { width, height } = this.engine
    const minY = height * 0.35

    this.pos.x = Math.max(0, Math.min(width, this.pos.x))
    this.pos.y = Math.max(minY, Math.min(height, this.pos.y))
  }

  /**
   * @param {Renderer2D} renderer 
   */
  draw(renderer) {
    // Determine color based on AI type
    let colorHex = '#ef4444' // Red (Chase)
    let colorRgba = (a) => `rgba(239, 68, 68, ${a})`

    if (this.aiType === 'wander') {
      colorHex = '#eab308' // Yellow
      colorRgba = (a) => `rgba(234, 179, 8, ${a})`
    } else if (this.aiType === 'flee') {
      colorHex = '#3b82f6' // Blue
      colorRgba = (a) => `rgba(59, 130, 246, ${a})`
    }

    // Draw vision range (Debug/Visual effect)
    const ctx = renderer.ctx // Direct context access for complex shapes
    const currentAngle = Math.atan2(this.facing.y, this.facing.x)

    ctx.save()
    if (this.state === 'alert') {
      ctx.fillStyle = colorRgba(0.15)
      ctx.strokeStyle = colorRgba(0.5)
    } else {
      ctx.fillStyle = colorRgba(0.05)
      ctx.strokeStyle = 'transparent' // No outline for idle to keep it clean
    }

    ctx.beginPath()
    if (this.visionType === 'cone') {
      const half = this.visionAngle / 2
      ctx.moveTo(this.pos.x, this.pos.y)
      ctx.arc(this.pos.x, this.pos.y, this.visionRadius, currentAngle - half, currentAngle + half)
      ctx.lineTo(this.pos.x, this.pos.y)
    } else {
      ctx.arc(this.pos.x, this.pos.y, this.visionRadius, 0, Math.PI * 2)
    }
    ctx.fill()
    if (this.state === 'alert') ctx.stroke()
    ctx.restore()

    // Exclamation mark for alert chasers
    if (this.state === 'alert' && this.aiType === 'chase') {
      // Optional: Draw '!'
    }

    // Use the same sheet for now, maybe different sprite frame if available
    const img = this.engine.textures.get('sheet')

    if (img) {
      // Draw colored circle under the sprite to indicate type
      renderer.drawCircle(this.pos.x, this.pos.y, 12, colorRgba(0.4))

      const spr = makeSprite({
        imageId: 'sheet',
        sx: 0, sy: 0, sw: 32, sh: 32,
        ax: 0.5, ay: 1.0
      })
      renderer.drawSprite(img, spr, this.pos, this.scale)
    } else {
      renderer.drawCircle(this.pos.x, this.pos.y - 16, 14, colorHex)
    }
  }
}

