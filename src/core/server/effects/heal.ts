import * as alt from 'alt-server';
import { Item } from '../../shared/interfaces/item';
import EFFECT from '../../shared/enums/effects';
import { INVENTORY_TYPE } from '../../shared/enums/inventoryTypes';
import { ItemEffects } from '../systems/itemEffects';
import { Athena } from '../api/athena';

function handleItemEvent(player: alt.Player, item: Item, slot: number, type: INVENTORY_TYPE | string) {
    if (!item || !item.data || !item.data.amount) {
        return;
    }

    Athena.player.safe.addHealth(player, item.data.amount, false);
    Athena.player.inventory.notify(player, `+${item.data.amount} Health`);

    if (item.data.sound) {
        Athena.player.emit.sound3D(player, item.data.sound, player);
    }
}

ItemEffects.add(EFFECT.EFFECT_HEAL, handleItemEvent);
