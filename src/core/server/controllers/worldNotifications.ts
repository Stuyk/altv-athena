import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IWorldNotification } from '../../shared/interfaces/iWorldNotification';
import { sha256Random } from '../utility/hash';
import { StreamerService } from '../systems/streamer';

const KEY = 'world-notifications';
const globalNotifications: Array<IWorldNotification> = [];

const InternalFunctions = {
    /**
     * Initialize this WorldNotification Stream Service
     * @memberof WorldNotificationController
     */
    init() {
        StreamerService.registerCallback(KEY, update);
    },

    /**
     * Internal function to refresh all global world notifications in the streamer service.
     * @memberof WorldNotificationController
     */
    refresh() {
        StreamerService.updateData(KEY, globalNotifications);
    },
};

/**
 * Adds a global world notification for all players.
 * @param {IWorldNotification} notification
 * @returns {string} uid for notification
 * @memberof WorldNotificationController
 */
export function append(notification: IWorldNotification): string {
    if (!notification.uid) {
        notification.uid = sha256Random(JSON.stringify(notification));
    }

    globalNotifications.push(notification);
    InternalFunctions.refresh();
    return notification.uid;
}

/**
 * Removes a global world notification from all players based on the global uid.
 * @param {string} uid
 * @return {boolean}
 * @memberof WorldNotificationController
 */
export function remove(uid: string): boolean {
    const index = globalNotifications.findIndex((label) => label.uid === uid);
    if (index <= -1) {
        return false;
    }

    globalNotifications.splice(index, 1);
    InternalFunctions.refresh();
    return true;
}

/**
 * Remove a world notification from a single local player.
 * @param {alt.Player} player
 * @param {string} uid
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (!uid) {
        throw new Error(`Did not specify a uid for notifiction removal. WorldNotificationController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_WORLD_NOTIFICATION, uid);
}

/**
 * Add a world notification to a single local player.
 * @param {alt.Player} player
 * @param {IWorldNotification} notification
 * @returns {string} uid for notification
 */
export function addToPlayer(player: alt.Player, notification: IWorldNotification): string {
    if (!notification.uid) {
        notification.uid = sha256Random(JSON.stringify(notification));
    }

    alt.emitClient(player, SYSTEM_EVENTS.APPEND_WORLD_NOTIFICATION, notification);
    return notification.uid;
}

/**
 * Updates world notifications through the streamer service.
 * @param {alt.Player} player
 * @param {Array<IWorldNotification>} notifications
 */
export function update(player: alt.Player, notifications: Array<IWorldNotification>) {
    alt.emitClient(player, SYSTEM_EVENTS.POPULATE_WORLD_NOTIFICATIONS, notifications);
}

InternalFunctions.init();

type WorldNotificationFuncs = ControllerFuncs<
    typeof append,
    typeof remove,
    typeof addToPlayer,
    typeof removeFromPlayer
>;

const Overrides: Partial<WorldNotificationFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
/**
 * Used to override any in-world streamer notifications
 *
 * @export
 * @param {keyof WorldNotificationFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof WorldNotificationFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
