import * as Athena from '@AthenaServer/api/index.js';
import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { ANIMATION_FLAGS } from '@AthenaShared/flags/animationFlags.js';
import IAttachable from '@AthenaShared/interfaces/iAttachable.js';
import ICredit from '@AthenaShared/interfaces/iCredit.js';
import IErrorScreen from '@AthenaShared/interfaces/iErrorScreen.js';
import IShard from '@AthenaShared/interfaces/iShard.js';
import ISpinner from '@AthenaShared/interfaces/iSpinner.js';
import { Particle } from '@AthenaShared/interfaces/particle.js';
import { ProgressBar } from '@AthenaShared/interfaces/progressBar.js';
import { Task, TaskCallback } from '@AthenaShared/interfaces/taskTimeline.js';
import { IWheelOption } from '@AthenaShared/interfaces/wheelMenu.js';
import { sha256Random } from '../utility/hash.js';
import { AcceptDeclineEvent } from '@AthenaShared/interfaces/acceptDeclineEvent.js';
import { RecommendedTimecycleTypes } from '@AthenaShared/enums/timecycleTypes.js';
import { WEATHER_KEY } from '@AthenaShared/utility/weather.js';

/**
 * Play an alarm on this player.
 * List of all alarms: https://github.com/DurtyFree/gta-v-data-dumps/blob/master/alarmSounds.json
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} name
 * @return {void}
 *
 */
export function startAlarm(player: alt.Player, name: string): void {
    if (Overrides.startAlarm) {
        return Overrides.startAlarm(player, name);
    }

    const data = Athena.document.character.get(player);
    if (data.isDead) {
        alt.logWarning(`[Athena] Cannot play alarm ${name} while player is dead.`);
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ALARM_START, name);
}

/**
 * Stop an alarm for this player.
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} name
 */
export function stopAlarm(player: alt.Player, name: string) {
    if (Overrides.stopAlarm) {
        return Overrides.stopAlarm(player, name);
    }

    if (!player || !player.valid) {
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ALARM_STOP, name);
}

/**
 * Stop all alarms for this player.
 * @param {alt.Player} player An alt:V Player Entity
 */
export function stopAllAlarms(player: alt.Player) {
    if (Overrides.stopAllAlarms) {
        return Overrides.stopAllAlarms(player);
    }

    if (!player || !player.valid) {
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ALARM_STOP_ALL);
}

/**
 * Play an animation on this player.
 * @param {string} dictionary
 * @param {string} name
 * @param {ANIMATION_FLAGS} flags
 * @param {number} [duration=-1]
 * @return {void}
 *
 */
export function animation(
    player: alt.Player,
    dictionary: string,
    name: string,
    flags: ANIMATION_FLAGS,
    duration: number = -1,
): void {
    if (Overrides.animation) {
        return Overrides.animation(player, dictionary, name, flags, duration);
    }

    const data = Athena.document.character.get(player);
    if (data.isDead) {
        alt.logWarning(`[Athena] Cannot play ${dictionary}@${name} while player is dead.`);
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ANIMATION, dictionary, name, flags, duration);
}

/**
 * Used to clear an animation or a task.
 * Does not trigger if the player is in a vehicle.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function clearAnimation(player: alt.Player) {
    if (Overrides.clearAnimation) {
        return Overrides.clearAnimation(player);
    }

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
}

/**
 * Play an animation on this player.
 * @param {string} name
 * @param {number} duration
 * @return {void}
 *
 */
export function scenario(player: alt.Player, name: string, duration: number): void {
    if (Overrides.scenario) {
        return Overrides.scenario(player, name, duration);
    }

    const data = Athena.document.character.get(player);
    if (data.isDead) {
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SCENARIO, name, duration);
}

/**
 * Synchronize a local variable to access locally for this player.
 * @param {string} key
 * @param {*} value
 *
 */
export function meta(player: alt.Player, key: string, value: any): void {
    if (Overrides.meta) {
        return Overrides.meta(player, key, value);
    }

    player.setLocalMeta(key, value);
}

/**
 * Send a notification to this player.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.notification(somePlayer, '~y~Hello There~');
 * ```
 *
 * @param {alt.Player} player
 * @param {string} message
 *
 */
export function notification(player: alt.Player, message: string): void {
    if (Overrides.notification) {
        return Overrides.notification(player, message);
    }

    Athena.systems.notification.toPlayer(player, message);
}

/**
 * Play a particle effect at a specific coordinate.
 *
 * @param {alt.Player} player
 * @param {Particle} particle
 * @param {boolean} [emitToNearbyPlayers=false]
 */
export function particle(player: alt.Player, particle: Particle, emitToNearbyPlayers = false): void {
    if (Overrides.particle) {
        return Overrides.particle(player, particle, emitToNearbyPlayers);
    }

    if (!emitToNearbyPlayers) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
        return;
    }

    const closestPlayers = Athena.getters.players.inRangeWithDistance(player.pos, 10);
    for (let i = 0; i < closestPlayers.length; i++) {
        const player = closestPlayers[i].player;
        alt.emitClient(player, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
    }
}

/**
 * Create a subtitle on the bottom of the screen with optional duration.
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} text
 * @param {number} duration
 */
export function createMissionText(player: alt.Player, text: string, duration?: number) {
    if (Overrides.createMissionText) {
        return Overrides.createMissionText(player, text, duration);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_MISSION_TEXT, text, duration);
}

/**
 * Create a progress bar that eventually ends itself.
 *
 * #### Example
 * ```ts
 * const someUid = Athena.player.emit.createProgressBar(somePlayer, {
 *      color: new alt.RGBA(255, 0, 0, 200),
 *      distance: 10,
 *      milliseconds: 30000,
 *      position: new alt.Vector3(somePlayer.pos.x, somePlayer.pos.y, somePlayer.pos.z)
 * });
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {ProgressBar} progressbar
 * @returns {string} A unique identifier to remove the progress bar.
 */
export function createProgressBar(player: alt.Player, progressbar: ProgressBar): string {
    if (Overrides.createProgressBar) {
        return Overrides.createProgressBar(player, progressbar);
    }

    if (!progressbar.uid) {
        progressbar.uid = sha256Random(JSON.stringify(progressbar));
    }

    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_CREATE, progressbar);
    return progressbar.uid;
}

/**
 * Remove a progress bar based on its unique identifier.
 *
 * #### Example
 * ```ts
 * const someUid = Athena.player.emit.createProgressBar(somePlayer, {
 *      color: new alt.RGBA(255, 0, 0, 200),
 *      distance: 10,
 *      milliseconds: 30000,
 *      position: new alt.Vector3(somePlayer.pos.x, somePlayer.pos.y, somePlayer.pos.z)
 * });
 *
 * Athena.player.emit.removeProgressBar(somePlayer, someUid);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} uid A unique string
 */
export function removeProgressBar(player: alt.Player, uid: string) {
    if (Overrides.removeProgressBar) {
        return Overrides.removeProgressBar(player, uid);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_REMOVE, uid);
}

/**
 * Play a custom sound without any positional data.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.sound3D(somePlayer, 'error.ogg');
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} audioName
 * @param {number} [volume=0.35]
 * @param {string} soundInstantID, optional unique id to play sound instant
 */
export function sound2D(player: alt.Player, audioName: string, volume: number = 0.35, soundInstantID?: string) {
    if (Overrides.sound2D) {
        return Overrides.sound2D(player, audioName, volume, soundInstantID);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, audioName, volume, soundInstantID);
}

/**
 * Play a sound from at a target's location for this player.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.sound3D(somePlayer, 'car_lock.ogg', someVehicle);
 * ```
 *
 * @param {string} audioName
 * @param {alt.Entity} target
 * @param {string} soundInstantID, optional unique id to play sound instant
 *
 */
export function sound3D(player: alt.Player, audioName: string, target: alt.Entity, soundInstantID?: string): void {
    if (Overrides.sound3D) {
        return Overrides.sound3D(player, audioName, target, soundInstantID);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, target, audioName, soundInstantID);
}

/**
 * Stop all custom sounds that may be playing.
 *
 * This does not stop frontend sounds.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.soundStop(somePlayer);
 * ```
 *
 * @param {string} audioName
 * @param {alt.Entity} target
 * @param {string} soundInstantID, optional unique id to play sound instant
 *
 */
export function soundStop(player: alt.Player, soundInstantID?: string): void {
    if (Overrides.soundStop) {
        return Overrides.soundStop(player, soundInstantID);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_STOP, soundInstantID);
}

/**
 * Play a frontend sound for this player.
 *
 * [Frontend Audio List](https://github.com/DurtyFree/gta-v-data-dumps/blob/master/soundNames.json)
 *
 * #### Example
 * ```ts
 * Athena.player.emit.soundFrontend(somePlayer, 'HUD_FRONTEND_DEFAULT_SOUNDSET', 'BACK');
 * ```
 *
 * @param {string} audioName
 * @param {string} ref
 *
 */
export function soundFrontend(player: alt.Player, audioName: string, ref: string): void {
    if (Overrides.soundFrontend) {
        return Overrides.soundFrontend(player, audioName, ref);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, audioName, ref);
}

/**
 * Force the player to perform an uncancellable task timeline.
 * @param {Array<Task | TaskCallback>} tasks
 */
export function taskTimeline(player: alt.Player, tasks: Array<Task | TaskCallback>) {
    if (Overrides.taskTimeline) {
        return Overrides.taskTimeline(player, tasks);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks);
}

/**
 * Create a spinner in the bottom-right corner.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.createSpinner(somePlayer, { text: 'Doing Something With Spinners', duration: 5000, type: 4 })
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {ISpinner} spinner
 */
export function createSpinner(player: alt.Player, spinner: ISpinner) {
    if (Overrides.createSpinner) {
        return Overrides.createSpinner(player, spinner);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SPINNER, spinner);
}

/**
 * Clear a spinner in the bottom-right corner.
 *
 * No UID necessary since it can only have one spinner at a time.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.clearSpinner(somePlayer);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function clearSpinner(player: alt.Player) {
    if (Overrides.clearSpinner) {
        return Overrides.clearSpinner(player);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SPINNER_CLEAR);
}

/**
 * Create a full-screen message. Cannot be cleared by the player.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.createErrorScreen(somePlayer, { title: 'Oh No!', text: 'Something Happened', text2: 'Maybe a suggestion', duration: 5000})
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {IErrorScreen} screen
 */
export function createErrorScreen(player: alt.Player, screen: IErrorScreen) {
    if (Overrides.createErrorScreen) {
        return Overrides.createErrorScreen(player, screen);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN, screen);
}

/**
 * Clear a full-screen message.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.clearErrorScreen(somePlayer)
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function clearErrorScreen(player: alt.Player) {
    if (Overrides.clearErrorScreen) {
        return Overrides.clearErrorScreen(player);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN_CLEAR);
}

/**
 * Create a full-screen shard. Similar to 'mission-passed' or 'wasted'.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.createShard(somePlayer, { title: 'Big Text', text: 'Small Text', duration: 5000 })
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {IErrorScreen} screen
 */
export function createShard(player: alt.Player, shard: IShard) {
    if (Overrides.createShard) {
        return Overrides.createShard(player, shard);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SHARD, shard);
}

/**
 * Clear a shard.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.clearShard(somePlayer);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function clearShard(player: alt.Player) {
    if (Overrides.clearShard) {
        return Overrides.clearShard(player);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SHARD_CLEAR);
}

/**
 * Create a 'credits' text aligned to a certain side of the screen.
 *
 * Automatically clear(s) over-time.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.createCredits(somePlayer, { name: 'Big Text', role: 'Small Text', duration: 2000 });
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {ICredit} screen
 */
export function createCredits(player: alt.Player, credits: ICredit) {
    if (Overrides.createCredits) {
        return Overrides.createCredits(player, credits);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_CREDITS, credits);
}

/**
 * Clears a 'credits' display.
 *
 * #### Example
 * ```ts
 * const uidFromAttachment = Athena.player.emit.clearCredits(somePlayer);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function clearCredits(player: alt.Player) {
    if (Overrides.clearCredits) {
        return Overrides.clearCredits(player);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_CREDITS_CLEAR);
}

/**
 * Attach an object to a player.
 *
 * Automatically synchronized and handled client-side.
 *
 * Last parameter is when to remove the object. Automatically set to infinite.
 *
 * #### Example
 * ```ts
 * const uidFromAttachment = Athena.player.emit.objectAttach(somePlayer, {
 *      model: 'prop_box_ammo01a',
 *      bone: 127,
 *      pos: { x: 0, y: 0, z: 0},
 *      rot: { x: 0, y: 0, z: 0 }
 * });
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {IAttachable} attachable
 * @param {number} removeAfterMilliseconds
 * @return {string} UID for attachable object
 */
export function objectAttach(player: alt.Player, attachable: IAttachable, removeAfterMilliseconds = -1): string | null {
    if (Overrides.objectAttach) {
        return Overrides.objectAttach(player, attachable, removeAfterMilliseconds);
    }

    if (!player || !player.valid) {
        return null;
    }

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

            objectRemove(player, uid);
        }, removeAfterMilliseconds);
    }

    return attachable.uid;
}

/**
 * Remove an attachment object from the player.
 *
 * #### Example
 * ```ts
 * const uidFromAttachment = Athena.player.emit.objectAttach(somePlayer, {
 *      model: 'prop_box_ammo01a',
 *      bone: 127,
 *      pos: { x: 0, y: 0, z: 0},
 *      rot: { x: 0, y: 0, z: 0 }
 * });
 *
 * Athena.player.emit.objectRemove(somePlayer, uidFromAttachment);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} uid A unique string
 * @return {void}
 */
export function objectRemove(player: alt.Player, uid: string) {
    if (Overrides.objectRemove) {
        return Overrides.objectRemove(player, uid);
    }

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
}

/**
 * Allows a temporary object to be created and moved.
 * The object is only seen by this one player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} model
 * @param {alt.IVector3} start
 * @param {alt.IVector3} end
 * @param {number} speed
 */
export function tempObjectLerp(
    player: alt.Player,
    model: string,
    start: alt.IVector3,
    end: alt.IVector3,
    speed: number,
) {
    if (Overrides.tempObjectLerp) {
        return Overrides.tempObjectLerp(player, model, start, end, speed);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TEMP_OBJECT_LERP, model, start, end, speed);
}

/**
 * Create a wheel menu and emit  it to the player.
 * Can emit events to client or server-side.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} label
 * @param {Array<IWheelItem>} wheelItems
 */
export function wheelMenu(player: alt.Player, label: string, wheelItems: Array<IWheelOption>) {
    if (Overrides.wheelMenu) {
        return Overrides.wheelMenu(player, label, wheelItems);
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_WHEEL_MENU, label, wheelItems, true);
}

/**
 * Emit a message to a given player.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.message(somePlayer, '{FF0000} Hello there! This text is Red :)');
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} msg
 */
export function message(player: alt.Player, msg: string) {
    if (Overrides.message) {
        return Overrides.message(player, msg);
    }

    Athena.systems.messenger.messaging.send(player, msg);
}

/**
 * Prompt the user to accept / decline something.
 *
 * They must react by holding up arrow to open the menu.
 *
 * #### Example
 *
 * ```ts
 * function doSomething(player: alt.Player) {
 *     Athena.player.emit.acceptDeclineEvent(somePlayer, {
 *         question: 'Would you like to teleport to the beach?',
 *         onClientEvents: {
 *             accept: 'from-client-event-doSomething',
 *             decline: 'from-client-event-doNothing',
 *         },
 *     });
 * }
 *
 * alt.onClient('from-client-event-doSomething', (player: alt.Player) => {
 *     //
 * });
 * alt.onClient('from-client-event-doNothing', (player: alt.Player) => {
 *     //
 * });
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {AcceptDeclineEvent} eventInfo
 */
export function acceptDeclineEvent(player: alt.Player, eventInfo: AcceptDeclineEvent) {
    if (Overrides.acceptDeclineEvent) {
        return Overrides.acceptDeclineEvent(player, eventInfo);
    }

    notification(player, `[UP ARROW] ~y~${eventInfo.question}`);
    player.emit(SYSTEM_EVENTS.ACCEPT_DECLINE_EVENT_SET, eventInfo);
}

/**
 * Turns the player's screen black over time.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.fadeScreenToBlack(somePlayer, 5000);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} timeInMs
 */
export function fadeScreenToBlack(player: alt.Player, timeInMs: number) {
    player.emit(SYSTEM_EVENTS.SCREEN_FADE_TO_BLACK, timeInMs);
}

/**
 * Removes the black filter over the screen over time.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.fadeScreenFromBlack(somePlayer, 5000);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} timeInMs
 */
export function fadeScreenFromBlack(player: alt.Player, timeInMs: number) {
    player.emit(SYSTEM_EVENTS.SCREEN_FADE_FROM_BLACK, timeInMs);
}

export function setTimeCycleEffect(player: alt.Player, name: RecommendedTimecycleTypes, amountInMs: number);
export function setTimeCycleEffect(player: alt.Player, name: string, amountInMs: number);
/**
 * Used to apply on-screen effects to a given player.
 *
 * Think of like screen wobbling, drunkness, etc.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.setTimeCycleEffect(somePlayer, 'REDMIST', 30000);
 * ```
 *
 * @export
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} name
 * @param {number} amountInMs How long it should last. -1 for infinite.
 */
export function setTimeCycleEffect(player: alt.Player, name: string, amountInMs = -1) {
    player.emit(SYSTEM_EVENTS.SCREEN_TIMECYCLE_EFFECT, name, amountInMs);
}

/**
 * Used to clear a screen effect from a player.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.clearTimeCycleEffect(somePlayer);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function clearTimeCycleEffect(player: alt.Player) {
    player.emit(SYSTEM_EVENTS.SCREEN_TIMECYCLE_EFFECT_CLEAR);
}

/**
 * Cleanly transition weather from current weather to a new weather type.
 *
 * Does not use alt:V functionality. Only uses natives.
 *
 * #### Example
 * ```ts
 * Athena.player.emit.setWeather(somePlayer, 'Thunder', 30);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} timeInSeconds
 */
export function setWeather(player: alt.Player, weather: WEATHER_KEY, timeInSeconds: number) {
    player.emit(SYSTEM_EVENTS.WEATHER_CHANGE_TO, weather, timeInSeconds);
}

interface EmitFunctions {
    acceptDeclineEvent: typeof acceptDeclineEvent;
    animation: typeof animation;
    clearAnimation: typeof clearAnimation;
    clearCredits: typeof clearCredits;
    clearErrorScreen: typeof clearErrorScreen;
    clearShard: typeof clearShard;
    clearSpinner: typeof clearSpinner;
    createCredits: typeof createCredits;
    createErrorScreen: typeof createErrorScreen;
    createMissionText: typeof createMissionText;
    createProgressBar: typeof createProgressBar;
    createShard: typeof createShard;
    createSpinner: typeof createSpinner;
    clearTimeCycleEffect: typeof clearTimeCycleEffect;
    fadeScreenToBlack: typeof fadeScreenToBlack;
    fadeScreenFromBlack: typeof fadeScreenFromBlack;
    message: typeof message;
    meta: typeof meta;
    notification: typeof notification;
    objectAttach: typeof objectAttach;
    objectRemove: typeof objectRemove;
    particle: typeof particle;
    removeProgressBar: typeof removeProgressBar;
    scenario: typeof scenario;
    setTimeCycleEffect: typeof setTimeCycleEffect;
    sound2D: typeof sound2D;
    sound3D: typeof sound3D;
    soundFrontend: typeof soundFrontend;
    soundStop: typeof soundStop;
    startAlarm: typeof startAlarm;
    stopAlarm: typeof stopAlarm;
    stopAllAlarms: typeof stopAllAlarms;
    taskTimeline: typeof taskTimeline;
    tempObjectLerp: typeof tempObjectLerp;
    wheelMenu: typeof wheelMenu;
}

const Overrides: Partial<EmitFunctions> = {};

export function override(functionName: 'acceptDeclineEvent', callback: typeof acceptDeclineEvent);
export function override(functionName: 'animation', callback: typeof animation);
export function override(functionName: 'clearAnimation', callback: typeof clearAnimation);
export function override(functionName: 'clearCredits', callback: typeof clearCredits);
export function override(functionName: 'clearTimeCycleEffect', callback: typeof clearTimeCycleEffect);
export function override(functionName: 'createErrorScreen', callback: typeof createErrorScreen);
export function override(functionName: 'createMissionText', callback: typeof createMissionText);
export function override(functionName: 'createProgressBar', callback: typeof createProgressBar);
export function override(functionName: 'createShard', callback: typeof createShard);
export function override(functionName: 'createSpinner', callback: typeof createSpinner);
export function override(functionName: 'fadeScreenFromBlack', callback: typeof fadeScreenFromBlack);
export function override(functionName: 'fadeScreenToBlack', callback: typeof fadeScreenToBlack);
export function override(functionName: 'message', callback: typeof message);
export function override(functionName: 'meta', callback: typeof meta);
export function override(functionName: 'notification', callback: typeof notification);
export function override(functionName: 'objectAttach', callback: typeof objectAttach);
export function override(functionName: 'objectRemove', callback: typeof objectRemove);
export function override(functionName: 'particle', callback: typeof particle);
export function override(functionName: 'removeProgressBar', callback: typeof removeProgressBar);
export function override(functionName: 'scenario', callback: typeof scenario);
export function override(functionName: 'setTimeCycleEffect', callback: typeof setTimeCycleEffect);
export function override(functionName: 'sound2D', callback: typeof sound2D);
export function override(functionName: 'sound3D', callback: typeof sound3D);
export function override(functionName: 'soundFrontend', callback: typeof soundFrontend);
export function override(functionName: 'soundStop', callback: typeof soundStop);
export function override(functionName: 'startAlarm', callback: typeof startAlarm);
export function override(functionName: 'stopAlarm', callback: typeof stopAlarm);
export function override(functionName: 'stopAllAlarms', callback: typeof stopAllAlarms);
export function override(functionName: 'taskTimeline', callback: typeof taskTimeline);
export function override(functionName: 'tempObjectLerp', callback: typeof tempObjectLerp);
export function override(functionName: 'wheelMenu', callback: typeof wheelMenu);
/**
 * Used to override any internal emit functions.
 *
 * @ignore
 *
 * @param {keyof EmitFunctions} functionName
 * @param {*} callback
 */
export function override(functionName: keyof EmitFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
