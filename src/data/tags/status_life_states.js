/**
 * 生命状态标签
 */
export default {
    'status_dying': {
        id: 'status_dying',
        name: { zh: '濒死', en: 'Dying', 'zh-TW': '瀕死', ja: '瀕死', ko: '빈사' },
        description: { zh: '生命值归零但尚未彻底死亡。', en: 'HP is zero but not yet permanently dead.', 'zh-TW': '生命值歸零但尚未徹底死亡。', ja: 'HPがゼロだが、まだ完全には死亡していない。', ko: '생명력이 0이지만 아직 완전히 사망하지 않음.' },
        color: '#ff6600'
    },
    'status_fragile': {
        id: 'status_fragile',
        name: { zh: '脆弱', en: 'Fragile', 'zh-TW': '脆弱', ja: '脆弱', ko: '취약' },
        description: { zh: '极易受到致命伤害。', en: 'Extremely vulnerable to fatal damage.', 'zh-TW': '極易受到致命傷害。', ja: '脆弱。致命的なダメージを受けやすい。', ko: '취약. 치명적인 피해에 매우 취약함.' },
        color: '#ff00ff'
    },
    'status_heroic': {
        id: 'status_heroic',
        name: { zh: '英雄', en: 'Heroic', 'zh-TW': '英雄', ja: '英雄的', ko: '영웅적' },
        description: { zh: '表现出超越常人的顽强意志。', en: 'Demonstrating extraordinary tenacity.', 'zh-TW': '表現出超越常人的頑強意志。', ja: '常人離れした粘り強さを示す。', ko: '보통 사람을 뛰어넘는 끈질긴 의지를 보여줌.' },
        color: '#ffff00'
    },
    'status_spirit': {
        id: 'status_spirit',
        name: { zh: '灵体', en: 'Spirit', 'zh-TW': '靈體', ja: '霊体', ko: '영체' },
        description: { zh: '以非物质形态存在的状态。', en: 'Existing in a non-material form.', 'zh-TW': '以非物質形態存在的狀態。', ja: '非物質的な形態で存在する状態。', ko: '비물질적인 형태로 존재하는 상태.' },
        color: '#88ffff'
    },
    'status_invulnerable': {
        id: 'status_invulnerable',
        name: { zh: '无敌', en: 'Invulnerable', 'zh-TW': '無敵', ja: '無敵', ko: '무적' },
        description: { zh: '无法受到任何伤害。', en: 'Cannot take any damage.', 'zh-TW': '無法受到任何傷害。', ja: 'いかなるダメージも受けない。', ko: '어떠한 피해도 입지 않음.' },
        color: '#ffffff'
    },
    'status_rebirth': {
        id: 'status_rebirth',
        name: { zh: '重生', en: 'Rebirth', 'zh-TW': '重生', ja: '転生', ko: '부활' },
        description: { zh: '拥有死而复生的能力。', en: 'Having the ability to return from death.', 'zh-TW': '擁有死而復生的能力。', ja: '死から復活する能力を持つ。', ko: '죽음에서 부활하는 능력을 가짐.' },
        color: '#00ffff'
    },
    'status_dead': {
        id: 'status_dead',
        name: { zh: '死亡', en: 'Dead', 'zh-TW': '死亡', ja: '死亡', ko: '사망' },
        description: { zh: '已彻底失去战斗能力。', en: 'Has completely lost the ability to fight.', 'zh-TW': '已徹底失去戰鬥能力。', ja: '完全に戦闘能力を失った。', ko: '완전히 전투 능력을 상실함.' },
        color: '#444444'
    }
}
