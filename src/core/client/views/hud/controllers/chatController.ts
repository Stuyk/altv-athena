import * as alt from 'alt-client';
import { KEY_BINDS } from '../../../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { View_Events_Chat } from '../../../../shared/enums/views';
import { KeybindController } from '../../../events/keyup';
import { disableAllControls } from '../../../utility/disableControls';
import { BaseHUD } from '../hud';

export class ChatController {
    /**
     * Register the keybind to toggle the leaderboard.
     * @static
     * @memberof ChatController
     */
    static registerKeybind() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.CHAT,
            singlePress: ChatController.focusChat
        });
    }

    static focusChat(): void {
        if (alt.isConsoleOpen()) {
            return;
        }

        if (!BaseHUD.view) {
            return;
        }

        if (BaseHUD.isOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isActionMenuOpen) {
            return;
        }

        if (alt.Player.local.isPhoneOpen) {
            return;
        }

        BaseHUD.isOpen = true;
        BaseHUD.view.emit('chat:Focus');
        alt.Player.local.isChatOpen = true;
        alt.toggleGameControls(false);
        disableAllControls(true);
    }

    /**
     * Emit messages to the WebView for chat.
     * @static
     * @param {string} message
     * @return {*}  {void}
     * @memberof HUDController
     */
    static appendMessage(message: string): void {
        if (!BaseHUD.view) {
            return;
        }

        BaseHUD.view.emit('chat:Append', message);
    }
}

alt.onServer(View_Events_Chat.Append, ChatController.appendMessage);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, ChatController.registerKeybind);
