import { BattleReader } from './adapter/Reader';
import { createAction } from './adapter/Builder';
import { emperorAI } from './bosses/emperor';
import { shahryarAI } from './bosses/shahryar';
import { hefietianAI } from './bosses/hefietian';
import { yibitianAI } from './bosses/yibitian';

const aiRegistry = {
    101: emperorAI,
    102: shahryarAI,
    103: hefietianAI,
    104: yibitianAI
};

const defaultAI = (context) => {
    // Default: Simple Attack on random target
    const target = context.read.getRandomTarget();
    return context.act()
        .attack(target)
        .build();
};

export const getEnemyAction = (enemyId, rawContext) => {
    // 1. Create Adapter
    const reader = new BattleReader(rawContext);

    // 2. Assemble Safe Context
    const safeContext = {
        read: reader,        // For reading state
        act: createAction    // For building actions
    };

    const aiFunc = aiRegistry[enemyId] || defaultAI;
    return aiFunc(safeContext);
};
