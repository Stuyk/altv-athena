import * as alt from 'alt-server';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { VITAL_NAMES } from '../../shared/enums';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { VITALS_CONFIG } from '../../shared/src/config';
import { Athena } from '../../../../server/api/athena';

const syncTimes: { [player_id: string]: number } = {};

class InternalFunctions {
    /**
     * If the player is dead, set their food and water to 100. Otherwise, remove food and water at the
     * rate specified in the config.
     * @param player - alt.Player - The player who's vital is being adjusted.
     * @returns Nothing.
     */
    static handlePing(player: alt.Player) {
        if (syncTimes[player.id] && Date.now() < syncTimes[player.id]) {
            return;
        }

        syncTimes[player.id] = Date.now() + VITALS_CONFIG.TIME_BETWEEN_UPDATES_IN_MS;

        if (player.data.isDead) {
            player.data[VITAL_NAMES.FOOD] = 100;
            player.data[VITAL_NAMES.WATER] = 100;
            Athena.player.emit.meta(player, VITAL_NAMES.FOOD, player.data[VITAL_NAMES.FOOD]);
            Athena.player.emit.meta(player, VITAL_NAMES.WATER, player.data[VITAL_NAMES.WATER]);
            return;
        }

        VitalsSystem.adjustVital(player, VITAL_NAMES.FOOD, -VITALS_CONFIG.FOOD_REMOVAL_RATE);
        VitalsSystem.adjustVital(player, VITAL_NAMES.WATER, -VITALS_CONFIG.WATER_REMOVAL_RATE);
    }
}

export class VitalsSystem {
    /**
     * Intialize the vitals system and start listening for the `PLAYER_TICK` event.
     *
     * @static
     * @memberof VitalsSystem
     */
    static init() {
        // This is called every 5s
        alt.onClient(SYSTEM_EVENTS.PLAYER_TICK, InternalFunctions.handlePing);

        // This is called when the player selects a character
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, (player) => {
            VitalsSystem.forceUpdateVital(player, VITAL_NAMES.FOOD);
            VitalsSystem.forceUpdateVital(player, VITAL_NAMES.WATER);
        });
    }

    /**
     * `forceUpdateVital` is a function that takes a player and a vital name and emits a meta event to
     * the player's client. Forcing the vital to update in the HUD.
     * @param player - alt.Player - The player who's vital is being updated.
     * @param {VITAL_NAMES} vitalName - The name of the vital to update.
     */
    static forceUpdateVital(player: alt.Player, vitalName: VITAL_NAMES) {
        if (!player.data[vitalName]) {
            player.data[vitalName] = 100;
        }

        Athena.player.emit.meta(player, vitalName, player.data[vitalName]);
    }

    /**
     * Adjust a vital by name to add / subtract the current vital amount.
     * Use `-` to subtract a value.
     *
     * @static
     * @param {alt.Player} player
     * @param {number} value 0 - 100
     * @param {VITAL_NAMES} vitalName
     * @memberof VitalsSystem
     */
    static adjustVital(player: alt.Player, vitalName: VITAL_NAMES, value: number, isExact = false) {
        if (typeof value === 'string') {
            value = parseFloat(value);
        }

        if (!isExact) {
            if (player.data[vitalName] === undefined || player.data[vitalName] === null) {
                player.data[vitalName] = 100;
            }

            player.data[vitalName] += value;

            if (player.data[vitalName] < 0) {
                player.data[vitalName] = 0;
            }

            if (player.data[vitalName] > 100) {
                player.data[vitalName] = 100;
            }
        } else {
            player.data[vitalName] = Math.abs(value);
        }

        Athena.player.emit.meta(player, vitalName, player.data[vitalName]);
        Athena.player.save.field(player, vitalName, player.data[vitalName]);
    }

    /**
     * Normalize a vitals value so it is between 0 and 100.
     *
     * Prevents overflow.
     *
     * @static
     * @param {number} value
     * @return {*}
     * @memberof VitalsSystem
     */
    static normalizeVital(value: number) {
        if (value > 100) {
            value = 100;
        }

        if (value < 0) {
            value = 0;
        }

        return value;
    }
}
