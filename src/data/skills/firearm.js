export default {
    // --- 射击技能 (Firearm Skills) ---

    // 基础射击
    2001: {
        id: 2001,
        name: {
            zh: '射击',
            'zh-TW': '射擊',
            en: 'Shoot',
            ja: '射撃',
            ko: '사격'
        },
        type: "skillTypes.active",
        category: "skillCategories.physical",
        icon: "icon_skill_shoot",
        subText: {
            zh: '单体物理伤害',
            'zh-TW': '單體物理傷害',
            en: 'Single Target Physical Dmg',
            ja: '単体物理ダメージ',
            ko: '단일 물리 피해'
        },
        description: {
            zh: '使用枪械对敌人进行射击。',
            'zh-TW': '使用槍械對敵人進行射擊。',
            en: 'Shoot the enemy with a firearm.',
            ja: '銃器で敵を射撃する。',
            ko: '총기로 적을 사격한다.'
        },
        targetType: "enemy",
        cost: "1 Ammo", // UI 显示
        costs: [
            { type: 'status_duration', id: 106, amount: 1 } // 逻辑消耗：弦上余数 (持续时间)
        ],
        effects: [
            { type: 'damage', scaling: 'atk', value: 1.0 }
        ]
    },

    // 玩家装填 (消耗物品)
    2002: {
        id: 2002,
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
            { type: 'applyStatus', status: 106, duration: 5, target: 'self' }
        ]
    },

    // 怪物装填 (消耗自身Buff)
    2003: {
        id: 2003,
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
            { type: 'status_duration', id: 105, amount: 5 } // 逻辑消耗：残弹余数 (持续时间)
        ],
        effects: [
            { type: 'applyStatus', status: 106, duration: 5, target: 'self' }
        ]
    },

    // 构造投影咒法·子弹打印
    2004: {
        id: 2004,
        name: {
            zh: '构造投影·子弹打印',
            'zh-TW': '構造投影·子彈打印',
            en: 'Projection: Bullet Print',
            ja: '投影魔術・弾丸生成',
            ko: '투영 마술 · 탄환 생성'
        },
        type: "skillTypes.active",
        category: "skillCategories.magic",
        icon: "icon_skill_magic_ammo", // 假设有这个图标
        subText: {
            zh: '消耗MP制造弹药',
            'zh-TW': '消耗MP製造彈藥',
            en: 'Use MP to Create Ammo',
            ja: 'MPを消費して弾薬生成',
            ko: 'MPを消費して弾薬生成'
        },
        description: {
            zh: '消耗魔力，通过投影魔术临时构造出备用弹药。',
            'zh-TW': '消耗魔力，通過投影魔術臨時構造出備用彈藥。',
            en: 'Consumes mana to temporarily construct reserve ammunition via projection magic.',
            ja: '魔力を消費し、投影魔術によって予備弾薬を一時的に生成する。',
            ko: '마력을 소모하여 투영 마술로 예비 탄약을 일시적으로 생성한다.'
        },
        targetType: "self",
        cost: "10 MP",
        costs: [
            { type: 'mp', amount: 10 }
        ],
        effects: [
            { type: 'applyStatus', status: 105, duration: 10, target: 'self' }
        ]
    }
};
