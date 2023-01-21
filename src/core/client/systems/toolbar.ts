import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Item } from '@AthenaShared/interfaces/item';
import { AthenaClient } from '@AthenaClient/api/athena';

const DEBOUNCE_TIME = 100;
const KeyBinds = {
    49: 0,
    50: 1,
    51: 2,
    52: 3,
    53: 4,
};

let toolbar: Array<Item> = [];
let debounce = Date.now();

const Internal = {
    init() {
        alt.on('keyup', Internal.handleKeyPress);
    },
    handleChanges(_inventory: Array<Item>, _toolbar: Array<Item>) {
        toolbar = _toolbar;
    },
    handleKeyPress(key: number) {
        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        if (typeof KeyBinds[key] === 'undefined') {
            return;
        }

        if (Date.now() < debounce) {
            return;
        }

        debounce = Date.now() + DEBOUNCE_TIME;
        const index = toolbar.findIndex((x) => x.slot === KeyBinds[key]);
        if (index <= -1) {
            return;
        }

        alt.emitServer(SYSTEM_EVENTS.PLAYER_TOOLBAR_INVOKE, KeyBinds[key]);
    },
};

alt.onServer(SYSTEM_EVENTS.PLAYER_TOOLBAR_ENABLE, Internal.init);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_SYNC, Internal.handleChanges);
