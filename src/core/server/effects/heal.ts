import * as alt from 'alt-server';
import { Item } from '@AthenaShared/interfaces/item';
import EFFECT from '@AthenaShared/enums/effects';
import { INVENTORY_TYPE } from '@AthenaShared/enums/inventoryTypes';
import { ItemEffects } from '@AthenaServer/systems/itemEffects';
import { Athena } from '@AthenaServer/api/athena';

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
