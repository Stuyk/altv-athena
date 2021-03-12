import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { PhoneController } from '../views/hud/controllers/phoneController';
import { BaseHUD } from '../views/hud/hud';

// Weather
let previousWeather: string = 'OVERCAST';
let weather: string;

// Time
let hasPausedClock = false;
let currentTime = {
    hour: 0,
    minute: 0
};

alt.onServer(SYSTEM_EVENTS.WORLD_UPDATE_TIME, handleUpdateTime);
alt.onServer(SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, handleUpdateWeather);
alt.on('debug:Time', getTime);

/**
 * Synchronizes our current time with the server.
 * @param {number} hour
 * @param {number} minute
 */
function handleUpdateTime(hour: number, minute: number): void {
    if (!hasPausedClock) {
        hasPausedClock = true;
        native.pauseClock(true);
    }

    currentTime.hour = hour;
    currentTime.minute = minute;

    PhoneController.updateTime(currentTime.hour, currentTime.minute);
    native.setClockTime(hour, minute, 0);
}

/**
 * Synchronizes our local weather with the server.
 * @param {string} newWeatherName
 * @return {*}  {Promise<void>}
 */
async function handleUpdateWeather(newWeatherName: string): Promise<void> {
    weather = newWeatherName;

    if (weather !== previousWeather) {
        native.setWeatherTypeOvertimePersist(weather, 30);
        previousWeather = weather;

        if (weather === 'XMAS') {
            native.setForceVehicleTrails(true);
            native.setForcePedFootstepsTracks(true);
            return;
        }

        native.setForceVehicleTrails(false);
        native.setForcePedFootstepsTracks(false);
    }
}

function getTime() {
    alt.log(`Time: ${currentTime.hour}:${currentTime.minute}:00`);
}
