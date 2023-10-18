import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { MessageCommand } from '@AthenaShared/interfaces/messageCommand.js';

interface CommandInput {
    /**
     * What is this command input asking for?
     * Usually something like... 'Type a chat message, or command with (/)'
     *
     * @type {string}
     *
     */
    placeholder: string;

    /**
     * Commands to populate this Command Input with to show suggestions.
     *
     * @type {Array<Omit<MessageCommand<any>, 'callback'>>}
     *
     */
    commands: Array<Omit<MessageCommand<any>, 'callback'>>;
}

type MessageCallback = (msg: string | undefined) => void;

const MAXIMUM_HISTORY_LENGTH = 128;
const MAX_SUGGESTIONS = 4;
const KEY_CODES = {
    ESCAPE_KEY: 27,
    ENTER_KEY: 13,
    UP: 38,
    DOWN: 40,
    TAB: 9,
};

let document: alt.RmlDocument;
let internalCallback: MessageCallback;
let wasMenuCheckSkipped = false;
let commands: Array<Omit<MessageCommand<alt.Player>, 'callback'>> = [];
let history: Array<string> = [];
let historyIndex = -1;
let isCommandInputOpen = false;

async function autoFillCommand() {
    if (Overrides.autoFillCommand) {
        return Overrides.autoFillCommand();
    }

    const msg = getCurrentMessage();
    if (!msg || msg === '' || msg.charAt(0) !== '/' || commands.length <= 0) {
        return;
    }

    const splitCommand = msg.replaceAll('/', '').toLowerCase().split(' ');
    if (!splitCommand[0]) {
        return;
    }

    const suggestions = commands.filter((x) => x.name.includes(splitCommand[0]));
    if (suggestions.length <= 0) {
        return;
    }

    const element = document.getElementByID('input');
    if (typeof element === 'undefined') {
        alt.logWarning(`Could not find rmlui commands element with id 'input'`);
        return undefined;
    }

    const inputWrapper = document.getElementByID('input-wrapper');
    inputWrapper.removeChild(element);
    element.destroy();

    if (typeof inputWrapper === 'undefined') {
        alt.logWarning(`Could not find rmlui commands element with id 'input-wrapper'`);
        return undefined;
    }

    // Before you go and try to move the caret position to the end of the input box.
    // There is no way to move the caret position.
    // There is no access to element.setSelectionRange
    // There is no access to element.move
    // Unfocus and Refocus does not work either
    // Pretty much no option to make the caret position at the end of the input box for RMLUI.

    const fullCommand = '/' + suggestions[0].name;
    const newElement = document.createElement('input');
    newElement.setAttribute('value', fullCommand);
    newElement.setAttribute('id', 'input');
    newElement.setAttribute('type', 'text');
    inputWrapper.appendChild(newElement);

    alt.nextTick(() => {
        newElement.focus();
        newElement.click();
    });
}

function getCurrentMessage(): string {
    if (Overrides.getCurrentMessage) {
        return Overrides.getCurrentMessage();
    }

    const element = document.getElementByID('input');
    if (typeof element === 'undefined') {
        alt.logWarning(`Could not find rmlui commands element with id 'input'`);
        return undefined;
    }
    ``;
    const msg = element.getAttribute('value');
    return msg;
}

/**
 * Try to update the on-screen suggestions.
 * If the array is empty; it will clear all suggestions.
 *
 * @param {Array<Omit<MessageCommand<alt.Player>, 'callback'>>} suggestions
 */
function updateSuggestions(suggestions: Array<Omit<MessageCommand<alt.Player>, 'callback'>>) {
    if (Overrides.updateSuggestions) {
        return Overrides.updateSuggestions(suggestions);
    }

    for (let i = 0; i < MAX_SUGGESTIONS; i++) {
        const suggestion = suggestions[i];
        const element = document.getElementByID(`suggestion-${i}`);
        if (typeof element === 'undefined') {
            continue;
        }

        if (typeof suggestion === 'undefined') {
            element.innerRML = '';
            continue;
        }

        element.innerRML = suggestion.description;
    }
}

function handleMessageUpdate() {
    if (Overrides.handleMessageUpdate) {
        return Overrides.handleMessageUpdate();
    }

    const msg = getCurrentMessage();
    if (!msg || msg === '') {
        return;
    }

    if (msg.charAt(0) !== '/') {
        updateSuggestions([]);
        return;
    }

    if (commands.length <= 0) {
        updateSuggestions([]);
        return;
    }

    const splitCommand = msg.replaceAll('/', '').toLowerCase().split(' ');
    if (!splitCommand[0]) {
        updateSuggestions([]);
        return;
    }

    const suggestions = commands.filter((x) => x.name.includes(splitCommand[0]));
    updateSuggestions(suggestions);
}

function browseHistory(shouldIncrease: boolean) {
    if (Overrides.browseHistory) {
        return Overrides.browseHistory(shouldIncrease);
    }

    historyIndex = shouldIncrease ? historyIndex + 1 : historyIndex - 1;

    if (historyIndex >= history.length) {
        historyIndex = history.length - 1;
    }

    if (historyIndex < -1) {
        historyIndex = -1;
    }

    const element = document.getElementByID('input');
    if (typeof element === 'undefined') {
        alt.logWarning(`Could not find rmlui commands element with id 'input'`);
        return undefined;
    }

    if (historyIndex === -1) {
        element.setAttribute('value', '');
        return;
    }

    element.setAttribute('value', history[historyIndex]);
}

function focus(inputInfo: CommandInput) {
    if (Overrides.focus) {
        return Overrides.focus(inputInfo);
    }

    const element = document.getElementByID('input');
    if (typeof element === 'undefined') {
        alt.logWarning(`Could not find rmlui commands element with id 'input'`);
        return;
    }

    element.focus();

    const placeholderElement = document.getElementByID('placeholder');
    if (typeof placeholderElement === 'undefined') {
        alt.logWarning(`Could not find rmlui commands element with id 'placeholder'`);
        return;
    }

    placeholderElement.innerRML = inputInfo.placeholder;

    // Assign commands the player has access to currently...
    commands = inputInfo.commands;
    historyIndex = -1;
}

function handleKeyUp(keycode: number) {
    if (Overrides.handleKeyUp) {
        return Overrides.handleKeyUp(keycode);
    }

    if (keycode === KEY_CODES.ESCAPE_KEY) {
        cancel();
        return;
    }

    if (keycode === KEY_CODES.ENTER_KEY) {
        submit();
        return;
    }

    if (keycode === KEY_CODES.TAB) {
        autoFillCommand();
        return;
    }

    if (keycode === KEY_CODES.UP || keycode === KEY_CODES.DOWN) {
        browseHistory(keycode === KEY_CODES.UP);
        return;
    }

    handleMessageUpdate();
}

async function submit() {
    if (Overrides.submit) {
        return Overrides.submit();
    }

    const msg = getCurrentMessage();
    const callbackRef = internalCallback;
    await cancel();

    if (typeof callbackRef !== 'function') {
        return;
    }

    if (typeof msg === 'undefined') {
        callbackRef(undefined);
        return;
    }

    if (msg !== '') {
        history.unshift(msg);
        if (history.length >= MAXIMUM_HISTORY_LENGTH) {
            history.pop();
        }
    }

    callbackRef(msg !== '' ? msg : undefined);
}

export function create(inputInfo: CommandInput, skipMenuCheck = false): Promise<string | undefined> {
    if (Overrides.create) {
        return Overrides.create(inputInfo, skipMenuCheck);
    }

    if (!skipMenuCheck) {
        wasMenuCheckSkipped = false;
        if (AthenaClient.webview.isAnyMenuOpen()) {
            console.warn(`Input box could not be created because a menu is already open.`);
            return undefined;
        }
    } else {
        wasMenuCheckSkipped = true;
    }

    if (typeof document === 'undefined') {
        document = new alt.RmlDocument('/client/rmlui/commands/index.rml');
        document.show();
    }

    alt.Player.local.isMenuOpen = true;
    alt.on('keyup', handleKeyUp);
    alt.showCursor(true);
    alt.toggleRmlControls(true);
    alt.toggleGameControls(false);
    focus(inputInfo);

    isCommandInputOpen = true;

    return new Promise((resolve: MessageCallback) => {
        internalCallback = resolve;
    });
}

export async function cancel() {
    if (Overrides.cancel) {
        return Overrides.cancel();
    }

    if (typeof document !== 'undefined') {
        document.destroy();
        document = undefined;
    }

    internalCallback = undefined;
    alt.off('keyup', handleKeyUp);
    alt.showCursor(false);
    alt.toggleRmlControls(false);
    alt.toggleGameControls(true);
    native.triggerScreenblurFadeOut(250);
    native.displayHud(true);
    native.displayRadar(true);

    if (!wasMenuCheckSkipped) {
        alt.Player.local.isMenuOpen = false;
    }

    await alt.Utils.waitFor(() => {
        return native.isScreenblurFadeRunning() === false;
    });

    isCommandInputOpen = false;
}

/**
 * Returns whether or not this interface is open.
 *
 * @return {boolean}
 */
export function isOpen(): boolean {
    if (Overrides.isOpen) {
        return Overrides.isOpen();
    }

    return isCommandInputOpen;
}

alt.on('disconnect', () => {
    if (typeof document === 'undefined') {
        return;
    }

    document.destroy();
    alt.log('input | Destroyed RMLUI Document on Disconnect');
});

interface CommandsInputFuncs {
    autoFillCommand: typeof autoFillCommand;
    browseHistory: typeof browseHistory;
    cancel: typeof cancel;
    create: typeof create;
    focus: typeof focus;
    getCurrentMessage: typeof getCurrentMessage;
    handleKeyUp: typeof handleKeyUp;
    handleMessageUpdate: typeof handleMessageUpdate;
    isOpen: typeof isOpen;
    submit: typeof submit;
    updateSuggestions: typeof updateSuggestions;
}

const Overrides: Partial<CommandsInputFuncs> = {};

export function override(functionName: 'autoFillCommand', callback: typeof autoFillCommand);
export function override(functionName: 'browseHistory', callback: typeof browseHistory);
export function override(functionName: 'cancel', callback: typeof cancel);
export function override(functionName: 'create', callback: typeof create);
export function override(functionName: 'focus', callback: typeof focus);
export function override(functionName: 'getCurrentMessage', callback: typeof getCurrentMessage);
export function override(functionName: 'handleKeyUp', callback: typeof handleKeyUp);
export function override(functionName: 'handleMessageUpdate', callback: typeof handleMessageUpdate);
export function override(functionName: 'isOpen', callback: typeof isOpen);
export function override(functionName: 'submit', callback: typeof submit);
export function override(functionName: 'updateSuggestions', callback: typeof updateSuggestions);
export function override(functionName: keyof CommandsInputFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
