import * as alt from 'alt-client';
import { AthenaClient } from '@AthenaClient/api/athena';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { WebViewController } from '@AthenaClient/extensions/view2';
import { CHAT_WEBVIEW_EVENTS } from '../shared/events';
import { MessageInfo } from '@AthenaClient/systems/messenger';

const THE_LETTER_T = 84;
const PAGE_NAME = 'Chat';
let hasRegistered = false;

const InternalFunctions = {
    handleKeyPress(keyCode: number) {
        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        AthenaClient.webview.emit(CHAT_WEBVIEW_EVENTS.PASS_KEY_PRESS, keyCode);
    },
    updateMessages(value: boolean = true) {
        if (!value) {
            return;
        }

        AthenaClient.webview.emit(CHAT_WEBVIEW_EVENTS.SET_MESSAGES, AthenaClient.messenger.history());
    },
    updateMessagesListener(messages: Array<MessageInfo>) {
        AthenaClient.webview.emit(CHAT_WEBVIEW_EVENTS.SET_MESSAGES, messages);
    },
};

const ChatView = {
    open() {
        if (!hasRegistered) {
            WebViewController.registerOverlay(PAGE_NAME, InternalFunctions.updateMessages);
            WebViewController.ready(PAGE_NAME, InternalFunctions.updateMessages);
            AthenaClient.messenger.registerHistoryCallback(InternalFunctions.updateMessagesListener);
            alt.on('keyup', InternalFunctions.handleKeyPress);
        }
    },
};

alt.onServer(SYSTEM_EVENTS.TICKS_START, ChatView.open);

async function handleInput() {
    const result = await AthenaClient.rmlui.inputBox.create({
        placeholder: 'Send a message or type a command...',
        darken: false,
        blur: false,
    });

    if (typeof result === 'undefined' || result === '') {
        return;
    }

    AthenaClient.messenger.send(result);
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, () => {
    AthenaClient.events.keyBinds.registerKeybind({ singlePress: handleInput, key: THE_LETTER_T });
});
