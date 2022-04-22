import * as alt from 'alt-server';
import { WORLD_WEATHER } from '../../shared/enums/weather';
import { DEFAULT_CONFIG } from '../athena/main';

/* -- Top of Map --
 * 0 - Weather at Index 0
 * 1 - Weather at Index 1
 * 2 - Weather at Index 2
 * 3 - Weather at Index 3
 * 4 - Weather at Index 4
 * 5 - Weather at Index 5
 * --- Bottom of Map ---
 * Every 1 Hour Time Update. Pops the last element of the array.
 * Then shifts it into the beginning of the array.
 *
 * This rotates weathers from top to bottom. Creating a
 * wave of weather across the map.
 *
 */

// Best kept at 6 unless you know what you're doing.
const worldDivision = 6;
const maxY = 8000;
const minY = -4000;

let weatherOverride = false;
let weatherOverrideName = null;
let timeOverride = false;
let timeOverrideHour = null;
let timeRule: () => { hour: number; minute: number; updateWeather?: boolean } = null;

export class World {
    static minMaxGroups: Array<{ minY: number; maxY: number }>;
    static hour: number = DEFAULT_CONFIG.BOOTUP_HOUR;
    static minute: number = DEFAULT_CONFIG.BOOTUP_MINUTE;

    /**
     * Register a time rule where when the rule is ran it will return the hour, minute, and second.
     * This allows you to completely override the entire time system.
     *
     * @static
     * @param {() => { hour: number, minute: number }} callback
     * @memberof World
     */
    static registerTimeRule(callback: () => { hour: number; minute: number; updateWeather?: boolean }) {
        timeRule = callback;
    }

    /**
     * Used to override weather setting for all players.
     * Automatically synchronized.
     * @static
     * @param {boolean} value
     * @param {string} [_weatherName='']
     * @memberof World
     */
    static setOverrideWeather(value: boolean, _weatherName: string = '') {
        if (!_weatherName) {
            _weatherName = WORLD_WEATHER.EXTRA_SUNNY;
        }

        weatherOverride = value;
        weatherOverrideName = _weatherName;
    }

    /**
     * Used to override time setting for all players.
     * Automatically synchronized.
     * @static
     * @param {boolean} value
     * @param {number} _hour
     * @memberof World
     */
    static setOverrideTime(value: boolean, _hour: number) {
        if (typeof _hour === 'string') {
            _hour = parseInt(_hour);
        }

        timeOverride = value;
        timeOverrideHour = _hour;
    }

    /**
     * Generates a reference grid for weather and objects.
     * @static
     * @param {number} division
     * @memberof World
     */
    static generateGrid(division: number): void {
        let groups: Array<{ minY: number; maxY: number }> = [];
        let total = maxY + Math.abs(minY);

        for (let i = 0; i < division; i++) {
            const result = {
                maxY: maxY - (total / division) * i,
                minY: maxY - 2000 - (total / division) * i,
            };

            groups.push(result);
        }

        World.minMaxGroups = groups;
    }

    static updateWorldTime(): void {
        // Set a time rule to completely override this system.
        if (timeRule) {
            const result = timeRule();
            if (result) {
                World.hour = result.hour;
                World.minute = result.minute;

                if (result.updateWeather) {
                    const endElement = DEFAULT_CONFIG.WEATHER_ROTATION.pop();
                    DEFAULT_CONFIG.WEATHER_ROTATION.unshift(endElement);
                }

                return;
            }

            alt.logWarning(`World Time Update Override was Incorrect. Fix formatting and object.`);
        }

        if (DEFAULT_CONFIG.USE_SERVER_TIME) {
            // Uses local time of where the server is located.
            // Change the time of the server to change this.
            const time = new Date(Date.now());
            World.minute = time.getMinutes();
            World.hour = time.getHours();

            // Updates Weather Every 30 Minutes
            if (World.minute !== 30 && World.minute !== 0) {
                return;
            }

            const endElement = DEFAULT_CONFIG.WEATHER_ROTATION.pop();
            DEFAULT_CONFIG.WEATHER_ROTATION.unshift(endElement);
            return;
        }

        World.minute += DEFAULT_CONFIG.MINUTES_PER_MINUTE;
        if (World.minute >= 60) {
            World.minute = 0;
            World.hour += 1;

            const endElement = DEFAULT_CONFIG.WEATHER_ROTATION.pop();
            DEFAULT_CONFIG.WEATHER_ROTATION.unshift(endElement);
        }

        if (World.hour >= 24) {
            World.hour = 0;
        }
    }

    /**
     * "Get the grid space of the player."
     * @param {alt.Player} player - alt.Player - The player to check.
     * @returns The index of the minMaxGroups array.
     */
    static getGridSpace(player: alt.Player): number {
        const gridSpace = World.minMaxGroups.findIndex(
            (pos) => player && player.valid && player.pos.y > pos.minY && player.pos.y < pos.maxY,
        );

        return gridSpace === -1 ? 0 : gridSpace;
    }

    /**
     * Get the weather for the current grid.
     * @param {number} gridIndex - The index of the grid in the grid array.
     * @returns The weather for the gridIndex.
     */
    static getWeatherByGrid(gridIndex: number): string {
        if (weatherOverride) {
            return weatherOverrideName;
        }

        return DEFAULT_CONFIG.WEATHER_ROTATION[gridIndex];
    }

    /**
     * return the hour of the world if there's a time override, otherwise return the hour of the
    world.
     * @returns The current hour.
     */
    static getWorldHour() {
        if (timeOverride) {
            return timeOverrideHour;
        }

        return World.hour;
    }

    /**
     * return the current minute of the world.
     * @returns The number of minutes in the current world.
     */
    static getWorldMinute() {
        return World.minute;
    }
}

alt.setInterval(World.updateWorldTime, 60000);
World.generateGrid(worldDivision);
World.updateWorldTime();