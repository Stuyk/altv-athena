import * as alt from 'alt-client';
import * as native from 'natives';
import { distance2d } from '../../shared/utility/vector';
import { getPointsInCircle } from './math';
import { drawRectangle2D, drawText2D } from './text';
import { Vector2 } from '../../shared/interfaces/vector';
import { handleFrontendSound } from '../systems/sound';
import { getScaledCursorPosition } from './mouse';
import { Timer } from './timers';
import { WebViewController } from '../extensions/view2';
import { IWheelItem } from '../../shared/interfaces/iWheelMenu';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ClientInventoryView } from '../views/inventory';

let currentMenu: IWheelMenu = null;
let nextClick = Date.now() + 250;
let interval;
let lastHover;

export interface IClientWheelItem extends IWheelItem {
    callback?: Function;
}

export interface IWheelMenu {
    label: string;
    points: Array<FullWheelItem>;
    center: alt.IVector2;
}

interface FullWheelItem extends IClientWheelItem, Vector2 {
    name?: string;
    callback?: Function;
    emitServer?: string;
    emitClient?: string;
    label?: string;
    points?: Array<FullWheelItem>;
}

class InternalFunctions {
    /**
     * Creates a simple dynamic wheel menu passed down from the server
     *
     * @static
     * @param {string} label
     * @param {Array<IClientWheelItem>} items
     * @memberof WheelMenu
     */
    static dynamicWheelMenu(label: string, items: Array<IClientWheelItem>) {
        ClientInventoryView.close();
        WheelMenu.create(label, items);
    }
}

export class WheelMenu {
    static create(
        label: string,
        options: Array<IClientWheelItem>,
        setMouseToCenter = false,
        center: Vector2 = { x: 0.5, y: 0.5 },
    ) {
        if (options.length > 10) {
            throw new Error('Wheel Menu cannot exceed 10 Options');
        }

        const points: Array<FullWheelItem> = getPointsInCircle(options.length, 0.25, center);

        for (let i = 0; i < options.length; i++) {
            points[i] = { ...options[i], ...points[i] };
        }

        if (interval) {
            Timer.clearInterval(interval);
            interval = null;
        }

        currentMenu = {
            label,
            points: points,
            center,
        };

        lastHover = null;

        interval = Timer.createInterval(WheelMenu.render, 0, 'wheelMenu.ts');
        native.triggerScreenblurFadeIn(250);
        native.displayRadar(false);
        WebViewController.setOverlaysVisible(false);
        alt.Player.local.isWheelMenuOpen = true;

        if (setMouseToCenter) {
            const [_nothing, _x, _y] = native.getActiveScreenResolution(0, 0);
            alt.setCursorPos({ x: _x / 2, y: _y / 2 });
        }
    }

    static showCursor(value: boolean) {
        try {
            alt.showCursor(value);
        } catch (err) {
            return;
        }
    }

    static async close() {
        Timer.clearInterval(interval);
        alt.Player.local.isWheelMenuOpen = false;
        await WebViewController.setOverlaysVisible(true);
        interval = null;
        currentMenu = null;
        native.triggerScreenblurFadeOut(100);
        native.displayRadar(true);
    }

    static async render() {
        if (!currentMenu) {
            return;
        }

        native.clearDrawOrigin();
        native.setMouseCursorActiveThisFrame();
        native.setMouseCursorSprite(1);
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

        const actualCursor = getScaledCursorPosition();

        let smallestDistance = 0.05;
        let index = -1;

        for (let i = 0; i < currentMenu.points.length; i++) {
            const data = currentMenu.points[i];
            const dist = distance2d({ x: data.x, y: data.y }, actualCursor);

            if (dist < smallestDistance) {
                smallestDistance = dist;
                index = i;
                drawText2D(data.name, { x: data.x, y: data.y }, 0.65, new alt.RGBA(255, 255, 255, 255), 0);
                native.setMouseCursorSprite(5);
            } else {
                drawText2D(data.name, { x: data.x, y: data.y }, 0.5, new alt.RGBA(255, 255, 255, 200), 0);
            }
        }

        drawRectangle2D({ x: 0.5, y: 0.5 }, { x: 1, y: 1 }, new alt.RGBA(0, 0, 0, 100));
        drawText2D(
            `${currentMenu.label}~n~~n~'ESC' - Close Menu`,
            currentMenu.center,
            0.5,
            new alt.RGBA(255, 255, 255, 255),
            0,
        );

        // Escape
        if (native.isDisabledControlJustReleased(0, 200)) {
            WheelMenu.close();
            return;
        }

        if (index !== -1 && lastHover !== index) {
            lastHover = index;
            handleFrontendSound('HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        }

        // Check Element Hover and Left Click Release
        if (index <= -1 || !native.isDisabledControlJustReleased(0, 24)) {
            return;
        }

        if (Date.now() < nextClick) {
            return;
        }

        nextClick = Date.now() + 250;

        const option = { ...currentMenu.points[index] };
        handleFrontendSound('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');

        await WheelMenu.close();

        if (option.callback) {
            if (option.data) {
                option.callback(...option.data);
            } else {
                option.callback();
            }
        }

        if (option.emitClient) {
            if (option.data) {
                alt.emit(option.emitClient, ...option.data);
            } else {
                alt.emit(option.emitClient);
            }
        }

        if (option.emitServer) {
            if (option.data) {
                alt.emitServer(option.emitServer, ...option.data);
            } else {
                alt.emitServer(option.emitServer);
            }
        }
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_WHEEL_MENU, InternalFunctions.dynamicWheelMenu);
