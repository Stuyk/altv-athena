// @ts-nocheck
import { shallowRef } from 'vue';

import Atm from '@plugins/core-atm/webview/Atm.vue';
import Clothing from '@plugins/core-clothing/webview/Clothing.vue';
import Factions from '@plugins/core-factions/webview/Factions.vue';
import Garage from '@plugins/core-garage/webview/Garage.vue';
import Hud from '@plugins/core-hud/webview/Hud.vue';
import PaintShop from '@plugins/core-paintshop/webview/PaintShop.vue';
import Dealership from '@plugins/core-dealership/webview/Dealership.vue';

export const PLUGIN_IMPORTS = {
    // Import Names and File Names are CaSeSenSiTiVe
    Atm: shallowRef(Atm),
    Clothing: shallowRef(Clothing),
    Factions: shallowRef(Factions),
    Garage: shallowRef(Garage),
    Hud: shallowRef(Hud),
    PaintShop: shallowRef(PaintShop),
    Dealership: shallowRef(Dealership),
};
