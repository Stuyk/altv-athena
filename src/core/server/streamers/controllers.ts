import { ServerItemController } from './item';
import { ServerMarkerController } from './marker';
import { ServerObjectController } from './object';
import { PedController } from './ped';
import { ServerTextLabelController } from './textlabel';
import { WorldNotificationController } from './worldNotifications';

export const Controllers = {
    item: ServerItemController,
    marker: ServerMarkerController,
    object: ServerObjectController,
    ped: PedController,
    text: ServerTextLabelController,
    notification: WorldNotificationController,
};
