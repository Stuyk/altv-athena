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

        BaseHUD.isOpen = true;
        BaseHUD.view.emit('chat:Focus');
        BaseHUD.view.focus();
        alt.Player.local.isChatOpen = true;
        alt.toggleGameControls(false);
        disableAllControls(true);
    }

    static async isViewReady() {
        if (BaseHUD.view && BaseHUD.view.valid) {
            return;
        }

        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!BaseHUD.view && !BaseHUD.view.valid) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 5);
        });
    }

    /**
     * Emit messages to the WebView for chat.
     * @static
     * @param {string} message
     * @return {*}  {void}
     * @memberof HUDController
     */
    static async receive(message: string): Promise<void> {
        await ChatController.isViewReady();
        BaseHUD.view.emit('chat:Append', message);
    }

    /**
     * Sends a chat message up from the WebView to the server chat.ts file.
     * @param {string} message
     */
    static send(message: string): void {
        alt.toggleGameControls(true);
        disableAllControls(false);
        BaseHUD.isOpen = false;
        alt.Player.local.isChatOpen = false;

        if (!message) {
            return;
        }

        alt.emitServer(View_Events_Chat.Send, message);
    }
}

alt.onServer(View_Events_Chat.Append, ChatController.receive);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, ChatController.registerKeybind);
