import * as alt from 'alt-server';
import { Item } from 'core/shared/interfaces/Item';
import { playerFuncs } from '../extensions/Player';

alt.on('effect:Heal', handleItemEvent);

function handleItemEvent(player: alt.Player, item: Item, slot: number, tab: number) {
    if (!item || !item.data || !item.data.heal) {
        console.log('Failed to use heal effect on item.');
        return;
    }

    playerFuncs.safe.addHealth(player, item.data.heal, false);

    if (item.data.sound) {
        playerFuncs.emit.sound3D(player, item.data.sound, player);
    }
}
