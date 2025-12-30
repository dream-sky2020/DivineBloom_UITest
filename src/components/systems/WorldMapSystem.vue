<template>
  <div class="root">
    <canvas ref="cv" class="cv"></canvas>

    <div class="ui">
      <div>Position: x={{ Math.round(player.pos.x) }}, y={{ Math.round(player.pos.y) }}</div>
      <div>Last Input: {{ lastInput || 'None' }}</div>
      <div>Move: WASD / Arrow Keys (Shift = faster)</div>
      <div>Sprite: {{ player.spriteId }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

/* =========================
   1) TextureStore：资源加载/缓存
   ========================= */
class TextureStore {
  constructor() {
    /** @type {Map<string, HTMLImageElement>} */
    this.images = new Map()
    /** @type {Map<string, Promise<HTMLImageElement>>} */
    this.loading = new Map()
  }

  /**
   * @param {string} id
   * @param {string} url
   * @returns {Promise<HTMLImageElement>}
   */
  load(id, url) {
    if (this.images.has(id)) return Promise.resolve(this.images.get(id))
    if (this.loading.has(id)) return this.loading.get(id)

    const p = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.images.set(id, img)
        this.loading.delete(id)
        resolve(img)
      }
      img.onerror = (e) => {
        this.loading.delete(id)
        reject(new Error(`Failed to load image: ${id}`))
      }
      img.src = url
    })

    this.loading.set(id, p)
    return p
  }

  /**
   * @param {string} id
   * @returns {HTMLImageElement | null}
   */
  get(id) {
    return this.images.get(id) || null
  }
}

/* =========================
   2) Sprite：精灵定义（支持裁切 + 锚点）
   ========================= */
function makeSprite({
  imageId,
  sx = 0, sy = 0, sw = 0, sh = 0,
  ax = 0.5, ay = 1.0, // anchor 默认脚底（中下）
}) {
  return { imageId, sx, sy, sw, sh, ax, ay }
}

/* =========================
   3) Renderer：统一绘制（Canvas2D）
   ========================= */
class Renderer2D {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx
    this.camera = { x: 0, y: 0 }
    this.clearColor = '#dbeafe'
  }

  setCamera(x, y) {
    this.camera.x = x
    this.camera.y = y
  }

  begin(w, h) {
    const ctx = this.ctx
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = this.clearColor
    ctx.fillRect(0, 0, w, h)
  }

  drawGround(w, h) {
    const ctx = this.ctx
    ctx.fillStyle = '#bbf7d0'
    ctx.fillRect(0, h * 0.35, w, h * 0.65)

    ctx.fillStyle = 'rgba(0,0,0,0.10)'
    ctx.fillRect(80, h * 0.55, 140, 18)
    ctx.fillRect(260, h * 0.70, 200, 18)
  }

  /**
   * @param {HTMLImageElement} img
   * @param {{sx:number,sy:number,sw:number,sh:number,ax:number,ay:number}} spr
   * @param {{x:number,y:number}} pos world position
   * @param {number} scale
   */
  drawSprite(img, spr, pos, scale = 1) {
    const ctx = this.ctx
    const x = pos.x - this.camera.x
    const y = pos.y - this.camera.y

    const sw = spr.sw || img.width
    const sh = spr.sh || img.height
    const dw = sw * scale
    const dh = sh * scale

    const dx = x - dw * spr.ax
    const dy = y - dh * spr.ay

    // 影子（可选，但很“游戏感”）
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    ctx.beginPath()
    ctx.ellipse(x, y + 6 * scale, 12 * scale, 7 * scale, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.drawImage(img, spr.sx, spr.sy, sw, sh, dx, dy, dw, dh)
  }
}

/* =========================
   4) Input：最小输入采样
   ========================= */
const keys = new Set()
const lastInput = ref('')

function onKeyDown(e) {
  keys.add(e.code)
  lastInput.value = e.code
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault()
}
function onKeyUp(e) { keys.delete(e.code) }

/* =========================
   5) Game State
   ========================= */
const cv = ref(null)
let ctx = null
let raf = 0
let lastT = 0
let w = 0, h = 0
let ro = null

const textures = new TextureStore()

// Sprite registry（以后你就往这里注册各种 sprite / 特效帧）
const sprites = new Map()

// Entity（最小：位置 + spriteId）
const player = reactive({
  pos: { x: 200, y: 260 },
  r: 12,
  spriteId: 'hero_idle',
  scale: 2
})

let renderer = null

function resize() {
  const canvas = cv.value
  if (!canvas) return
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  w = canvas.clientWidth
  h = canvas.clientHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function update(dt) {
  const fast = keys.has('ShiftLeft') || keys.has('ShiftRight')
  const speed = (fast ? 320 : 200)

  let dx = 0, dy = 0
  if (keys.has('KeyW') || keys.has('ArrowUp')) dy -= 1
  if (keys.has('KeyS') || keys.has('ArrowDown')) dy += 1
  if (keys.has('KeyA') || keys.has('ArrowLeft')) dx -= 1
  if (keys.has('KeyD') || keys.has('ArrowRight')) dx += 1

  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.sqrt(2)
    dx *= inv
    dy *= inv
  }

  player.pos.x += dx * speed * dt
  player.pos.y += dy * speed * dt

  // clamp inside screen-space “世界”（最小演示：不做地图，先限制在画面内）
  player.pos.x = Math.max(0, Math.min(w, player.pos.x))
  player.pos.y = Math.max(h * 0.35, Math.min(h, player.pos.y))

  // 摄像机：这里先固定为 0（你以后要大地图，再启用跟随）
  renderer.setCamera(0, 0)
}

function draw() {
  renderer.begin(w, h)
  renderer.drawGround(w, h)

  const spr = sprites.get(player.spriteId)
  const img = textures.get(spr.imageId)

  if (img) {
    renderer.drawSprite(img, spr, player.pos, player.scale)
  } else {
    // 兜底：未加载时用圆点
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(player.pos.x, player.pos.y - 16, 14, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop(t) {
  const now = t * 0.001
  const dt = Math.min(0.05, now - (lastT || now))
  lastT = now
  update(dt)
  draw()
  raf = requestAnimationFrame(loop)
}

/* =========================
   6) 内嵌一张“最小精灵图”(dataURL)
   你以后可以替换成真实 png 文件路径
   ========================= */
function buildTinySpriteSheetDataURL() {
  // 32x32 的小人（红衣+黑头），用 SVG 生成 dataURL，避免外部依赖
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <rect width="32" height="32" fill="none"/>
    <ellipse cx="16" cy="26" rx="9" ry="4" fill="rgba(0,0,0,0.25)"/>
    <circle cx="16" cy="10" r="6" fill="#0f172a"/>
    <rect x="11" y="16" width="10" height="10" rx="2" fill="#ef4444"/>
    <rect x="9" y="20" width="4" height="7" rx="1" fill="#ef4444"/>
    <rect x="19" y="20" width="4" height="7" rx="1" fill="#ef4444"/>
  </svg>`
  const encoded = encodeURIComponent(svg)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}

onMounted(async () => {
  const canvas = cv.value
  ctx = canvas.getContext('2d', { alpha: false })
  renderer = new Renderer2D(ctx)

  ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  window.addEventListener('keydown', onKeyDown, { passive: false })
  window.addEventListener('keyup', onKeyUp)

  // 注册 sprite：hero_idle（从精灵表里裁切 32x32）
  const sheetUrl = buildTinySpriteSheetDataURL()
  await textures.load('sheet', sheetUrl)
  sprites.set('hero_idle', makeSprite({ imageId: 'sheet', sx: 0, sy: 0, sw: 32, sh: 32, ax: 0.5, ay: 1.0 }))

  raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (ro) ro.disconnect()
})
</script>

<style scoped>
.root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cv {
  width: 100%;
  height: 100%;
  display: block;
  background: #dbeafe;
}

.ui {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.90);
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 8px;
  font: 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  color: #000; /* 要求：字体黑色 */
  pointer-events: none;
}
</style>
