import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { InteractionShape } from '../extensions/Colshape';
import { playerFuncs } from '../extensions/Player';
import { Interaction } from '../interface/Interaction';
import { sha256Random } from '../utility/encryption';

const interactions: Array<InteractionShape> = [];

class InternalFunctions {
    /**
     * Add a InteractionShape to the interactions array.
     * @param {InteractionShape} shape - The shape that the user is interacting with.
     * @returns None
     */
    static add(shape: InteractionShape) {
        interactions.push(shape);
    }

    /**
     * Remove all interactions with the given uid.
     * @param {string} uid - The unique identifier for the interaction.
     * @returns None
     */
    static remove(uid: string): void {
        for (var i = interactions.length - 1; i >= 0; i--) {
            if (interactions[i].interaction && interactions[i].interaction.uid !== uid) {
                continue;
            }

            try {
                interactions[i].destroy();
            } catch (err) {
                // Ignore error
            }

            interactions.splice(i, 1);
        }
    }

    /**
     * When an entity enters the collision shape, the function is called.
     * @param {InteractionShape} colshape - The colshape that was entered.
     * @param {alt.Entity} entity - The entity that entered the colshape.
     * @returns None
     */
    static enter(colshape: InteractionShape, entity: alt.Entity) {
        if (!colshape.interaction || !colshape.interaction.uid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        if (colshape.interaction.isPlayerOnly && !entity.vehicle) {
            entity.currentInteraction = colshape;
            alt.emitClient(
                entity,
                SYSTEM_EVENTS.PLAYER_SET_INTERACTION,
                colshape.interaction.position,
                colshape.interaction.description,
            );
        }

        if (colshape.interaction.isVehicleOnly && entity.vehicle) {
            entity.currentInteraction = colshape;
            alt.emitClient(
                entity,
                SYSTEM_EVENTS.PLAYER_SET_INTERACTION,
                colshape.interaction.position,
                colshape.interaction.description,
            );
        }
    }

    /**
     * When an entity leaves the collision shape, the collision shape will call this function.
     * @param {InteractionShape} colshape - The colshape that was entered.
     * @param {alt.Entity} entity - The entity that entered the colshape.
     * @returns None
     */
    static leave(colshape: InteractionShape, entity: alt.Entity) {
        if (!colshape.interaction || !colshape.interaction.uid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        // Either in a vehicle, or on foot.
        if (!colshape.interaction.isPlayerOnly && !colshape.interaction.isVehicleOnly) {
            entity.currentInteraction = colshape;
            alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, null, null);
            return;
        }

        if (colshape.interaction.isPlayerOnly && !entity.vehicle) {
            entity.currentInteraction = colshape;
            alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, null, null);
        }

        if (colshape.interaction.isVehicleOnly && entity.vehicle) {
            entity.currentInteraction = colshape;
            alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, null, null);
        }
    }

    /**
     * `trigger` is called when a player interacts with an Interaction Point.
     * @param {alt.Player} player - The player who triggered the interaction.
     */
    static trigger(player: alt.Player): void {
        if (!player.currentInteraction) {
            return;
        }

        const dist = distance2d(player.pos, player.currentInteraction.pos);
        if (dist >= DEFAULT_CONFIG.MAX_INTERACTION_DISTANCE) {
            playerFuncs.emit.notification(player, `~r~Too far away to interact.`);
            return;
        }

        const interaction = player.currentInteraction.interaction;
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

export class InteractionController {
    /**
     * Add an interaction to the scene.
     * @param {Interaction} interaction - The interaction object to be added.
     * @returns A string representing the uid of the interaction.
     */
    static add(interaction: Interaction): string {
        if (!interaction.uid) {
            interaction.uid = sha256Random(JSON.stringify(interaction));
        }

        if (!interaction.range) {
            interaction.range = 2.5;
        }

        const shape = new InteractionShape(interaction);
        shape.playersOnly = true;

        InternalFunctions.add(shape);

        return interaction.uid;
    }

    /**
     * Remove a user from the list of users.
     * @param {string} uid - The unique identifier of the object to remove.
     * @returns None
     */
    static remove(uid: string): void {
        InternalFunctions.remove(uid);
    }

    /**
     * Cannot generate summary
     * @param {string} uid - The unique identifier of the interaction.
     * @returns The InteractionShape object.
     */
    static get(uid: string): InteractionShape | null {
        const index = interactions.findIndex((shape) => shape.interaction && shape.interaction.uid === uid);
        if (index <= -1) {
            return null;
        }

        return interactions[index];
    }
}

alt.on('entityLeaveColshape', InternalFunctions.leave);
alt.on('entityEnterColshape', InternalFunctions.enter);
alt.onClient(SYSTEM_EVENTS.INTERACTION, InternalFunctions.trigger);
