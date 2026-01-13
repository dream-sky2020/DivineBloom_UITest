export default {
    // --- 射击技能 (Firearm Skills) ---

    // 基础射击
    'skill_firearm_shoot': {
        id: 'skill_firearm_shoot',
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
            { type: 'status_duration', id: 'status_chambered_count', amount: 1 } // 逻辑消耗：弦上余数 (持续时间)
        ],
        effects: [
            { type: 'damage', scaling: 'atk', value: 1.0 }
        ]
    }
};
