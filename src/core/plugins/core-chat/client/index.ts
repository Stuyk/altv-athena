import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { CHAT_WEBVIEW_EVENTS } from '../shared/events.js';
import { MessageInfo } from '@AthenaClient/systems/messenger.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';

const THE_LETTER_T = 84;
const PAGE_NAME = 'Chat';
let hasRegistered = false;

const InternalFunctions = {
    /**
     * Takes any key press and passes it through to the Webview.
     * This is so that the key presses are handled without a 'document.addEventListener'
     * This means the key presses should still work, when not in-focus.
     *
     * @param {number} keyCode
     * @return {void}
     */
    handleKeyPress(keyCode: number) {
        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        AthenaClient.webview.emit(CHAT_WEBVIEW_EVENTS.PASS_KEY_PRESS, keyCode);
    },
    /**
     * Fetches and pushes message history, when the chat is opened and turned visible.
     *
     * @param {boolean} [value=true]
     * @return {void}
     */
    updateMessages(value: boolean = true) {
        if (!value) {
            return;
        }

        AthenaClient.webview.emit(CHAT_WEBVIEW_EVENTS.SET_MESSAGES, AthenaClient.systems.messenger.getHistory());
    },
    /**
     * Automatically updates the WebView with latest message history.
     *
     * @param {Array<MessageInfo>} messages
     */
    updateMessagesListener(messages: Array<MessageInfo>) {
        AthenaClient.webview.emit(CHAT_WEBVIEW_EVENTS.SET_MESSAGES, messages);
    },
    /**
     * Opens the message box for commands or messages.
     */
    async openMessageBox() {
        if (alt.isConsoleOpen()) {
            return;
        }

        const result = await AthenaClient.rmlui.commands.create({
            placeholder: 'Send a message or type a command...',
            commands: AthenaClient.systems.messenger.getCommands(),
        });

        if (typeof result === 'undefined' || result === '') {
            return;
        }

        AthenaClient.systems.messenger.send(result);
    },
    /**
     * Initializes the chat overlay, and registers it as an overlay.
     *
     */
    open() {
        if (!hasRegistered) {
            AthenaClient.webview.registerOverlay(PAGE_NAME, InternalFunctions.updateMessages);
            AthenaClient.webview.ready(PAGE_NAME, InternalFunctions.updateMessages);
            AthenaClient.systems.messenger.registerHistoryCallback(InternalFunctions.updateMessagesListener);
            alt.on('keyup', InternalFunctions.handleKeyPress);
            hasRegistered = true;
        }
    },
};

onTicksStart.add(() => {
    AthenaClient.systems.hotkeys.add({
        key: THE_LETTER_T,
        description: 'Open Chat Box',
        identifier: 'open-chat-box',
        keyDown: InternalFunctions.openMessageBox,
    });

    InternalFunctions.open();
});
