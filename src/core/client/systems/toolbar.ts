import * as alt from 'alt-client';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { KeybindController } from '../events/keyup';

export const ToolbarController = {
    /**
     * Turn on the keybinds for toolbar switching.
     * @static
     * @memberof ToolbarController
     */
    registerKeybinds() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.TOOLBAR_ONE,
            singlePress: ToolbarController.handleToolbarSwitch,
        });

        KeybindController.registerKeybind({
            key: KEY_BINDS.TOOLBAR_TWO,
            singlePress: ToolbarController.handleToolbarSwitch,
        });

        KeybindController.registerKeybind({
            key: KEY_BINDS.TOOLBAR_THREE,
            singlePress: ToolbarController.handleToolbarSwitch,
        });

        KeybindController.registerKeybind({
            key: KEY_BINDS.TOOLBAR_FOUR,
            singlePress: ToolbarController.handleToolbarSwitch,
        });
    },

    handleToolbarSwitch(key: number) {
        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isActionMenuOpen) {
            return;
        }

        if (alt.Player.local.isNoClipOn) {
            return;
        }

        const slot: number = parseInt(String.fromCharCode(key)) - 1;
        const item = alt.Player.local.meta.toolbar.find((item) => item.slot === slot);

        if (!item) {
            alt.log(`No item in slot`);
            return;
        }

        alt.emitServer(SYSTEM_EVENTS.PLAYER_TOOLBAR_SET, slot);
    },
};

alt.onceServer(SYSTEM_EVENTS.TICKS_START, ToolbarController.registerKeybinds);
