import { ServerDoorController } from '@AthenaServer/streamers/doors';
import { ServerItemController } from '@AthenaServer/streamers/item';
import { ServerMarkerController } from '@AthenaServer/streamers/marker';
import { ServerObjectController } from '@AthenaServer/streamers/object';
import { PedController } from '@AthenaServer/streamers/ped';
import { ServerTextLabelController } from '@AthenaServer/streamers/textlabel';
import { WorldNotificationController } from '@AthenaServer/streamers/worldNotifications';
import { AdminController } from '@AthenaServer/systems/admin';
import { ServerBlipController } from '@AthenaServer/systems/blip';
import ChatController from '@AthenaServer/systems/chat';
import { HologramController } from '@AthenaServer/systems/hologram';
import { InteractionController } from '@AthenaServer/systems/interaction';

export const controllersConst = {
    admin: AdminController,
    blip: ServerBlipController,
    chat: ChatController,
    doors: ServerDoorController,
    interaction: InteractionController,
    item: ServerItemController,
    holograms: HologramController,
    marker: ServerMarkerController,
    object: ServerObjectController,
    ped: PedController,
    text: ServerTextLabelController,
    notification: WorldNotificationController,
};
