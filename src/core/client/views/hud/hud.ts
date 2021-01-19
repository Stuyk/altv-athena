import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Chat } from '../../../shared/enums/views';
import { Command } from '../../../shared/interfaces/Command';
import { disableAllControls } from '../../utility/disableControls';
import { handleFreezePlayer } from '../../utility/freeze';
import { sleep } from '../../utility/sleep';
import './controllers/audioController';
import './controllers/chatController';
import './controllers/helpController';
import './controllers/leaderBoardController';

const url = `http://resource/client/views/hud/html/index.html`;

export class BaseHUD {
    static isOpen: boolean = false;
    static view: alt.WebView;

    static createView() {
        if (!BaseHUD.view) {
            BaseHUD.view = new alt.WebView(url, false);
            BaseHUD.view.isVisible = false;
            BaseHUD.view.on('chat:Send', BaseHUD.handleNewMessage);
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

    static populateCommands(commandList: Array<Partial<Command>>): void {
        handleFreezePlayer(false);

        alt.log(`[Athena] Registered Commands: ${commandList.length}`);
        BaseHUD.view.emit('chat:PopulateCommands', commandList);
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

alt.onServer(SYSTEM_EVENTS.TICKS_START, BaseHUD.createView);
alt.onServer(SYSTEM_EVENTS.POPULATE_COMMANDS, BaseHUD.populateCommands);
