import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_STATE } from '../../shared/enums/vehicle';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import IHud from '../interface/IHud';
import { isAnyMenuOpen } from '../utility/menus';
import { drawText2D } from '../utility/text';
import { World } from './world';

let interval;
let objective: string;
let hudElements: Array<IHud> = [
    {
        // Cash
        position: {
            x: 0.98,
            y: 0.02
        },
        padding: 0.01,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            return alt.Player.local.meta.cash ? `Cash ~g~$${alt.Player.local.meta.cash.toFixed(2)}` : `Cash ~g~$0`;
        }
    },
    {
        // Bank
        position: {
            x: 0.98,
            y: 0.07
        },
        padding: 0.01,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            return alt.Player.local.meta.bank ? `Bank ~g~$${alt.Player.local.meta.bank.toFixed(2)}` : `Bank ~g~$0`;
        }
    },
    {
        // Food
        position: {
            x: 0.98,
            y: 0.12
        },
        padding: 0.01,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            return alt.Player.local.meta.food ? `Food ${alt.Player.local.meta.food.toFixed(2)}%` : `Food - 100%`;
        }
    },
    {
        // Water
        position: {
            x: 0.98,
            y: 0.17
        },
        padding: 0.01,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            return alt.Player.local.meta.water ? `Water ${alt.Player.local.meta.water.toFixed(2)}%` : `Water - 100%`;
        }
    },
    {
        // Speedometer, Fuel, Lock Status, Seatbelt
        position: {
            x: 0.5,
            y: 0.95
        },
        padding: 0,
        align: 0,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            let text = '';
            const isMetric = native.getProfileSetting(227);
            const currentSpeed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
            const speedCalc = (currentSpeed * (isMetric ? 3.6 : 2.236936)).toFixed(0);
            let fuel = 100;

            if (alt.Player.local.vehicle.hasSyncedMeta(VEHICLE_STATE.FUEL)) {
                fuel = alt.Player.local.vehicle.getSyncedMeta(VEHICLE_STATE.FUEL);
            }

            // Speedometer
            text += `~b~${speedCalc} ${isMetric ? 'KM/H' : 'MP/H'} ~w~| `;

            // Fuel
            text += `~o~${LocaleController.get(LOCALE_KEYS.VEHICLE_FUEL)} ${fuel.toFixed(2)}% ~w~| `;

            // Door Locks
            if (native.getVehicleDoorLockStatus(alt.Player.local.vehicle.scriptID) === 2) {
                text += `~r~${LocaleController.get(LOCALE_KEYS.VEHICLE_LOCKED)}`;
            } else {
                text += `~g~${LocaleController.get(LOCALE_KEYS.VEHICLE_UNLOCKED)}`;
            }

            return text;
        },
        isVehicle: true
    },
    {
        // World Time
        position: {
            x: 0.5,
            y: 0.02
        },
        padding: 0,
        align: 0,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            return World.getTimeAsString();
        }
    },
    {
        // Objective
        position: {
            x: 0,
            y: 0.9
        },
        padding: 0,
        align: 0,
        scale: 0.6,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            return objective ? objective : '';
        }
    }
];

export class HudSystem {
    /**
     * Initialize HUD
     * @static
     * @memberof HudSystem
     */
    static init() {
        if (interval) {
            alt.clearInterval(interval);
        }

        interval = alt.setInterval(HudSystem.render, 0);
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
    static appendToHud(element: IHud) {
        hudElements.push(element);
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

        for (let i = 0; i < hudElements.length; i++) {
            const element = hudElements[i];

            // In Vehicle Rendering
            if (element.isVehicle && !alt.Player.local.vehicle) {
                continue;
            }

            const value = hudElements[i].callback(element.position, element.scale);
            drawText2D(value, element.position, element.scale, element.color, element.align, element.padding);
        }
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, HudSystem.init);
