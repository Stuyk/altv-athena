import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Interaction } from '../../shared/interfaces/Interaction';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { DEFAULT_CONFIG } from '../athena/main';
import { InteractionShape } from '../extensions/Colshape';
import { playerFuncs } from '../extensions/Player';
import { sha256Random } from '../utility/encryption';

import '../views/atm';

const interactions: { [key: string]: Array<InteractionShape> } = {};
const safeInteractions: Array<Interaction> = [];

export class InteractionController {
    /**
     * Register an interaction.
     * @static
     * @param {Interaction} interaction
     * @memberof InteractionController
     * @returns {string} uid
     */
    static add(interaction: Interaction): InteractionShape {
        const uid = sha256Random(JSON.stringify(interaction));
        interaction.identifier = uid;

        if (!interactions[interaction.type]) {
            interactions[interaction.type] = [];
        }

        const shape = new InteractionShape(interaction.position, 2.5, 3);
        shape.setInteraction(interaction);
        interactions[interaction.type].push(shape);

        safeInteractions.push(shape.getInteraction());
        return shape;
    }

    /**
     * Remove an interaction by type and uid.
     * @static
     * @param {string} type
     * @param {string} uid
     * @memberof InteractionController
     */
    static remove(type: string, uid: string): boolean {
        if (!interactions[type]) {
            return false;
        }

        let index = interactions[type].findIndex((i) => i.getIdentifier() === uid);
        if (index <= -1) {
            return false;
        }

        try {
            interactions[type][index].destroy();
        } catch (err) {
            throw new Error(`Failed to destroy an Interaction Colshape`);
        }

        interactions[type].splice(index, 1);
        return true;
    }

    /**
     * Called when a player enters the InteractionShape
     * @static
     * @param {InteractionShape} colshape
     * @param {alt.Entity} player
     * @return {*}
     * @memberof InteractionController
     */
    static enter(colshape: InteractionShape, player: alt.Player) {
        if (!colshape.isInteraction) {
            return;
        }

        if (!(player instanceof alt.Player)) {
            return;
        }

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, colshape.getInteraction());
    }

    /**
     * Called when a player leaves an InteractionShape.
     * @static
     * @param {InteractionShape} colshape
     * @param {alt.Player} player
     * @return {*}
     * @memberof InteractionController
     */
    static leave(colshape: InteractionShape, player: alt.Player) {
        if (!colshape.isInteraction) {
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
    static trigger(player: alt.Player, type: string) {
        if (!interactions[type]) {
            return;
        }

        const closestShape = interactions[type].find((interaction) => {
            return interaction.getDistance(player) <= DEFAULT_CONFIG.MAX_INTERACTION_DISTANCE;
        });

        if (!closestShape) {
            playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.INTERACTION_TOO_FAR_AWAY));
            return;
        }

        const interaction = closestShape.getInteraction();
        if (!interaction || !interaction.event) {
            return;
        }

        // Goes Server Side
        if (interaction.event.isServer) {
            alt.emit(interaction.event.eventName, player, closestShape.pos);
            return;
        }

        // Goes Client Side
        alt.emitClient(player, interaction.event.eventName, closestShape.pos);
    }
}

alt.on('entityLeaveColshape', InteractionController.leave);
alt.on('entityEnterColshape', InteractionController.enter);
alt.onClient(SYSTEM_EVENTS.INTERACTION, InteractionController.trigger);
