import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { INVENTORY_TYPE } from '../../shared/enums/inventoryTypes';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Item } from '../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { isFlagEnabled } from '../../shared/utility/flags';
import { Athena } from '../api/athena';
import { Injections } from './injections';
import { PlayerInjectionNames, WeaponChangeCallback } from './injections/player';
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
            ToolbarController.handleWeaponEquip(player, slot, item);
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

    static async runWeaponInjections(player: alt.Player, slot: number, item: Item, isEquip = true) {
        const startInjections = Injections.get<WeaponChangeCallback>(
            isEquip ? PlayerInjectionNames.WEAPON_EQUIP : PlayerInjectionNames.WEAPON_UNEQUIP,
        );
        for (const callback of startInjections) {
            await callback(player, slot, item);
        }
    }

    /**
     * When the player equips a weapon, the function will remove all weapons from the player and
     * then give them the weapon that was just equipped.
     * @param {alt.Player} player - The player who is using the item.
     * @param {Item} item - The item that was selected.
     * @returns The function that handles the weapon equip.
     */
    static async handleWeaponEquip(player: alt.Player, slot: number, item: Item) {
        player.removeAllWeapons();

        if (!item.data.hash) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.WEAPON_NO_HASH));
            return;
        }

        const equipTest = player.lastToolbarData ? player.lastToolbarData.equipped : false;
        const sameWeaponSlotTest = player.lastToolbarData ? !(player.lastToolbarData.slot !== item.slot) : false;

        // Handle first equip
        if (!player.lastToolbarData || !sameWeaponSlotTest || !equipTest) {
            if (!player.lastToolbarData) {
                player.lastToolbarData = { equipped: true, slot: item.slot };
            }

            player.giveWeapon(item.data.hash, 0, true);
            await ToolbarController.runWeaponInjections(player, slot, item, true);
            Athena.player.emit.sound3D(player, 'item_equip', player);
            Athena.events.player.trigger(ATHENA_EVENTS_PLAYER.EQUIPPED_WEAPON, player, slot, item);
            player.lastToolbarData.slot = item.slot;
            player.lastToolbarData.equipped = true;
            return;
        }

        player.lastToolbarData.equipped = false;
        Athena.events.player.trigger(ATHENA_EVENTS_PLAYER.UNEQUIPPED_WEAPON, player, slot, item);
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

            Athena.state.set(player, 'toolbar', player.data.toolbar, true);
            Athena.player.sync.inventory(player);
        }

        if (item.data && item.data.event) {
            ItemEffects.invoke(player, item, INVENTORY_TYPE.TOOLBAR);
            Athena.player.emit.sound2D(player, 'item_use', Math.random() * 0.45 + 0.1);
        }
    }
}

alt.onClient(SYSTEM_EVENTS.PLAYER_TOOLBAR_SET, ToolbarController.handleToolbarChange);
