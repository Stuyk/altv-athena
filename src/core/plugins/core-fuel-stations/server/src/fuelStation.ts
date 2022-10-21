import * as alt from 'alt-server';
import { getClosestEntity } from '../../../../server/utility/vector';
import { VIEW_EVENTS_FUEL_TRIGGER } from '../../shared/events';
import { LOCALE_FUEL_STATIONS } from '../../shared/locales';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { Vehicle_Behavior } from '../../../../shared/enums/vehicle';
import { JobTrigger } from '../../../../shared/interfaces/jobTrigger';
import { isFlagEnabled } from '../../../../shared/utility/flags';
import { distance2d } from '../../../../shared/utility/vector';
import { FUEL_CONFIG } from './config';
import stations from './stations';
import { Athena } from '../../../../server/api/athena';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';

const maximumFuel = 100;
const fuelInfo: { [playerID: string]: FuelStatus } = {};
const LastTriggers: { [id: string]: JobTrigger } = {};

interface FuelStatus {
    vehicle: alt.Vehicle;
    cost: number;
    fuel: number;
    timeout: number;
}

export class FuelStationSystem {
    static init() {
        alt.onClient(VIEW_EVENTS_FUEL_TRIGGER.ACCEPT, FuelStationSystem.acceptDialog);
        alt.onClient(VIEW_EVENTS_FUEL_TRIGGER.CANCEL, FuelStationSystem.cancelDialog);

        for (let i = 0; i < stations.length; i++) {
            const fuelPump = stations[i];
            if (fuelPump.isBlip) {
                Athena.controllers.blip.append({
                    text: 'Fuel',
                    color: 1,
                    sprite: 361,
                    scale: 1,
                    shortRange: true,
                    pos: fuelPump,
                    uid: `fuel-${i}`,
                });
            }

            Athena.controllers.interaction.add({
                uid: `fuel-pump-${i}`,
                position: fuelPump,
                description: 'Refuel Vehicle',
                callback: FuelStationSystem.request,
                debug: false,
            });
        }
    }

    /**
     * Request to refuel a vehicle.
     * @param {alt.Player} player - alt.Player - The player who is requesting the refuel.
     */
    static request(player: alt.Player) {
        if (player.vehicle) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_MUST_EXIT_VEHICLE);
            return;
        }

        if (fuelInfo[player.id] && Date.now() < fuelInfo[player.id].timeout) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_REFILLING);
            return;
        }

        // Reset fuel timeout if exceeded
        if (fuelInfo[player.id] && Date.now() > fuelInfo[player.id].timeout) {
            delete fuelInfo[player.id];
        }

        const closestVehicle = getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 2, true);
        if (!closestVehicle) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TOO_FAR_FROM_PUMP);
            return;
        }

        if (!isFlagEnabled(closestVehicle.behavior, Vehicle_Behavior.CONSUMES_FUEL)) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_FULL);
            return;
        }

        if (closestVehicle.engineOn) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TURN_OFF_ENGINE);
            return;
        }

        if (closestVehicle.isRefueling) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_REFILLING);
            return;
        }

        const dist = distance2d(player.pos, closestVehicle.pos);
        if (dist >= 4) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TOO_FAR_FROM_PUMP);
            return;
        }

        if (!closestVehicle.data) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_FULL);
            return;
        }

        if (closestVehicle.data.fuel >= 99) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_FULL);
            return;
        }

        const currentFuel = closestVehicle.data.fuel;
        let missingFuel = maximumFuel - currentFuel;
        let maximumCost = missingFuel * FUEL_CONFIG.FUEL_PRICE;

        // re-calculate based on what the player can afford.
        if (player.data.cash < maximumCost) {
            maximumCost = FUEL_CONFIG.FUEL_PRICE * player.data.cash;
            missingFuel = missingFuel - FUEL_CONFIG.FUEL_PRICE * player.data.cash;
            if (missingFuel <= 2) {
                Athena.player.emit.notification(player, `${LOCALE_FUEL_STATIONS.FUEL_CANNOT_AFFORD} $${maximumCost}`);
                return;
            }
        }

        missingFuel = Math.floor(missingFuel);

        const trigger: JobTrigger = {
            header: 'Fuel Vehicle',
            acceptCallback: FuelStationSystem.start,
            cancelCallback: FuelStationSystem.cancel,
            image: '../../assets/images/refuel.jpg',
            summary: `How much % of fuel do you want to refill in the ${closestVehicle.data.model}, if it costs $${FUEL_CONFIG.FUEL_PRICE} each?`,
            maxAmount: missingFuel,
        };

        fuelInfo[player.id] = {
            cost: FUEL_CONFIG.FUEL_PRICE,
            fuel: missingFuel,
            vehicle: closestVehicle,
            timeout: Date.now() + FUEL_CONFIG.FUEL_RESET_TIMEOUT,
        };

        if (!player || !player.valid) {
            return;
        }

        LastTriggers[player.id] = trigger;
        alt.log('Emit VIEW_EVENTS_FUEL_TRIGGER.OPEN to client ' + player.data.name);
        alt.emitClient(player, VIEW_EVENTS_FUEL_TRIGGER.OPEN, deepCloneObject(trigger));
    }

    /**
     * Start the fuel process for the given player.
     * @param {alt.Player} player - alt.Player - The player who started the refueling.
     */
    static start(player: alt.Player, fuelAmount: number) {
        if (!player || !player.valid) {
            return;
        }

        const id = player.id;
        if (!fuelInfo[id]) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TRY_AGAIN);
            return;
        }

        const data = fuelInfo[id];

        if (data.vehicle.isRefueling) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_ALREADY_REFILLING);
            delete fuelInfo[id];
            return;
        }

        if (data.vehicle.engineOn) {
            Athena.player.emit.notification(player, LOCALE_FUEL_STATIONS.FUEL_TURN_OFF_ENGINE);
            return;
        }

        if (!Athena.player.currency.sub(player, CurrencyTypes.CASH, data.cost * fuelAmount)) {
            Athena.player.emit.notification(
                player,
                `${LOCALE_FUEL_STATIONS.FUEL_CANNOT_AFFORD} $${data.cost * fuelAmount}`,
            );
            delete fuelInfo[id];
            return;
        }

        let totalRefuelingTime = fuelAmount * FUEL_CONFIG.FUEL_TIME;
        data.vehicle.isRefueling = true;
        Athena.player.emit.createProgressBar(player, {
            uid: `FUEL-${player.data._id.toString()}`,
            color: new alt.RGBA(255, 255, 255, 255),
            distance: 15,
            milliseconds: totalRefuelingTime,
            position: data.vehicle.pos,
            text: LOCALE_FUEL_STATIONS.FUELING_PROGRESS_BAR,
        });

        alt.setTimeout(() => {
            if (player) {
                Athena.player.emit.removeProgressBar(player, `FUEL-${player.data._id.toString()}`);
                Athena.player.emit.notification(
                    player,
                    `${LOCALE_FUEL_STATIONS.FUEL_COST}${(data.cost * fuelAmount).toFixed(2)} | ${fuelAmount.toFixed(
                        2,
                    )}`,
                );
            }

            if (data.vehicle && data.vehicle.valid) {
                data.vehicle.isRefueling = false;
                data.vehicle.data.fuel += fuelAmount;
                Athena.vehicle.funcs.save(data.vehicle, { fuel: data.vehicle.data.fuel });
            }

            delete fuelInfo[id];
        }, totalRefuelingTime);
    }

    /**
     * `cancel` is a function that takes a player as an argument and deletes the fuelInfo object for that player.
     * @param {alt.Player} player - alt.Player - The player that is using the command.
     * @returns None
     */
    static cancel(player: alt.Player) {
        if (fuelInfo[player.id]) {
            delete fuelInfo[player.id];
        }
    }

    /**
     * Invoke a callback or event based on what is specified in the JobTrigger data.
     *
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @memberof InternalFunctions
     */
    static acceptDialog(player: alt.Player, amount: number) {
        if (!player || !player.valid) {
            return;
        }

        if (!LastTriggers[player.id]) {
            return;
        }

        const data = LastTriggers[player.id];

        if (data.event) {
            alt.emit(data.event, player);
        }

        if (data.acceptCallback && typeof data.acceptCallback === 'function') {
            data.acceptCallback(player, amount);
        }

        delete LastTriggers[player.id];
    }

    /**
     * Invoke a callback or event based on what is specified in the JobTrigger data.
     *
     * @static
     * @param {alt.Player} player
     * @memberof InternalFunctions
     */
    static cancelDialog(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        if (!LastTriggers[player.id]) {
            return;
        }

        const data = LastTriggers[player.id];

        if (data.cancelEvent) {
            alt.emit(data.cancelEvent, player);
        }

        if (data.cancelCallback && typeof data.cancelCallback === 'function') {
            data.cancelCallback(player);
        }

        delete LastTriggers[player.id];
    }
}
