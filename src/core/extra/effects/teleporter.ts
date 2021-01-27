import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import { Item } from '../../shared/interfaces/Item';
import logger from '../../server/utility/athenaLogger';

alt.on('effect:Teleport', (player: alt.Player, item: Item) => {
    if (!item || !item.data || !item.data.x || !item.data.y || !item.data.z) {
        return;
    }

    playerFuncs.safe.setPosition(player, item.data.x, item.data.y, item.data.z);
    playerFuncs.emit.sound3D(player, 'item_teleport', player);
});
