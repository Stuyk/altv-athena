import * as alt from 'alt-server';
import { INVENTORY_TYPE } from '../../shared/enums/inventoryTypes';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Item } from '../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { isFlagEnabled } from '../../shared/utility/flags';
import { Athena } from '../api/athena';
import { ItemEffects } from './itemEffects';

export class ToolbarController {
    /**
     * This function is called when the player changes the item in their toolbar.
     * @param {alt.Player} player - alt.Player - The player who is using the item.
     * @param {number} slot - The slot number of the item in the toolbar.
     * @returns The item that was equipped.
     */
    static handleToolbarChange(player: alt.Player, slot: number): void {
        if (slot <= -1 || slot >= 4) {
            return;
        }

        const item = Athena.player.inventory.getToolbarItem(player, slot);
        if (!item) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_NOT_EQUIPPED));
            return;
        }

        if (!isFlagEnabled(item.behavior, ITEM_TYPE.IS_TOOLBAR)) {
            return;
        }

        // Handle Weapon Switch
        if (isFlagEnabled(item.behavior, ITEM_TYPE.IS_WEAPON)) {
            ToolbarController.handleWeaponEquip(player, item);
            return;
        }

        // Handle Consume Item from Toolbar
        if (isFlagEnabled(item.behavior, ITEM_TYPE.CONSUMABLE)) {
            ToolbarController.handleToolbarUse(player, item, slot);
            return;
        }

        // Handle other item switch types
        // No idea what this will be yet.
    }

    /**
     * When the player equips a weapon, the function will remove all weapons from the player and
     * then give them the weapon that was just equipped.
     * @param {alt.Player} player - The player who is using the item.
     * @param {Item} item - The item that was selected.
     * @returns The function that handles the weapon equip.
     */
    static handleWeaponEquip(player: alt.Player, item: Item) {
        player.removeAllWeapons();

        if (!item.data.hash) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.WEAPON_NO_HASH));
            return;
        }

        // Handle first equip
        if (!player.lastToolbarData) {
            player.lastToolbarData = { equipped: true, slot: item.slot };
            player.giveWeapon(item.data.hash, 9999, true);
            Athena.player.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }

        if (player.lastToolbarData.slot !== item.slot) {
            player.lastToolbarData = { equipped: true, slot: item.slot };
            player.giveWeapon(item.data.hash, 9999, true);
            Athena.player.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }

        if (!player.lastToolbarData.equipped) {
            player.giveWeapon(item.data.hash, 9999, true);
            player.lastToolbarData.equipped = true;
            Athena.player.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }

        player.lastToolbarData.equipped = false;
        Athena.player.emit.sound3D(player, 'item_remove', player);
    }

    /**
     * If the item is not consumable, remove one from the quantity and if the quantity is now 0,
     * remove the item from the toolbar. If the item has a data.event, emit it.
     * @param {alt.Player} player - The player who used the item.
     * @param {Item} item - The item that was used.
     * @returns None
     */
    static handleToolbarUse(player: alt.Player, item: Item, slot: number) {
        if (!isFlagEnabled(item.behavior, ITEM_TYPE.SKIP_CONSUMABLE)) {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                Athena.player.inventory.toolbarRemove(player, item.slot);
            } else {
                Athena.player.inventory.replaceToolbarItem(player, item);
            }

            Athena.player.sync.inventory(player);
            Athena.player.save.field(player, 'toolbar', player.data.toolbar);
        }

        if (item.data && item.data.event) {
            ItemEffects.invoke(player, item, INVENTORY_TYPE.TOOLBAR);
            Athena.player.emit.sound2D(player, 'item_use', Math.random() * 0.45 + 0.1);
        }
    }
}

alt.onClient(SYSTEM_EVENTS.PLAYER_TOOLBAR_SET, ToolbarController.handleToolbarChange);
