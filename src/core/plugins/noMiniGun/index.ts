import { InventoryController } from '../../server/views/inventory';
import { Item } from '../../shared/interfaces/Item';
import * as alt from 'alt-server';
import { isFlagEnabled } from '../../shared/utility/flags';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { Permissions } from '../../shared/flags/permissions';

InventoryController.addItemRuleCheck(handleNoMinigun);
InventoryController.addItemRuleCheck(handleNoMinigunDrop);

function handleNoMinigun(
    player: alt.Player,
    item: Item,
    endSlotName: string | null,
    endSlotIndex: number | null,
    tab: number | null
) {
    if (!isFlagEnabled(item.behavior, ITEM_TYPE.IS_WEAPON)) {
        return true;
    }

    if (!item.name.toLowerCase().includes('minigun')) {
        return true;
    }

    if (!endSlotName || !endSlotName.includes('toolbar')) {
        return true;
    }

    console.log(`${player.data.name} - Hit custom rule for minigun. Denied move.`);
    return false;
}

function handleNoMinigunDrop(
    player: alt.Player,
    item: Item,
    endSlotName: string | null,
    endSlotIndex: number | null,
    tab: number | null
) {
    if (!isFlagEnabled(item.behavior, ITEM_TYPE.IS_WEAPON)) {
        return true;
    }

    if (!item.name.toLowerCase().includes('minigun')) {
        return true;
    }

    if (!endSlotName.includes('ground')) {
        return true;
    }

    if (isFlagEnabled(player.accountData.permissionLevel, Permissions.Admin)) {
        return true;
    }

    console.log(`${player.data.name} - Hit custom rule for minigun. Denied drop.`);
    return false;
}
