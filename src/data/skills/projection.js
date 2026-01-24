export default {
    // 构造投影咒法·子弹打印
    'skill_magic_projection_ammo': {
        id: 'skill_magic_projection_ammo',
        name: {
            zh: '构造投影·子弹打印',
            'zh-TW': '構造投影·子彈打印',
            en: 'Projection: Bullet Print',
            ja: '投影魔術・弾丸生成',
            ko: '투영 마술 · 탄환 생성'
        },
        type: "skillTypes.active",
        category: "cat_skill_magic",
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
        tags: ['cat_skill_magic', 'cat_skill_firearm', 'status_buff'],
        cost: "10 MP",
        costs: [
            { type: 'mp', amount: 10 }
        ],
        effects: [
            { type: 'applyStatus', status: 'status_ammo_count', duration: 10, target: 'self' }
        ]
    }
};
