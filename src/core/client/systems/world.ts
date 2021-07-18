import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

export class World {
    static hasPausedClock = false;
    static previousWeather = 'Overcast';
    static weather: string;
    static hour: number = 0;
    static minute: number = 0;

    static normalizeHour(value: number) {
        if (value >= 13) {
            return value - 12;
        }

        return value;
    }

    static normalizeValue(value: number) {
        if (value <= 9) {
            return `0${value}`;
        }

        return `${value}`;
    }

    static getTimeAsString(): string {
        const timeOfDay = World.hour >= 12 ? 'PM' : 'AM';
        const hour = World.normalizeValue(World.normalizeHour(World.hour));
        const minute = World.normalizeValue(World.minute);

        return `${hour}:${minute} ${timeOfDay}`;
    }

    static getTimeAsNumber(): { hour: number; minute: number } {
        return { hour: World.hour, minute: World.minute };
    }

    static updateTime(hour: number, minute: number) {
        if (!World.hasPausedClock) {
            World.hasPausedClock = true;
            native.pauseClock(true);
        }

        World.hour = hour;
        World.minute = minute;
        native.setClockTime(hour, minute, 0);
    }

    static updateWeather(name: string) {
        World.weather = name;

        if (World.weather !== World.previousWeather) {
            native.setWeatherTypeOvertimePersist(World.weather, 30);
            World.previousWeather = World.weather;

            if (World.weather === 'XMAS') {
                native.setForceVehicleTrails(true);
                native.setForcePedFootstepsTracks(true);
                return;
            }

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
