import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Chat } from '../../../shared/enums/views';
import { Command } from '../../../shared/interfaces/Command';
import { handleFrontendSound } from '../../systems/sound';
import { disableAllAttacks, disableAllControls } from '../../utility/disableControls';
import { handleFreezePlayer } from '../../utility/freeze';
import { ActionsController } from './controllers/actionsController';

import './controllers/actionsController';
import './controllers/audioController';
import './controllers/chatController';
import './controllers/leaderBoardController';
import { ChatController } from './controllers/chatController';

const url = `http://assets/webview/client/hud/index.html`;

let commandList: Array<any> = [];
let interval: number;
let _serverURL;

alt.onServer(SYSTEM_EVENTS.SET_VIEW_URL, (ip: string) => {
    _serverURL = ip;
});

export class BaseHUD {
    static isOpen: boolean = false;
    static view: alt.WebView;

    static createView() {
        if (!BaseHUD.view) {
            BaseHUD.view = new alt.WebView(url, false);
            BaseHUD.view.isVisible = false;
            BaseHUD.view.on('url', BaseHUD.handleURL);
            BaseHUD.view.on('chat:Send', ChatController.send);
            BaseHUD.view.on('mouse:Focus', BaseHUD.handleFocus);
            BaseHUD.view.on('commands:Update', BaseHUD.updateCommands);
            BaseHUD.view.on('actions:Navigate', ActionsController.navigate);
            BaseHUD.view.on('actions:Close', ActionsController.closed);
            BaseHUD.view.on('actions:LeftRight', ActionsController.leftRight);
            BaseHUD.view.on('actions:Trigger', ActionsController.trigger);
            BaseHUD.view.on('play:Sound', handleFrontendSound);

            alt.setTimeout(() => {
                if (native.isScreenFadedOut()) {
                    native.doScreenFadeIn(2000);
                }
            }, 1000);
        }

        BaseHUD.view.unfocus();
    }

    static handleURL() {
        BaseHUD.view.emit('url', _serverURL);
    }

    static populateCommands(_commandList: Array<Partial<Command>>): void {
        commandList = _commandList;
        handleFreezePlayer(false);
        BaseHUD.updateCommands();
        alt.log(`[Athena] Registered Commands: ${commandList.length}`);
    }

    static updateCommands() {
        if (!BaseHUD.view) {
            return;
        }

        BaseHUD.view.emit('chat:PopulateCommands', commandList);
        BaseHUD.view.isVisible = true;
    }

    static setHudVisibility(value: boolean) {
        if (!BaseHUD.view) {
            return;
        }

        if (!value) {
            BaseHUD.view.isVisible = false;
            native.displayRadar(false);
            return;
        }

        BaseHUD.view.isVisible = true;
        native.displayRadar(true);
        return;
    }

    private static handleFocus(shouldFocus: boolean, focusName: string): void {
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
            interval = alt.setInterval(() => {
                native.disableControlAction(0, 1, true);
                native.disableControlAction(0, 2, true);
                native.disableControlAction(0, 3, true);
                native.disableControlAction(0, 4, true);
                native.disableControlAction(0, 5, true);
                native.disableControlAction(0, 6, true);
                native.disableControlAction(0, 24, true);
                native.disableControlAction(0, 25, true);
                native.disableControlAction(0, 68, true);
                native.disableControlAction(0, 69, true);
                native.disableControlAction(0, 70, true);
                native.disableControlAction(0, 91, true);
                native.disableControlAction(0, 92, true);
                native.disableControlAction(0, 114, true);
                native.disableControlAction(0, 142, true);
            }, 0);

            alt.Player.local[focusName] = true;
            disableAllAttacks(true);
            return;
        }

        if (interval) {
            alt.clearInterval(interval);
        }

        alt.Player.local[focusName] = false;
        BaseHUD.view.unfocus();
        disableAllAttacks(false);
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, BaseHUD.createView);
alt.onServer(SYSTEM_EVENTS.POPULATE_COMMANDS, BaseHUD.populateCommands);
