import * as alt from 'alt-server';
import { Item } from '../../shared/interfaces/Item';
import { playerFuncs } from '../extensions/Player';
import EFFECT from '../../shared/enums/effects';

alt.on(EFFECT.EFFECT_FOOD, handleItemEvent);

function handleItemEvent(player: alt.Player, item: Item, slot: number, tab: number) {
    if (!item || !item.data || !item.data.amount) {
        return;
    }

    playerFuncs.safe.addFood(player, item.data.amount);

    if (item.data.sound) {
        playerFuncs.emit.sound3D(player, item.data.sound, player);
    }
}
