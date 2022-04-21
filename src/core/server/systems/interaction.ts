import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { sha256Random } from '../utility/encryption';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { Interaction } from '../../shared/interfaces/interaction';
import { InteractionShape } from '../extensions/extColshape';
import { Athena } from '../api/athena';

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
     */
    static remove(uid: string): void {
        for (var i = interactions.length - 1; i >= 0; i--) {
            if (interactions[i].interaction && interactions[i].interaction.uid !== uid) {
                continue;
            }

            // ! --- Debug Function
            if (interactions[i].interaction.debug) {
                console.log(`--- ColShape Interaction ---`);
                console.log(`Remove ColShape`);
                console.log(`Removing ${interactions[i].interaction.uid}`);
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
        if (!colshape || !colshape.interaction || !entity || !entity.valid) {
            return;
        }

        if (!colshape.interaction || !colshape.interaction.uid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        let valid = false;
        if (colshape.interaction.isPlayerOnly && !entity.vehicle) {
            valid = true;
        }

        if (colshape.interaction.isVehicleOnly && entity.vehicle) {
            valid = true;
        }

        if (!colshape.interaction.isPlayerOnly && !colshape.interaction.isVehicleOnly) {
            valid = true;
        }

        if (!valid) {
            return;
        }

        // ! --- Debug Function
        if (colshape.interaction.debug) {
            console.log(`${entity.data.name} ENTER ColShape: ${colshape.interaction.uid}`);
            console.log(`--- ColShape Interaction ---`);
            console.log(colshape.interaction);
            Athena.player.emit.soundFrontend(entity, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }

        entity.currentInteraction = colshape;
        const cleanInteraction = deepCloneObject<Omit<Interaction, 'callback'>>(colshape.interaction);
        alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, cleanInteraction);
    }

    /**
     * When an entity leaves the collision shape, the collision shape will call this function.
     * @param {InteractionShape} colshape - The colshape that was entered.
     * @param {alt.Entity} entity - The entity that entered the colshape.
     * @returns None
     */
    static leave(colshape: InteractionShape, entity: alt.Entity) {
        if (!colshape || !colshape.interaction || !entity || !entity.valid) {
            return;
        }

        if (!colshape.interaction || !colshape.interaction.uid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        const shape: InteractionShape = entity.currentInteraction;
        if (!shape || !shape.interaction) {
            return;
        }

        // Prevents the leave event until a shape is actually left
        if (colshape.interaction.uid !== shape.interaction.uid) {
            return;
        }

        // ! --- Debug Function
        if (colshape.interaction.debug) {
            console.log(`${entity.data.name} LEFT ColShape: ${colshape.interaction.uid}`);
            console.log(`--- ColShape Interaction ---`);
            console.log(colshape.interaction);
            Athena.player.emit.soundFrontend(entity, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }

        entity.currentInteraction = null;
        alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, null);
    }

    /**
     * `trigger` is called when a player interacts with an Interaction Point.
     * @param {alt.Player} player - The player who triggered the interaction.
     */
    static trigger(player: alt.Player): void {
        if (!player.currentInteraction) {
            return;
        }

        const shape: InteractionShape = player.currentInteraction;
        if (!shape.interaction) {
            return;
        }

        const dist = distance2d(player.pos, shape.interaction.position);

        // ! --- Debug Function
        if (shape.interaction.debug) {
            console.log(`--- ColShape Interaction ---`);
            console.log(`UID: ${shape.interaction.uid}`);
            console.log(`Triggered by ${player.data.name}`);
            console.log(`Range: ${shape.interaction.range}`);
            console.log(`Distance From Player: ${dist}`);
        }

        if (dist >= DEFAULT_CONFIG.MAX_INTERACTION_DISTANCE) {
            Athena.player.emit.notification(player, `~r~Too far away to interact.`);
            return;
        }

        const interaction = shape.interaction;
        if (!interaction || !interaction.callback) {
            return;
        }

        if (interaction.data) {
            // ! --- Debug Function
            if (shape.interaction.debug) {
                console.log(`Triggered Callback for Interaction`);
                console.log(`Arguments:`);
                console.log(JSON.stringify(interaction.data, null, '\t'));
            }

            interaction.callback(player, ...interaction.data);
            return;
        }

        // ! --- Debug Function
        if (shape.interaction.debug) {
            console.log(`Triggered Callback for Interaction`);
            console.log(`No Arguments`);
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

        if (interaction.range < 1) {
            interaction.range = 1;
        }

        // ! --- Debug Function
        if (interaction.debug) {
            console.log(`--- ColShape Interaction ---`);
            console.log(`Interaction Created`);
            console.log(`UID: ${interaction.uid}`);
            console.log(interaction);
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
