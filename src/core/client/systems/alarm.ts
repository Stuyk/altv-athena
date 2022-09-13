import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Timer } from '../utility/timers';

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ALARM_START, startAlarm);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ALARM_STOP, stopAlarm);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ALARM_STOP_ALL, stopAllAlarms);

const MaxLoadAttempts = 25;

/**
 * Attempts to load an alarm multiple times before returning false.
 * @param {string} name The name of the alarm.
 * @param {number} [count=0] Do not modify this. Leave it as zero.
 * @return {Promise<boolean>}  {Promise<boolean>}
 */
export async function loadAlarm(name: string, count: number = 0): Promise<boolean> {
    return new Promise((resolve: Function): void => {
        if (native.prepareAlarm(name)) {
            resolve(true);
            return;
        }

        const interval = Timer.createInterval(
            () => {
                count += 1;

                if (native.prepareAlarm(name)) {
                    Timer.clearInterval(interval);
                    resolve(true);
                    return;
                }

                if (count >= MaxLoadAttempts) {
                    Timer.clearInterval(interval);
                    resolve(false);
                    return;
                }

                native.prepareAlarm(name);
            },
            250,
            'alarm.ts',
        );
    });
}

/**
 * Play an alarm for the local player.
 * @export
 * @param {string} name The name of the alarm.
 * @return {Promise<void>}  {Promise<void>}
 */
export async function startAlarm(
    name: string,
): Promise<void> {
    const isPrepared = await loadAlarm(name);
    if (!isPrepared) {
        return;
    }

    if (!alt.Player.local || !alt.Player.local.valid) {
        return;
    }

    if (native.isAlarmPlaying(name)) {
        return;
    }

    native.startAlarm(name, true);
}

/**
 * Stop an alarm for the local player.
 * @export
 * @param {string} name The name of the alarm.
 * @return {Promise<void>}  {Promise<void>}
 */
export async function stopAlarm(
    name: string,
): Promise<void> {
    if (!native.isAlarmPlaying(name)) {
        return;
    }

    native.stopAlarm(name, true);
}

/**
 * Stop all alarms for the local player.
 * @export
 * @return {Promise<void>}  {Promise<void>}
 */
export async function stopAllAlarms(): Promise<void> {
    try {
        native.stopAllAlarms(true);
    } catch (error) {
        alt.log(error);
    }
}
