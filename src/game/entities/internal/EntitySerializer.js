import { EnemySerializer } from './serializers/EnemySerializer'
import { PlayerSerializer } from './serializers/PlayerSerializer'
import { NPCSerializer } from './serializers/NPCSerializer'

export const EntitySerializer = {
    serialize(entity) {
        if (entity.type === 'enemy') {
            return EnemySerializer.serialize(entity)
        }

        if (entity.type === 'player') {
            return PlayerSerializer.serialize(entity)
        }

        if (entity.type === 'npc') {
            return NPCSerializer.serialize(entity)
        }

        return null
    }
}

