import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export interface InputBoxInfo {
    /**
     * What is the question, or info you need a response for?
     * ie. 'What is your first name?'
     *
     * @type {string}
     *
     */
    placeholder: string;

    /**
     * If set to true, it will blur the background while responding.
     *
     * @type {boolean}
     *
     */
    blur?: boolean;

    /**
     * If set to true, it will darken the background while responding.
     *
     * @type {boolean}
     *
     */
    darken?: boolean;

    /**
     * Hide Radar?
     *
     * @type {boolean}
     *
     */
    hideHud?: boolean;
}

type MessageCallback = (msg: string | undefined) => void;
let document: alt.RmlDocument;
let internalCallback: MessageCallback;
let wasMenuCheckSkipped = false;

const InternalFunctions = {
    focus(inputInfo: InputBoxInfo) {
        const element = document.getElementByID('input');
        element.focus();

        const placeholderElement = document.getElementByID('placeholder');
        placeholderElement.innerRML = inputInfo.placeholder;

        if (inputInfo.blur) {
            native.triggerScreenblurFadeIn(250);
        }

        if (inputInfo.darken) {
            const bodyElement = document.getElementByID('body');
            bodyElement.style['background'] = `#000000c2`;
        }

        if (inputInfo.hideHud) {
            native.displayHud(false);
            native.displayRadar(false);
        }
    },
    handleKeyUp(keycode: number) {
        if (keycode === ESCAPE_KEY) {
            cancel();
            return;
        }

        if (keycode === ENTER_KEY) {
            InternalFunctions.submit();
            return;
        }
    },
    async submit() {
        const element = document.getElementByID('input');
        const msg = element.getAttribute('value');

        const callbackRef = internalCallback;
        await cancel();

        if (typeof callbackRef === 'function') {
            callbackRef(msg !== '' ? msg : undefined);
        }
    },
};

/**
 * Create an input box.
 *
 * Retruns a string or undefined based on user input.
 *
 *
 * @param {InputBoxInfo} inputInfo
 * @param {boolean} [skipMenuCheck=false]
 * @return {(Promise<string | undefined>)}
 */
export function create(inputInfo: InputBoxInfo, skipMenuCheck = false): Promise<string | undefined> {
    if (!skipMenuCheck) {
        wasMenuCheckSkipped = false;
        if (AthenaClient.webview.isAnyMenuOpen(false)) {
            console.warn(`Input box could not be created because a menu is already open.`);
            return undefined;
        }
    } else {
        wasMenuCheckSkipped = true;
    }

    if (typeof document === 'undefined') {
        document = new alt.RmlDocument('/client/rmlui/input/index.rml');
        document.show();
    }

    alt.Player.local.isMenuOpen = true;
    alt.on('keyup', InternalFunctions.handleKeyUp);
    alt.showCursor(true);
    alt.toggleRmlControls(true);
    alt.toggleGameControls(false);
    InternalFunctions.focus(inputInfo);

    return new Promise((resolve: MessageCallback) => {
        internalCallback = resolve;
    });
}

export async function cancel() {
    if (typeof document !== 'undefined') {
        document.destroy();
        document = undefined;
    }

    internalCallback = undefined;
    alt.off('keyup', InternalFunctions.handleKeyUp);
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
}

alt.on('disconnect', () => {
    if (typeof document !== 'undefined') {
        document.destroy();
        alt.log('input | Destroyed RMLUI Document on Disconnect');
    }
});
