import * as alt from 'alt-client';

import { KEY_BINDS } from '../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ActionMenu } from '../../shared/interfaces/Actions';
import { Interaction } from '../../shared/interfaces/Interaction';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { distance2d } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { ActionsController } from '../views/hud/controllers/actionsController';
import { HelpController } from './help';
import { VehicleController } from './vehicle';

const MAX_INTERACTION_DIST = 5;
const MAX_CHECKPOINT_DRAW = 8;
const TIME_BETWEEN_CHECKS = 500;
let NEXT_MENU_UPDATE = Date.now() + 2000;
let dynamicActionMenu: ActionMenu = {};
let tick;
let pressedKey = false;
let nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;

export class InteractionController {
    /**
     * Initialize the Interaction Controller
     * @static
     * @memberof InteractionController
     */
    static init() {
        if (!tick) {
            tick = alt.setInterval(InteractionController.tick, 0);
        }

        InteractionController.registerKeybinds();
    }

    /**
     * Register default keybind for interactions.
     * @static
     * @memberof InteractionController
     */
    static registerKeybinds() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.INTERACT,
            singlePress: () => {
                pressedKey = true;
            }
        });
    }

    /**
     * Set when a player enters a ColShape Interaction from Server Side
     * @static
     * @param {(string | null)} type
     * @param {alt.Vector3} position
     * @memberof InteractionController
     */
    static set(interaction: Interaction) {
        if (interaction === null) {
            alt.Player.local.closestInteraction = null;
            return;
        }

        alt.Player.local.closestInteraction = interaction;
    }

    static tick() {
        if (alt.Player.local.isMenuOpen) {
            pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        if (alt.Player.local.isChatOpen) {
            pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        if (alt.Player.local.meta.isDead) {
            pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        VehicleController.runVehicleControllerTick();

        let hasVehicle = false;
        // Populates the Menu
        if (Date.now() > NEXT_MENU_UPDATE) {
            NEXT_MENU_UPDATE = Date.now() + 1000;
            dynamicActionMenu = {};

            // const closestVehicle = VehicleController.getClosestVehicle();
            // if (closestVehicle) {
            //     const dist = distance2d(alt.Player.local.pos, closestVehicle.pos);
            //     if (dist <= MAX_INTERACTION_DIST) {
            //         hasVehicle = true;

            //         const vehicleMenus = VehicleController.getVehicleOptions();
            //         if (Object.keys(vehicleMenus).length >= 1) {
            //             dynamicActionMenu = { ...dynamicActionMenu, ...vehicleMenus };
            //         }
            //     }
            // }
        }

        // Populates Interaction Menu
        // if (alt.Player.local.closestInteraction) {
        //     const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);
        //     if (dist < MAX_CHECKPOINT_DRAW) {
        //         dynamicActionMenu[alt.Player.local.closestInteraction.shortDesc] = {
        //             eventName: SYSTEM_EVENTS.INTERACTION,
        //             isServer: true,
        //             data: alt.Player.local.closestInteraction.type
        //         };
        //     }
        // }

        // Timeout for Key Presses
        if (nextKeyPress > Date.now()) {
            pressedKey = false;
            return;
        }

        const dynamicMenuLength = Object.keys(dynamicActionMenu).length;

        // Check that the Dynamic Menu has Items
        if (dynamicMenuLength <= 0) {
            return;
        }

        // Multiple Views
        // if (dynamicMenuLength >= 2) {
        //     HelpController.append({
        //         position: alt.Player.local.pos,
        //         key: KEY_BINDS.INTERACT,
        //         desc: LocaleController.get(LOCALE_KEYS.INTERACTION_VIEW_OPTIONS)
        //     });
        // } else if (alt.Player.local.closestInteraction && alt.Player.local.closestInteraction.position) {
        //     HelpController.append({
        //         position: alt.Player.local.closestInteraction.position,
        //         key: KEY_BINDS.INTERACT,
        //         desc: alt.Player.local.closestInteraction.shortDesc
        //     });
        // } else if (alt.Player.local.otherInteraction) {
        //     const dist = distance2d(alt.Player.local.pos, alt.Player.local.otherInteraction.position);
        //     if (dist <= MAX_INTERACTION_DIST) {
        //         HelpController.append({
        //             position: alt.Player.local.closestInteraction.position,
        //             key: KEY_BINDS.INTERACT,
        //             desc: alt.Player.local.closestInteraction.shortDesc
        //         });

        //         HelpController.updateHelpText({
        //             position: alt.Player.local.pos,
        //             key: null,
        //             shortDesc: alt.Player.local.otherInteraction.short,
        //             longDesc: alt.Player.local.otherInteraction.long
        //         });
        //     } else {
        //         HelpController.updateHelpText(null);
        //     }
        // } else {
        //     HelpController.updateHelpText(null);
        // }

        // Called when the palyer pressed the interaction key.
        if (!pressedKey) {
            return;
        }

        pressedKey = false;
        nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;

        if (dynamicMenuLength <= 1 && hasVehicle) {
            ActionsController.set(dynamicActionMenu);
            return;
        }

        if (dynamicMenuLength <= 1 && alt.Player.local.closestInteraction) {
            alt.emitServer(SYSTEM_EVENTS.INTERACTION, alt.Player.local.closestInteraction.type);
            return;
        }

        ActionsController.set(dynamicActionMenu);
        return;
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.set);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InteractionController.init);
