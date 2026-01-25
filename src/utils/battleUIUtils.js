import { statusDb } from '@schema/status';

export const getRoleColor = (role) => {
    if (!role) return '#94a3b8';
    if (role.includes('swordsman')) return '#ef4444';
    if (role.includes('gunner')) return '#f97316';
    if (role.includes('mage')) return '#3b82f6';
    if (role.includes('brawler')) return '#eab308';
    if (role.includes('lancer')) return '#dc2626';
    if (role.includes('mimic')) return '#a855f7';
    if (role.includes('storyteller')) return '#14b8a6';
    return '#94a3b8';
};

export const getStatusIcon = (statusId) => {
    return statusDb[statusId]?.icon || '?';
};

export const getStatusTooltip = (status) => {
    const def = statusDb[status.id];
    if (!def) return '';
    return `${def.name.zh} (${status.duration}回合)\n${def.description.zh}`;
};

export const getStatusClass = (statusId) => {
    const def = statusDb[statusId];
    if (!def) return '';
    return def.type === 'statusTypes.buff' ? 'status-buff' : 'status-debuff';
};

export const getATBWidth = (atbValue) => {
    if (!atbValue || atbValue < 0) return 0;
    if (atbValue > 0 && atbValue % 100 === 0) return 100;
    return atbValue % 100;
};

export const getATBColorClass = (atbValue) => {
    if (!atbValue) return '';
    if (atbValue >= 400) return 'atb-white';
    if (atbValue >= 300) return 'atb-blue';
    if (atbValue >= 200) return 'atb-red';
    if (atbValue >= 100) return 'atb-orange';
    return 'atb-yellow';
};

export const getATBContainerClass = (atbValue) => {
    if (!atbValue) return '';
    if (atbValue >= 400) return 'bg-blue';
    if (atbValue >= 300) return 'bg-red';
    if (atbValue >= 200) return 'bg-orange';
    if (atbValue >= 100) return 'bg-yellow';
    return '';
};

