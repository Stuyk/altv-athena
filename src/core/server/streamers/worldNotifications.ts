import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { IWorldNotification } from '@AthenaShared/interfaces/iWorldNotification';
import { sha256Random } from '@AthenaServer/utility/encryption';
import { StreamerService } from '@AthenaServer/systems/streamer';

const KEY = 'world-notifications';
const globalNotifications: Array<IWorldNotification> = [];

const InternalFunctions = {
    /**
     * Initialize this WorldNotification Stream Service
     * @memberof WorldNotificationController
     */
    init() {
        StreamerService.registerCallback(KEY, WorldNotificationController.update);
    },

    /**
     * Internal function to refresh all global world notifications in the streamer service.
     * @memberof WorldNotificationController
     */
    refresh() {
        StreamerService.updateData(KEY, globalNotifications);
    },
};

const WorldNotificationControllerConst = {
    /**
     * Adds a global world notification for all players.
     * @param {IWorldNotification} notification
     * @returns {string} uid for notification
     * @memberof WorldNotificationController
     */
    append(notification: IWorldNotification): string {
        if (!notification.uid) {
            notification.uid = sha256Random(JSON.stringify(notification));
        }

        globalNotifications.push(notification);
        InternalFunctions.refresh();
        return notification.uid;
    },

    /**
     * Removes a global world notification from all players based on the global uid.
     * @param {string} uid
     * @return {boolean}
     * @memberof WorldNotificationController
     */
    remove(uid: string): boolean {
        const index = globalNotifications.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalNotifications.splice(index, 1);
        InternalFunctions.refresh();
        return true;
    },

    /**
     * Remove a world notification from a single local player.
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof WorldNotificationController
     */
    removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(
                `Did not specify a uid for notifiction removal. WorldNotificationController.removeFromPlayer`,
            );
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_WORLD_NOTIFICATION, uid);
    },

    /**
     * Add a world notification to a single local player.
     * @param {alt.Player} player
     * @param {IWorldNotification} notification
     * @returns {string} uid for notification
     * @memberof WorldNotificationController
     */
    addToPlayer(player: alt.Player, notification: IWorldNotification): string {
        if (!notification.uid) {
            notification.uid = sha256Random(JSON.stringify(notification));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_WORLD_NOTIFICATION, notification);
        return notification.uid;
    },

    /**
     * Updates world notifications through the streamer service.
     * @param {alt.Player} player
     * @param {Array<IWorldNotification>} notifications
     * @memberof WorldNotificationController
     */
    update(player: alt.Player, notifications: Array<IWorldNotification>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_WORLD_NOTIFICATIONS, notifications);
    },
};

export const WorldNotificationController = {
    ...WorldNotificationControllerConst,
};

InternalFunctions.init();
