import * as alt from 'alt-client';
import * as native from 'natives';

import { AthenaClient } from '@AthenaClient/api/athena';
import { Item } from '@AthenaShared/interfaces/item';
import { INVENTORY_EVENTS } from '../shared/events';
import { INVENTORY_CONFIG } from '../shared/config';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { onInventoryUpdate } from '@AthenaClient/events/onInventoryUpdate';
import { Page } from '@AthenaClient/systems/page';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced';

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

function getClosestPlayers() {
    const playerList = [...alt.Player.all];
    const validPlayers: Array<{ name: string; id: number }> = [];

    for (let i = 0; i < playerList.length; i++) {
        if (!playerList[i].valid) {
            continue;
        }

        if (playerList[i].id === alt.Player.local.id) {
            continue;
        }

        const id: number = playerList[i].getSyncedMeta(PLAYER_SYNCED_META.IDENTIFICATION_ID) as number;
        const name: string = playerList[i].getSyncedMeta(PLAYER_SYNCED_META.NAME) as string;

        if (typeof id === 'undefined' || typeof name === 'undefined') {
            continue;
        }

        const dist = AthenaClient.utility.distance3D(alt.Player.local.pos, playerList[i].pos);
        if (dist > INVENTORY_CONFIG.MAX_GIVE_DISTANCE) {
            continue;
        }

        validPlayers.push({ name, id });
    }

    AthenaClient.webview.emit(INVENTORY_EVENTS.FROM_CLIENT.SET_CLOSEST_PLAYERS, validPlayers);
}

function init() {
    page = new AthenaClient.webview.page({
        name: INVENTORY_EVENTS.PAGE,
        callbacks: {
            onReady: async () => {
                isOpen = true;
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory, toolbar, totalWeight);
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_WEIGHT_STATE, isWeightEnabled);
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_SIZE, inventorySize);
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_MAX_WEIGHT, maxWeight);
                alt.emitServer(INVENTORY_EVENTS.TO_SERVER.OPEN);

                // Draws a ped clone in-menu; but not currently working during this version of alt:V
                // native.activateFrontendMenu(native.getHashKey('FE_MENU_VERSION_EMPTY_NO_BACKGROUND'), false, -1);
                // const clone = native.clonePed(alt.Player.local.scriptID, false, false, true);
                // await alt.Utils.wait(100);
                // native.freezeEntityPosition(clone, true);
                // native.setMouseCursorVisible(false);
                // native.givePedToPauseMenu(clone, 1);
                // native.setPauseMenuPedLighting(true);
                // native.setPauseMenuPedSleepState(true);
                // native.setPauseMenuActive(false);
                // native.requestScaleformMovie('PAUSE_MP_MENU_PLAYER_MODEL');
                // native.replaceHudColourWithRgba(117, 0, 0, 0, 0);

                AthenaClient.sound.play2D(`@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_open.ogg`, 0.2);
            },
            onClose: () => {
                isOpen = false;

                // native.clearPedInPauseMenu();
                // native.setFrontendActive(false);

                alt.emitServer(INVENTORY_EVENTS.TO_SERVER.CLOSE);
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
                disableControls: 'camera',
                disablePauseMenu: true,
            },
            onClose: {
                hideCursor: true,
                showHud: true,
                showOverlays: true,
                unfocus: true,
                setIsMenuOpenToFalse: true,
                enableControls: true,
                enablePauseMenu: true,
            },
        },
    });

    onInventoryUpdate.add(onUpdate);
    AthenaClient.config.player.callback.add('inventory-size', onInventorySizeChange);
    AthenaClient.config.player.callback.add('inventory-weight-enabled', onInventoryWeightStateChange);
    AthenaClient.config.player.callback.add('inventory-max-weight', onInventoryMaxWeightChange);
    AthenaClient.webview.on(INVENTORY_EVENTS.FROM_WEBVIEW.GET_CLOSEST_PLAYERS, getClosestPlayers);

    alt.onServer(INVENTORY_EVENTS.TO_CLIENT.OPEN, () => {
        page.open();
    });

    alt.onServer(INVENTORY_EVENTS.TO_CLIENT.CLOSE, () => {
        page.close(true);
    });
}

alt.on('disconnect', () => {
    native.clearPedInPauseMenu();
    native.setFrontendActive(false);
});

onTicksStart.add(init);
