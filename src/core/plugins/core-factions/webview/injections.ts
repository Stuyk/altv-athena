// @ts-nocheck - Required to ignore weird pathing issues.
import { defineAsyncComponent } from 'vue';

export const FactionPageInjections = {
    actions: {
        // name: component_relative_path
        // ie. Atm: '../../core-atm/components/Atm.vue'
    },
    settings: {
        // name: component_relative_path
        // ie. Atm: '../../core-atm/components/Atm.vue'
        Paychecks: defineAsyncComponent(() => import('../../core-factions-paychecks/components/Paychecks.vue')),
    },
};
