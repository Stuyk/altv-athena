import * as alt from 'alt-server';
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

export class World {
    static minMaxGroups: Array<{ minY: number; maxY: number }>;
    static hour: number = DEFAULT_CONFIG.BOOTUP_HOUR;
    static minute: number = DEFAULT_CONFIG.BOOTUP_MINUTE;

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
                minY: maxY - 2000 - (total / division) * i
            };

            groups.push(result);
        }

        World.minMaxGroups = groups;
    }

    static updateWorldTime(): void {
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

    static getGridSpace(player: alt.Player): number {
        const gridSpace = World.minMaxGroups.findIndex(
            (pos) => player && player.valid && player.pos.y > pos.minY && player.pos.y < pos.maxY
        );

        return gridSpace === -1 ? 0 : gridSpace;
    }

    static getWeatherByGrid(gridIndex: number): string {
        return DEFAULT_CONFIG.WEATHER_ROTATION[gridIndex];
    }
}

alt.setInterval(World.updateWorldTime, 60000);
World.generateGrid(worldDivision);
World.updateWorldTime();
