import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IPed } from '../../shared/interfaces/IPed';
import Logger from '../utility/athenaLogger';
import { StreamerService } from './streamer';
import ChatController from "./chat";
import {LocaleController} from "../../shared/locale/locale";
import {LOCALE_KEYS} from "../../shared/locale/languages/keys";
import {PERMISSIONS} from "../../shared/flags/PermissionFlags";
import {playerFuncs} from "../extensions/Player";
import {getVectorInFrontOfPlayer} from "../utility/vector";
import VehicleFuncs from "../extensions/VehicleFuncs";
import crypto from 'crypto';

const globalPeds: Array<IPed> = [];
const KEY = 'peds';

export class PedController {

    static refresh() {
        StreamerService.updateData(KEY, globalPeds);
        alt.log(`${globalPeds[0].uid}`)
    }

    static append(objectData: IPed) {
        if (!objectData.uid) {
            Logger.error(`(${JSON.stringify(objectData.pos)}) Object does not have a unique id (uid).`);
            return;
        }

        globalPeds.push(objectData);
        PedController.refresh();
        alt.log("append ped")
    }

    static remove(uid: string): boolean {
        const index = globalPeds.findIndex((object) => object.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalPeds.splice(index, 1);
        PedController.refresh();
        alt.emitClient(null, SYSTEM_EVENTS.REMOVE_GLOBAL_PED, uid);
        return true;
    }

    static removeFromPlayer(player: alt.Player, uid: string, removeAllInterior = false) {
        if (!uid) {
            throw new Error(`Did not specify a uid for object removal. ObjectController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_PED, uid, removeAllInterior);
    }

    static addToPlayer(player: alt.Player, objectData: IPed) {
        if (!objectData.uid) {
            throw new Error(
                `Object ${JSON.stringify(objectData.pos)} does not have a uid. ObjectController.addToPlayer`
            );
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_PED, objectData);
    }

    static update(player: alt.Player, objects: Array<IPed>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_PEDS, objects);
    }
}

ChatController.addCommand(
    'addped',
    LocaleController.get(LOCALE_KEYS.COMMAND_VEHICLE, '/addped'),
    PERMISSIONS.ADMIN,
    handleAdd
);


function handleAdd(player: alt.Player, model: string): void {
    if (!model) {
        playerFuncs.emit.message(player, ChatController.getDescription('vehicle'));
        return;
    }

    if (player.data.isDead) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
        return;
    }

    const fwd = getVectorInFrontOfPlayer(player, 5);

    PedController.append({uid: crypto.randomBytes(16).toString("hex"),
    model: model,
    pos: fwd})
    alt.log("adding ped")
}
