import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { SYSTEM_EVENTS } from '../../shared/enums/system.js';
import { IPed } from '../../shared/interfaces/iPed.js';
import { Animation } from '../../shared/interfaces/animation.js';
import { NET_OWNER_PED } from '@AthenaShared/enums/netOwner.js';
import { ControllerFuncs } from './shared.js';

const globalPeds: Array<IPed & { ped: alt.Ped }> = [];

/**
 * Create a global static ped for the server.
 *
 * A static pedestrian does not move, and simply stands there.
 *
 *  * Returns a uid or generates one if not specified.
 *
 * #### Example
 * ```ts
 * const uid = Athena.controllers.staticPed.append({ model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })
 *
 * Athena.controllers.staticPed.append({ uid: 'the-id-you-specified', model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })
 * ```
 *
 * @param {IPed} pedData
 * @return {string} uid A unique string for the ped
 */
export function append(pedData: IPed): string {
    if (Overrides.append) {
        return Overrides.append(pedData);
    }

    if (!pedData.uid) {
        pedData.uid = Athena.utility.hash.sha256Random(JSON.stringify(pedData));
    }

    const ped = new alt.Ped(
        pedData.model,
        new alt.Vector3(pedData.pos),
        pedData.rotation ? new alt.Vector3(pedData.pos) : alt.Vector3.zero,
        50,
    );

    ped.dimension = pedData.dimension ? pedData.dimension : 0;
    ped.frozen = pedData.frozen ? true : false;
    ped.collision = pedData.collision ? true : false;
    ped.dimension = pedData.dimension ? pedData.dimension : 0;
    ped.setStreamSyncedMeta('type', 'ped');
    ped.setStreamSyncedMeta('ped', pedData);

    globalPeds.push({ ...pedData, ped });
    return pedData.uid;
}

/**
 * Get the pedestrian entity assgined to the `uid`.
 *
 * @export
 * @param {string} uid
 * @return {alt.Ped}
 */
export function getPed(uid: string) {
    const index = globalPeds.findIndex((ped) => ped.uid === uid);
    if (index <= -1) {
        return undefined;
    }

    const entity = globalPeds[index];

    return {
        uid,
        entity,
        follow(target: alt.Player) {
            if (!entity.ped.netOwner) {
                return;
            }

            entity.ped.netOwner.emit(NET_OWNER_PED.FOLLOW, entity.ped, target);
        },
        unfollow(target: alt.Player) {
            if (!entity.ped.netOwner) {
                return;
            }

            entity.ped.netOwner.emit(NET_OWNER_PED.UNFOLLOW, entity.ped, target);
        },
        goto(pos: alt.Vector3) {
            if (!entity.ped.netOwner) {
                return;
            }

            entity.ped.netOwner.emit(NET_OWNER_PED.GOTO, entity.ped, pos);
        },
        enterVehicle(vehicle: alt.Vehicle, seat: number) {
            if (!entity.ped.netOwner) {
                return;
            }

            entity.ped.netOwner.emit(NET_OWNER_PED.ENTER_VEHICLE, entity.ped, vehicle, seat);
        },
        leaveVehicle() {
            if (!entity.ped.netOwner) {
                return;
            }

            entity.ped.netOwner.emit(NET_OWNER_PED.LEAVE_VEHICLE, entity.ped);
        },
        animate(animation: Animation) {
            if (!entity.ped.netOwner) {
                return;
            }

            entity.ped.netOwner.emit(NET_OWNER_PED.ANIMATE, entity.ped, animation);
        },
    };
}

/**
 * Remove a global pedestrian
 *
 * #### Example
 * ```ts
 * Athena.controllers.staticPed.remove(someUid)
 *
 * Athena.controllers.staticPed.remove('the-id-you-specified');
 * ```
 *
 * @param {string} uid A unique string
 * @return {boolean}
 */
export function remove(uid: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(uid);
    }

    const index = globalPeds.findIndex((ped) => ped.uid === uid);
    if (index <= -1) {
        return false;
    }

    try {
        globalPeds[index].ped.destroy();
    } catch (err) {}

    globalPeds.splice(index, 1);
    alt.emitAllClients(SYSTEM_EVENTS.REMOVE_GLOBAL_PED, uid);
    return true;
}

/**
 * Remove a pedestrian from a player.
 *
 * #### Example
 * ```ts
 * Athena.controllers.staticPed.removeFromPlayer(somePlayer, someUid)
 *
 * Athena.controllers.staticPed.removeFromPlayer(somePlayer, 'the-id-you-specified');
 * ```
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} uid A unique string
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (Overrides.removeFromPlayer) {
        return Overrides.removeFromPlayer(player, uid);
    }

    if (!uid) {
        throw new Error(`Did not specify a uid for ped removal. PedController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_PED, uid);
}

/**
 * Add a single ped that only a single player can see
 *
 * Returns a uid or generates one if not specified.
 *
 * #### Example
 * ```ts
 * const uid = Athena.controllers.staticPed.addToPlayer(somePlayer, { model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })
 *
 * Athena.controllers.staticPed.addToPlayer(somePlayer, { uid: 'the-id-you-specified', model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {IPed} pedData
 * @return {string}
 */
export function addToPlayer(player: alt.Player, pedData: IPed): string {
    if (Overrides.addToPlayer) {
        return Overrides.addToPlayer(player, pedData);
    }

    if (!pedData.uid) {
        pedData.uid = Athena.utility.hash.sha256Random(JSON.stringify(pedData));
    }

    alt.emitClient(player, SYSTEM_EVENTS.APPEND_PED, pedData);
    return pedData.uid;
}

/**
 * Make a pedestrian play a specific animation.
 *
 * #### Example
 * ```ts
 * Athena.controllers.staticPed.playAnimation('the-id-you-specified', playAnimation('test',
 *      {
 *          dict: 'mp_ped_interaction',
 *          name: 'hugs_guy_a',
 *          duration: 2000,
 *          flags: 0,
 *      },
 * );
 * ```
 *
 *
 * @param {string} uid A unique string
 * @param {Animation} animation
 */
export function playAnimation(uid: string, animation: Animation) {
    alt.emitAllClients(SYSTEM_EVENTS.PLAY_ANIMATION_FOR_PED, uid, animation);
}

type PedControllerFuncs = ControllerFuncs<typeof append, typeof remove, typeof addToPlayer, typeof removeFromPlayer>;

const Overrides: Partial<PedControllerFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);

/**
 * Used to override any static ped streamer functionality.
 *
 *
 * @param {keyof PedControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof PedControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
