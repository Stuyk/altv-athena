import * as alt from 'alt-client';
import { View_Events_Chat } from '../../../../shared/enums/views';
import { disableAllControls } from '../../../utility/disableControls';
import { BaseHUD } from '../hud';

export class ChatController {
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
