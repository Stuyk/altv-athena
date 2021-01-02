import { System_Events_World } from '../../shared/enums/system';
import * as alt from 'alt-client';
import * as native from 'natives';

const weatherTransitionTime = 35;

// Weather
let previousWeather: string = 'OVERCAST';
let weather: string;

// Time
let hasPausedClock = false;
let currentTime = {
    hour: 0,
    minute: 0
};

alt.onServer(System_Events_World.UpdateTime, handleUpdateTime);
alt.onServer(System_Events_World.UpdateWeather, handleUpdateWeather);
alt.on('debug:Time', getTime);

function handleUpdateTime(hour: number, minute: number): void {
    if (!hasPausedClock) {
        hasPausedClock = true;
        native.pauseClock(true);
    }

    currentTime.hour = hour;
    currentTime.minute = minute;

    native.setClockTime(hour, minute, 0);
}

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

async function updateWeather(fromHash: number, toHash: number, counter: number = 0): Promise<void> {
    return new Promise((resolve): void => {
        let interval = alt.setInterval(() => {
            counter += 1;

            if (counter < 100) {
                native.setWeatherTypeTransition(fromHash, toHash, counter / 100);
                return;
            }

            resolve();
            alt.clearInterval(interval);
        }, weatherTransitionTime * 10);
    });
}

function getTime() {
    alt.log(`Time: ${currentTime.hour}:${currentTime.minute}:00`);
}
