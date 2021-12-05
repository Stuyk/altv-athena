import * as alt from 'alt-client';
import { KEY_BINDS } from '../../shared/enums/KeyBinds';

import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { KeybindController } from '../events/keyup';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { disableAllControls } from '../utility/disableControls';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

const PAGE_NAME = 'Chat';

class ChatView implements ViewModel {
    /**
     * Register the keybind to toggle the leaderboard.
     * @static
     * @memberof ChatController
     */
    static registerKeybind() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.CHAT,
            singlePress: ChatView.focus,
        });
    }

    static async focus() {
        if (alt.isConsoleOpen()) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Focus`);

        alt.Player.local.isChatOpen = true;
        alt.toggleGameControls(false);
        disableAllControls(true);
    }

    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, ChatView.ready);
        view.on(`${PAGE_NAME}:Close`, ChatView.close);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);

        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, ChatView.ready);
        view.off(`${PAGE_NAME}:Close`, ChatView.close);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_ATM));
    }
}
