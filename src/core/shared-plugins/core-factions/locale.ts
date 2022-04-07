import { RankPermissionNames } from './interfaces';

export const FactionLocale = {
    [RankPermissionNames.addMembers + 'Desc']: 'Recruit new members.',
    [RankPermissionNames.bankAdd + 'Desc']: 'Add to bank.',
    [RankPermissionNames.bankRemove + 'Desc']: 'Remove money from bank.',
    [RankPermissionNames.kickMembers + 'Desc']: 'Kick members below acting rank.',
    [RankPermissionNames.manageMembers + 'Desc']: 'Change member ranks below acting rank.',
    [RankPermissionNames.manageRankPermissions + 'Desc']: 'Change rank permissions below acting rank.',
    [RankPermissionNames.manageRanks + 'Desc']:
        'Create ranks, rename ranks, and adjust weight of ranks below current acting rank.',
    [RankPermissionNames.addMembers]: 'Recruit Member',
    [RankPermissionNames.bankAdd]: 'Add to Bank',
    [RankPermissionNames.bankRemove]: 'Remove from Bank',
    [RankPermissionNames.kickMembers]: 'Kick',
    [RankPermissionNames.manageMembers]: 'Manage Member',
    [RankPermissionNames.manageRankPermissions]: 'Rank Permissions',
    [RankPermissionNames.manageRanks]: 'Manage Rank',
};
