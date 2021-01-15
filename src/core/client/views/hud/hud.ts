import * as alt from 'alt-client';
import * as native from 'natives';
import { commandList } from '../../../shared/commands/commandList';
import { Events_Misc } from '../../../shared/enums/events';
import { View_Events_Chat } from '../../../shared/enums/views';
import { disableAllControls } from '../../utility/disableControls';
import { handleFreezePlayer } from '../../utility/freeze';
import { sleep } from '../../utility/sleep';
import { switchInPlayer } from '../../utility/switch';
import './controllers/audioController';
import './controllers/chatController';
import './controllers/helpController';
import './controllers/leaderBoardController';

const url = `http://resource/client/views/hud/html/index.html`;

export class BaseHUD {
    static isOpen: boolean = false;
    static view: alt.WebView;

    static handleView() {
        if (!BaseHUD.view) {
            BaseHUD.view = new alt.WebView(url, false);
            BaseHUD.view.isVisible = false;
            BaseHUD.view.on('chat:Send', BaseHUD.handleNewMessage);
            BaseHUD.view.on('chat:Inject', BaseHUD.handleInject);
            BaseHUD.view.on('mouse:Focus', BaseHUD.handleFocus);

            alt.setTimeout(() => {
                if (native.isScreenFadedOut()) {
                    native.doScreenFadeIn(2000);
                }
            }, 1000);
        }

        BaseHUD.view.unfocus();
    }

    /**
     * Sends a chat message up from the WebView to the server chat.ts file.
     * @param {string} message
     */
    private static handleNewMessage(message: string): void {
        alt.toggleGameControls(true);
        disableAllControls(false);
        BaseHUD.isOpen = false;
        alt.Player.local.isChatOpen = false;

        // Handles Empty Messages
        if (!message) {
            return;
        }

        alt.emitServer(View_Events_Chat.Send, message);
    }

    private static async handleInject() {
        const myCommands = commandList.filter(
            (cmd) => cmd.permission === 0 || (alt.Player.local.meta.permissionLevel & cmd.permission) !== 0
        );

        await sleep(1500);
        handleFreezePlayer(false);

        BaseHUD.view.emit('chat:Inject', myCommands);
        BaseHUD.view.isVisible = true;
    }

    private static handleFocus(shouldFocus: boolean): void {
        if (alt.isConsoleOpen()) {
            return;
        }

        try {
            alt.showCursor(shouldFocus);
        } catch (err) {
            return;
        }

        if (shouldFocus) {
            BaseHUD.view.focus();
            return;
        }

        BaseHUD.view.unfocus();
    }
}

alt.onServer(Events_Misc.StartTicks, BaseHUD.handleView);
