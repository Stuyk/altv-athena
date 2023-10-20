import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { SYSTEM_EVENTS } from '../../shared/enums/system.js';
import { IWorldNotification } from '../../shared/interfaces/iWorldNotification.js';
import { ControllerFuncs } from './shared.js';

const MAX_MARKERS_TO_DRAW = 10;
const markerGroup = new alt.VirtualEntityGroup(MAX_MARKERS_TO_DRAW);
const globalNotifications: (IWorldNotification & { entity: alt.VirtualEntity })[] = [];

/**
 * Adds a global world notification for all players.
 * @param {IWorldNotification} notification
 * @returns {string} uid A unique string for notification
 *
 */
export function append(notification: IWorldNotification): string {
    if (Overrides.append) {
        return Overrides.append(notification);
    }

    if (!notification.uid) {
        notification.uid = Athena.utility.hash.sha256Random(JSON.stringify(notification));
    }

    const entity = new alt.VirtualEntity(markerGroup, new alt.Vector3(notification.pos), 10, {
        notification,
        type: 'worldnotification',
    });
    entity.dimension = notification.dimension ? notification.dimension : 0;
    globalNotifications.push({ ...notification, entity });

    return notification.uid;
}

/**
 * Removes a global world notification from all players based on the global uid.
 * @param {string} uid A unique string
 * @return {boolean}
 *
 */
export function remove(uid: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(uid);
    }

    const index = globalNotifications.findIndex((label) => label.uid === uid);
    if (index <= -1) {
        return false;
    }

    try {
        globalNotifications[index].entity.destroy();
    } catch (err) {}

    globalNotifications.splice(index, 1);
    return true;
}

/**
 * Remove a world notification from a single local player.
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} uid A unique string
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (Overrides.removeFromPlayer) {
        return Overrides.removeFromPlayer(player, uid);
    }

    if (!uid) {
        throw new Error(`Did not specify a uid for notifiction removal. WorldNotificationController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_WORLD_NOTIFICATION, uid);
}

/**
 * Add a world notification to a single local player.
 * @param {alt.Player} player An alt:V Player Entity
 * @param {IWorldNotification} notification
 * @returns {string} uid A unique string for notification
 */
export function addToPlayer(player: alt.Player, notification: IWorldNotification): string {
    if (Overrides.addToPlayer) {
        return Overrides.addToPlayer(player, notification);
    }

    if (!notification.uid) {
        notification.uid = Athena.utility.hash.sha256Random(JSON.stringify(notification));
    }

    alt.emitClient(player, SYSTEM_EVENTS.APPEND_WORLD_NOTIFICATION, notification);
    return notification.uid;
}

/**
 * Updates world notifications through the streamer service.
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Array<IWorldNotification>} notifications
 */
export function update(player: alt.Player, notifications: Array<IWorldNotification>) {
    if (Overrides.update) {
        return Overrides.update(player, notifications);
    }

    alt.emitClient(player, SYSTEM_EVENTS.POPULATE_WORLD_NOTIFICATIONS, notifications);
}

type WorldNotificationFuncs = ControllerFuncs<
    typeof append,
    typeof remove,
    typeof addToPlayer,
    typeof removeFromPlayer,
    typeof update
>;

const Overrides: Partial<WorldNotificationFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
export function override(functionName: 'update', callback: typeof update);
/**
 * Used to override any in-world streamer notifications
 *
 *
 * @param {keyof WorldNotificationFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof WorldNotificationFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
