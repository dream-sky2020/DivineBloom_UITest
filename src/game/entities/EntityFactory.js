import { Player } from './Player'
import { MapEnemy } from './MapEnemy'
import { NPC } from './NPC'

export const EntityFactory = {
  /**
   * @param {import('@/game/GameEngine').GameEngine} engine 
   * @param {string} type 
   * @param {object} data 
   * @param {object} context 
   */
  create(engine, type, data, context = {}) {
    switch (type) {
      case 'player':
        // Player is usually a singleton or passed in context, but for completeness:
        // Note: Player usually needs 'PlayerConfig' but here we restore from data
        const p = new Player(engine, { scale: data.scale })
        p.restore(data)
        return p

      case 'enemy':
        return MapEnemy.fromData(engine, data, context)

      case 'npc':
        return NPC.fromData(engine, data, context)

      default:
        console.warn(`Unknown entity type: ${type}`)
        return null
    }
  }
}

