import * as alt from 'alt-client';

import { AthenaClient } from '@AthenaClient/api/athena';
import { Item } from '@AthenaShared/interfaces/item';
import { INVENTORY_EVENTS } from '../shared/events';
import { INVENTORY_CONFIG } from '../shared/config';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { onInventoryUpdate } from '@AthenaClient/events/onInventoryUpdate';
import { Page } from '@AthenaClient/systems/page';

let page: Page;

let inventory: Array<Item> = [];
let toolbar: Array<Item> = [];
let totalWeight: number;
let isWeightEnabled = false;
let inventorySize = 30;
let maxWeight = 64;
let isOpen = false;

function onUpdate(_inventory: Array<Item>, _toolbar: Array<Item>, _totalWeight: number) {
    inventory = _inventory;
    toolbar = _toolbar;
    totalWeight = _totalWeight;

    if (!isOpen) {
        return;
    }

    AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory, toolbar, totalWeight);
}

function onInventorySizeChange(value: number) {
    inventorySize = value;

    if (!isOpen) {
        return;
    }

    AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_SIZE, inventorySize);
}

function onInventoryWeightStateChange(value: boolean) {
    isWeightEnabled = value;

    if (!isOpen) {
        return;
    }

    AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_WEIGHT_STATE, isWeightEnabled);
}

function onInventoryMaxWeightChange(value: number) {
    maxWeight = value;

    if (!isOpen) {
        return;
    }

    AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_MAX_WEIGHT, maxWeight);
}

function init() {
    page = new AthenaClient.webview.page({
        name: INVENTORY_EVENTS.PAGE,
        callbacks: {
            onReady: () => {
                isOpen = true;
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory, toolbar, totalWeight);
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_WEIGHT_STATE, isWeightEnabled);
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_SIZE, inventorySize);
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_MAX_WEIGHT, maxWeight);
                alt.emitServer(INVENTORY_EVENTS.TO_SERVER.OPEN);

                AthenaClient.sound.play2D(`@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_open.ogg`, 0.2);
            },
            onClose: () => {
                isOpen = false;
                AthenaClient.sound.play2D(`@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_close.ogg`, 0.2);
            },
        },
        keybind: {
            key: INVENTORY_CONFIG.KEYBIND,
            isLongPress: false,
            useSameKeyToClose: true,
        },
        options: {
            onOpen: {
                focus: true,
                hideHud: true,
                hideOverlays: true,
                setIsMenuOpenToTrue: true,
                showCursor: true,
                disableControls: true,
            },
            onClose: {
                hideCursor: true,
                showHud: true,
                showOverlays: true,
                unfocus: true,
                setIsMenuOpenToFalse: true,
                enableControls: true,
            },
        },
    });

    onInventoryUpdate.add(onUpdate);
    AthenaClient.config.player.callback.add('inventory-size', onInventorySizeChange);
    AthenaClient.config.player.callback.add('inventory-weight-enabled', onInventoryWeightStateChange);
    AthenaClient.config.player.callback.add('inventory-max-weight', onInventoryMaxWeightChange);

    alt.onServer(INVENTORY_EVENTS.TO_CLIENT.OPEN, () => {
        page.open();
    });

    alt.onServer(INVENTORY_EVENTS.TO_CLIENT.CLOSE, () => {
        page.close(true);
    });
}

onTicksStart.add(init);
