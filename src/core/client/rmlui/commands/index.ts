import { isAnyMenuOpen } from '@AthenaClient/utility/menus';
import { MessageCommand } from '@AthenaShared/interfaces/messageCommand';
import * as alt from 'alt-client';
import * as native from 'natives';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

interface CommandInput {
    /**
     * What is this command input asking for?
     * Usually something like... 'Type a chat message, or command with (/)'
     *
     * @type {string}
     * @memberof CommandInput
     */
    placeholder: string;

    /**
     * Commands to populate this Command Input with to show suggestions.
     *
     * @type {Array<Omit<MessageCommand<any>, 'callback'>>}
     * @memberof CommandInput
     */
    commands: Array<Omit<MessageCommand<any>, 'callback'>>;
}

type MessageCallback = (msg: string | undefined) => void;
let document: alt.RmlDocument;
let internalCallback: MessageCallback;
let wasMenuCheckSkipped = false;

function getCurrentMessage(): string {
    const element = document.getElementByID('input');
    const msg = element.getAttribute('value');
    return msg;
}

const InternalFunctions = {
    focus(inputInfo: CommandInput) {
        const element = document.getElementByID('input');
        element.focus();

        const placeholderElement = document.getElementByID('placeholder');
        placeholderElement.innerRML = inputInfo.placeholder;
    },
    handleKeyUp(keycode: number) {
        if (keycode === ESCAPE_KEY) {
            CommandInputConst.cancel();
            return;
        }

        if (keycode === ENTER_KEY) {
            InternalFunctions.submit();
            return;
        }
    },
    async submit() {
        const msg = getCurrentMessage();

        const callbackRef = internalCallback;
        await CommandInputConst.cancel();

        if (typeof callbackRef === 'function') {
            callbackRef(msg !== '' ? msg : undefined);
        }
    },
};

const CommandInputConst = {
    create(inputInfo: CommandInput, skipMenuCheck = false): Promise<string | undefined> {
        if (!skipMenuCheck) {
            wasMenuCheckSkipped = false;
            if (isAnyMenuOpen(false)) {
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
        alt.on('keyup', InternalFunctions.handleKeyUp);
        alt.showCursor(true);
        alt.toggleRmlControls(true);
        alt.toggleGameControls(false);
        InternalFunctions.focus(inputInfo);

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
    },
};

alt.on('disconnect', () => {
    if (typeof document !== 'undefined') {
        document.destroy();
        alt.log('input | Destroyed RMLUI Document on Disconnect');
    }
});

export const CommandInput = {
    ...CommandInputConst,
};
