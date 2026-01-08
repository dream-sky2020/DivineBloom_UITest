export const NPCSerializer = {
  serialize(entity) {
    return {
      x: entity.position.x,
      y: entity.position.y,
      config: {
        dialogueId: entity.interaction.id,
        range: entity.interaction.range,
        spriteId: entity.visual.id,
        scale: entity.visual.scale
      }
    }
  }
}

