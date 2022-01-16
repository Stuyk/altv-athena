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
import { waitForFalse, waitFor } from '../utility/wait';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const PAGE_NAME = 'Inventory';

let camera;
let camera2;
let lastDroppedItems: Array<DroppedItem> = [];
let drawInterval: number = null;
let isOpen = false;
let isCameraBeingCreated = false;

/**
 * Do Not Export Internal Only
 */
export class InternalFunctions implements ViewModel {
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
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Update`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Use`, InternalFunctions.handleUse);
        view.on(`${PAGE_NAME}:Process`, InternalFunctions.handleProcess);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.on(`${PAGE_NAME}:Split`, InternalFunctions.handleSplit);
        view.on(`${PAGE_NAME}:Pickup`, InternalFunctions.handlePickup);

        WebViewController.openPages([PAGE_NAME]);
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

        if (!isCameraBeingCreated) {
            await InternalFunctions.showPreview();
        }
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
        native.setCamActive(camera, false);
        native.setCamActive(camera2, false);
        native.destroyAllCams(true);
        native.renderScriptCams(false, false, 0, false, false, 0);
        native.setEntityVisible(alt.Player.local.scriptID, true, false);

        camera = null;
        camera2 = null;

        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Update`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Use`, InternalFunctions.handleUse);
        view.off(`${PAGE_NAME}:Process`, InternalFunctions.handleProcess);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.off(`${PAGE_NAME}:Split`, InternalFunctions.handleSplit);
        view.off(`${PAGE_NAME}:Pickup`, InternalFunctions.handlePickup);

        WebViewController.closePages([PAGE_NAME]);
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
        // Default: I
        if (key === KEY_BINDS.INVENTORY && !isOpen) {
            InternalFunctions.open();
            return;
        }

        // Default: I or ESC
        if ((key === KEY_BINDS.INVENTORY || key === 27) && isOpen) {
            InternalFunctions.close();
            return;
        }
    }

    /**
     * Used to rotate the camera and show the player a specific way.
     * @static
     * @return {*}  {Promise<boolean>}
     * @memberof InternalFunctions
     */
    static async showPreview(): Promise<boolean> {
        if (alt.Player.local.vehicle) {
            return true;
        }

        isCameraBeingCreated = true;

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
        alt.setTimeout(() => {
            isCameraBeingCreated = false;
        }, easeTime);
        return true;
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
