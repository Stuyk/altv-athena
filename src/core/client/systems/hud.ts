import * as alt from 'alt-client';
import * as native from 'natives';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_STATE } from '../../shared/enums/vehicle';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import IHud from '../interface/IHud';
import { getPointsInCircle } from '../utility/math';
import { isAnyMenuOpen } from '../utility/menus';
import { drawText2D } from '../utility/text';
import { drawTexture2D, loadTexture } from '../utility/texture';
import { Timer } from '../utility/timers';
import { World } from './world';

let interval;
let objective: string;
let isUpdating: boolean = false;
let hudElements: Array<IHud> = [
    {
        identifier: 'hud-cash',
        position: {
            x: 0.98,
            y: 0.02
        },
        padding: 0.01,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            const value = alt.Player.local.meta.cash ? alt.Player.local.meta.cash : 0;
            const fixedValue = parseFloat(value.toFixed(2));
            return `Cash ~g~$${fixedValue.toLocaleString()}`;
        }
    },
    {
        identifier: 'hud-bank',
        position: {
            x: 0.98,
            y: 0.07
        },
        padding: 0.01,
        align: 2,
        scale: 0.5,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            const value = alt.Player.local.meta.bank ? alt.Player.local.meta.bank : 0;
            const fixedValue = parseFloat(value.toFixed(2));
            return `Bank ~g~$${fixedValue.toLocaleString()}`;
        }
    },
    {
        identifier: 'hud-food',
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
        identifier: 'hud-water',
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
        identifier: 'hud-vehicle',
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
        identifier: 'hud-time',
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
        identifier: 'hud-objective',
        position: {
            x: 0.5,
            y: 0.9
        },
        padding: 0,
        align: 0,
        scale: 0.6,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: () => {
            return objective ? objective : '';
        }
    },
    {
        identifier: 'hud-wanted',
        position: {
            x: 0.54,
            y: 0.08
        },
        padding: 0,
        align: 0,
        scale: 0.75,
        color: new alt.RGBA(255, 255, 255, 225),
        callback: (pos: { x: number; y: number }, scale: number) => {
            loadTexture('mpleaderboard').then(() => {
                const value = alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.WANTED_LEVEL);
                const stars = value !== null ? value : 0;

                for (let i = 0; i < 5; i++) {
                    const newPos = {
                        x: pos.x - 0.02 * i,
                        y: pos.y
                    };

                    if (i + 1 >= 6 - stars) {
                        drawTexture2D('mpleaderboard', 'leaderboard_star_icon', newPos, scale, 255);
                        continue;
                    }

                    drawTexture2D('mpleaderboard', 'leaderboard_star_icon', newPos, scale, 100);
                }
            });

            return null;
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
    static remove(identifier: string): boolean {
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

            const value = hudElements[i].callback(element.position, element.scale);
            if (!value) {
                continue;
            }

            drawText2D(value, element.position, element.scale, element.color, element.align, element.padding);
        }
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, HudSystem.init);
