import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IPed } from '../../shared/interfaces/iPed';
import { Animation } from '../../shared/interfaces/animation';

const globalPeds: Array<IPed> = [];
const KEY = 'peds';

const InternalFunctions = {
    /**
     * Initialize the PedController Streamer Service
     * @static
     * @memberof PedController
     */
    init() {
        Athena.systems.streamer.registerCallback(KEY, InternalFunctions.update);
    },

    update(player: alt.Player, peds: Array<IPed>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_PEDS, peds);
    },

    /**
     * Refresh all global pedestrians.
     * @static
     * @memberof PedController
     */
    refresh() {
        Athena.systems.streamer.updateData(KEY, globalPeds);
    },
};

/**
 * Create a global static ped for the server.
 * @static
 * @param {IPed} pedData
 * @return {string} uid for the ped
 */
export function append(pedData: IPed): string {
    if (!pedData.uid) {
        pedData.uid = Athena.utility.hash.sha256Random(JSON.stringify(pedData));
    }

    globalPeds.push(pedData);
    InternalFunctions.refresh();
    return pedData.uid;
}

/**
 * Remove a global pedestrian
 * @static
 * @param {string} uid
 * @return {*}  {boolean}
 */
export function remove(uid: string): boolean {
    const index = globalPeds.findIndex((ped) => ped.uid === uid);
    if (index <= -1) {
        return false;
    }

    globalPeds.splice(index, 1);
    InternalFunctions.refresh();
    alt.emitAllClients(SYSTEM_EVENTS.REMOVE_GLOBAL_PED, uid);
    return true;
}

/**
 * Remove a pedestrian from a player.
 * @static
 * @param {alt.Player} player
 * @param {string} uid
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (!uid) {
        throw new Error(`Did not specify a uid for ped removal. PedController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_PED, uid);
}

/**
 * Add a single ped that only a single player can see
 * @static
 * @param {alt.Player} player
 * @param {IPed} pedData
 * @return {string}
 */
export function addToPlayer(player: alt.Player, pedData: IPed): string {
    if (!pedData.uid) {
        pedData.uid = Athena.utility.hash.sha256Random(JSON.stringify(pedData));
    }

    alt.emitClient(player, SYSTEM_EVENTS.APPEND_PED, pedData);
    return pedData.uid;
}

export function playAnimation(uid: string, animation: Animation[]) {
    alt.emitAllClients(SYSTEM_EVENTS.PLAY_ANIMATION_FOR_PED, uid, animation);
}

InternalFunctions.init();

type PedControllerFuncs = ControllerFuncs<typeof append, typeof remove, typeof addToPlayer, typeof removeFromPlayer>;

const Overrides: Partial<PedControllerFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
/**
 * Used to override any static ped streamer functionality.
 *
 * @export
 * @param {keyof PedControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof PedControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
