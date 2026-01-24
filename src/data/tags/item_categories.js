/**
 * 物品大类定义与基础特性标签
 */
export default {
    // --- 物品大类 (Item Categories) ---
    'itemTypes.weapon': {
        id: 'itemTypes.weapon',
        name: { zh: '武器', en: 'Weapon', 'zh-TW': '武器', ja: '武器', ko: '무기' },
        description: { zh: '用于攻击敌人的装备。', en: 'Equipment used to attack enemies.', 'zh-TW': '用於攻擊敵人的裝備。', ja: '敵を攻撃するための装備。', ko: '적을 공격하는 데 사용되는 장비.' },
        color: '#f87171'
    },
    'itemTypes.armor': {
        id: 'itemTypes.armor',
        name: { zh: '防具', en: 'Armor', 'zh-TW': '防具', ja: '防具', ko: '방어구' },
        description: { zh: '用于提升防御能力的装备。', en: 'Equipment used to increase defense.', 'zh-TW': '用於提升防禦能力的裝備。', ja: '防禦力を高めるための装備。', ko: '방어력을 높이는 데 사용되는 장비.' },
        color: '#60a5fa'
    },
    'itemTypes.accessory': {
        id: 'itemTypes.accessory',
        name: { zh: '饰品', en: 'Accessory', 'zh-TW': '飾品', ja: 'アクセサリー', ko: '장신구' },
        description: { zh: '提供额外属性或特殊效果的装备。', en: 'Equipment providing extra stats or special effects.', 'zh-TW': '提供額外屬性或特殊效果的裝備。', ja: '追加のステータスや特殊効果を与える装備。', ko: '추가 능력치나 특수 효과를 제공하는 장비.' },
        color: '#fbbf24'
    },
    'itemTypes.consumable': {
        id: 'itemTypes.consumable',
        name: { zh: '消耗品', en: 'Consumable', 'zh-TW': '消耗品', ja: '消耗品', ko: '소모품' },
        description: { zh: '使用后会消失的物品。', en: 'Items that disappear after use.', 'zh-TW': '使用後會消失的物品。', ja: '使用すると消失するアイテム。', ko: '사용 후 사라지는 아이템.' },
        color: '#34d399'
    },
    'itemTypes.material': {
        id: 'itemTypes.material',
        name: { zh: '材料', en: 'Material', 'zh-TW': '材料', ja: '素材', ko: '재료' },
        description: { zh: '用于制作或强化的基础素材。', en: 'Basic materials used for crafting or enhancement.', 'zh-TW': '用於製作或強化的基礎素材。', ja: '製作や強化に使用される基本素材。', ko: '제작이나 강화에 사용되는 기본 재료.' },
        color: '#94a3b8'
    },
    'itemTypes.keyItem': {
        id: 'itemTypes.keyItem',
        name: { zh: '重要物品', en: 'Key Item', 'zh-TW': '重要物品', ja: '重要アイテム', ko: '중요 아이템' },
        description: { zh: '与剧情或任务相关的关键物品。', en: 'Key items related to the plot or quests.', 'zh-TW': '與劇情或任務相關的關鍵物品。', ja: 'ストーリーやクエストに関連する重要的アイテム。', ko: '스토리나 퀘스트와 관련된 중요한 아이템.' },
        color: '#a855f7'
    },
    'itemTypes.ammo': {
        id: 'itemTypes.ammo',
        name: { zh: '弹药', en: 'Ammo', 'zh-TW': '彈藥', ja: '弾薬', ko: '탄약' },
        description: { zh: '远程武器所需的消耗性资源。', en: 'Consumable resources required for ranged weapons.', 'zh-TW': '遠程武器所需的消耗性資源。', ja: '遠距離武器に必要な消耗性リソース。', ko: '원거리 무기에 필요한 소모성 자원.' },
        color: '#fb923c'
    },

    // --- 物品特性标签 (Item Trait Tags) ---
    'item_weapon': {
        id: 'item_weapon',
        name: { zh: '武器', en: 'Weapon' },
        color: '#f87171'
    },
    'item_armor': {
        id: 'item_armor',
        name: { zh: '防具', en: 'Armor' },
        color: '#60a5fa'
    },
    'item_accessory': {
        id: 'item_accessory',
        name: { zh: '饰品', en: 'Accessory' },
        color: '#fbbf24'
    },
    'item_consumable': {
        id: 'item_consumable',
        name: { zh: '消耗品', en: 'Consumable' },
        color: '#34d399'
    },
    'item_material': {
        id: 'item_material',
        name: { zh: '材料', en: 'Material' },
        color: '#94a3b8'
    },
    'item_key': {
        id: 'item_key',
        name: { zh: '关键', en: 'Key' },
        color: '#a855f7'
    },
    'item_ammo': {
        id: 'item_ammo',
        name: { zh: '弹药', en: 'Ammo' },
        color: '#fb923c'
    },
    'quest': {
        id: 'quest',
        name: { zh: '任务', en: 'Quest' },
        color: '#a855f7'
    }
}
