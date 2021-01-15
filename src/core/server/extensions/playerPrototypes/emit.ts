import * as alt from 'alt-server';
import { AnimationFlags } from '../../../shared/enums/animation';
import { Events_Meta } from '../../../shared/enums/meta';
import { System_Events_Animation, System_Events_Notification, System_Events_Sound } from '../../../shared/enums/system';
import { View_Events_Chat } from '../../../shared/enums/views';

export interface EmitPrototype {
    /**
     * Make this player play an animation.
     * @param {string} dictionary
     * @param {string} name
     * @param {AnimationFlags} flags Use a Bitwise Flag to Combine
     * @param {number} duration
     * @memberof EmitPrototype
     */
    animation(dictionary: string, name: string, flags: AnimationFlags, duration: number): void;

    /**
     * Emit Data to this player only.
     * @param {string} key
     * @param {*} value
     * @memberof EmitPrototype
     */
    meta(key: string, value: any): void;

    /**
     * Send an event to this player.
     * @param {string} eventName
     * @param {...any[]} args
     * @memberof EmitPrototype
     */
    event(eventName: string, ...args: any[]): void;

    /**
     * Send a message to this player's chatbox.
     * @param {string} message
     * @memberof EmitPrototype
     */
    message(message: string): void;

    /**
     * Send a native GTA:V notification to this player.
     * @param {string} message
     * @memberof EmitPrototype
     */
    notification(message: string): void;

    /**
     * Play a custom sound in a 3D space for this player.
     * @param {string} audioName
     * @param {alt.Entity} target A vehicle, player, etc.
     * @memberof EmitPrototype
     */
    sound3D(audioName: string, target: alt.Entity): void;

    /**
     * Play a native frontend sound for this player.
     * @param {string} audioName
     * @param {string} ref
     * @memberof EmitPrototype
     */
    soundFrontend(audioName: string, ref: string): void;
}

export function bind(): EmitPrototype {
    const _this = this;
    _this.animation = animation;
    _this.meta = meta;
    _this.event = event;
    _this.message = message;
    _this.notification = notification;
    _this.sound3D = sound3D;
    _this.soundFrontend = soundFrontend;
    return _this;
}

/**
 * Play an animation on this player.
 * @param {string} dictionary
 * @param {string} name
 * @param {AnimationFlags} flags
 * @param {number} [duration=-1]
 * @return {*}  {void}
 * @memberof EmitPrototype
 */
function animation(dictionary: string, name: string, flags: AnimationFlags, duration: number = -1): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (p.data.isDead) {
        alt.logWarning(`[Athena] Cannot play ${dictionary}@${name} while player is dead.`);
        return;
    }

    p.emit().event(System_Events_Animation.PlayAnimation, dictionary, name, flags, duration);
}

/**
 * Synchronize a local variable to access locally for this player.
 * @param {string} key
 * @param {*} value
 * @memberof EmitPrototype
 */
function meta(key: string, value: any): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    alt.nextTick(() => {
        alt.emitClient(p, Events_Meta.Set, key, value);
    });
}

/**
 * Call a client-side event for this player.
 * @param {string} eventName
 * @param {...any[]} args
 * @memberof EmitPrototype
 */
function event(eventName: string, ...args: any[]): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    alt.nextTick(() => {
        alt.emitClient(p, eventName, ...args);
    });
}

/**
 * Send a message to this player's chat box.
 * @param {string} message
 * @memberof EmitPrototype
 */
function message(message: string): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.emit().event(View_Events_Chat.Append, message);
}

/**
 * Send a notification to this player.
 * @param {string} message
 * @memberof EmitPrototype
 */
function notification(message: string): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.emit().event(System_Events_Notification.ShowNotification, message);
}

/**
 * Play a sound from at a target's location for this player.
 * @param {string} audioName
 * @param {alt.Entity} target
 * @memberof EmitPrototype
 */
function sound3D(audioName: string, target: alt.Entity): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.emit().event(System_Events_Sound.PlaySound3D, target, audioName);
}

/**
 * Play a frontend sound for this player.
 * @param {string} audioName
 * @param {string} ref
 * @memberof EmitPrototype
 */
function soundFrontend(audioName: string, ref: string): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.emit().event(System_Events_Sound.PlaySoundFrontend, audioName, ref);
}
