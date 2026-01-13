export default {
    // 玩家装填 (消耗物品)
    'skill_firearm_reload_item': {
        id: 'skill_firearm_reload_item',
        name: {
            zh: '装填',
            'zh-TW': '裝填',
            en: 'Reload',
            ja: 'リロード',
            ko: '재장전'
        },
        type: "skillTypes.utility",
        category: "skillCategories.support",
        icon: "icon_skill_reload",
        subText: {
            zh: '消耗物品恢复弹药',
            'zh-TW': '消耗物品恢復彈藥',
            en: 'Use Item to Reload',
            ja: 'アイテムを消費してリロード',
            ko: '아이템을 소모하여 재장전'
        },
        description: {
            zh: '消耗背包中的子弹装填武器。',
            'zh-TW': '消耗背包中的子彈裝填武器。',
            en: 'Reload weapon using ammo from inventory.',
            ja: 'インベントリの弾薬を使って武器をリロードする。',
            ko: '인벤토리의 탄약을 사용하여 무기를 재장전한다.'
        },
        targetType: "self",
        cost: "5 Rounds",
        costs: [
            { type: 'item', id: 6001, amount: 5 } // 逻辑消耗：通用子弹 (ID 6001)
        ],
        effects: [
            { type: 'applyStatus', status: 'status_chambered_count', duration: 5, target: 'self' }
        ]
    },

    // 怪物装填 (消耗自身Buff)
    'skill_firearm_reload_reserve': {
        id: 'skill_firearm_reload_reserve',
        name: {
            zh: '装填',
            'zh-TW': '裝填',
            en: 'Reload',
            ja: 'リロード',
            ko: '재장전'
        },
        type: "skillTypes.utility",
        category: "skillCategories.enemy", // 标记为敌人技能
        icon: "icon_skill_reload",
        subText: {
            zh: '消耗备弹恢复弹药',
            'zh-TW': '消耗備彈恢復彈藥',
            en: 'Use Reserve to Reload',
            ja: '予備弾薬を消費してリロード',
            ko: '예비 탄약을 소모하여 재장전'
        },
        description: {
            zh: '从储备弹药中装填武器。',
            'zh-TW': '從儲備彈藥中裝填武器。',
            en: 'Reload weapon from reserve ammo.',
            ja: '予備弾薬から武器をリロードする。',
            ko: '예비 탄약에서 무기를 재장전한다.'
        },
        targetType: "self",
        costs: [
            { type: 'status_duration', id: 'status_ammo_count', amount: 5 } // 逻辑消耗：残弹余数 (持续时间)
        ],
        effects: [
            { type: 'applyStatus', status: 'status_chambered_count', duration: 5, target: 'self' }
        ]
    }
};
