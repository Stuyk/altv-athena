import * as alt from 'alt-client';
import { AthenaClient } from '@AthenaClient/api/athena';
import { Item, StoredItem } from '@AthenaShared/interfaces/item';
import { INVENTORY_EVENTS } from '../shared/events';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { PLAYER_LOCAL_META } from '@AthenaShared/enums/playerSynced';
import { INVENTORY_CONFIG } from '../shared/config';

let inventory: Array<Item<StoredItem>> = [];
let toolbar: Array<Item<StoredItem>> = [];
let isOpen = false;

function init() {
    new AthenaClient.webview.page({
        name: INVENTORY_EVENTS.PAGE,
        callbacks: {
            onReady: () => {
                isOpen = true;
                AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory, toolbar);
            },
            onClose: () => {
                isOpen = false;
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
}

function processMetaChange(key: string, value: any, oldValue: any): void {
    if (key === PLAYER_LOCAL_META.INVENTORY) {
        inventory = value;
    }

    if (key === PLAYER_LOCAL_META.TOOLBAR) {
        toolbar = value;
    }

    if (!isOpen) {
        return;
    }

    AthenaClient.webview.emit(INVENTORY_EVENTS.TO_WEBVIEW.SET_INVENTORY, inventory, toolbar);
}

AthenaClient.events.onTicksStart.add(init);
alt.on('localMetaChange', processMetaChange);
