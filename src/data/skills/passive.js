export default {
    // Passive Skills
    'skill_passive_attack_up': {
        id: 'skill_passive_attack_up',
        name: {
            zh: '攻击强化',
            'zh-TW': '攻擊強化',
            en: 'Attack Up',
            ja: '攻撃力強化',
            ko: '공격력 강화'
        },
        type: "skillTypes.passive",
        category: "skillCategories.passive",
        icon: "icon_strength",
        cost: "--",
        effects: [
            {
                type: "stat_boost",
                stat: "atk",
                value: 0.15, // +15%
                trigger: "battle_start"
            }
        ],
        subText: {
            zh: '被动效果',
            'zh-TW': '被動效果',
            en: 'Passive Effect',
            ja: 'パッシブ効果',
            ko: '패시브 효과'
        },
        description: {
            zh: '永久提升角色的物理攻击力。',
            'zh-TW': '永久提升角色的物理攻擊力。',
            en: 'Permanently increases physical attack power.',
            ja: 'キャラクターの物理攻撃力を永続的に上昇させる。',
            ko: '캐릭터의 물리 공격력을 영구적으로 상승시킨다.'
        }
    },
    'skill_passive_mana_regen': {
        id: 'skill_passive_mana_regen',
        name: {
            zh: '法力再生',
            'zh-TW': '法力再生',
            en: 'Mana Regen',
            ja: '魔力再生',
            ko: '마나 재생'
        },
        type: "skillTypes.passive",
        category: "skillCategories.passive",
        icon: "icon_mana",
        cost: "--",
        effects: [
            {
                type: "recover_mp",
                value: 10,
                trigger: "turnStart"
            }
        ],
        subText: {
            zh: '被动效果',
            'zh-TW': '被動效果',
            en: 'Passive Effect',
            ja: 'パッシブ効果',
            ko: '패시브 효과'
        },
        description: {
            zh: '每回合自动恢复少量魔法值。',
            'zh-TW': '每回合自動恢復少量魔法值。',
            en: 'Automatically restores a small amount of MP each turn.',
            ja: '毎ターンMPを少量自動回復する。',
            ko: '매 턴마다 소량의 MP를 자동으로 회복한다.'
        }
    },
    'skill_passive_heroic_will_shattered_prison': {
        id: 'skill_passive_heroic_will_shattered_prison',
        name: {
            zh: '英雄意志·破碎监牢',
            'zh-TW': '英雄意志·破碎監牢',
            en: 'Heroic Will: Shattered Prison',
            ja: '英雄の意志・砕かれた牢獄',
            ko: '영웅의 의지: 부서진 감옥'
        },
        type: "skillTypes.passive",
        category: "skillCategories.passive",
        icon: "icon_limit_break", // 假设复用或新加图标
        cost: "--",
        effects: [
            {
                type: "applyStatus",
                status: "status_shattered_prison",
                trigger: "on_cc_skip"
            }
        ],
        subText: {
            zh: '控制抵抗',
            'zh-TW': '控制抵抗',
            en: 'CC Resist',
            ja: '行動阻害耐性',
            ko: '제어 저항'
        },
        description: {
            zh: '当因无法行动（如麻痹、冻结）跳过回合时，获得"破碎监牢"状态，下一回合行动必定不会被阻止。',
            'zh-TW': '當因無法行動（如麻痺、凍結）跳過回合時，獲得"破碎監牢"狀態，下一回合行動必定不會被阻止。',
            en: 'When a turn is skipped due to CC (Stun, Freeze), gain "Shattered Prison" status, ensuring action next turn.',
            ja: '行動不能（麻痺、凍結など）によりターンをスキップした時、「砕かれた牢獄」状態を得て、次のターンは确实に行動できる。',
            ko: '행동 불가(마비, 동결 등)로 인해 턴을 건너뛸 때, "부서진 감옥" 상태를 얻어 다음 턴에는 반드시 행동할 수 있다.'
        }
    },
    'skill_passive_will_to_live': {
        id: 'skill_passive_will_to_live',
        name: {
            zh: '求生意志',
            'zh-TW': '求生意志',
            en: 'Will to Live',
            ja: '生存本能',
            ko: '생존 의지'
        },
        type: "skillTypes.passive",
        category: "skillCategories.passive",
        icon: "icon_heart_pulse",
        cost: "--",
        effects: [
            {
                type: "death_handler",
                variant: "will_to_live",
                trigger: "onHpZero"
            }
        ],
        subText: {
            zh: '生存被动',
            'zh-TW': '生存被動',
            en: 'Survival Passive',
            ja: '生存パッシブ',
            ko: '생존 패시브'
        },
        description: {
            zh: '当生命值归零时，不会立刻死亡而是进入濒死状态。在濒死状态下再次受到伤害有概率死亡。回复生命值可解除濒死。',
            'zh-TW': '當生命值歸零時，不會立刻死亡而是進入瀕死狀態。在瀕死狀態下再次受到傷害有概率死亡。回復生命值可解除瀕死。',
            en: 'When HP reaches zero, enter Dying state instead of dying. Taking damage while Dying has a chance to cause death. Healing removes Dying.',
            ja: 'HPが0になった時、即座に死亡せず瀕死状態になる。瀕死状態でダメージを受けると確率で死亡する。回復すると解除される。',
            ko: '생명력이 0이 되어도 즉시 사망하지 않고 빈사 상태가 됩니다. 빈사 상태에서 피해를 입으면 확률적으로 사망합니다. 회복 시 해제됩니다.'
        }
    },
    'skill_passive_hollow_will': {
        id: 'skill_passive_hollow_will',
        name: {
            zh: '空洞意志',
            'zh-TW': '空洞意志',
            en: 'Hollow Will',
            ja: '虚ろな意志',
            ko: '공허한 의지'
        },
        type: "skillTypes.passive",
        category: "skillCategories.passive",
        icon: "icon_skull",
        cost: "--",
        effects: [
            {
                type: "death_handler",
                variant: "hollow_will",
                trigger: "onHpZero"
            }
        ],
        subText: {
            zh: '致命缺陷',
            'zh-TW': '致命缺陷',
            en: 'Fatal Flaw',
            ja: '致命的な欠陥',
            ko: '치명적 결함'
        },
        description: {
            zh: '生命值归零时立刻死亡。除装备“超越生死”外，所有角色的默认属性。',
            'zh-TW': '生命值歸零時立刻死亡。除裝備“超越生死”外，所有角色的默認屬性。',
            en: 'Dies immediately when HP reaches zero. Default for all characters unless "Surpass Life and Death" is equipped.',
            ja: 'HPが0になると即座に死亡する。「超越生死」を装備していない全キャラクターのデフォルト属性。',
            ko: '생명력이 0이 되면 즉시 사망합니다. "超越生死"를 장착하지 않은 모든 캐릭터의 기본 속성입니다.'
        }
    }
}
