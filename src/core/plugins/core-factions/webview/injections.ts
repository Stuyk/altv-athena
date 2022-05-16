// @ts-nocheck - Required to ignore weird pathing issues.
import { FactionCorePageInjections } from './coreInjections';

export const FactionPageInjections = {
    // Actions inserts are inserted at the bottom of the actions page.
    // Location of Insert: https://i.imgur.com/oyNzeDB.png
    actions: {
        // name: component_relative_path
        // ie. Atm: defineAsyncComponent(() => import('../../core-atm/components/Atm.vue'));
        ...FactionCorePageInjections.actions,
    },
    // Members inserts are inserted for individual member permissions when clicked on.
    // Location of Insert: https://i.imgur.com/azBYSdt.png
    members: {
        // name: component_relative_path
        // ie. RankPay: defineAsyncComponent(() => import('../../core-factions-locater/components/Locate.vue'));
        ...FactionCorePageInjections.members,
    },
    // Ranking inserts are inserted next to the already existing buttons.
    // Location of Insert: https://i.imgur.com/X7hBlwo.png
    rankings: {
        // name: component_relative_path
        // ie. RankPay: defineAsyncComponent(() => import('../../core-rank-pay/components/RankPay.vue'));
        ...FactionCorePageInjections.rankings,
    },
    // Settings inserts are inserted at the bottom of the settings page.
    // Location of Insert: https://i.imgur.com/oyNzeDB.png
    settings: {
        // name: component_relative_path
        // ie. Atm: defineAsyncComponent(() => import('../../core-atm/components/Atm.vue'));
        ...FactionCorePageInjections.settings,
    },
    bank: {
        // name: component_relative_path
        // ie. Atm: defineAsyncComponent(() => import('../../core-atm/components/Atm.vue'));
        ...FactionCorePageInjections.bank,
    },
};
