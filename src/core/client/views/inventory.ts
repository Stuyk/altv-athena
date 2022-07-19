import * as alt from 'alt-client';
import * as native from 'natives';

import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Inventory } from '../../shared/enums/views';
import { DroppedItem } from '../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { distance2d } from '../../shared/utility/vector';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';
import { drawMarker } from '../utility/marker';
import { isAnyMenuOpen } from '../utility/menus';
import { Timer } from '../utility/timers';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const PAGE_NAME = 'Inventory';

let lastDroppedItems: Array<DroppedItem> = [];
let drawInterval: number = null;
let isOpen = false;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    /**
     * Initialize key listeners.
     * @static
     * @memberof InternalFunctions
     */
    static init() {
        alt.on('keyup', InternalFunctions.keyUp);
    }

    /**
     * Used to open the Inventory.
     * Checks if any other menus are open.
     * @static
     * @return {*}
     * @memberof InternalFunctions
     */
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        isOpen = true;
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Update`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Use`, InternalFunctions.handleUse);
        view.on(`${PAGE_NAME}:Process`, InternalFunctions.handleProcess);
        view.on(`${PAGE_NAME}:Split`, InternalFunctions.handleSplit);
        view.on(`${PAGE_NAME}:Pickup`, InternalFunctions.handlePickup);

        WebViewController.openPages(PAGE_NAME, true, InternalFunctions.close);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static handleProcess(selectedSlot, endSlot, page, hash): void {
        alt.emitServer(View_Events_Inventory.Process, selectedSlot, endSlot, page, hash);
    }

    static handlePickup(hash: string) {
        alt.emitServer(View_Events_Inventory.Pickup, hash);
    }

    static async ready(): Promise<void> {
        Object.keys(keyFunctions).forEach((key) => {
            keyFunctions[key]();
        });

        InternalFunctions.processClosestGroundItems();

        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:DisablePreview`, alt.Player.local.vehicle ? true : false);
        view.emit(`${PAGE_NAME}:SetLocales`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_INVENTORY));
    }

    static async updateInventory() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Inventory`, alt.Player.local.meta.inventory);
    }

    static async updateEquipment() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Equipment`, alt.Player.local.meta.equipment);
    }

    static async updateToolbar() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Toolbar`, alt.Player.local.meta.toolbar);
    }

    static handleUse(selectedSlot: string, tab: number): void {
        alt.emitServer(View_Events_Inventory.Use, selectedSlot, tab);
    }

    static handleSplit(selectedSlot: string, amount: number): void {
        alt.emitServer(View_Events_Inventory.Split, selectedSlot, amount);
    }

    static async close() {
        native.clearFocus();
        native.setEntityVisible(alt.Player.local.scriptID, true, false);

        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Update`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Use`, InternalFunctions.handleUse);
        view.off(`${PAGE_NAME}:Process`, InternalFunctions.handleProcess);
        view.off(`${PAGE_NAME}:Split`, InternalFunctions.handleSplit);
        view.off(`${PAGE_NAME}:Pickup`, InternalFunctions.handlePickup);

        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
        isOpen = false;
    }

    static processMetaChange(key: string, value: any, oldValue: any): void {
        // Weed out the keys we don`t care about.
        if (!validKeys.includes(key)) {
            return;
        }

        if (!keyFunctions[key]) {
            return;
        }

        keyFunctions[key]();
    }

    static updateGroundItems(items: Array<DroppedItem>) {
        lastDroppedItems = items;

        if (drawInterval) {
            Timer.clearInterval(drawInterval);
            drawInterval = null;
        }

        if (lastDroppedItems.length >= 1) {
            drawInterval = Timer.createInterval(InternalFunctions.drawItemMarkers, 0, `${PAGE_NAME}.ts`);
        }

        alt.setTimeout(InternalFunctions.processClosestGroundItems, 0);
    }

    static async processClosestGroundItems() {
        let itemsNearPlayer = lastDroppedItems.filter(
            (item) => distance2d(item.position, alt.Player.local.pos) <= SHARED_CONFIG.MAX_PICKUP_RANGE,
        );

        if (alt.Player.local.vehicle) {
            itemsNearPlayer = [];
        }

        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Ground`, itemsNearPlayer);
    }

    static drawItemMarkers() {
        for (let i = 0; i < lastDroppedItems.length; i++) {
            const groundItem = lastDroppedItems[i];
            const newPosition = {
                x: groundItem.position.x,
                y: groundItem.position.y,
                z: groundItem.position.z - 0.98,
            };

            drawMarker(
                28,
                newPosition as alt.Vector3,
                new alt.Vector3(0.25, 0.25, 0.25),
                new alt.RGBA(0, 181, 204, 200),
            );
        }
    }

    /**
     * Adds an in-menu notification only when the menu is open.
     * Does not work for normal notifications.
     * @static
     * @param {string} value
     * @memberof InternalFunctions
     */
    static async addInventoryNotification(value: string) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:AddNotification`, value);
    }

    /**
     * Used to listen for events that pertain to this specific view.
     * @static
     * @param {number} key
     * @return {*}
     * @memberof InternalFunctions
     */
    static async keyUp(key: number) {
        if (alt.isConsoleOpen()) {
            return;
        }

        // Default: I
        if (key === KEY_BINDS.INVENTORY && !isOpen) {
            InternalFunctions.open();
            return;
        }
    }
}

export class ClientInventoryView {
    static close() {
        if (!isOpen) {
            return;
        }

        InternalFunctions.close();
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InternalFunctions.processMetaChange);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEMS, InternalFunctions.updateGroundItems);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_NOTIFICATION, InternalFunctions.addInventoryNotification);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.init);

const keyFunctions = {
    inventory: InternalFunctions.updateInventory,
    toolbar: InternalFunctions.updateToolbar,
    equipment: InternalFunctions.updateEquipment,
};
