import * as alt from 'alt-client';
import * as native from 'natives';
import { HUD_IDENTIFIER } from '../../shared/enums/hudIdentifiers';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { VEHICLE_STATE } from '../../shared/enums/vehicle';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import IHud from '../interface/iHud';
import { isAnyMenuOpen } from '../utility/menus';
import { drawText2D } from '../utility/text';
import { Timer } from '../utility/timers';
import { World } from './world';

/**
 * DEPRECATED IN 3.0.0
 * FILE LEFT HERE FOR INFORMATION PURPOSES
 *
 * NEW HUD IS IN VIEWS/HUD.TS
 */

let interval;
let objective: string;
let isUpdating: boolean = false;
let hudElements: Array<IHud> = [
    {
        identifier: 'hud-cash',
        position: {
            x: 0.98,
            y: 0.02,
        },
        padding: 0.04,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud, pos: { x: number; y: number }) => {
            const value = alt.Player.local.meta.cash ? alt.Player.local.meta.cash : 0;
            const fixedValue = parseFloat(value.toFixed(0));

            if (self.callbackReroute) {
                self.callbackReroute(fixedValue);
                return null;
            }

            return `~g~$${fixedValue.toLocaleString()} ~w~CASH`;
        },
    },
    {
        identifier: 'hud-bank',
        position: {
            x: 0.98,
            y: 0.07,
        },
        padding: 0.04,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud, pos: { x: number; y: number }) => {
            const value = alt.Player.local.meta.bank ? alt.Player.local.meta.bank : 0;
            const fixedValue = parseFloat(value.toFixed(0));

            if (self.callbackReroute) {
                self.callbackReroute(fixedValue);
                return null;
            }

            return ` ~g~$${fixedValue.toLocaleString()} ~w~BANK`;
        },
    },
    {
        identifier: 'hud-food',
        position: {
            x: 0.98,
            y: 0.12,
        },
        padding: 0.04,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud, pos: { x: number; y: number }) => {
            const food = alt.Player.local.meta.food;

            if (self.callbackReroute) {
                const actualFood = food !== undefined && food !== null ? food.toFixed(0) : 100;
                self.callbackReroute(actualFood);
                return null;
            }

            return food !== undefined && food !== null ? `${food.toFixed(0)} FOOD` : `100 FOOD`;
        },
    },
    {
        identifier: 'hud-water',
        position: {
            x: 0.98,
            y: 0.17,
        },
        padding: 0.04,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud, pos: { x: number; y: number }) => {
            const water = alt.Player.local.meta.water;

            if (self.callbackReroute) {
                const actualWater = water !== undefined && water !== null ? water.toFixed(0) : 100;
                self.callbackReroute(actualWater);
                return null;
            }

            return water !== undefined && water !== null ? `${water.toFixed(0)} WATER` : `100 WATER`;
        },
    },
    {
        identifier: 'hud-vehicle',
        position: {
            x: 0.5,
            y: 0.95,
        },
        padding: 0,
        align: 0,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud) => {
            let text = '';
            const isMetric = native.getProfileSetting(227);
            const currentSpeed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
            const speedCalc = (currentSpeed * (isMetric ? 3.6 : 2.236936)).toFixed(0);
            let fuel = 100;

            if (alt.Player.local.vehicle.hasSyncedMeta(VEHICLE_STATE.FUEL)) {
                fuel = alt.Player.local.vehicle.getSyncedMeta(VEHICLE_STATE.FUEL) as number;
            }

            // Speedometer
            text += `~b~${speedCalc} ${isMetric ? 'KM/H' : 'MP/H'} ~w~| `;

            // Fuel
            text += `~o~${LocaleController.get(LOCALE_KEYS.VEHICLE_FUEL)} ${fuel.toFixed(2)}% ~w~| `;

            // Door Locks
            const isLocked = native.getVehicleDoorLockStatus(alt.Player.local.vehicle.scriptID) === 2;
            if (isLocked) {
                text += `~r~${LocaleController.get(LOCALE_KEYS.VEHICLE_LOCKED)}`;
            } else {
                text += `~g~${LocaleController.get(LOCALE_KEYS.VEHICLE_UNLOCKED)}`;
            }

            if (self.callbackReroute) {
                self.callbackReroute(isMetric, speedCalc, fuel, isLocked);
                return null;
            }

            return text;
        },
        isVehicle: true,
    },
    {
        identifier: 'hud-time',
        position: {
            x: 0.5,
            y: 0.02,
        },
        padding: 0,
        align: 0,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud) => {
            if (self.callbackReroute) {
                self.callbackReroute(World.getTimeAsString());
                return null;
            }

            return World.getTimeAsString();
        },
    },
    {
        identifier: 'hud-objective',
        position: {
            x: 0.5,
            y: 0.9,
        },
        padding: 0,
        align: 0,
        scale: 0.6,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud) => {
            if (self.callbackReroute) {
                self.callbackReroute(objective);
                return null;
            }

            return objective ? objective : '';
        },
    },
    {
        identifier: 'hud-wanted',
        position: {
            x: 0.54,
            y: 0.08,
        },
        padding: 0,
        align: 0,
        scale: 0.75,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (self: IHud, pos: { x: number; y: number }, scale: number) => {
            const value = alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.WANTED_LEVEL);
            const stars = value !== null ? value : 0;

            if (self.callbackReroute) {
                self.callbackReroute(stars);
                return null;
            }

            drawText2D(`Stars: ${stars}`, { x: pos.x, y: pos.y }, 0.4, new alt.RGBA(255, 255, 255, 100));
            return null;
        },
    },
];

export class HudSystem {
    /**
     * Initialize HUD
     * @static
     * @memberof HudSystem
     */
    static init() {
        if (interval) {
            Timer.clearInterval(interval);
        }

        interval = Timer.createInterval(HudSystem.render, 0, 'hud.ts');
    }

    /**
     * Set the objective text used for the job interface.
     * @static
     * @param {(string | null)} text
     * @memberof HudSystem
     */
    static setObjective(text: string | null) {
        objective = text;
    }

    /**
     * Append some native text to display on the hud.
     * Uses callback functions to generate the data to display.
     * @static
     * @param {IHud} element
     * @memberof HudSystem
     */
    static add(element: IHud) {
        hudElements.push(element);
    }

    /**
     * Remove a HUD element from being rendered.
     * Returns true or false if the element was removed successfully.
     * @static
     * @param {string} identifier
     * @memberof HudSystem
     */
    static remove(identifier: HUD_IDENTIFIER | string): boolean {
        isUpdating = true;

        const index = hudElements.findIndex((x) => x.identifier === identifier);
        if (index <= -1) {
            isUpdating = false;
            return false;
        }

        hudElements.splice(index, 1);
        isUpdating = false;
        return true;
    }

    /**
     * Used to Overwrite a Default HUD Element
     * Great for re-routing to your own WebView
     * @static
     * @param {HUD_IDENTIFIER} identifier
     * @param {(...args: any[]) => void} overwriteCallback
     * @return {*}
     * @memberof HudSystem
     */
    static overwriteCallback(identifier: HUD_IDENTIFIER, overwriteCallback: (...args: any[]) => void) {
        isUpdating = true;

        const index = hudElements.findIndex((x) => x.identifier === identifier);
        if (index <= -1) {
            isUpdating = false;
            return;
        }

        hudElements[index].callbackReroute = overwriteCallback;
        isUpdating = false;
    }

    /**
     * Render HUD Elements
     * @static
     * @return {*}
     * @memberof HudSystem
     */
    private static render() {
        if (isAnyMenuOpen(true)) {
            return;
        }

        if (isUpdating) {
            return;
        }

        for (let i = 0; i < hudElements.length; i++) {
            const element = hudElements[i];

            // In Vehicle Rendering
            if (element.isVehicle && !alt.Player.local.vehicle) {
                continue;
            }

            const value = hudElements[i].callback(hudElements[i], element.position, element.scale);
            if (!value) {
                continue;
            }

            drawText2D(
                value.toString(),
                element.position,
                element.scale,
                element.color,
                element.align,
                element.padding,
            );
        }
    }
}

// Turn on Old Hud Here
// alt.onServer(SYSTEM_EVENTS.TICKS_START, HudSystem.init);
