import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { IPed } from '@AthenaShared/interfaces/iPed.js';
import { Animation } from '@AthenaShared/interfaces/animation.js';
import { playPedAnimation } from '@AthenaClient/systems/animations.js';

let localPeds: Array<IPed> = [];
let addedPeds: Array<IPed> = [];
let pedInfo: { [uid: string]: number } = {};
let isRemoving = false;
let interval;

/**
 * Do Not Export Internal Only
 */
const PedController = {
    init() {
        localPeds = [];
        addedPeds = [];
        pedInfo = {};
    },

    populate(peds: Array<IPed>) {
        addedPeds = peds;

        if (!interval) {
            interval = alt.setInterval(handleDrawPeds, 500);
        }
    },

    removeGlobalPed(uid: string) {
        isRemoving = true;

        let index = addedPeds.findIndex((ped) => ped.uid === uid);
        if (index >= 0) {
            addedPeds.splice(index, 1);
        }

        if (pedInfo[uid] !== null && pedInfo[uid] !== undefined) {
            native.deleteEntity(pedInfo[uid]);
            delete pedInfo[uid];
        }

        isRemoving = false;
    },

    playAnimation(uid: string, animation: Animation) {
        if (pedInfo[uid] !== null && pedInfo[uid] !== undefined) {
            playPedAnimation(pedInfo[uid], animation.dict, animation.name, animation.flags, animation.duration);
        }
    },

    removeAll() {
        const peds = addedPeds.concat(localPeds);
        while (peds.length >= 1) {
            const ped = peds.pop();
            const id = pedInfo[ped.uid];

            if (id === undefined || id === null) {
                return;
            }

            native.deletePed(id);
        }
    },
};

function handleDrawPeds() {
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

        if (AthenaClient.utility.vector.distance2d(alt.Player.local.pos, pedData.pos) > pedData.maxDistance) {
            if (pedInfo[pedData.uid] === -1) {
                continue;
            }

            if (pedInfo[pedData.uid] !== undefined && pedInfo[pedData.uid] !== null) {
                native.deleteEntity(pedInfo[pedData.uid]);
                pedInfo[pedData.uid] = null;
            }
            continue;
        }

        if (pedInfo[pedData.uid] !== undefined && pedInfo[pedData.uid] !== null) {
            continue;
        }

        pedInfo[pedData.uid] = -1;

        const hash = alt.hash(pedData.model);
        AthenaClient.utility.model.load(hash).then((res) => {
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
                false,
            );
            native.setEntityNoCollisionEntity(pedInfo[pedData.uid], alt.Player.local.scriptID, false);
            native.setEntityAsMissionEntity(pedInfo[pedData.uid], true, false); // make sure its not despawned by game engine
            native.setBlockingOfNonTemporaryEvents(pedInfo[pedData.uid], true); // make sure ped doesnt flee etc only do what its told
            native.setPedCanBeTargetted(pedInfo[pedData.uid], false);
            native.setPedCanBeKnockedOffVehicle(pedInfo[pedData.uid], 1);
            native.setPedCanBeDraggedOut(pedInfo[pedData.uid], false);
            native.setPedSuffersCriticalHits(pedInfo[pedData.uid], false);
            native.setPedDropsWeaponsWhenDead(pedInfo[pedData.uid], false);
            native.setPedDiesInstantlyInWater(pedInfo[pedData.uid], false);
            native.setPedCanRagdoll(pedInfo[pedData.uid], false);
            native.setPedDiesWhenInjured(pedInfo[pedData.uid], false);
            native.taskSetBlockingOfNonTemporaryEvents(pedInfo[pedData.uid], true);
            native.setPedFleeAttributes(pedInfo[pedData.uid], 0, false);
            native.setPedConfigFlag(pedInfo[pedData.uid], 32, true); // ped can fly thru windscreen
            native.setPedConfigFlag(pedInfo[pedData.uid], 281, true); // ped no writhe
            native.setPedGetOutUpsideDownVehicle(pedInfo[pedData.uid], false);
            native.setPedCanEvasiveDive(pedInfo[pedData.uid], false);

            native.taskSetBlockingOfNonTemporaryEvents(pedInfo[pedData.uid], true);
            native.setBlockingOfNonTemporaryEvents(pedInfo[pedData.uid], true);
            native.setPedFleeAttributes(pedInfo[pedData.uid], 0, true);
            native.setPedCombatAttributes(pedInfo[pedData.uid], 17, true);
            native.setPedAsEnemy(pedInfo[pedData.uid], false);
            native.setEntityInvincible(pedInfo[pedData.uid], true);

            alt.nextTick(() => {
                native.setEntityRotation(
                    pedInfo[pedData.uid],
                    pedData.rotation.x,
                    pedData.rotation.y,
                    pedData.rotation.z,
                    0,
                    true,
                );

                if (pedData.randomizeAppearance) {
                    native.setPedRandomProps(pedInfo[pedData.uid]);
                    native.setPedRandomComponentVariation(pedInfo[pedData.uid], 0);
                }

                native.freezeEntityPosition(pedInfo[pedData.uid], true);
                native.setEntityNoCollisionEntity(pedInfo[pedData.uid], alt.Player.local.scriptID, true);

                if (pedData.animations && pedData.animations.length > 0) {
                    let randomAnimation = pedData.animations[Math.floor(Math.random() * pedData.animations.length)];
                    PedController.playAnimation(pedData.uid, randomAnimation);
                }
            });
        });
    }
}

/**
 * Gets an NPC based on their scriptID if present.
 *
 * @static
 * @param {number} scriptId
 *
 */
export function get(scriptId: number): IPed | undefined {
    const keys = Object.keys(pedInfo);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (`${pedInfo[key]}` !== `${scriptId}`) {
            continue;
        }

        const localPedIndex = localPeds.findIndex((x) => x.uid === key);
        const addedPedIndex = addedPeds.findIndex((x) => x.uid === key);

        if (localPedIndex <= -1 && addedPedIndex <= -1) {
            continue;
        }

        if (localPedIndex >= 0) {
            return localPeds[localPedIndex];
        }

        if (addedPedIndex >= 0) {
            return addedPeds[addedPedIndex];
        }

        continue;
    }

    return undefined;
}

/**
 * Create a client-only static pedestrian.
 *
 *
 * @param {IPed} pedData
 * @return {void}
 */
export function append(pedData: IPed) {
    if (!pedData.uid) {
        alt.logError(`(${JSON.stringify(pedData.pos)}) Ped is missing uid.`);
        return;
    }

    const index = localPeds.findIndex((ped) => ped.uid === pedData.uid);
    if (index <= -1) {
        localPeds.push(pedData);
    } else {
        alt.logWarning(`${pedData.uid} was not a unique identifier. Replaced Ped in PedController.`);
        localPeds[index] = pedData;
    }

    localPeds.push(pedData);
    if (!interval) {
        interval = alt.setInterval(handleDrawPeds, 500);
    }
}

/**
 * Remove a client ped by uid
 *
 *
 * @param {string} uid A unique string
 * @return {void}
 */
export function remove(uid: string) {
    isRemoving = true;

    let index = -1;

    if (pedInfo[uid] !== null && pedInfo[uid] !== undefined) {
        native.deleteEntity(pedInfo[uid]);
        delete pedInfo[uid];
    }

    index = localPeds.findIndex((ped) => ped.uid === uid);

    if (index <= -1) {
        isRemoving = false;
        return;
    }

    const pedData = localPeds[index];
    if (!pedData) {
        isRemoving = false;
        return;
    }

    localPeds.splice(index, 1);
    isRemoving = false;
}

alt.on('connectionComplete', PedController.init);
alt.on('disconnect', PedController.removeAll);
alt.onServer(SYSTEM_EVENTS.REMOVE_GLOBAL_PED, PedController.removeGlobalPed);
alt.onServer(SYSTEM_EVENTS.POPULATE_PEDS, PedController.populate);
alt.onServer(SYSTEM_EVENTS.PLAY_ANIMATION_FOR_PED, PedController.playAnimation);
alt.onServer(SYSTEM_EVENTS.APPEND_PED, append);
alt.onServer(SYSTEM_EVENTS.REMOVE_PED, remove);
