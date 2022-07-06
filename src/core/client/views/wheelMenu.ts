import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

import { VIEW_EVENTS_WHEEL_MENU } from '../../shared/enums/views';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';
import { isAnyMenuOpen } from '../utility/menus';

const PAGE_NAME = 'WheelMenu';
let _label = '';
let _options: Array<IWheelOptionExt> = [];
let _interval: number;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static init() {
        alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_WHEEL_MENU, WheelMenu.open);
    }

    static tick() {
        native.disableControlAction(0, 1, true);
        native.disableControlAction(0, 2, true);
        native.disableControlAction(0, 3, true);
        native.disableControlAction(0, 4, true);
        native.disableControlAction(0, 5, true);
        native.disableControlAction(0, 6, true);
        native.disableControlAction(0, 12, true);
        native.disableControlAction(0, 13, true);
        native.disableControlAction(0, 24, true);
        native.disableControlAction(0, 200, true);
        native.disableControlAction(0, 257, true);
    }

    static async execute(uid: string) {
        const index = _options.findIndex((x) => x.uid === uid);
        if (index <= -1) {
            InternalFunctions.close(true);
            return;
        }

        const option = _options[index];
        if (!option.doNotClose) {
            await InternalFunctions.close(true);
        }

        if (typeof option.callback === 'function') {
            if (Array.isArray(option.data)) {
                option.callback(...option.data);
            } else {
                option.callback();
            }
        }

        if (typeof option.emitClient === 'string') {
            if (Array.isArray(option.data)) {
                alt.emit(option.emitClient, ...option.data);
            } else {
                alt.emit(option.emitClient);
            }
        }

        if (typeof option.emitServer === 'string') {
            if (Array.isArray(option.data)) {
                alt.emitServer(option.emitServer, ...option.data);
            } else {
                alt.emitServer(option.emitServer);
            }
        }
    }

    static async close(closePage = false) {
        if (_interval) {
            alt.clearInterval(_interval);
            _interval = null;
        }

        const view = await WebViewController.get();
        view.off(VIEW_EVENTS_WHEEL_MENU.READY, InternalFunctions.ready);
        view.off(VIEW_EVENTS_WHEEL_MENU.EXECUTE, InternalFunctions.execute);

        if (closePage) {
            WebViewController.closePages([PAGE_NAME], true);
        }

        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        native.triggerScreenblurFadeOut(250);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(VIEW_EVENTS_WHEEL_MENU.ADD_OPTIONS, _label, JSON.parse(JSON.stringify(_options)));
    }
}

export class WheelMenu {
    /**
     * Open the wheel menu and inject various options to show.
     * When a user clicks on an option it executes that option based on whatever events, callbacks, etc. are passed.
     *
     * @static
     * @param {string} label
     * @param {Array<IWheelOptionExt>} options
     * @return {*}
     * @memberof WheelMenu
     */
    static async open(label: string, options: Array<IWheelOptionExt>, setMouseToCenter = false) {
        if (isAnyMenuOpen()) {
            return;
        }

        _label = label;
        _options = options;

        for (let i = 0; i < _options.length; i++) {
            if (!_options[i].uid) {
                _options[i].uid = `option-${i}`;
            }
        }

        // This is where we bind our received events from the WebView to
        // the functions in our WebView.
        const view = await WebViewController.get();
        view.on(VIEW_EVENTS_WHEEL_MENU.READY, InternalFunctions.ready);
        view.on(VIEW_EVENTS_WHEEL_MENU.EXECUTE, InternalFunctions.execute);

        if (setMouseToCenter) {
            const [_nothing, _x, _y] = native.getActiveScreenResolution(0, 0);
            alt.setCursorPos({ x: _x / 2, y: _y / 2 });
        }

        // This is where we open the page and show the cursor.
        WebViewController.openPages(PAGE_NAME, true, InternalFunctions.close);
        WebViewController.focus();
        WebViewController.showCursor(true);

        // Let the rest of the script know this menu is open.
        alt.Player.local.isMenuOpen = true;

        if (_interval) {
            alt.clearInterval(_interval);
            _interval = null;
        }

        native.triggerScreenblurFadeIn(250);
        _interval = alt.setInterval(InternalFunctions.tick, 0);
    }

    /**
     * Does not close the wheel menu but instead overwrites its current options.
     *
     * @static
     * @param {string} label
     * @param {Array<IWheelOptionExt>} options
     * @param {boolean} [setMouseToCenter=false]
     * @memberof WheelMenu
     */
    static update(label: string, options: Array<IWheelOptionExt>, setMouseToCenter = false) {
        _label = label;
        _options = options;

        for (let i = 0; i < _options.length; i++) {
            if (!_options[i].uid) {
                _options[i].uid = `option-${i}`;
            }
        }

        if (setMouseToCenter) {
            const [_nothing, _x, _y] = native.getActiveScreenResolution(0, 0);
            alt.setCursorPos({ x: _x / 2, y: _y / 2 });
        }

        InternalFunctions.ready();
    }
}

InternalFunctions.init();
