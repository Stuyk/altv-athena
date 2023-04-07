import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';
import { rgbaToHexAlpha } from '@AthenaShared/utility/color';
import { Invoke, Toggle, Selection, Range, MenuInfo } from './menuInterfaces';

const KEYS = {
    ESCAPE_KEY: 27,
    ENTER_KEY: 13,
    LEFT_KEY: 37,
    RIGHT_KEY: 39,
    UP_KEY: 38,
    DOWN_KEY: 40,
};

let menu: MenuInfo;
let optionIndex: number = 0;
let document: alt.RmlDocument;
let pauseControl = false;

const InternalFunctions = {
    init(info: MenuInfo) {
        menu = info;

        // Header Background Setup
        const header = document.getElementByID('header');
        header.style['background'] = menu.header.color as string;

        // Header Text Setup
        const headerText = document.getElementByID('headertext');
        headerText.innerRML = menu.header.title;

        // Options Setup
        const optionsElement = document.getElementByID('options');
        for (let i = 0; i < menu.options.length; i++) {
            const option = menu.options[i];

            // Creates the initial option div
            // Each option can be fetched by `index`
            // ie. document.getElementByID('option-1');
            const newOption = document.createElement('div');
            newOption.addClass('option');
            newOption.setAttribute('id', `option-${i}`);

            // Creates the title inside of the option div
            const optionTitle = document.createElement('div');
            optionTitle.addClass('key');
            optionTitle.innerRML = option.title;
            newOption.appendChild(optionTitle);

            // Creates the right-hand side of the option div.
            // Initial values are set based on type then updated accordingly.
            const optionEntry = document.createElement('div');
            optionEntry.setAttribute('id', `option-value-${i}`);
            optionEntry.addClass('value');
            newOption.appendChild(optionEntry);
            optionsElement.appendChild(newOption);

            // Go through each option index.
            // Update their value after appending.
            optionIndex = i;
            InternalFunctions.updateValue();
        }

        optionIndex = 0;
        const element = document.getElementByID(`option-${optionIndex}`);
        element.addClass('selected');
        InternalFunctions.updateDescription();
        pauseControl = false;
    },
    /**
     * Updates an option description after chaning optionIndex.
     */
    updateDescription() {
        const element = document.getElementByID('description');
        element.innerRML = menu.options[optionIndex].description;
    },
    updateValue() {
        const option = menu.options[optionIndex];
        const element = document.getElementByID('option-value-' + optionIndex);

        if (option.type === 'Invoke') {
            element.innerRML = '&nbsp;';
            return;
        }

        if (option.type === 'Range') {
            element.innerRML = `&lt; ${option.value}/${option.max} &gt;`;
            return;
        }

        if (option.type === 'Selection') {
            element.innerRML = `&lt; ${option.options[option.value].replaceAll('&', '&amp;')} &gt;`;
            return;
        }

        if (option.type === 'Toggle') {
            element.innerRML = option.value ? 'Y' : 'N';
            return;
        }
    },
    updateIndex() {
        const element = document.getElementByID(`option-${optionIndex}`);
        element.addClass('selected');
    },
    /**
     * Fully closes the menu and destroys the rmlui document.
     *
     */
    close() {
        if (typeof document !== 'undefined') {
            document.destroy();
            document = undefined;
        }

        native.disableFrontendThisFrame();
        native.setFrontendActive(false);

        menu = undefined;
        AthenaClient.systems.sound.frontend('CANCEL', 'HUD_FREEMODE_SOUNDSET');

        alt.Player.local.isMenuOpen = false;
        alt.off('keyup', InternalFunctions.handleKeyUp);
    },
    /**
     * Called when pressing enter.
     */
    async select() {
        const option = menu.options[optionIndex];

        // Ignore hitting enter for Range / Selection type unless enter is used for updating.
        if ((option.type === 'Range' || option.type === 'Selection') && !option.onlyUpdateOnEnter) {
            console.log('parsing...');

            pauseControl = true;
            const specifiedValue = await AthenaClient.rmlui.input.create(
                {
                    placeholder: `Input value for ${option.title}`,
                },
                true,
            );

            if (typeof specifiedValue === 'undefined') {
                AthenaClient.systems.sound.frontend('CANCEL', 'HUD_FREEMODE_SOUNDSET');
                pauseControl = false;
                return;
            }

            const value = parseFloat(specifiedValue);
            if (isNaN(value)) {
                AthenaClient.systems.sound.frontend('CANCEL', 'HUD_FREEMODE_SOUNDSET');
                pauseControl = false;
                return;
            }

            const min = option.type === 'Selection' ? 0 : option.min;
            const max = option.type === 'Selection' ? option.options.length - 1 : option.max;
            if (value > max || value < min) {
                AthenaClient.systems.sound.frontend('CANCEL', 'HUD_FREEMODE_SOUNDSET');
                pauseControl = false;
                return;
            }

            option.value = value;
            if (option.type === 'Range') {
                option.callback(value);
            }

            if (option.type === 'Selection') {
                option.callback(option.options[option.value]);
            }

            InternalFunctions.updateValue();
            AthenaClient.systems.sound.frontend('SELECT', 'HUD_FREEMODE_SOUNDSET');
            pauseControl = false;
            return;
        }

        AthenaClient.systems.sound.frontend('SELECT', 'HUD_FREEMODE_SOUNDSET');

        // Invoke callbacks individually because TypeScript hates this.
        switch (option.type) {
            case 'Invoke':
                option.callback();
                return;
            case 'Range':
                option.callback(option.value);
                return;
            case 'Selection':
                option.callback(option.options[option.value]);
                return;
            case 'Toggle':
                option.value = !option.value;
                option.callback(option.value);
                InternalFunctions.updateValue();
                return;
        }
    },
    /**
     * Moves the option selection navigation up.
     */
    up() {
        const element = document.getElementByID(`option-${optionIndex}`);
        element.removeClass('selected');

        if (optionIndex === 0) {
            optionIndex = menu.options.length - 1;
        } else {
            optionIndex -= 1;
        }

        InternalFunctions.updateDescription();
        InternalFunctions.updateIndex();
        AthenaClient.systems.sound.frontend('NAV_UP_DOWN', 'HUD_FREEMODE_SOUNDSET');

        if (alt.debug) {
            alt.log(`NAV_UP -> ${optionIndex}`);
        }
    },
    /**
     * Moves the option selection navigation down.
     */
    down() {
        const element = document.getElementByID(`option-${optionIndex}`);
        element.removeClass('selected');

        if (optionIndex === menu.options.length - 1) {
            optionIndex = 0;
        } else {
            optionIndex += 1;
        }

        InternalFunctions.updateDescription();
        InternalFunctions.updateIndex();
        AthenaClient.systems.sound.frontend('NAV_UP_DOWN', 'HUD_FREEMODE_SOUNDSET');

        if (alt.debug) {
            alt.log(`NAV_DOWN -> ${optionIndex}`);
        }
    },
    /**
     * Decrements option value.
     * Works for range & selection only.
     */
    left() {
        const option = menu.options[optionIndex];
        if (option.type === 'Invoke' || option.type === 'Toggle') {
            return;
        }

        AthenaClient.systems.sound.frontend('NAV_LEFT_RIGHT', 'HUD_FREEMODE_SOUNDSET');

        let increment = 1;
        let min = 0;
        let max = 0;
        if (option.type === 'Range') {
            increment = option.increment;
            min = option.min;
            max = option.max;
        }

        if (option.type === 'Selection') {
            min = 0;
            max = option.options.length - 1;
        }

        if (option.value === min) {
            option.value = max;
        } else {
            option.value -= increment;
        }

        InternalFunctions.updateValue();

        if (alt.debug) {
            alt.log(`NAV_LEFT -> ${option.value}`);
        }
    },
    /**
     * Increments option value.
     * Works for range & selection only.
     */
    right() {
        const option = menu.options[optionIndex];
        if (option.type === 'Invoke' || option.type === 'Toggle') {
            return;
        }

        AthenaClient.systems.sound.frontend('NAV_LEFT_RIGHT', 'HUD_FREEMODE_SOUNDSET');

        let increment = 1;
        let min = 0;
        let max = 0;
        if (option.type === 'Range') {
            increment = option.increment;
            min = option.min;
            max = option.max;
        }

        if (option.type === 'Selection') {
            min = 0;
            max = option.options.length - 1;
        }

        if (option.value === max) {
            option.value = min;
        } else {
            option.value += increment;
        }

        InternalFunctions.updateValue();

        if (alt.debug) {
            alt.log(`NAV_RIGHT -> ${option.value}`);
        }
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

        if (pauseControl) {
            return;
        }

        if (typeof FUNCTION_BINDS[keycode] !== 'function') {
            return;
        }

        FUNCTION_BINDS[keycode]();
    },
};

/**
 * Create a menu similar to NativeUI.
 *
 *
 *
 * @param {MenuInfo} info
 * @return {void}
 */
export function create(info: MenuInfo): void {
    if (AthenaClient.webview.isAnyMenuOpen(false)) {
        alt.logWarning(`Menu could not be created because a menu is already open.`);
        return undefined;
    }

    if (info.options.length > 11) {
        alt.logWarning(`Menu Options exceeded 11 entries. Trimmed off excess menu entries.`);
        info.options = info.options.slice(0, 11);
    }

    if (typeof info.header.color !== 'string') {
        info.header.color = rgbaToHexAlpha(info.header.color);
    }

    if (typeof document === 'undefined') {
        document = new alt.RmlDocument('/client/rmlui/menu/index.rml');
        document.show();
    }

    alt.Player.local.isMenuOpen = true;
    alt.on('keyup', InternalFunctions.handleKeyUp);
    InternalFunctions.init(info);
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

/**
 * Build a menu option, and return the result.
 * Used like: `createOption<Range>({ ... })`;
 *
 * @template T
 * @param {T} menuTemplate
 * @return {T}
 */
export function createOption<T = Selection | Range | Toggle | Invoke>(menuTemplate: T): T {
    return menuTemplate;
}

const FUNCTION_BINDS = {
    [KEYS.ESCAPE_KEY]: InternalFunctions.close,
    [KEYS.UP_KEY]: InternalFunctions.up,
    [KEYS.DOWN_KEY]: InternalFunctions.down,
    [KEYS.RIGHT_KEY]: InternalFunctions.right,
    [KEYS.LEFT_KEY]: InternalFunctions.left,
    [KEYS.ENTER_KEY]: InternalFunctions.select,
};

alt.on('disconnect', () => {
    if (typeof document !== 'undefined') {
        document.destroy();
        alt.log('menu | Destroyed RMLUI Document on Disconnect');
    }
});
