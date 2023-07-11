import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';
import { OptionFor3DMenu } from './menu3DInterfaces';

const KEYS = {
    ESCAPE_KEY: 27,
    ENTER_KEY: 13,
    LEFT_KEY: 37,
    RIGHT_KEY: 39,
    UP_KEY: 38,
    DOWN_KEY: 40,
};

let maxDistance: number;
let internalPos: alt.IVector3;
let internalOptions: Array<OptionFor3DMenu>;
let optionIndex: number = 0;
let document: alt.RmlDocument;
let interval: number;

function roundToTwo(value: number) {
    return Math.round(value * 100 + Number.EPSILON) / 100;
}

const InternalFunctions = {
    init(pos: alt.IVector3, options: Array<OptionFor3DMenu>, distance: number) {
        internalOptions = options;
        internalPos = pos;
        maxDistance = distance;
        optionIndex = 0;

        // Options Setup
        const optionsElement = document.getElementByID('options');
        for (let i = 0; i < internalOptions.length; i++) {
            const option = internalOptions[i];

            const newOption = document.createElement('div');
            newOption.addClass('option');
            newOption.setAttribute('id', `option-${i}`);
            newOption.innerRML = option.name;

            if (i === 0) {
                newOption.addClass('selected');
            }

            optionsElement.appendChild(newOption);
        }

        interval = alt.setInterval(InternalFunctions.tick, 0);
    },
    updateIndex() {
        const element = document.getElementByID(`option-${optionIndex}`);
        element.addClass('selected');
    },
    /**
     * Fully closes the menu and destroys the rmlui document.
     *
     */
    close(skipSound = false) {
        alt.clearInterval(interval);

        if (typeof document !== 'undefined') {
            document.destroy();
            document = undefined;
        }

        internalOptions = undefined;
        internalPos = undefined;

        if (!skipSound) {
            AthenaClient.systems.sound.frontend('CANCEL', 'HUD_FREEMODE_SOUNDSET');
        }

        alt.Player.local.isMenuOpen = false;
        alt.off('keyup', InternalFunctions.handleKeyUp);
    },
    /**
     * Called when pressing enter.
     */
    async select() {
        const option = internalOptions[optionIndex];
        option.callback();
        AthenaClient.systems.sound.frontend('SELECT', 'HUD_FREEMODE_SOUNDSET');
        InternalFunctions.close(true);
    },
    /**
     * Moves the option selection navigation up.
     */
    up() {
        const element = document.getElementByID(`option-${optionIndex}`);
        element.removeClass('selected');

        if (optionIndex === 0) {
            optionIndex = internalOptions.length - 1;
        } else {
            optionIndex -= 1;
        }

        InternalFunctions.updateIndex();
        AthenaClient.systems.sound.frontend('NAV_UP_DOWN', 'HUD_FREEMODE_SOUNDSET');
    },
    /**
     * Moves the option selection navigation down.
     */
    down() {
        const element = document.getElementByID(`option-${optionIndex}`);
        element.removeClass('selected');

        if (optionIndex === internalOptions.length - 1) {
            optionIndex = 0;
        } else {
            optionIndex += 1;
        }

        InternalFunctions.updateIndex();
        AthenaClient.systems.sound.frontend('NAV_UP_DOWN', 'HUD_FREEMODE_SOUNDSET');
    },
    /**
     * Invokes key press functions.
     *
     * @param {number} keycode
     * @return {void}
     */
    handleKeyUp(keycode: number) {
        if (alt.isMenuOpen()) {
            return;
        }

        if (typeof FUNCTION_BINDS[keycode] !== 'function') {
            return;
        }

        FUNCTION_BINDS[keycode]();
    },
    tick() {
        if (!internalPos) {
            return;
        }

        const element = document.getElementByID('menu-wrapper');
        if (!element) {
            return;
        }

        const screenPos = alt.worldToScreen(internalPos);
        const dist = AthenaClient.utility.vector.distance(alt.Player.local.pos, internalPos);
        if (dist > maxDistance) {
            InternalFunctions.close(true);
            return;
        }

        const scale = (maxDistance - dist) / maxDistance; // 0.0 - 1.0
        element.style['left'] = `${screenPos.x}px`;
        element.style['top'] = `${screenPos.y}px`;
        element.style['transform'] = `scale(${roundToTwo(scale)})`;
    },
};

/**
 * Create an in-world 3D menu with maximum options.
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {Array<OptionFor3DMenu>} options
 * @param {number} maxDistance
 * @return {void}
 */
export function create(pos: alt.IVector3, options: Array<OptionFor3DMenu>, maxDistance = 8): void {
    if (AthenaClient.webview.isAnyMenuOpen(false)) {
        alt.logWarning(`Menu could not be created because a menu is already open.`);
        return undefined;
    }

    if (options.length > 8) {
        alt.logWarning(`Menu Options exceeded 8 entries. Trimmed off excess menu entries.`);
        options = options.slice(0, 8);
    }

    if (typeof document === 'undefined') {
        document = new alt.RmlDocument('/client/rmlui/menu3d/index.rml');
        document.show();
    }

    alt.Player.local.isMenuOpen = true;
    alt.on('keyup', InternalFunctions.handleKeyUp);
    InternalFunctions.init(pos, options, maxDistance);
}

/**
 * Call this function to close the menu.
 * Make sure to wait for it to close before opening a new menu.
 *
 */
export async function close(): Promise<void> {
    await InternalFunctions.close();
    await alt.Utils.wait(100);
}

const FUNCTION_BINDS = {
    [KEYS.ESCAPE_KEY]: InternalFunctions.close,
    [KEYS.UP_KEY]: InternalFunctions.up,
    [KEYS.DOWN_KEY]: InternalFunctions.down,
    [KEYS.ENTER_KEY]: InternalFunctions.select,
};

alt.on('disconnect', () => {
    if (typeof document !== 'undefined') {
        document.destroy();
        alt.log('menu3d | Destroyed RMLUI Document on Disconnect');
    }
});
