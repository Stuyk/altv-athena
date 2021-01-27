import * as alt from 'alt-server';
import { ItemType } from '../../shared/enums/itemType';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Item } from '../../shared/interfaces/Item';
import { ToolbarLocale } from '../../shared/locale/toolbar';
import { isFlagEnabled } from '../../shared/utility/flags';
import { playerFuncs } from '../extensions/Player';

export class ToolbarController {
    static handleToolbarChange(player: alt.Player, slot: number): void {
        if (slot <= -1 || slot >= 4) {
            return;
        }

        const item = playerFuncs.inventory.getToolbarItem(player, slot);
        if (!item) {
            playerFuncs.emit.message(player, ToolbarLocale.DOES_NOT_EXIST);
            return;
        }

        if (!isFlagEnabled(item.behavior, ItemType.IS_TOOLBAR)) {
            return;
        }

        // Handle Weapon Switch
        if (isFlagEnabled(item.behavior, ItemType.IS_WEAPON)) {
            ToolbarController.handleWeaponEquip(player, item);
            return;
        }

        // Handle other item switch types
        // No idea what this will be yet.
    }

    static handleWeaponEquip(player: alt.Player, item: Item) {
        player.removeAllWeapons();

        if (!item.data.hash) {
            playerFuncs.emit.message(player, ToolbarLocale.NO_WEAPON_HASH);
            return;
        }

        // Handle first equip
        if (!player.lastToolbarData) {
            player.lastToolbarData = { equipped: true, slot: item.slot };
            player.giveWeapon(item.data.hash, 9999, true);
            playerFuncs.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }

        if (player.lastToolbarData.slot !== item.slot) {
            player.lastToolbarData = { equipped: true, slot: item.slot };
            player.giveWeapon(item.data.hash, 9999, true);
            playerFuncs.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }

        if (!player.lastToolbarData.equipped) {
            player.giveWeapon(item.data.hash, 9999, true);
            player.lastToolbarData.equipped = true;
            playerFuncs.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }

        player.lastToolbarData.equipped = false;
        playerFuncs.emit.sound3D(player, 'item_remove', player);
    }
}

alt.onClient(SYSTEM_EVENTS.PLAYER_TOOLBAR_SET, ToolbarController.handleToolbarChange);
