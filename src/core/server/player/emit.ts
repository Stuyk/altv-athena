import * as Athena from '@AthenaServer/api';
import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { View_Events_Input_Menu } from '@AthenaShared/enums/views';
import { ANIMATION_FLAGS } from '@AthenaShared/flags/animationFlags';
import IAttachable from '@AthenaShared/interfaces/iAttachable';
import ICredit from '@AthenaShared/interfaces/iCredit';
import IErrorScreen from '@AthenaShared/interfaces/iErrorScreen';
import { InputMenu } from '@AthenaShared/interfaces/inputMenus';
import IShard from '@AthenaShared/interfaces/iShard';
import ISpinner from '@AthenaShared/interfaces/iSpinner';
import { Particle } from '@AthenaShared/interfaces/particle';
import { ProgressBar } from '@AthenaShared/interfaces/progressBar';
import { Task, TaskCallback } from '@AthenaShared/interfaces/taskTimeline';
import { IWheelOption } from '@AthenaShared/interfaces/wheelMenu';
import { sha256Random } from '../utility/hash';
import { AcceptDeclineEvent } from '@AthenaShared/interfaces/acceptDeclineEvent';
import { getters } from '@AthenaServer/systems/getters';

/**
 * Play an alarm on this player.
 * List of all alarms: https://github.com/DurtyFree/gta-v-data-dumps/blob/master/alarmSounds.json
 * @param {alt.Player} player
 * @param {string} name
 * @return {*}  {void}
 * @memberof EmitPrototype
 */
export function startAlarm(player: alt.Player, name: string): void {
    const data = Athena.document.character.get(player);
    if (data.isDead) {
        alt.logWarning(`[Athena] Cannot play alarm ${name} while player is dead.`);
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ALARM_START, name);
}

/**
 * Stop an alarm for this player.
 * @param {alt.Player} player
 * @param {string} name
 */
export function stopAlarm(player: alt.Player, name: string) {
    if (!player || !player.valid) {
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ALARM_STOP, name);
}

/**
 * Stop all alarms for this player.
 * @param {alt.Player} player
 */
export function stopAllAlarms(player: alt.Player) {
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
 * @return {*}  {void}
 * @memberof EmitPrototype
 */
export function animation(
    player: alt.Player,
    dictionary: string,
    name: string,
    flags: ANIMATION_FLAGS,
    duration: number = -1,
): void {
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
 * @param {alt.Player} player
 */
export function clearAnimation(player: alt.Player) {
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
 * @return {*}
 * @memberof EmitPrototype
 */
export function scenario(player: alt.Player, name: string, duration: number): void {
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
 * @memberof EmitPrototype
 */
export function meta(player: alt.Player, key: string, value: any): void {
    player.setLocalMeta(key, value);
}

/**
 * Send a notification to this player.
 * @param {string} message
 * @memberof EmitPrototype
 */
export function notification(player: alt.Player, message: string): void {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, message);
}

/**
 * Play a particle effect at a specific coordinate.
 * @param {Particle} particle
 * @param {boolean} [emitToNearbyPlayers=false]
 */
export function particle(player: alt.Player, particle: Particle, emitToNearbyPlayers = false): void {
    if (!emitToNearbyPlayers) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
        return;
    }

    const closestPlayers = getters.players.inRangeWithDistance(player.pos, 10);
    for (let i = 0; i < closestPlayers.length; i++) {
        const player = closestPlayers[i].player;
        alt.emitClient(player, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
    }
}

/**
 * Create a subtitle on the bottom of the screen with optional duration.
 * @param {alt.Player} player
 * @param {string} text
 * @param {number} duration
 */
export function createMissionText(player: alt.Player, text: string, duration?: number) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_MISSION_TEXT, text, duration);
}

/**
 * Create a progress bar that eventually ends itself.
 * @param {alt.Player} player
 * @param {ProgressBar} progressbar
 * @returns {string} A unique identifier to remove the progress bar.
 */
export function createProgressBar(player: alt.Player, progressbar: ProgressBar): string {
    if (!progressbar.uid) {
        progressbar.uid = sha256Random(JSON.stringify(progressbar));
    }

    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_CREATE, progressbar);
    return progressbar.uid;
}

/**
 * Remove a progress bar based on its unique identifier.
 * @param {alt.Player} player
 * @param {string} uid
 */
export function removeProgressBar(player: alt.Player, uid: string) {
    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_REMOVE, uid);
}

/**
 * Play a sound without any positional data.
 * @param {alt.Player} p
 * @param {string} audioName
 * @param {number} [volume=0.35]
 * @param {string} soundInstantID, optional unique id to play sound instant
 */
export function sound2D(p: alt.Player, audioName: string, volume: number = 0.35, soundInstantID?: string) {
    alt.emitClient(p, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, audioName, volume, soundInstantID);
}

/**
 * Play a sound from at a target's location for this player.
 * @param {string} audioName
 * @param {alt.Entity} target
 * @param {string} soundInstantID, optional unique id to play sound instant
 * @memberof EmitPrototype
 */
export function sound3D(p: alt.Player, audioName: string, target: alt.Entity, soundInstantID?: string): void {
    alt.emitClient(p, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, target, audioName, soundInstantID);
}

/**
 * Stop all sounds.
 * @param {string} audioName
 * @param {alt.Entity} target
 * @param {string} soundInstantID, optional unique id to play sound instant
 * @memberof EmitPrototype
 */
export function soundStop(p: alt.Player, soundInstantID?: string): void {
    alt.emitClient(p, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_STOP, soundInstantID);
}

/**
 * Play a frontend sound for this player.
 * @param {string} audioName
 * @param {string} ref
 * @memberof EmitPrototype
 */
export function soundFrontend(p: alt.Player, audioName: string, ref: string): void {
    alt.emitClient(p, SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, audioName, ref);
}

/**
 * Force the player to perform an uncancellable task timeline.
 * @param {Array<Task | TaskCallback>} tasks
 */
export function taskTimeline(player: alt.Player, tasks: Array<Task | TaskCallback>) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks);
}

export function inputMenu(player: alt.Player, inputMenu: InputMenu) {
    alt.emitClient(player, View_Events_Input_Menu.SetMenu, inputMenu);
}

/**
 * Create a spinner in the bottom-right corner.
 * @param {alt.Player} player
 * @param {ISpinner} spinner
 */
export function createSpinner(player: alt.Player, spinner: ISpinner) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SPINNER, spinner);
}

/**
 * Clear a spinner in the bottom-right corner.
 * No UID necessary since it can only have one spinner at a time.
 * @param {alt.Player} player
 */
export function clearSpinner(player: alt.Player) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SPINNER_CLEAR);
}

/**
 * Create a full-screen message. Cannot be cleared by the player.
 * @param {alt.Player} player
 * @param {IErrorScreen} screen
 */
export function createErrorScreen(player: alt.Player, screen: IErrorScreen) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN, screen);
}

/**
 * Clear a full-screen message.
 * @param {alt.Player} player
 */
export function clearErrorScreen(player: alt.Player) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN_CLEAR);
}

/**
 * Create a full-screen shard. Similar to 'mission-passed' or 'wasted'.
 * @param {alt.Player} player
 * @param {IErrorScreen} screen
 */
export function createShard(player: alt.Player, shard: IShard) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SHARD, shard);
}

/**
 * Clear a shard.
 * @param {alt.Player} player
 */
export function clearShard(player: alt.Player) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SHARD_CLEAR);
}

/**
 * Create a 'credits' text aligned to a certain side of the screen.
 * Automatically clear(s) over-time.
 * @param {alt.Player} player
 * @param {IErrorScreen} screen
 */
export function createCredits(player: alt.Player, credits: ICredit) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_CREDITS, credits);
}

/**
 * Clears a 'credits' display.
 * @param {alt.Player} player
 */
export function clearCredits(player: alt.Player) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_CREDITS_CLEAR);
}

/**
 * Attach an object to a player.
 * Automatically synchronized and handled client-side.
 * Last parameter is when to remove the object. Automatically set to infinite.
 * @param {alt.Player} player
 * @param {IAttachable} attachable
 * @param {number} removeAfterMilliseconds
 * @return {string} UID for attachable object
 */
export function objectAttach(player: alt.Player, attachable: IAttachable, removeAfterMilliseconds = -1): string | null {
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
 * Remove an object from the player.
 * @param {alt.Player} player
 * @param {string} uid
 * @return {*}
 */
export function objectRemove(player: alt.Player, uid: string) {
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
 * @param {alt.Player} player
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
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TEMP_OBJECT_LERP, model, start, end, speed);
}

/**
 * Create a wheel menu and emit  it to the player.
 * Can emit events to client or server-side.
 *
 * @param {alt.Player} player
 * @param {string} label
 * @param {Array<IWheelItem>} wheelItems
 */
export function wheelMenu(player: alt.Player, label: string, wheelItems: Array<IWheelOption>) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_WHEEL_MENU, label, wheelItems, true);
}

/**
 * Emit a message to a given player.
 *
 * @param {alt.Player} player
 * @param {string} msg
 */
export function message(player: alt.Player, msg: string) {
    Athena.systems.messenger.player.send(player, msg);
}

/**
 * Prompt the user to accept / decline something.
 * They must react by holding l-shift to open the menu.
 *
 * @param {alt.Player} player
 * @param {AcceptDeclineEvent} eventInfo
 */
export function acceptDeclineEvent(player: alt.Player, eventInfo: AcceptDeclineEvent) {
    notification(player, `[UP ARROW] ~y~${eventInfo.question}`);
    player.emit(SYSTEM_EVENTS.ACCEPT_DECLINE_EVENT_SET, eventInfo);
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
    inputMenu: typeof inputMenu;
    message: typeof message;
    meta: typeof meta;
    notification: typeof notification;
    objectAttach: typeof objectAttach;
    objectRemove: typeof objectRemove;
    particle: typeof particle;
    removeProgressBar: typeof removeProgressBar;
    scenario: typeof scenario;
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
export function override(functionName: 'createErrorScreen', callback: typeof createErrorScreen);
export function override(functionName: 'createMissionText', callback: typeof createMissionText);
export function override(functionName: 'createProgressBar', callback: typeof createProgressBar);
export function override(functionName: 'createShard', callback: typeof createShard);
export function override(functionName: 'createSpinner', callback: typeof createSpinner);
export function override(functionName: 'inputMenu', callback: typeof inputMenu);
export function override(functionName: 'message', callback: typeof message);
export function override(functionName: 'meta', callback: typeof meta);
export function override(functionName: 'notification', callback: typeof notification);
export function override(functionName: 'objectAttach', callback: typeof objectAttach);
export function override(functionName: 'objectRemove', callback: typeof objectRemove);
export function override(functionName: 'particle', callback: typeof particle);
export function override(functionName: 'removeProgressBar', callback: typeof removeProgressBar);
export function override(functionName: 'scenario', callback: typeof scenario);
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
export function override(functionName: keyof EmitFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
