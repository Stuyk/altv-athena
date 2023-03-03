import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/blip';

const globalBlips: Array<Blip> = [];

/**
 * Adds a global label the player loads when they join.
 * Also appends it to any online players.
 * Requires a UID to remove it later.
 *
 * @param {Blip} label
 * @returns {string} A uid to remove it later.
 */
export function append(blip: Blip): string {
    if (!blip.uid) {
        blip.uid = Athena.utility.hash.sha256Random(JSON.stringify(blip));
    }

    const index = globalBlips.findIndex((existing) => existing && existing.uid === blip.uid);
    if (index >= 0) {
        globalBlips[index] = blip;
    } else {
        globalBlips.push(blip);
    }

    alt.emitAllClients(SYSTEM_EVENTS.APPEND_BLIP, blip);
    return blip.uid;
}

/**
 * Removes a text label based on uid.
 * @param {string} uid
 * @return {boolean}
 */
export function remove(uid: string): boolean {
    const index = globalBlips.findIndex((label) => label.uid === uid);
    if (index <= -1) {
        return false;
    }

    alt.emitAllClients(SYSTEM_EVENTS.REMOVE_BLIP, uid);
    globalBlips.splice(index, 1);
    return true;
}

/**
 * Remove a blip from the player.
 * @param {alt.Player} player
 * @param {string} uid
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (!uid) {
        throw new Error(`Did not specify a uid for object removal. ObjectController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_BLIP, uid);
}

/**
 * Add a blip to the player.
 * @param {alt.Player} player
 * @param {Blip} blipData
 */
export function addToPlayer(player: alt.Player, blipData: Blip) {
    if (!blipData.uid) {
        throw new Error(`Object ${JSON.stringify(blipData)} does not have a uid. ObjectController.addToPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.APPEND_BLIP, blipData);
}

export function populateGlobalBlips(player: alt.Player) {
    alt.emitClient(player, SYSTEM_EVENTS.POPULATE_BLIPS, globalBlips);
}

interface BlipControllerFuncs
    extends ControllerFuncs<typeof append, typeof remove, typeof addToPlayer, typeof removeFromPlayer> {
    populateGlobalBlips: typeof populateGlobalBlips;
}

const Overrides: Partial<BlipControllerFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
export function override(functionName: 'populateGlobalBlips', callback: typeof populateGlobalBlips);
/**
 * Used to override any blip controller function.
 *
 * @export
 * @param {keyof BlipControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof BlipControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
