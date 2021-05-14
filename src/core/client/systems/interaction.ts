import * as alt from 'alt-client';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ActionMenu, Action } from '../../shared/interfaces/Actions';
import { Interaction } from '../../shared/interfaces/Interaction';
import { distance2d } from '../../shared/utility/vector';
import { KEY_BINDS } from '../events/keyup';
import { drawMarker } from '../utility/marker';
import { ActionsController } from '../views/hud/controllers/actionsController';
import { HelpController } from '../views/hud/controllers/helpController';
import { BaseHUD, HudEventNames } from '../views/hud/hud';
import { VehicleController } from './vehicle';

const MAX_INTERACTION_DRAW = 4; // Draws the key to press near the object.
const MAX_CHECKPOINT_DRAW = 8;
const TIME_BETWEEN_CHECKS = 500;
let NEXT_MENU_UPDATE = Date.now() + 2000;
let NEXT_HELP_CLEAR = Date.now() + 5000;
let dynamicActionMenu: ActionMenu = {};

export class InteractionController {
    static customInteractions: Array<Interaction> = [];
    static tick: number;
    static pressedKey: boolean = false;
    static nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;

    static triggerInteraction(): void {
        InteractionController.pressedKey = true;
    }

    /**
     * Set when a player enters a ColShape Interaction from Server Side
     * @static
     * @param {(string | null)} type
     * @param {alt.Vector3} position
     * @memberof InteractionController
     */
    static setInteractionInfo(type: string | null, position: alt.Vector3, text: string) {
        if (type === null) {
            alt.Player.local.closestInteraction = null;
            return;
        }

        alt.Player.local.closestInteraction = { type, position, text };
    }

    static handleInteractionMode() {
        if (alt.Player.local.isMenuOpen) {
            InteractionController.pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        if (alt.Player.local.isChatOpen) {
            InteractionController.pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        if (alt.Player.local.meta.isDead) {
            InteractionController.pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        VehicleController.runVehicleControllerTick();

        if (Date.now() > NEXT_HELP_CLEAR) {
            NEXT_HELP_CLEAR = Date.now() + 5000;
            delete alt.Player.local.otherInteraction;
            HelpController.updateHelpText(null, null, null, null);
        }

        // Populates the Menu
        if (Date.now() > NEXT_MENU_UPDATE) {
            NEXT_MENU_UPDATE = Date.now() + 1000;
            dynamicActionMenu = {};

            // Populate Vehicle Options
            const vehicleMenus = VehicleController.getVehicleOptions();
            if (Object.keys(vehicleMenus).length >= 1) {
                dynamicActionMenu = { ...dynamicActionMenu, ...vehicleMenus };
            }
        }

        // Populates Interaction Menu
        if (alt.Player.local.closestInteraction) {
            const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);
            if (dist < MAX_CHECKPOINT_DRAW) {
                dynamicActionMenu[alt.Player.local.closestInteraction.text] = {
                    eventName: SYSTEM_EVENTS.INTERACTION,
                    isServer: true,
                    data: alt.Player.local.closestInteraction.type
                };
            }
        }

        // Timeout for Key Presses
        if (InteractionController.nextKeyPress > Date.now()) {
            InteractionController.pressedKey = false;
            return;
        }

        // Check that the Dynamic Menu has Items
        if (Object.keys(dynamicActionMenu).length <= 0) {
            return;
        }

        if (alt.Player.local.closestInteraction && alt.Player.local.closestInteraction.position) {
            // Show this when interactions available is populated.
            HelpController.updateHelpText(
                alt.Player.local.closestInteraction.position,
                KEY_BINDS.INTERACT,
                alt.Player.local.closestInteraction.text,
                null
            );
        } else if (alt.Player.local.otherInteraction) {
            HelpController.updateHelpText(
                alt.Player.local.otherInteraction.position,
                null,
                alt.Player.local.otherInteraction.short,
                alt.Player.local.otherInteraction.long
            );
        }

        // Open the Dynamic Menu
        if (InteractionController.pressedKey) {
            InteractionController.pressedKey = false;
            InteractionController.nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
            ActionsController.set(dynamicActionMenu);
        }

        return;
    }

    static addInteractions(customInteractions: Array<Interaction>): void {
        InteractionController.customInteractions = customInteractions;

        for (let i = 0; i < customInteractions.length; i++) {
            const interaction = customInteractions[i];
            if (interaction.blip) {
                let blip = new alt.PointBlip(interaction.blip.pos.x, interaction.blip.pos.y, interaction.blip.pos.z);
                blip.scale = interaction.blip.scale;

                // Beta Feature? Not implemented yet.
                if (blip.hasOwnProperty('size')) {
                    blip.size = { x: interaction.blip.scale, y: interaction.blip.scale } as alt.Vector2;
                }

                blip.sprite = interaction.blip.sprite;
                blip.color = interaction.blip.color;
                blip.shortRange = interaction.blip.shortRange;
                blip.name = interaction.blip.text;
            }
        }
    }
}

alt.onServer(SYSTEM_EVENTS.POPULATE_INTERACTIONS, InteractionController.addInteractions);
alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.setInteractionInfo);
alt.onServer(SYSTEM_EVENTS.TICKS_START, () => {
    InteractionController.tick = alt.setInterval(InteractionController.handleInteractionMode, 0);
});
