import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { InteractionShape } from '../extensions/Colshape';
import { playerFuncs } from '../extensions/Player';
import { Interaction } from '../interface/Interaction';
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

        if (!interaction.range) {
            interaction.range = 2.5;
        }

        const shape = new InteractionShape(interaction.position, interaction.range, 3);
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
    static enter(colshape: InteractionShape, entity: alt.Entity) {
        if (!colshape.isInteraction) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        // When entering set the help text.
        // Don't pass the interaction. Just the description from it.
        entity.currentInteraction = colshape;
        const interaction = entity.currentInteraction.getInteraction();
        alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, interaction.position, interaction.description);
    }

    /**
     * Called when a player leaves an InteractionShape.
     * @static
     * @param {InteractionShape} colshape
     * @param {alt.Player} player
     * @return {*}
     * @memberof InteractionController
     */
    static leave(colshape: InteractionShape, entity: alt.Entity) {
        if (!colshape.isInteraction) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        // When leaving remove the help text.
        // Don't pass the interaction.
        entity.currentInteraction = null;
        alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, null, null);
    }

    /**
     * Triggers when a player presses their interaction key from the client-side.
     * @static
     * @param {alt.Player} player
     * @param {string} type
     * @return {*}
     * @memberof InteractionController
     */
    static trigger(player: alt.Player) {
        if (!player.currentInteraction) {
            return;
        }

        const dist = distance2d(player.pos, player.currentInteraction.pos);
        if (dist >= DEFAULT_CONFIG.MAX_INTERACTION_DISTANCE) {
            playerFuncs.emit.notification(player, `~r~Too far away to interact.`);
            return;
        }

        const interaction = player.currentInteraction.getInteraction();
        if (!interaction || !interaction.callback) {
            return;
        }

        if (interaction.data) {
            interaction.callback(player, ...interaction.data);
            return;
        }

        interaction.callback(player);
    }
}

alt.on('entityLeaveColshape', InteractionController.leave);
alt.on('entityEnterColshape', InteractionController.enter);
alt.onClient(SYSTEM_EVENTS.INTERACTION, InteractionController.trigger);
