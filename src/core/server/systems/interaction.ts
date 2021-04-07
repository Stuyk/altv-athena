import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Clothing } from '../../shared/enums/views';
import gridData from '../../shared/information/gridData';
import { Blip } from '../../shared/interfaces/Blip';
import { Interaction } from '../../shared/interfaces/Interaction';
import { InteractionLocale } from '../../shared/locale/interaction';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { distance2d } from '../utility/vector';
import '../views/atm';

interface InteractionHelper {
    [key: string]: Array<alt.Colshape>;
}

interface InteractionDefault {
    eventName: string;
    isServer: boolean;
    maxRadius?: number;
}

let customInteractions: Array<Interaction> = [];

export class InteractionController {
    static Interactions: InteractionHelper = {};
    static InteractionTypes: { [key: string]: InteractionDefault } = {
        atm: { eventName: SYSTEM_EVENTS.INTERACTION_ATM, isServer: false },
        gas: { eventName: SYSTEM_EVENTS.INTERACTION_FUEL, isServer: true, maxRadius: 1 },
        clothing: { eventName: View_Events_Clothing.Open, isServer: false }
    };

    /**
     * Generates interaction points based on prop data.
     * @static
     * @memberof InteractionController
     */
    static generateInteractions() {
        let count = 0;

        gridData.forEach((grid) => {
            Object.keys(grid.objects).forEach((key) => {
                const category = key;
                const interaction = InteractionController.InteractionTypes[category];

                let defaultRadius = 2.5;
                if (interaction && interaction.maxRadius) {
                    defaultRadius = interaction.maxRadius;
                }

                const infoData: Array<{ position: alt.Vector3 }> = grid.objects[key];
                infoData.forEach((info) => {
                    const newPos = new alt.Vector3(info.position.x, info.position.y, info.position.z - 1);
                    const shape = new alt.ColshapeCylinder(newPos.x, newPos.y, newPos.z, defaultRadius, 2.5);
                    shape.playersOnly = true;
                    shape['isInteraction'] = true;
                    shape['interactionType'] = category;

                    if (!InteractionController.Interactions[category]) {
                        InteractionController.Interactions[category] = [];
                    }

                    count += 1;
                    InteractionController.Interactions[category].push(shape);
                });
            });
        });

        alt.log(`[Athena] Generated ${count} Interaction Points`);
    }

    /**
     * Used to add an interaction
     * @static
     * @param {string} identifierAndEventName Must be unique. This is your event name.
     * @param {alt.Vector3} position
     * @param {number} range
     * @param {string} activationText What this interaction tells you it will do
     * @param {Blip} blip The blip that goes along with this interaction
     * @param {boolean} isServerEvent Is this a server event or a client event?
     * @memberof InteractionController
     */
    static addInteraction(
        identifierAndEventName: string,
        position: alt.IVector3,
        range: number,
        activationText: string,
        blip: Blip,
        isServerEvent: boolean
    ) {
        const newPos = new alt.Vector3(position.x, position.y, position.z - 1);
        const shape = new alt.ColshapeCylinder(newPos.x, newPos.y, newPos.z, range, 2.5);
        shape.playersOnly = true;
        shape['isInteraction'] = true;
        shape['interactionType'] = identifierAndEventName;

        if (!InteractionController.Interactions[identifierAndEventName]) {
            InteractionController.Interactions[identifierAndEventName] = [];
        }

        customInteractions.push({ identifier: identifierAndEventName, blip, text: activationText });
        InteractionController.Interactions[identifierAndEventName].push(shape);
        InteractionController.InteractionTypes[identifierAndEventName] = {
            eventName: identifierAndEventName,
            isServer: isServerEvent
        };
    }

    /**
     * Triggers when a player enters an interaction point.
     * @static
     * @param {alt.Colshape} colshape
     * @param {alt.Entity} player
     * @return {*}
     * @memberof InteractionController
     */
    static handleEnterInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) {
            return;
        }

        if (!(player instanceof alt.Player)) {
            return;
        }

        alt.emitClient(
            player,
            SYSTEM_EVENTS.PLAYER_SET_INTERACTION,
            colshape['interactionType'],
            new alt.Vector3(colshape.pos.x, colshape.pos.y, colshape.pos.z)
        );
    }

    /**
     * Triggers when a player leaves an interaction point.
     * @static
     * @param {alt.Colshape} colshape
     * @param {alt.Entity} player
     * @memberof InteractionController
     */
    static handleLeaveInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) {
            return;
        }

        if (!(player instanceof alt.Player)) {
            return;
        }

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, null);
    }

    /**
     * Triggers when a player presses their interaction key from the client-side.
     * @static
     * @param {alt.Player} player
     * @param {string} type
     * @return {*}
     * @memberof InteractionController
     */
    static handleInteraction(player: alt.Player, type: string) {
        type = type.toLowerCase();

        if (!InteractionController.Interactions[type]) {
            return;
        }

        const closestInteraction = InteractionController.Interactions[type].find((interaction) => {
            if (distance2d(interaction.pos, player.pos) <= DEFAULT_CONFIG.MAX_INTERACTION_DISTANCE) {
                return true;
            }

            return false;
        });

        if (!closestInteraction) {
            playerFuncs.emit.message(player, InteractionLocale.TOO_FAR_AWAY);
            return;
        }

        const interaction = InteractionController.InteractionTypes[type];
        if (!interaction) {
            playerFuncs.emit.message(player, InteractionLocale.DOES_NOT_EXIST);
            return;
        }

        // Goes Server Side
        if (interaction.isServer) {
            alt.emit(interaction.eventName, player, closestInteraction.pos);
            return;
        }

        // Goes Client Side
        alt.emitClient(player, interaction.eventName, closestInteraction.pos);
    }

    /**
     * Sends custom interactions to client after connecting.
     * @static
     * @param {alt.Player} player
     * @memberof InteractionController
     */
    static populateCustomInteractions(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_INTERACTIONS, customInteractions);
    }
}

alt.on('entityLeaveColshape', InteractionController.handleLeaveInteraction);
alt.on('entityEnterColshape', InteractionController.handleEnterInteraction);
alt.onClient(SYSTEM_EVENTS.INTERACTION, InteractionController.handleInteraction);

InteractionController.generateInteractions();
