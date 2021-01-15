import * as alt from 'alt-server';
import { System_Events_World } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';

alt.setInterval(handleWorldTime, 60000);
alt.on(System_Events_World.UpdateWeather, updatePlayerWeather);

const WorldDivision = 6;
const GlobalTime = {
    hour: DEFAULT_CONFIG.BOOTUP_HOUR,
    minute: DEFAULT_CONFIG.BOOTUP_MINUTE
};

// 12,000 Total Units
const maxY = 8000;
const minY = -4000;
const minMaxGroups = generateMinMaxs(WorldDivision);

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

function handleWorldTime(): void {
    GlobalTime.minute += DEFAULT_CONFIG.MINUTES_PER_MINUTE;
    if (GlobalTime.minute >= 60) {
        GlobalTime.minute = 0;
        GlobalTime.hour += 1;

        const endElement = DEFAULT_CONFIG.WEATHER_ROTATION.pop();
        DEFAULT_CONFIG.WEATHER_ROTATION.unshift(endElement);
    }

    if (GlobalTime.hour >= 24) {
        GlobalTime.hour = 0;
    }
}

/**
 * Divides the world horizontally.
 * @param {number} division
 * @return {Array<{ minY: number; maxY: number }>}  {Array<{ minY: number; maxY: number }>}
 */
function generateMinMaxs(division: number): Array<{ minY: number; maxY: number }> {
    let groups = [];
    let total = maxY + Math.abs(minY);

    for (let i = 0; i < division; i++) {
        const result = {
            maxY: maxY - (total / division) * i,
            minY: maxY - 2000 - (total / division) * i
        };

        groups.push(result);
    }

    return groups;
}

/**
 * Updates the player time to match server time.
 * @export
 * @param {alt.Player} player
 */
export function updatePlayerTime(player: alt.Player): void {
    alt.emitClient(player, System_Events_World.UpdateTime, GlobalTime.hour, GlobalTime.minute);
}

/**
 * Updates player weather based on current area.
 * @export
 * @param {alt.Player} player
 * @return {*}  {void}
 */
export function updatePlayerWeather(player: alt.Player): void {
    const gridSpace = minMaxGroups.findIndex(
        (pos) => player && player.valid && player.pos.y > pos.minY && player.pos.y < pos.maxY
    );

    if (gridSpace <= -1) {
        player.emit().event(System_Events_World.UpdateWeather, DEFAULT_CONFIG.WEATHER_ROTATION[0]);
        player.currentWeather = DEFAULT_CONFIG.WEATHER_ROTATION[0];
        player.gridSpace = 0;
        player.emit().meta('gridSpace', gridSpace);
        return;
    }

    player.emit().event(System_Events_World.UpdateWeather, DEFAULT_CONFIG.WEATHER_ROTATION[gridSpace]);
    player.currentWeather = DEFAULT_CONFIG.WEATHER_ROTATION[gridSpace];
    player.gridSpace = gridSpace;
    player.emit().meta('gridSpace', gridSpace);
}
