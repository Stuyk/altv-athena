import * as alt from 'alt-server';

import {SYSTEM_EVENTS} from '../../shared/enums/system';
import {IPed} from '../../shared/interfaces/IPed';
import {Animation} from '../../shared/interfaces/Animation';
import Logger from '../utility/athenaLogger';
import {StreamerService} from './streamer';

const globalPeds: Array<IPed> = [];
const KEY = 'peds';

export class PedController {

    static refresh() {
        StreamerService.updateData(KEY, globalPeds);
    }

    static append(pedData: IPed) {
        if (!pedData.uid) {
            Logger.error(`(${JSON.stringify(pedData.pos)}) Ped does not have a unique id (uid).`);
            return;
        }

        globalPeds.push(pedData);
        PedController.refresh();
    }

    static remove(uid: string): boolean {
        const index = globalPeds.findIndex((ped) => ped.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalPeds.splice(index, 1);
        PedController.refresh();
        alt.emitClient(null, SYSTEM_EVENTS.REMOVE_GLOBAL_PED, uid);
        return true;
    }

    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for ped removal. PedController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_PED, uid);
    }

    static addToPlayer(player: alt.Player, pedData: IPed) {
        if (!pedData.uid) {
            throw new Error(
                `Ped ${JSON.stringify(pedData.pos)} does not have a uid. PedController.addToPlayer`
            );
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_PED, pedData);
    }

    static update(player: alt.Player, peds: Array<IPed>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_PEDS, peds);
    }

    static playAnimation(uid: string, animation: Animation[]) {
        alt.emitClient(null, SYSTEM_EVENTS.PLAY_ANIMATION_FOR_PED, uid, animation);
    }
}
