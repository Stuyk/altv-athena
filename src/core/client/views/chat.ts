import * as alt from 'alt-client';
import * as native from 'natives';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Chat } from '../../shared/enums/views';
import { Command } from '../../shared/interfaces/command';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';
import { disableAllControls } from '../utility/disableControls';

const PAGE_NAME = 'Chat';
let messages: Array<IMessage> = [];
let commands: Array<Partial<Command>> = [];
let history: Array<string> = [];
let isReady = false;
let isDisabled = false;
let hasRegistered = false;

interface IMessage {
    message: string;
    timestamp: string;
}

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async setVisible(value: boolean) {
        isDisabled = !value;

        if (!isDisabled) {
            alt.on('keyup', InternalFunctions.keyDown);
            return;
        }

        alt.off('keyup', InternalFunctions.keyDown);
    }

    static async open() {
        const view = await WebViewController.get();

        alt.on('keyup', InternalFunctions.keyDown);

        if (!hasRegistered) {
            WebViewController.registerOverlay(PAGE_NAME, InternalFunctions.setVisible);
            view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
            view.on(`${PAGE_NAME}:Send`, InternalFunctions.send);
            view.on(`${PAGE_NAME}:Refresh`, InternalFunctions.update);
            view.on(`${PAGE_NAME}:Clear`, InternalFunctions.clear);
            hasRegistered = true;
        }

        alt.setTimeout(() => {
            if (native.isScreenFadedOut()) {
                native.doScreenFadeIn(2000);
            }

            native.freezeEntityPosition(alt.Player.local.scriptID, false);
        }, 1000);
    }

    static async focus() {
        if (alt.Player.local.isActionMenuOpen) {
            alt.log('cannot open cause action menu is open');
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isWheelMenuOpen) {
            return;
        }

        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.isConsoleOpen()) {
            return;
        }

        alt.Player.local.isChatOpen = true;
        alt.toggleGameControls(false);
        disableAllControls(true);

        const view = await WebViewController.get();
        WebViewController.showCursor(true);
        view.emit(`${PAGE_NAME}:Focus`);
        view.focus();
    }

    static async ready() {
        isReady = true;
        InternalFunctions.update();
    }

    static async receive(message: string): Promise<void> {
        const date = new Date(Date.now());
        const hours = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
        const seconds = date.getSeconds() <= 9 ? `0${date.getSeconds()}` : date.getSeconds();
        const timestamp = `[${hours}:${minutes}:${seconds}]`;

        // Insert the new messages to the front of the array.
        messages.unshift({
            timestamp,
            message,
        });

        if (messages.length >= 150) {
            messages.pop();
        }

        if (!isReady) {
            return;
        }

        InternalFunctions.update();
    }

    static populateCommands(_commands: Array<Partial<Command>>): void {
        commands = _commands;
        InternalFunctions.update();
    }

    static async update() {
        const view = await WebViewController.get();
        view.emit(
            `${PAGE_NAME}:SetMessages`,
            JSON.stringify(messages),
            JSON.stringify(commands),
            JSON.stringify(history),
        );
    }

    static clear() {
        messages = [];
        InternalFunctions.update();
    }

    static async send(message: string) {
        alt.toggleGameControls(true);
        disableAllControls(false);
        alt.Player.local.isChatOpen = false;

        const view = await WebViewController.get();
        WebViewController.showCursor(false);
        view.unfocus();

        if (!message) {
            return;
        }

        history.unshift(message);

        if (history.length >= 25) {
            history.pop();
        }

        alt.emitServer(View_Events_Chat.Send, message, commands);
    }

    static async keyDown(key: number) {
        if (isDisabled) {
            return;
        }

        // Page Up & Page Down
        if (key === 33 || key === 34) {
            const view = await WebViewController.get();
            view.emit(`${PAGE_NAME}:UnfocusedKeyBind`, key);
        }

        // Default: T
        if (key === KEY_BINDS.CHAT) {
            InternalFunctions.focus();
        }
    }
}

alt.onServer(View_Events_Chat.Append, InternalFunctions.receive);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.open);
alt.onServer(SYSTEM_EVENTS.POPULATE_COMMANDS, InternalFunctions.populateCommands);
