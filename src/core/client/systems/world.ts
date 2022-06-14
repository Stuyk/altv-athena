import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { WORLD_WEATHER } from '../../shared/enums/weather';

export class World {
    static hasPausedClock = false;
    static previousWeather = 'Overcast';
    static weather: string;
    static hour: number = 0;
    static minute: number = 0;

    /**
     * Normalize the hour value to be between 0 and 23.
     * @param {number} value - number - The value to be normalized.
     * @returns The function normalizeHour() is returning the value of the parameter value.
     */
    static normalizeHour(value: number) {
        if (value >= 13) {
            return value - 12;
        }

        return value;
    }

    /**
     * Normalize a value to two digits.
     * @param {number} value - number - The value to be normalized.
     * @returns The function is returning the value of the variable.
     */
    static normalizeValue(value: number) {
        if (value <= 9) {
            return `0${value}`;
        }

        return `${value}`;
    }

    static getTimeAsString(): string {
        if (SHARED_CONFIG.USE_24H_TIME_FORMAT) {
            const hour = World.normalizeValue(World.hour);
            const minute = World.normalizeValue(World.minute);

            return `${hour}:${minute}`;
        }

        const timeOfDay = World.hour >= 12 ? 'PM' : 'AM';
        const hour = World.normalizeValue(World.normalizeHour(World.hour));
        const minute = World.normalizeValue(World.minute);

        return `${hour}:${minute} ${timeOfDay}`;
    }

    /**
     * return the current time as a number.
     * @returns The time as a number.
     */
    static getTimeAsNumber(): { hour: number; minute: number } {
        return { hour: World.hour, minute: World.minute };
    }

    /**
     * Update the time of day.
     * @param {number} hour - The hour of the day.
     * @param {number} minute - The minute of the day.
     * @returns None
     */
    static updateTime(hour: number, minute: number) {
        if (!World.hasPausedClock) {
            World.hasPausedClock = true;
            native.pauseClock(true);
        }

        World.hour = hour;
        World.minute = minute;
        native.setClockTime(hour, minute, 0);
    }

    /**
     * When the weather changes, update the weather and play the appropriate audio.
     * @param {string} name - The name of the weather.
     */
    static updateWeather(name: string) {
        World.weather = name;

        if (World.weather !== World.previousWeather) {
            native.setWeatherTypeOvertimePersist(World.weather, 30);
            World.previousWeather = World.weather;

            if (World.weather === WORLD_WEATHER.XMAS) {
                native.setForceVehicleTrails(true);
                native.setForcePedFootstepsTracks(true);
                native.requestScriptAudioBank('ICE_FOOTSTEPS', false, 0);
                native.requestScriptAudioBank('SNOW_FOOTSTEPS', false, 0);
                return;
            }

            native.releaseNamedScriptAudioBank('ICE_FOOTSTEPS');
            native.releaseNamedScriptAudioBank('SNOW_FOOTSTEPS');
            native.setForceVehicleTrails(false);
            native.setForcePedFootstepsTracks(false);
        }
    }
}

function getTime() {
    alt.log(`Time: ${World.hour}:${World.minute}:00`);
}

alt.onServer(SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.updateTime);
alt.onServer(SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, World.updateWeather);
alt.on('debug:Time', getTime);
