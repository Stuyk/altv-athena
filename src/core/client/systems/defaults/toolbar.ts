import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { Item } from '@AthenaShared/interfaces/item.js';

const DELAY_TIME = 1000;
const KeyBinds = {
    49: 0,
    50: 1,
    51: 2,
    52: 3,
    53: 4,
};

let toolbar: Array<Item> = [];
let debounce = Date.now();
let enabled = true;
let interval: number;
let lastKey: number;

const Internal = {
    init() {
        if (!enabled) {
            return;
        }

        alt.on('keyup', Internal.handleKeyPress);
    },
    handleChanges(_inventory: Array<Item>, _toolbar: Array<Item>) {
        if (!enabled) {
            return;
        }

        toolbar = _toolbar;
    },
    drawCooldown() {
        if (Date.now() > debounce) {
            alt.clearInterval(interval);
            interval = undefined;
            alt.emitServer(SYSTEM_EVENTS.PLAYER_TOOLBAR_INVOKE, lastKey);
            return;
        }

        if (!enabled) {
            return;
        }

        const timeLeft = ((debounce - Date.now()) / 1000).toFixed(2);
        const offsetPos = native.getOffsetFromEntityInWorldCoords(alt.Player.local.scriptID, 0.5, 0, 0.2);
        AthenaClient.screen.text.drawText3D(`${timeLeft}s`, offsetPos, 0.5, new alt.RGBA(255, 255, 255, 150));
    },
    handleKeyPress(key: number) {
        if (!enabled) {
            return;
        }

        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        if (typeof KeyBinds[key] === 'undefined') {
            return;
        }

        if (Date.now() < debounce) {
            if (typeof interval === 'undefined') {
                interval = alt.setInterval(Internal.drawCooldown, 0);
            }

            AthenaClient.systems.sound.play2d('error', 0.2);
            return;
        }

        if (typeof interval !== 'undefined') {
            alt.clearInterval(interval);
        }

        debounce = Date.now() + DELAY_TIME;
        const index = toolbar.findIndex((x) => x.slot === KeyBinds[key]);
        if (index <= -1) {
            return;
        }

        if (typeof interval === 'undefined') {
            interval = alt.setInterval(Internal.drawCooldown, 0);
        }

        lastKey = KeyBinds[key];
    },
};

export const ToolbarSystem = {
    disable() {
        enabled = false;
    },
};

alt.onServer(SYSTEM_EVENTS.PLAYER_TOOLBAR_ENABLE, Internal.init);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_SYNC, Internal.handleChanges);
