import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IPed } from '../../shared/interfaces/IPed';
import { distance2d } from '../../shared/utility/vector';
import { loadModel } from '../utility/model';
import { Timer } from '../utility/timers';

let localPeds: Array<IPed> = [];
let addedPeds: Array<IPed> = [];
let pedInfo: { [uid: string]: number } = {};
let isRemoving = false;
let interval;
//
export class PedController {
//
    static append(objectData: IPed) {
        if (!objectData.uid) {
            alt.logError(`(${JSON.stringify(objectData.pos)}) Object is missing uid.`);
            return;
        }

        localPeds.push(objectData);
        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
        alt.log('adding ped')
    }
//
//
    static populate(objects: Array<IPed>) {
        addedPeds = objects;

        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
    }


    static remove(uid: string, removeAllInterior = false) {
        isRemoving = true;

        let index = -1;

        if (pedInfo[uid] !== null && pedInfo[uid] !== undefined) {
            native.deleteEntity(pedInfo[uid]);
            delete pedInfo[uid];
        }

        // Removes all objects matching this prefix specifically.
        if (removeAllInterior) {
            for (let i = localPeds.length - 1; i >= 0; i--) {
                if (!localPeds[i].isInterior) {
                    continue;
                }

                localPeds.splice(i, 1);
            }

            isRemoving = false;
            return;
        }

        index = localPeds.findIndex((object) => object.uid === uid);

        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const objectData = localPeds[index];
        if (!objectData) {
            isRemoving = false;
            return;
        }

        localPeds.splice(index, 1);
        isRemoving = false;
    }
    //
    //
    static removeGlobalObject(uid: string) {
        isRemoving = true;

        let index = addedPeds.findIndex((object) => object.uid === uid);
        if (index >= 0) {
            addedPeds.splice(index, 1);
        }

        if (pedInfo[uid] !== null && pedInfo[uid] !== undefined) {
            native.deleteEntity(pedInfo[uid]);
            delete pedInfo[uid];
        }

        isRemoving = false;
    }
}

function handleDrawObjects() {
    if (isRemoving) {
        return;
    }

    const peds = addedPeds.concat(localPeds);

    if (peds.length <= 0) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    for (let i = 0; i < peds.length; i++) {
        const pedData = peds[i];
        if (!pedData.maxDistance) {
            pedData.maxDistance = 25;
        }

        // Remove the Object if it has an id
        if (distance2d(alt.Player.local.pos, pedData.pos) > pedData.maxDistance) {
            // Being Created. Delete it after creation.
            if (pedInfo[pedData.uid] === -1) {
                continue;
            }

            if (pedInfo[pedData.uid] !== undefined && pedInfo[pedData.uid] !== null) {
                native.deleteObject(pedInfo[pedData.uid]);
                pedInfo[pedData.uid] = null;
            }
            continue;
        }

        // Continue on. The object was already created.
        if (pedInfo[pedData.uid] !== undefined && pedInfo[pedData.uid] !== null) {
            continue;
        }

        pedInfo[pedData.uid] = -1;

        const hash = alt.hash(pedData.model);
        loadModel(hash).then((res) => {
            if (!res) {
                pedInfo[pedData.uid] = null;
                throw new Error(`${pedData.model} is not a valid model.`);
            }

            pedInfo[pedData.uid] = native.createPed(
                1,
                hash,
                pedData.pos.x,
                pedData.pos.y,
                pedData.pos.z,
                0,
                false,
                false
            );
            native.setEntityNoCollisionEntity(Ped, alt.Player.local.scriptID, false);
            native.freezeEntityPosition(pedInfo[pedData.uid], false);
            native.setEntityHeading(pedInfo[pedData.uid], npc.rot);
            native.taskSetBlockingOfNonTemporaryEvents(pedInfo[pedData.uid], true);
            native.setBlockingOfNonTemporaryEvents(pedInfo[pedData.uid], true);
            native.setPedFleeAttributes(pedInfo[pedData.uid], 0, true);
            native.setPedCombatAttributes(pedInfo[pedData.uid], 17, true);
            native.setPedAsEnemy(pedInfo[pedData.uid], false);
            native.setEntityInvincible(pedInfo[pedData.uid], true);

            // alt.log(`CREATED MODEL ${objectInfo[objectData.uid]} for ${objectData.model}`);
            const rot = pedData.rot ? pedData.rot : { x: 0, y: 0, z: 0 };
            native.setEntityNoCollisionEntity(pedInfo[pedData.uid], alt.Player.local.scriptID, true);
            native.setEntityRotation(pedInfo[pedData.uid], rot.x, rot.y, rot.z, 1, false);
            native.freezeEntityPosition(pedInfo[pedData.uid], true);
        });
    }
}
//
alt.onServer(SYSTEM_EVENTS.REMOVE_GLOBAL_PED, PedController.removeGlobalObject);
alt.onServer(SYSTEM_EVENTS.APPEND_PED, PedController.append);
alt.onServer(SYSTEM_EVENTS.POPULATE_PEDS, PedController.populate);
alt.onServer(SYSTEM_EVENTS.REMOVE_PED, PedController.remove);

let loaded = false;

let NPCS = [
    { pedid: null, displayname: "Bank Teller", showname: true, model: -1022961931, pos: new alt.Vector3(147.86373901367188, -1041.956054687500, 28.50), rot: 340 }, //fleeca
    { pedid: null, displayname: "Bank Teller", showname: true, model: 1767447799, pos: new alt.Vector3(149.32746887207030, -1042.417602539062, 28.50), rot: 340 }, //fleeca
    { pedid: null, displayname: "Bank Teller", showname: true, model: 1767447799, pos: new alt.Vector3(313.74066162109375, -280.8527526855469, 53.20), rot: 340 }, //fleeca
    { pedid: null, displayname: "Bank Teller", showname: true, model: -1022961931, pos: new alt.Vector3(312.05273437500000, -280.4439697265625, 53.20), rot: 340 }, //fleeca
    { pedid: null, displayname: "Clothes Merchant", showname: true, model: 1055701597, pos: new alt.Vector3(127.43736267089844, -224.3340606689453, 54.55), rot: 90 }, //urban clothes shop
];

function distance(vector1, vector2) {
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2));
}

let SpawnedNPCS = [];


alt.onServer('spawnped', (x,y,z)=>{
let npc = NPCS[0]
        if (!native.hasModelLoaded(npc.model)) {
            native.requestModel(npc.model);
        }
        let Ped = native.createPed(1, npc.model, x, y, z, 0, false, false);
        SpawnedNPCS.push(Ped);
        npc.pedid = Ped;
        native.setEntityNoCollisionEntity(Ped, alt.Player.local.scriptID, false);
        native.freezeEntityPosition(Ped, false);
        native.setEntityHeading(Ped, npc.rot);
        native.taskSetBlockingOfNonTemporaryEvents(Ped, true);
        native.setBlockingOfNonTemporaryEvents(Ped, true);
        native.setPedFleeAttributes(Ped, 0, true);
        native.setPedCombatAttributes(Ped, 17, true);
        native.setPedAsEnemy(Ped, false);
        native.setEntityInvincible(Ped, true);

        alt.setTimeout(() => {
            native.setEntityNoCollisionEntity(Ped, alt.Player.local.scriptID, true);
            native.freezeEntityPosition(Ped, true);
        }, 2000);
})



alt.everyTick(() => {
    if (SpawnedNPCS.length >= 1) {
        SpawnedNPCS.forEach(npc => {
            NPCS.forEach(npcData => {
                if (npcData.showname && npcData.pedid === npc && distance(npcData.pos, alt.Player.local.pos) < 10) {
                    native.requestPedVisibilityTracking(npc);
                    if (native.isTrackedPedVisible(npc)) {
                        native.clearPedBloodDamage(npc);
                        let headbone = native.getPedBoneCoords(npc, 31086, 0, 0, 0);
                        native.setDrawOrigin(headbone.x, headbone.y, headbone.z + 0.5, false);
                        native.setTextOutline();
                        native.beginTextCommandDisplayText('STRING');
                        native.setTextFont(0);
                        native.setTextCentre(true);
                        native.setTextScale(0.25, 0.25);
                        native.setTextDropshadow(0, 255, 255, 255, 255);
                        native.setTextProportional(false);
                        native.setTextColour(255, 255, 255, 255);
                        native.addTextComponentSubstringPlayerName(npcData.displayname);
                        native.endTextCommandDisplayText(0, 0, 0);
                        native.clearDrawOrigin();
                    }
                }
            });
        });
    }
});
