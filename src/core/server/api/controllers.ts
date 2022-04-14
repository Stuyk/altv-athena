import { ServerItemController } from '../streamers/item';
import { ServerMarkerController } from '../streamers/marker';
import { ServerObjectController } from '../streamers/object';
import { PedController } from '../streamers/ped';
import { ServerTextLabelController } from '../streamers/textlabel';
import { WorldNotificationController } from '../streamers/worldNotifications';
import { ServerBlipController } from '../systems/blip';
import { InteractionController } from '../systems/interaction';

export const Controllers = {
    blip: ServerBlipController,
    interaction: InteractionController,
    item: ServerItemController,
    marker: ServerMarkerController,
    object: ServerObjectController,
    ped: PedController,
    text: ServerTextLabelController,
    notification: WorldNotificationController,
};
