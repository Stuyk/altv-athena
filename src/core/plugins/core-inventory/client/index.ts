import * as alt from 'alt-client';
import * as native from 'natives';

import * as AthenaClient from '@AthenaClient/api/index.js';
import { Item } from '@AthenaShared/interfaces/item.js';
import { INVENTORY_EVENTS } from '../shared/events.js';
import { INVENTORY_CONFIG } from '../shared/config.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';
import { onInventoryUpdate } from '@AthenaClient/events/onInventoryUpdate.js';
import { Page } from '@AthenaClient/webview/page.js';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced.js';

let page: Page;

let inventory: Array<Item> = [];
let toolbar: Array<Item> = [];
let totalWeight: number;
let isWeightEnabled = false;
let inventorySize = 30;
let maxWeight = 64;
let isOpen = false;
let ped: number;
let previousHudColor: alt.RGBA;

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

        const dist = AthenaClient.utility.vector.distance(alt.Player.local.pos, playerList[i].pos);
        if (dist > INVENTORY_CONFIG.MAX_GIVE_DISTANCE) {
            continue;
        }

        validPlayers.push({ name, id });
    }

    AthenaClient.webview.emit(INVENTORY_EVENTS.FROM_CLIENT.SET_CLOSEST_PLAYERS, validPlayers);
}

function init() {
    page = new AthenaClient.webview.Page({
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
                // Will be available in next build...
                // native.activateFrontendMenu(native.getHashKey('FE_MENU_VERSION_EMPTY_NO_BACKGROUND'), false, -1);
                // ped = native.clonePed(alt.Player.local.scriptID, false, false, true);
                // native.setEntityCoordsNoOffset(
                //     ped,
                //     alt.Player.local.pos.x,
                //     alt.Player.local.pos.y,
                //     alt.Player.local.pos.z - 100,
                //     false,
                //     false,
                //     false,
                // );
                // await alt.Utils.wait(300);
                // native.requestScaleformMovie('PAUSE_MP_MENU_PLAYER_MODEL');
                // native.freezeEntityPosition(ped, true);
                // native.setMouseCursorVisible(false);
                // native.givePedToPauseMenu(ped, 0);
                // native.setPauseMenuPedLighting(true);
                // native.setPauseMenuPedSleepState(true);

                // const [_, r, g, b, a] = native.getHudColour(177);
                // previousHudColor = new alt.RGBA(r, g, b, a);
                // native.replaceHudColourWithRgba(117, 0, 0, 0, 0);

                AthenaClient.systems.sound.play2d(
                    `@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_open.ogg`,
                    0.2,
                );
            },
            onClose: () => {
                isOpen = false;

                native.clearPedInPauseMenu();
                native.setFrontendActive(false);

                if (typeof ped !== 'undefined') {
                    native.deleteEntity(ped);
                    ped = undefined;
                }

                if (previousHudColor) {
                    native.replaceHudColourWithRgba(
                        117,
                        previousHudColor.r,
                        previousHudColor.g,
                        previousHudColor.b,
                        previousHudColor.a,
                    );
                }

                alt.emitServer(INVENTORY_EVENTS.TO_SERVER.CLOSE);
                AthenaClient.systems.sound.play2d(
                    `@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_close.ogg`,
                    0.2,
                );
            },
        },
        keybind: {
            key: INVENTORY_CONFIG.KEYBIND,
            useSameKeyToClose: true,
            description: 'Inventory',
            identifier: 'inventory-toggle-menu',
            allowInSpecificPage: INVENTORY_EVENTS.PAGE,
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
    AthenaClient.systems.playerConfig.addCallback('inventory-size', onInventorySizeChange);
    AthenaClient.systems.playerConfig.addCallback('inventory-weight-enabled', onInventoryWeightStateChange);
    AthenaClient.systems.playerConfig.addCallback('inventory-max-weight', onInventoryMaxWeightChange);
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
