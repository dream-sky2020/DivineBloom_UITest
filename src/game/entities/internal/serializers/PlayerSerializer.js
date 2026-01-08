export const PlayerSerializer = {
  serialize(entity) {
    return {
      x: entity.position.x,
      y: entity.position.y,
      scale: entity.visual.scale
    }
  }
}

