import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IPed } from '../../shared/interfaces/iPed';
import { Animation } from '../../shared/interfaces/animation';
import { StreamerService } from '../systems/streamer';
import { sha256Random } from '../utility/encryption';

const globalPeds: Array<IPed> = [];
const KEY = 'peds';

export class PedController {
    /**
     * Initialize the PedController Streamer Service
     * @static
     * @memberof PedController
     */
    static init() {
        StreamerService.registerCallback(KEY, PedController.update);
    }

    /**
     * Refresh all global pedestrians.
     * @static
     * @memberof PedController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalPeds);
    }

    /**
     * Create a global static ped for the server.
     * @static
     * @param {IPed} pedData
     * @return {string} uid for the ped
     * @memberof PedController
     */
    static append(pedData: IPed): string {
        if (!pedData.uid) {
            pedData.uid = sha256Random(JSON.stringify(pedData));
        }

        globalPeds.push(pedData);
        PedController.refresh();
        return pedData.uid;
    }

    /**
     * Remove a global pedestrian
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof PedController
     */
    static remove(uid: string): boolean {
        const index = globalPeds.findIndex((ped) => ped.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalPeds.splice(index, 1);
        PedController.refresh();
        alt.emitAllClients(SYSTEM_EVENTS.REMOVE_GLOBAL_PED, uid);
        return true;
    }

    /**
     * Remove a pedestrian from a player.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof PedController
     */
    static removeFromPlayer(player: alt.Player, uid: string) {
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
     * @memberof PedController
     */
    static addToPlayer(player: alt.Player, pedData: IPed): string {
        if (!pedData.uid) {
            pedData.uid = sha256Random(JSON.stringify(pedData));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_PED, pedData);
        return pedData.uid;
    }

    static update(player: alt.Player, peds: Array<IPed>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_PEDS, peds);
    }

    static playAnimation(uid: string, animation: Animation[]) {
        alt.emitAllClients(SYSTEM_EVENTS.PLAY_ANIMATION_FOR_PED, uid, animation);
    }
}

PedController.init();
