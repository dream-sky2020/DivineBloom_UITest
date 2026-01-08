export const EnemySerializer = {
  serialize(entity) {
    const { position, aiState, aiConfig, interaction, visual } = entity
    return {
      x: position.x,
      y: position.y,
      battleGroup: interaction.battleGroup,
      options: {
        uuid: interaction.uuid,
        isStunned: aiState.state === 'stunned',
        stunnedTimer: aiState.state === 'stunned' ? aiState.timer : 0,
        aiType: aiConfig.type,
        visionRadius: aiConfig.visionRadius,
        visionType: aiConfig.visionType,
        visionAngle: Math.round(aiConfig.visionAngle * (180 / Math.PI)),
        visionProximity: aiConfig.visionProximity,
        speed: aiConfig.speed,
        minYRatio: aiConfig.minYRatio,
        suspicionTime: aiConfig.suspicionTime,
        spriteId: visual.id,
        scale: visual.scale
      }
    }
  }
}

