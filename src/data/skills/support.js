export default {
    // Support Skills
    'skill_support_heal': {
        id: 'skill_support_heal',
        name: {
            zh: '治愈术',
            'zh-TW': '治癒術',
            en: 'Heal',
            ja: 'ヒール',
            ko: '힐'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "ally",
        tags: ['status_healing'],
        effects: [
            { type: "heal", value: 500, minOffset: -0.1, maxOffset: 0.1 }
        ],
        icon: "icon_heal",
        cost: "20 MP",
        subText: {
            zh: '单体治疗',
            'zh-TW': '單體治療',
            en: 'Single Target Heal',
            ja: '単体回復',
            ko: '단일 치유'
        },
        description: {
            zh: '恢复己方单体目标的生命值。',
            'zh-TW': '恢復己方單體目標的生命值。',
            en: 'Restores HP to a single ally.',
            ja: '味方単体のHPを回復する。',
            ko: '아군 한 명의 HP를 회복시킨다.'
        }
    },
    'skill_support_shield': {
        id: 'skill_support_shield',
        name: {
            zh: '护盾术',
            'zh-TW': '護盾術',
            en: 'Shield',
            ja: 'プロテス',
            ko: '쉴드'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "allAllies",
        tags: ['status_buff', 'mech_aoe'],
        effects: [
            { type: "applyStatus", status: 'status_defense_up', duration: 3 }
        ],
        icon: "icon_shield",
        cost: "30 MP",
        subText: {
            zh: '增加防御',
            'zh-TW': '增加防禦',
            en: 'Increase Defense',
            ja: '防御力アップ',
            ko: '방어력 증가'
        },
        description: {
            zh: '在短时间内提高己方全体的防御力。',
            'zh-TW': '在短時間內提高己方全體的防禦力。',
            en: 'Temporarily increases defense for all allies.',
            ja: '短時間、味方全員の防御力を高める。',
            ko: '短い時間、味方全員の防御力を高める。'
        }
    },
    'skill_support_resurrection': {
        id: 'skill_support_resurrection',
        name: {
            zh: '复活术',
            'zh-TW': '復活術',
            en: 'Resurrection',
            ja: 'レイズ',
            ko: '부활'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "deadAlly",
        tags: ['status_revive'],
        effects: [
            { type: "revive", value: 0.2 }
        ],
        icon: "icon_revive",
        cost: "40 MP",
        subText: {
            zh: '复活队友',
            'zh-TW': '復活隊友',
            en: 'Revive Ally',
            ja: '蘇生',
            ko: '아군 부활'
        },
        description: {
            zh: '复活一名倒下的队友并恢复少量生命值。',
            'zh-TW': '復活一名倒下的隊友並恢復少量生命值。',
            en: 'Revives a fallen ally with a small amount of HP.',
            ja: '倒れた仲間を蘇生し、HPを少量回復する。',
            ko: '쓰러진 아군을 부활시키고 소량의 HP를 회복시킨다.'
        }
    },

    'skill_support_mass_resurrection': {
        id: 'skill_support_mass_resurrection',
        name: {
            zh: '群体复活',
            'zh-TW': '群體復活',
            en: 'Mass Resurrection',
            ja: 'アレイズ',
            ko: '광역 부활'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "allDeadAllies",
        tags: ['status_revive', 'mech_aoe'],
        effects: [
            { type: "revive", value: 0.5 }
        ],
        icon: "icon_revive_all",
        cost: "80 MP",
        subText: {
            zh: '群体复活',
            'zh-TW': '群體復活',
            en: 'Mass Revive',
            ja: '全体蘇生',
            ko: '전체 부활'
        },
        description: {
            zh: '复活所有倒下的队友并恢复中量生命值。',
            'zh-TW': '復活所有倒下的隊友並恢復中量生命值。',
            en: 'Revives all fallen allies with a moderate amount of HP.',
            ja: '倒れた仲間全員を蘇生し、HPを中量回復する。',
            ko: '쓰러진 아군 전원을 부활시키고 중량의 HP를 회복시킨다.'
        }
    },
    'skill_support_mass_heal': {
        id: 'skill_support_mass_heal',
        name: {
            zh: '群体治疗术',
            'zh-TW': '群體治療術',
            en: 'Mass Heal',
            ja: 'ヒールオール',
            ko: '매스 힐'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "allAllies",
        tags: ['status_healing', 'mech_aoe'],
        effects: [
            { type: "heal_all", value: 500, minOffset: -0.1, maxOffset: 0.1 }
        ],
        icon: "icon_heal_all",
        cost: "45 MP",
        subText: {
            zh: '群体治疗',
            'zh-TW': '群體治療',
            en: 'AoE Heal',
            ja: '全体回復',
            ko: '전체 치유'
        },
        description: {
            zh: '恢复己方全体成员的生命值。',
            'zh-TW': '恢復己方全體成員的生命值。',
            en: 'Restores HP to all allies.',
            ja: '味方全員のHPを回復する。',
            ko: '아군 전원의 HP를 회복시킨다.'
        }
    },
    'skill_support_forward_allies': {
        id: 'skill_support_forward_allies',
        name: {
            zh: '前进吧我的盟友',
            'zh-TW': '前進吧我的盟友',
            en: 'Forward, My Allies!',
            ja: '進め、我が盟友よ',
            ko: '전진하라, 나의 맹우여'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "allOtherAllies",
        tags: ['status_buff', 'mech_aoe', 'mech_quick'],
        effects: [
            { type: "applyStatus", status: 'status_haste', duration: 3 } // Haste
        ],
        icon: "icon_forward_allies",
        cost: "30 MP",
        subText: {
            zh: '盟友全体加速',
            'zh-TW': '盟友全體加速',
            en: 'Ally Speed Up',
            ja: '味方全体速度上昇',
            ko: '아군 전체 속도 증가'
        },
        description: {
            zh: '激励除自己以外的所有队友，提升他们的行动速度。',
            'zh-TW': '激勵除自己以外的所有隊友，提升他們的行動速度。',
            en: 'Inspires all allies except self, increasing their action speed.',
            ja: '自分以外の味方全員を鼓舞し、行動速度を上昇させる。',
            ko: '자신을 제외한 모든 아군을 격려하여 행동 속도를 증가시킨다.'
        }
    },
    'skill_support_dispel': {
        id: 'skill_support_dispel',
        name: {
            zh: '净化术',
            'zh-TW': '淨化術',
            en: 'Dispel',
            ja: 'デスペル',
            ko: '디스펠'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "ally",
        tags: ['status_cure'],
        effects: [
            { 
                type: "cureStatus", 
                tags: ['statusTypes.debuff'], 
                dispelLevel: 1 
            }
        ],
        icon: "icon_dispel",
        cost: "15 MP",
        subText: {
            zh: '单体净化',
            'zh-TW': '單體淨化',
            en: 'Single Dispel',
            ja: '単体解除',
            ko: '단일 해제'
        },
        description: {
            zh: '移除己方单体目标的所有常规负面状态（驱散等级 1）。',
            'zh-TW': '移除己方單體目標的所有正規負面狀態（驅散等級 1）。',
            en: 'Removes all normal debuffs from a single ally (Dispel Level 1).',
            ja: '味方単体の通常の弱体効果をすべて解除する（解除レベル 1）。',
            ko: '아군 한 명의 모든 일반 약화 효과를 제거한다 (해제 레벨 1).'
        }
    },
    'skill_support_mass_dispel': {
        id: 'skill_support_mass_dispel',
        name: {
            zh: '圣洁领域',
            'zh-TW': '聖潔領域',
            en: 'Holy Field',
            ja: 'ホーリーフィールド',
            ko: '홀리 필드'
        },
        type: "skillTypes.active",
        category: "cat_skill_support",
        targetType: "allAllies",
        tags: ['status_cure', 'mech_aoe'],
        effects: [
            { 
                type: "cureStatus", 
                tags: ['statusTypes.debuff'], 
                dispelLevel: 2 
            }
        ],
        icon: "icon_dispel_all",
        cost: "50 MP",
        subText: {
            zh: '群体高级净化',
            'zh-TW': '群體高級淨化',
            en: 'AoE High Dispel',
            ja: '全体高位解除',
            ko: '광역 상급 해제'
        },
        description: {
            zh: '释放圣洁力量，移除己方全体目标的大部分负面状态（驱散等级 2）。',
            'zh-TW': '釋放聖潔力量，移除己方全體目標的大部分負面狀態（驅散等級 2）。',
            en: 'Releases holy power to remove most debuffs from all allies (Dispel Level 2).',
            ja: '清らかな力を放ち、味方全員のほとんどの弱体効果を解除する（解除レベル 2）。',
            ko: '성결한 힘을 방출하여 아군 전원의 대부분의 약화 효과를 제거한다 (해제 레벨 2).'
        }
    }
}
