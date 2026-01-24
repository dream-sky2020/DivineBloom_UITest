/**
 * 资源与消耗状态标签
 */
export default {
    'status_resource': {
        id: 'status_resource',
        name: { zh: '资源', en: 'Resource', 'zh-TW': '資源', ja: 'リソース', ko: '자원' },
        description: { zh: '用于发动技能或维持状态的资源。', en: 'Resources used to activate skills or maintain status.', 'zh-TW': '用於發動技能或維持狀態的資源。', ja: 'スキルの発動や状态の維持に使用されるリソース。', ko: '스킬 발동이나 상태 유지에 사용되는 자원.' },
        color: '#aaaaaa'
    },
    'status_ammo': {
        id: 'status_ammo',
        name: { zh: '弹药', en: 'Ammo', 'zh-TW': '彈藥', ja: '弾薬', ko: '탄약' },
        description: { zh: '远程武器所需的弹药。', en: 'Ammunition required for ranged weapons.', 'zh-TW': '遠程武器所需的彈藥。', ja: '弾薬。遠距離武器に必要な弾薬。', ko: '탄약. 원거리 무기에 필요한 탄약.' },
        color: '#ffcc00'
    },
    'status_chambered': {
        id: 'status_chambered',
        name: { zh: '已装填', en: 'Chambered', 'zh-TW': '已裝填', ja: '装填済み', ko: '장전됨' },
        description: { zh: '已进入发射准备状态的弹药。', en: 'Ammunition ready to be fired.', 'zh-TW': '已進入發射準備狀態的彈藥。', ja: '発射準備が整った弾薬。', ko: '발사 준비가 완료된 탄약.' },
        color: '#ff9900'
    }
}
