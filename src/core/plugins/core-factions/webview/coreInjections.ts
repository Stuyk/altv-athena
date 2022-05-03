// @ts-nocheck - Required to ignore weird pathing issues.
import { defineAsyncComponent } from 'vue';

// Not recommended to modify this file unless you are removing some core plugins for factions.
export const FactionCorePageInjections = {
    actions: {},
    members: {},
    rankings: {},
    settings: {
        Paychecks: defineAsyncComponent(() => import('../../core-factions-paychecks/components/Paychecks.vue')),
    },
};
