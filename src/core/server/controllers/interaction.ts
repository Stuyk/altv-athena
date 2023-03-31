import * as alt from 'alt-server';
import * as Athena from '../api';
import { DEFAULT_CONFIG } from '../athena/main';
import { InteractionShape } from '../extensions/extColshape';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { distance2d } from '@AthenaShared/utility/vector';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { Interaction } from '@AthenaShared/interfaces/interaction';
import { LocaleController } from '@AthenaShared/locale/locale';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { WORLD_NOTIFICATION_TYPE } from '@AthenaShared/enums/worldNotificationTypes';

const interactions: Array<InteractionShape> = [];
const InteractionBindings: { [player_id: string]: InteractionShape } = {};

/**
 * @internal
 * @type {*} */
const InternalFunctions = {
    /**
     * Add a InteractionShape to the interactions array.
     * @param {InteractionShape} shape - The shape that the user is interacting with.
     * @returns None
     */
    add(shape: InteractionShape) {
        interactions.push(shape);
    },

    /**
     * Remove all interactions with the given uid.
     * @param {string} uid A unique string - The unique identifier for the interaction.
     */
    remove(uid: string): void {
        for (let i = interactions.length - 1; i >= 0; i--) {
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
    },

    /**
     * When an entity enters the collision shape, the function is called.
     *
     * @param {InteractionShape} colshape - The colshape that was entered.
     * @param {alt.Entity} entity - The entity that entered the colshape.
     * @returns None
     */
    enter(colshape: InteractionShape, entity: alt.Entity) {
        if (InternalOverrides.enter) {
            return InternalOverrides.enter(colshape, entity);
        }

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

        if (colshape.interaction.triggerCallbackOnEnter) {
            InteractionBindings[entity.id] = colshape;

            if (colshape.interaction.data) {
                colshape.interaction.callback(entity, ...colshape.interaction.data);
                return;
            } else {
                colshape.interaction.callback(entity, null);
                return;
            }
        }

        // ! --- Debug Function
        if (colshape.interaction.debug) {
            const data = Athena.document.character.get(entity);
            console.log(`${data.name} ENTER ColShape: ${colshape.interaction.uid}`);
            console.log(`--- ColShape Interaction ---`);
            console.log(colshape.interaction);
            Athena.player.emit.soundFrontend(entity, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }

        if (colshape.interaction && colshape.interaction.description) {
            Athena.controllers.worldNotification.addToPlayer(entity, {
                uid: colshape.interaction.description,
                pos: { x: colshape.pos.x, y: colshape.pos.y, z: colshape.pos.z + 1.5 },
                text: colshape.interaction.description,
                type: WORLD_NOTIFICATION_TYPE.ARROW_BOTTOM,
            });
        }

        InteractionBindings[entity.id] = colshape;
        const cleanInteraction = deepCloneObject<Omit<Interaction, 'callback'>>(colshape.interaction);
        alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, cleanInteraction);
    },

    /**
     * When an entity leaves the collision shape, the collision shape will call this function.
     * @param {InteractionShape} colshape - The colshape that was entered.
     * @param {alt.Entity} entity - The entity that entered the colshape.
     * @returns None
     */
    leave(colshape: InteractionShape, entity: alt.Entity) {
        if (InternalOverrides.leave) {
            return InternalOverrides.leave(colshape, entity);
        }

        if (!colshape || !colshape.interaction || !entity || !entity.valid) {
            return;
        }

        if (!colshape.interaction || !colshape.interaction.uid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        if (!entity || !entity.valid) {
            return;
        }

        const shape: InteractionShape = InteractionBindings[entity.id];
        if (!shape || !shape.interaction) {
            return;
        }

        // Prevents the leave event until a shape is actually left
        if (colshape.interaction.uid !== shape.interaction.uid) {
            return;
        }

        // ! --- Debug Function
        if (colshape.interaction.debug) {
            const data = Athena.document.character.get(entity);
            console.log(`${data.name} LEFT ColShape: ${colshape.interaction.uid}`);
            console.log(`--- ColShape Interaction ---`);
            console.log(colshape.interaction);
            Athena.player.emit.soundFrontend(entity, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }

        if (colshape.interaction && colshape.interaction.description) {
            Athena.controllers.worldNotification.removeFromPlayer(entity, colshape.interaction.description);
        }

        if (typeof colshape.interaction.onLeaveCallback === 'function') {
            if (colshape.interaction.data) {
                colshape.interaction.onLeaveCallback(entity, ...colshape.interaction.data);
                return;
            } else {
                colshape.interaction.onLeaveCallback(entity, null);
                return;
            }
        }

        delete InteractionBindings[entity.id];
        alt.emitClient(entity, SYSTEM_EVENTS.PLAYER_SET_INTERACTION, null);
    },

    /**
     * `trigger` is called when a player interacts with an Interaction Point.
     * @param {alt.Player} player An alt:V Player Entity
     */
    trigger(player: alt.Player): void {
        if (InternalOverrides.trigger) {
            return InternalOverrides.trigger(player);
        }

        if (!InteractionBindings[player.id]) {
            return;
        }

        const shape: InteractionShape = InteractionBindings[player.id];
        if (!shape.interaction) {
            return;
        }

        const dist = distance2d(player.pos, shape.interaction.position);

        // ! --- Debug Function
        if (shape.interaction.debug) {
            const data = Athena.document.character.get(player);
            console.log(`--- ColShape Interaction ---`);
            console.log(`UID: ${shape.interaction.uid}`);
            console.log(`Triggered by ${data.name}`);
            console.log(`Range: ${shape.interaction.range}`);
            console.log(`Distance From Player: ${dist}`);
        }

        if (dist >= DEFAULT_CONFIG.MAX_INTERACTION_DISTANCE) {
            Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERACTION_TOO_FAR_AWAY));
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
    },
};

/**
 * Add an interaction to the scene.
 *
 * An interaction is where a player can walk up to an invisible marker and press the interaction key to trigger a callback.
 *
 * Interactions are accessible by all players.
 *
 * Additional options may be added to the example interaction below.
 *
 * See type interface in VSCode for more information.
 *
 * > Always subtract 1 from the 'z' axis when getting positions in-game.
 *
 * Returns a uid or generates one if not specified.
 *
 * #### Example
 * ```ts
 * const uid = Athena.controllers.interaction.append({
 *    position: { x: 0, y: 0, z: 0 },
 *    isPlayerOnly: true,
 *    isVehicleOnly: false,
 *    callback(player: alt.Player) {
 *        alt.log(`${player.id} interacted with an interaction!`)
 *    }
 * });
 *
 * Athena.controllers.interaction.append({
 *    uid: 'the-uid-you-specified',
 *    position: { x: 0, y: 0, z: 0 },
 *    isPlayerOnly: true,
 *    isVehicleOnly: false,
 *    callback(player: alt.Player) {
 *        alt.log(`${player.id} interacted with an interaction!`)
 *    }
 * });
 * ```
 *
 * @param {Interaction} interaction - The interaction object to be added.
 * @returns A string representing the uid of the interaction.
 */
export function append(interaction: Interaction): string {
    if (Overrides.append) {
        return Overrides.append(interaction);
    }

    if (!interaction.uid) {
        interaction.uid = Athena.utility.hash.sha256Random(JSON.stringify(interaction));
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

    const shape = new InteractionShape(interaction as Required<Interaction>);
    shape.playersOnly = true;

    InternalFunctions.add(shape);

    return interaction.uid;
}

/**
 * Removes an interaction from existence.
 *
 * Removes the associated ColShape as well.
 *
 * #### Example
 * ```ts
 * Athena.controllers.interaction.remove(someUid);
 *
 * Athena.controllers.interaction.remove('the-uid-you-specified');
 * ```
 *
 * @param {string} uid A unique string - The unique identifier of the interaction to remove.
 * @returns None
 */
export function remove(uid: string): void {
    if (Overrides.remove) {
        return Overrides.remove(uid);
    }

    InternalFunctions.remove(uid);
}

/**
 * Returns interaction information.
 *
 * This includes the internal ColShapes as well.
 *
 * #### Example
 * ```ts
 * const interaction = Athena.controllers.interaction.get('the-uid-you-specified');
 * ```
 *
 * @param {string} uid A unique string - The unique identifier of the interaction.
 * @returns The InteractionShape object.
 */
export function get(uid: string): InteractionShape | undefined {
    if (Overrides.get) {
        return Overrides.get(uid);
    }

    const index = interactions.findIndex((shape) => shape.interaction && shape.interaction.uid === uid);
    if (index <= -1) {
        return undefined;
    }

    return interactions[index];
}

/**
 * Used to obtain current interactions that are bound to a player id.
 *
 *
 * @return {{ [player_id: string]: InteractionShape }}
 */
export function getBindings(): { [player_id: string]: InteractionShape } {
    if (Overrides.getBindings) {
        return Overrides.getBindings();
    }

    return InteractionBindings;
}

alt.on('playerDisconnect', (player: alt.Player) => {
    if (!player || !player.valid) {
        return;
    }

    delete InteractionBindings[player.id];
});
alt.on('entityLeaveColshape', InternalFunctions.leave);
alt.on('entityEnterColshape', InternalFunctions.enter);
alt.onClient(SYSTEM_EVENTS.INTERACTION, InternalFunctions.trigger);

interface InteractionControllerFuncs {
    append: typeof append;
    remove: typeof remove;
    get: typeof get;
    getBindings: typeof getBindings;
}

interface InteractionControllerInternalFuncs {
    enter: typeof InternalFunctions.enter;
    leave: typeof InternalFunctions.leave;
    trigger: typeof InternalFunctions.trigger;
}

const Overrides: Partial<InteractionControllerFuncs> = {};
const InternalOverrides: Partial<InteractionControllerInternalFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'get', callback: typeof get);
export function override(functionName: 'getBindings', callback: typeof getBindings);
/**
 * Used to override any interaction controller function.
 *
 *
 * @param {keyof InteractionControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof InteractionControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}

export function overrideInternal(functionName: 'trigger', callback: typeof InternalFunctions.trigger);
export function overrideInternal(functionName: 'leave', callback: typeof InternalFunctions.leave);
export function overrideInternal(functionName: 'enter', callback: typeof InternalFunctions.enter);
/**
 * Used to override any internal interaction controller function.
 * Handles things such as entering colshapes, leaving, and trigger them.
 *
 *
 * @param {keyof InteractionControllerInternalFuncs} functionName
 * @param {*} callback
 */
export function overrideInternal(functionName: keyof InteractionControllerInternalFuncs, callback: any): void {
    InternalOverrides[functionName] = callback;
}
