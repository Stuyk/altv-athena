import * as alt from 'alt-client';
import * as native from 'natives';
import { KEY_BINDS } from '../../shared/enums/KeyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { View_Events_Chat } from '../../shared/enums/Views';
import { Command } from '../../shared/interfaces/Command';
import { KeybindController } from '../events/keyup';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { disableAllControls } from '../utility/disableControls';
import { handleFreezePlayer } from '../utility/freeze';
import { isAnyMenuOpen } from '../utility/menus';

const PAGE_NAME = 'Chat';
const messages: Array<IMessage> = [];
let commands: Array<Partial<Command>> = [];
let isReady = false;

interface IMessage {
    message: string;
    timestamp: string;
}

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

    static async open() {
        const view = await WebViewController.get();
        if (isReady) {
            view.off(`${PAGE_NAME}:Ready`, ChatView.ready);
            view.off(`${PAGE_NAME}:Send`, ChatView.send);
        }

        view.on(`${PAGE_NAME}:Ready`, ChatView.ready);
        view.on(`${PAGE_NAME}:Send`, ChatView.send);

        WebViewController.openPages([PAGE_NAME]);

        alt.setTimeout(() => {
            if (native.isScreenFadedOut()) {
                native.doScreenFadeIn(2000);
            }

            handleFreezePlayer(false);
        }, 1000);
    }

    static async focus() {
        if (isAnyMenuOpen(false)) {
            return;
        }

        if (alt.isConsoleOpen()) {
            return;
        }

        alt.Player.local.isChatOpen = true;
        alt.toggleGameControls(false);
        disableAllControls(true);

        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Focus`);
        view.focus();
    }

    static async ready() {
        isReady = true;
        ChatView.update();
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

        ChatView.update();
    }

    static populateCommands(_commands: Array<Partial<Command>>): void {
        commands = _commands;
        ChatView.update();
    }

    static async update() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetMessages`, JSON.stringify(messages), JSON.stringify(commands));
    }

    static async send(message: string) {
        alt.toggleGameControls(true);
        disableAllControls(false);
        alt.Player.local.isChatOpen = false;

        const view = await WebViewController.get();
        view.unfocus();

        if (!message) {
            return;
        }

        alt.emitServer(View_Events_Chat.Send, message, commands);
    }
}

alt.onServer(View_Events_Chat.Append, ChatView.receive);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, ChatView.registerKeybind);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, ChatView.open);
alt.onServer(SYSTEM_EVENTS.POPULATE_COMMANDS, ChatView.populateCommands);
