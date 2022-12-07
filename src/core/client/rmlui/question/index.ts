import { AthenaClient } from '@AthenaClient/api/athena';
import { isAnyMenuOpen } from '@AthenaClient/utility/menus';
import * as alt from 'alt-client';
import * as native from 'natives';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

interface QuestionInfo {
    buttons?: {
        accept: string;
        decline: string;
    };

    /**
     * What is the question, or info you need a response for?
     * ie. 'What is your first name?'
     *
     * @type {string}
     * @memberof QuestionInfo
     */
    placeholder: string;

    /**
     * If set to true, it will blur the background while responding.
     *
     * @type {boolean}
     * @memberof QuestionInfo
     */
    blur?: boolean;

    /**
     * If set to true, it will darken the background while responding.
     *
     * @type {boolean}
     * @memberof QuestionInfo
     */
    darken?: boolean;

    /**
     * Hide Radar?
     *
     * @type {boolean}
     * @memberof QuestionInfo
     */
    hideHud?: boolean;
}

type MessageCallback = (accepted: boolean) => void;
let document: alt.RmlDocument;
let internalCallback: MessageCallback;

const InternalFunctions = {
    focus(info: QuestionInfo) {
        const placeholderElement = document.getElementByID('placeholder');
        placeholderElement.innerRML = info.placeholder;

        const declineElement = document.getElementByID('decline');
        const acceptElement = document.getElementByID('accept');

        acceptElement.on('click', InternalFunctions.submit);
        declineElement.on('click', () => {
            AthenaClient.sound.frontend('CANCEL', 'HUD_FREEMODE_SOUNDSET');
            internalCallback(false);
            QuestionBox.cancel();
        });

        if (info.buttons) {
            acceptElement.innerRML = info.buttons.accept;
            declineElement.innerRML = info.buttons.decline;
        }

        if (info.blur) {
            native.triggerScreenblurFadeIn(250);
        }

        if (info.darken) {
            const bodyElement = document.getElementByID('body');
            bodyElement.style['background'] = `#000000c2`;
        }

        if (info.hideHud) {
            native.displayHud(false);
            native.displayRadar(false);
        }
    },
    handleKeyUp(keycode: number) {
        if (keycode === ESCAPE_KEY) {
            AthenaClient.sound.frontend('CANCEL', 'HUD_FREEMODE_SOUNDSET');
            internalCallback(false);
            QuestionBox.cancel();
            return;
        }

        if (keycode === ENTER_KEY) {
            InternalFunctions.submit();
            return;
        }
    },
    async submit() {
        const callbackRef = internalCallback;
        AthenaClient.sound.frontend('SELECT', 'HUD_FREEMODE_SOUNDSET');
        await QuestionBox.cancel();

        if (typeof callbackRef === 'function') {
            callbackRef(true);
        }
    },
};

const QuestionBoxConst = {
    create(info: QuestionInfo): Promise<boolean> {
        if (isAnyMenuOpen(false)) {
            console.warn(`Input box could not be created because a menu is already open.`);
            return undefined;
        }

        if (typeof document === 'undefined') {
            document = new alt.RmlDocument('/client/rmlui/question/index.rml');
            document.show();
        }

        alt.Player.local.isMenuOpen = true;
        alt.on('keyup', InternalFunctions.handleKeyUp);
        alt.showCursor(true);
        alt.toggleRmlControls(true);
        alt.toggleGameControls(false);
        InternalFunctions.focus(info);

        return new Promise((resolve: MessageCallback) => {
            internalCallback = resolve;
        });
    },
    async cancel() {
        if (typeof document !== 'undefined') {
            document.destroy();
            document = undefined;
        }

        internalCallback = undefined;
        alt.Player.local.isMenuOpen = false;
        alt.off('keyup', InternalFunctions.handleKeyUp);
        alt.showCursor(false);
        alt.toggleRmlControls(false);
        alt.toggleGameControls(true);
        native.triggerScreenblurFadeOut(250);
        native.displayHud(true);
        native.displayRadar(true);

        await alt.Utils.waitFor(() => {
            return native.isScreenblurFadeRunning() === false;
        });
    },
};

alt.on('disconnect', () => {
    if (typeof document !== 'undefined') {
        document.destroy();
        alt.log('question | Destroyed RMLUI Document on Disconnect');
    }
});

export const QuestionBox = {
    ...QuestionBoxConst,
};
