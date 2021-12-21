import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IWorldNotification } from '../../shared/interfaces/iWorldNotification';
import { distance2d } from '../../shared/utility/vector';
import { Timer } from '../utility/timers';

let addedNotifications: Array<IWorldNotification> = [];
let localNotifications: Array<IWorldNotification> = [];
let isRemoving = false;
let interval: number;

class ClientWorldNotificationController {
    static init() {
        addedNotifications = [];
        localNotifications = [];
    }

    static stop() {
        if (!interval) {
            return;
        }

        Timer.clearInterval(interval);
    }

    static append(notification: IWorldNotification) {
        if (!notification.uid) {
            alt.logError(`(${JSON.stringify(notification.pos)}) WorldNotification is missing uid.`);
            return;
        }

        const index = localNotifications.findIndex((obj) => obj.uid === notification.uid);
        if (index <= -1) {
            localNotifications.push(notification);
        } else {
            alt.logWarning(
                `${notification.uid} was not a unique identifier. Replaced WorldNotifications in ClientWorldNotificationController.`,
            );
            localNotifications[index] = notification;
        }

        if (!interval) {
            interval = Timer.createInterval(handleDrawNotifications, 0, 'worldNotifications.ts');
        }
    }

    static populate(notifications: Array<IWorldNotification>) {
        addedNotifications = notifications;

        if (!interval) {
            interval = Timer.createInterval(handleDrawNotifications, 0, 'worldNotifications.ts');
        }
    }

    static remove(uid: string) {
        isRemoving = true;

        const index = localNotifications.findIndex((marker) => marker.uid === uid);
        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const marker = localNotifications[index];
        if (!marker) {
            isRemoving = false;
            return;
        }

        localNotifications.splice(index, 1);
        isRemoving = false;
    }
}

function handleDrawNotifications() {
    if (isRemoving) {
        return;
    }

    const notifications = addedNotifications.concat(localNotifications);

    if (notifications.length <= 0) {
        return;
    }

    if (alt.Player.local.isWheelMenuOpen) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        if (!notification.maxDistance) {
            notification.maxDistance = 5;
        }

        if (distance2d(alt.Player.local.pos, notification.pos) > notification.maxDistance) {
            continue;
        }

        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(notification.text);
        native.endTextCommandDisplayHelp(2, false, false, -1);
        native.setFloatingHelpTextWorldPosition(1, notification.pos.x, notification.pos.y, notification.pos.z);

        if (notification.background === null || notification.background === undefined) {
            notification.background = 2;
        }

        native.setFloatingHelpTextStyle(1, 1, notification.background, -1, notification.type, 0);
    }
}

alt.on('connectionComplete', ClientWorldNotificationController.init);
alt.on('disconnect', ClientWorldNotificationController.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_WORLD_NOTIFICATIONS, ClientWorldNotificationController.populate);
alt.onServer(SYSTEM_EVENTS.APPEND_WORLD_NOTIFICATION, ClientWorldNotificationController.append);
alt.onServer(SYSTEM_EVENTS.REMOVE_WORLD_NOTIFICATION, ClientWorldNotificationController.remove);
