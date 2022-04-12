import { shallowRef } from 'vue';
import Atm from '../../core-atm/webview/Atm.vue';
import Clothing from '../../core-clothing/webview/Clothing.vue';
import Factions from '../../core-factions/webview/Factions.vue';
import Garage from '../../core-garage/webview/Garage.vue';
import Hud from '../../core-hud/webview/Hud.vue';
import PaintShop from '../../core-paintshop/webview/PaintShop.vue';

export const PLUGIN_IMPORTS = {
    // Import Names and File Names are CaSeSenSiTiVe
    Atm: shallowRef(Atm),
    Clothing: shallowRef(Clothing),
    Factions: shallowRef(Factions),
    Garage: shallowRef(Garage),
    Hud: shallowRef(Hud),
    PaintShop: shallowRef(PaintShop),
};
