import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Chat, View_Events_Input_Menu } from '../../../shared/enums/views';
import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';
import IAttachable from '../../../shared/interfaces/iAttachable';
import IClientInteraction from '../../../shared/interfaces/iClientInteraction';
import ICredit from '../../../shared/interfaces/iCredit';
import IErrorScreen from '../../../shared/interfaces/iErrorScreen';
import { InputMenu } from '../../../shared/interfaces/inputMenus';
import IShard from '../../../shared/interfaces/iShard';
import ISpinner from '../../../shared/interfaces/iSpinner';
import { Particle } from '../../../shared/interfaces/particle';
import { ProgressBar } from '../../../shared/interfaces/progressBar';
import { Task, TaskCallback } from '../../../shared/interfaces/taskTimeline';
import { Vector3 } from '../../../shared/interfaces/vector';
import { IWheelOption } from '../../../shared/interfaces/wheelMenu';
import { sha256Random } from '../../utility/encryption';
import utility from './utility';

const Emit = {
    /**
     * Play an animation on this player.
     * @param {string} dictionary
     * @param {string} name
     * @param {ANIMATION_FLAGS} flags
     * @param {number} [duration=-1]
     * @return {*}  {void}
     * @memberof EmitPrototype
     */
    animation(
        player: alt.Player,
        dictionary: string,
        name: string,
        flags: ANIMATION_FLAGS,
        duration: number = -1,
    ): void {
        if (player.data.isDead) {
            alt.logWarning(`[Athena] Cannot play ${dictionary}@${name} while player is dead.`);
            return;
        }

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ANIMATION, dictionary, name, flags, duration);
    },

    /**
     * Used to clear an animation or a task.
     * Does not trigger if the player is in a vehicle.
     *
     * @param {alt.Player} player
     */
    clearAnimation(player: alt.Player) {
        if (!player || !player.valid || player.vehicle) {
            return;
        }

        const tasks = [
            {
                nativeName: 'clearPedTasks',
                params: [],
                timeToWaitInMs: 100,
            },
        ];

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks);
    },

    /**
     * Play an animation on this player.
     * @param {string} name
     * @param {number} duration
     * @return {*}  {void}
     * @memberof EmitPrototype
     */
    scenario(player: alt.Player, name: string, duration: number): void {
        if (player.data.isDead) {
            return;
        }

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SCENARIO, name, duration);
    },

    /**
     * Synchronize a local variable to access locally for this player.
     * @param {string} key
     * @param {*} value
     * @memberof EmitPrototype
     */
    meta(player: alt.Player, key: string, value: any): void {
        alt.nextTick(() => {
            alt.emitClient(player, SYSTEM_EVENTS.META_SET, key, value);
        });
    },

    /**
     * Send a message to this player's chat box.
     * @param {string} message
     * @memberof EmitPrototype
     */
    message(player: alt.Player, message: string): void {
        alt.emitClient(player, View_Events_Chat.Append, message);
    },

    /**
     * Send a notification to this player.
     * @param {string} message
     * @memberof EmitPrototype
     */
    notification(player: alt.Player, message: string): void {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, message);
    },

    /**
     * Play a particle effect at a specific coordinate.
     * @param {Particle} particle
     * @param {boolean} [emitToNearbyPlayers=false]
     */
    particle(player: alt.Player, particle: Particle, emitToNearbyPlayers = false): void {
        if (!emitToNearbyPlayers) {
            alt.emitClient(player, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
            return;
        }

        const nearbyPlayers = utility.getClosestPlayers(player, 10);
        for (let i = 0; i < nearbyPlayers.length; i++) {
            const player = nearbyPlayers[i];
            alt.emitClient(player, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
        }
    },

    /**
     * Create a progress bar that eventually ends itself.
     * @param {alt.Player} player
     * @param {ProgressBar} progressbar
     * @returns {string} A unique identifier to remove the progress bar.
     */
    createProgressBar(player: alt.Player, progressbar: ProgressBar): string {
        if (!progressbar.uid) {
            progressbar.uid = sha256Random(JSON.stringify(progressbar));
        }

        alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_CREATE, progressbar);
        return progressbar.uid;
    },

    /**
     * Remove a progress bar based on its unique identifier.
     * @param {alt.Player} player
     * @param {string} uid
     */
    removeProgressBar(player: alt.Player, uid: string) {
        alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_REMOVE, uid);
    },

    /**
     * Play a sound without any positional data.
     * @param {alt.Player} p
     * @param {string} audioName
     * @param {number} [volume=0.35]
     */
    sound2D(p: alt.Player, audioName: string, volume: number = 0.35) {
        alt.emitClient(p, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, audioName, volume);
    },

    /**
     * Play a sound from at a target's location for this player.
     * @param {string} audioName
     * @param {alt.Entity} target
     * @memberof EmitPrototype
     */
    sound3D(p: alt.Player, audioName: string, target: alt.Entity): void {
        alt.emitClient(p, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, target, audioName);
    },

    /**
     * Play a frontend sound for this player.
     * @param {string} audioName
     * @param {string} ref
     * @memberof EmitPrototype
     */
    soundFrontend(p: alt.Player, audioName: string, ref: string): void {
        alt.emitClient(p, SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, audioName, ref);
    },

    /**
     * Force the player to perform an uncancellable task timeline.
     * @param {Array<Task | TaskCallback>} tasks
     */
    taskTimeline(player: alt.Player, tasks: Array<Task | TaskCallback>) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks);
    },

    inputMenu(player: alt.Player, inputMenu: InputMenu) {
        alt.emitClient(player, View_Events_Input_Menu.SetMenu, inputMenu);
    },

    /**
     * Create a spinner in the bottom-right corner.
     * @param {alt.Player} player
     * @param {ISpinner} spinner
     */
    createSpinner(player: alt.Player, spinner: ISpinner) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SPINNER, spinner);
    },

    /**
     * Clear a spinner in the bottom-right corner.
     * No UID necessary since it can only have one spinner at a time.
     * @param {alt.Player} player
     */
    clearSpinner(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SPINNER_CLEAR);
    },

    /**
     * Create a full-screen message. Cannot be cleared by the player.
     * @param {alt.Player} player
     * @param {IErrorScreen} screen
     */
    createErrorScreen(player: alt.Player, screen: IErrorScreen) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN, screen);
    },

    /**
     * Clear a full-screen message.
     * @param {alt.Player} player
     */
    clearErrorScreen(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN_CLEAR);
    },

    /**
     * Create a full-screen shard. Similar to 'mission-passed' or 'wasted'.
     * @param {alt.Player} player
     * @param {IErrorScreen} screen
     */
    createShard(player: alt.Player, shard: IShard) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SHARD, shard);
    },

    /**
     * Clear a shard.
     * @param {alt.Player} player
     */
    clearShard(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SHARD_CLEAR);
    },

    /**
     * Create a 'credits' text aligned to a certain side of the screen.
     * Automatically clear(s) over-time.
     * @param {alt.Player} player
     * @param {IErrorScreen} screen
     */
    createCredits(player: alt.Player, credits: ICredit) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_CREDITS, credits);
    },

    /**
     * Clears a 'credits' display.
     * @param {alt.Player} player
     */
    clearCredits(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_CREDITS_CLEAR);
    },

    /**
     * Attach an object to a player.
     * Automatically synchronized and handled client-side.
     * Last parameter is when to remove the object. Automatically set to infinite.
     * @param {alt.Player} player
     * @param {IAttachable} attachable
     * @param {number} removeAfterMilliseconds
     * @return {string} UID for attachable object
     */
    objectAttach(player: alt.Player, attachable: IAttachable, removeAfterMilliseconds = -1): string | null {
        if (!player || !player.valid) {
            return null;
        }

        let uid: string;

        if (!attachable.uid) {
            attachable.uid = sha256Random(JSON.stringify(attachable));
        }

        if (!player.attachables || !Array.isArray(player.attachables)) {
            player.attachables = [];
        }

        const index = player.attachables.findIndex((x) => x.uid === attachable.uid);
        if (index >= 0) {
            player.attachables[index] = attachable;
        } else {
            player.attachables.push(attachable);
        }

        player.setStreamSyncedMeta(PLAYER_SYNCED_META.ATTACHABLES, player.attachables);

        if (removeAfterMilliseconds >= 0) {
            const uid = attachable.uid;

            alt.setTimeout(() => {
                if (!player || !player.valid) {
                    return;
                }

                Emit.objectRemove(player, uid);
            }, removeAfterMilliseconds);
        }

        return attachable.uid;
    },

    /**
     * Remove an object from the player.
     * @param {alt.Player} player
     * @param {string} uid
     * @return {*}
     */
    objectRemove(player: alt.Player, uid: string) {
        if (!player || !player.valid) {
            return;
        }

        if (!player.attachables || !Array.isArray(player.attachables)) {
            return;
        }

        for (let i = player.attachables.length - 1; i >= 0; i--) {
            if (player.attachables[i].uid !== uid) {
                continue;
            }

            player.attachables.splice(i, 1);
            player.setStreamSyncedMeta(PLAYER_SYNCED_META.ATTACHABLES, player.attachables);
            return;
        }
    },

    /**
     * Add Interaction Text
     * @param {alt.Player} player
     * @param {IClientInteraction} interaction
     */
    interactionAdd(player: alt.Player, interaction: IClientInteraction) {
        alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_TEXT_CREATE, interaction);
    },

    /**
     * Remove Interaction Text
     * @param {alt.Player} player
     * @param {string} uid
     */
    interactionRemove(player: alt.Player, uid: string) {
        alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_TEXT_REMOVE, uid);
    },

    /**
     * Makes the user press 'E' to trigger this callback event.
     * @param {alt.Player} player
     * @param {string} eventName
     */
    interactionTemporary(player: alt.Player, eventName: string) {
        alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_TEMPORARY, eventName);
    },

    /**
     * Allows a temporary object to be created and moved.
     * The object is only seen by this one player.
     *
     * @param {alt.Player} player
     * @param {string} model
     * @param {Vector3} start
     * @param {Vector3} end
     * @param {number} speed
     */
    tempObjectLerp(player: alt.Player, model: string, start: Vector3, end: Vector3, speed: number) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TEMP_OBJECT_LERP, model, start, end, speed);
    },

    /**
     * Create a wheel menu and emit  it to the player.
     * Can emit events to client or server-side.
     *
     * @param {alt.Player} player
     * @param {string} label
     * @param {Array<IWheelItem>} wheelItems
     */
    wheelMenu(player: alt.Player, label: string, wheelItems: Array<IWheelOption>) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_WHEEL_MENU, label, wheelItems, true);
    },
};

/**
 * It takes a function name and a callback, and if the function name exists in the exports object, it
 * overrides it with the callback
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is emitted.
 */
function override<Key extends keyof typeof Emit>(functionName: Key, callback: typeof Emit[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`Athena.player.emit does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

const exports: typeof Emit & { override?: typeof override } = {
    ...Emit,
    override,
};

export default exports;
