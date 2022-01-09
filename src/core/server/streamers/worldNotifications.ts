import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IWorldNotification } from '../../shared/interfaces/iWorldNotification';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';

const KEY = 'world-notifications';
const globalNotifications: Array<IWorldNotification> = [];

export class WorldNotificationController {
    /**
     * Initialize this WorldNotification Stream Service
     * @static
     * @memberof WorldNotificationController
     */
    static init() {
        StreamerService.registerCallback(KEY, WorldNotificationController.update);
    }

    /**
     * Internal function to refresh all global world notifications in the streamer service.
     * @static
     * @memberof WorldNotificationController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalNotifications);
    }

    /**
     * Adds a global world notification for all players.
     * @static
     * @param {IWorldNotification} notification
     * @returns {string} uid for notification
     * @memberof WorldNotificationController
     */
    static append(notification: IWorldNotification): string {
        if (!notification.uid) {
            notification.uid = sha256Random(JSON.stringify(notification));
        }

        globalNotifications.push(notification);
        WorldNotificationController.refresh();
        return notification.uid;
    }

    /**
     * Removes a global world notification from all players based on the global uid.
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof WorldNotificationController
     */
    static remove(uid: string): boolean {
        const index = globalNotifications.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalNotifications.splice(index, 1);
        WorldNotificationController.refresh();
        return true;
    }

    /**
     * Remove a world notification from a single local player.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof WorldNotificationController
     */
    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(
                `Did not specify a uid for notifiction removal. WorldNotificationController.removeFromPlayer`,
            );
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_WORLD_NOTIFICATION, uid);
    }

    /**
     * Add a world notification to a single local player.
     * @static
     * @param {alt.Player} player
     * @param {IWorldNotification} notification
     * @returns {string} uid for notification
     * @memberof WorldNotificationController
     */
    static addToPlayer(player: alt.Player, notification: IWorldNotification): string {
        if (!notification.uid) {
            notification.uid = sha256Random(JSON.stringify(notification));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_WORLD_NOTIFICATION, notification);
        return notification.uid;
    }

    /**
     * Updates world notifications through the streamer service.
     * @static
     * @param {alt.Player} player
     * @param {Array<IWorldNotification>} notifications
     * @memberof WorldNotificationController
     */
    static update(player: alt.Player, notifications: Array<IWorldNotification>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_WORLD_NOTIFICATIONS, notifications);
    }
}

WorldNotificationController.init();
