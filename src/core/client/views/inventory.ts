import * as alt from 'alt-client';
import * as native from 'natives';

import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { KEY_BINDS } from '../../shared/enums/KeyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { View_Events_Inventory } from '../../shared/enums/Views';
import { DroppedItem } from '../../shared/interfaces/Item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { distance2d } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { drawMarker } from '../utility/marker';
import { isAnyMenuOpen } from '../utility/menus';
import { Timer } from '../utility/timers';
import { waitForFalse, waitFor } from '../utility/wait';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const PAGE_NAME = 'Inventory';

let camera;
let camera2;
let lastDroppedItems: Array<DroppedItem> = [];
let drawInterval: number = null;

export class InventoryController implements ViewModel {
    /**
     * Register the keybind to the Keybind Controller.
     * Triggers opening the inventory when pressed.
     * @static
     * @memberof InventoryController
     */
    static registerKeybinds() {
        KeybindController.registerKeybind({ key: KEY_BINDS.INVENTORY, singlePress: InventoryController.open });
    }

    /**
     * Used to open the Inventory.
     * Checks if any other menus are open.
     * @static
     * @return {*}
     * @memberof InventoryController
     */
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Update`, InventoryController.ready);
        view.on(`${PAGE_NAME}:Use`, InventoryController.handleUse);
        view.on(`${PAGE_NAME}:Process`, InventoryController.handleProcess);
        view.on(`${PAGE_NAME}:Close`, InventoryController.close);
        view.on(`${PAGE_NAME}:Split`, InventoryController.handleSplit);
        view.on(`${PAGE_NAME}:Pickup`, InventoryController.handlePickup);
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        WebViewController.setOverlaysVisible(false);

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

        InventoryController.processClosestGroundItems();
        const didRenderCamera = await InventoryController.showPreview();
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:DisablePreview`, !didRenderCamera ? true : false);
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
        native.renderScriptCams(false, false, 255, true, false, 0);
        native.setCamActive(camera, false);
        native.setCamActive(camera2, false);
        native.destroyAllCams(true);
        native.setEntityVisible(alt.Player.local.scriptID, true, false);

        camera = null;
        camera2 = null;

        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Update`, InventoryController.ready);
        view.off(`${PAGE_NAME}:Use`, InventoryController.handleUse);
        view.off(`${PAGE_NAME}:Process`, InventoryController.handleProcess);
        view.off(`${PAGE_NAME}:Close`, InventoryController.close);
        view.off(`${PAGE_NAME}:Split`, InventoryController.handleSplit);
        view.off(`${PAGE_NAME}:Pickup`, InventoryController.handlePickup);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
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
            drawInterval = Timer.createInterval(InventoryController.drawItemMarkers, 0, `${PAGE_NAME}.ts`);
        }

        alt.setTimeout(InventoryController.processClosestGroundItems, 0);
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
     * @memberof InventoryController
     */
    static async addInventoryNotification(value: string) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:AddNotification`, value);
    }

    static async showPreview(): Promise<boolean> {
        if (alt.Player.local.vehicle) {
            return false;
        }

        await waitForFalse(native.isPedWalking, alt.Player.local.scriptID);
        await waitForFalse(native.isPedRunning, alt.Player.local.scriptID);
        await waitFor(native.isPedStill, alt.Player.local.scriptID);

        const gamePlayCamRot = native.getGameplayCamRot(0);
        const gamePlayCamPos = native.getGameplayCamCoord();
        const fov = 80;
        const fwd = native.getEntityForwardVector(alt.Player.local.scriptID);
        const pos = { ...alt.Player.local.pos };
        const fwdPos = {
            x: pos.x + fwd.x * 1.75,
            y: pos.y + fwd.y * 1.75,
            z: pos.z + 0.2,
        };

        camera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            gamePlayCamPos.x,
            gamePlayCamPos.y,
            gamePlayCamPos.z,
            0,
            0,
            0,
            fov,
            false,
            0,
        );
        native.setCamRot(camera, gamePlayCamRot.x, gamePlayCamRot.y, gamePlayCamRot.z, 0);

        camera2 = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            fwdPos.x,
            fwdPos.y,
            fwdPos.z,
            0,
            0,
            0,
            fov,
            false,
            0,
        );

        const easeTime = 750;
        native.setEntityVisible(alt.Player.local.scriptID, false, false);
        native.pointCamAtEntity(camera2, alt.Player.local.scriptID, 0, 0, 0, false);
        native.setCamActiveWithInterp(camera2, camera, 500, 1, 1);

        alt.setTimeout(() => {
            native.setEntityVisible(alt.Player.local.scriptID, true, false);
        }, easeTime / 3);

        native.renderScriptCams(true, true, 0, true, false, 0);
        return true;
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InventoryController.processMetaChange);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEMS, InventoryController.updateGroundItems);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_NOTIFICATION, InventoryController.addInventoryNotification);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InventoryController.registerKeybinds);

const keyFunctions = {
    inventory: InventoryController.updateInventory,
    toolbar: InventoryController.updateToolbar,
    equipment: InventoryController.updateEquipment,
};
