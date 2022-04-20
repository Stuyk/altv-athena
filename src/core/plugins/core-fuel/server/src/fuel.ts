import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { VehicleEvents } from '../../../../server/events/vehicleEvents';
import { ATHENA_EVENTS_VEHICLE } from '../../../../shared/enums/athenaEvents';
import { Vehicle_Behavior, VEHICLE_STATE } from '../../../../shared/enums/vehicle';
import { VEHICLE_RULES } from '../../../../shared/enums/vehicleRules';
import { VEHICLE_CLASS } from '../../../../shared/enums/vehicleTypeFlags';
import { VehicleData } from '../../../../shared/information/vehicles';
import { IVehicle } from '../../../../shared/interfaces/iVehicle';
import { isFlagEnabled } from '../../../../shared/utility/flags';
import { distance2d } from '../../../../shared/utility/vector';
import { LOCALE_FUEL } from '../../shared/locales';
import { FuelCommands } from './commands';
import { FUEL_CONFIG } from './config';

export class FuelSystem {
    /**
     * This function is used to create an interval for the fuel system
     */
    static init() {
        alt.setInterval(FuelSystem.updateDrivingPlayers, FUEL_CONFIG.TIME_BETWEEN_UPDATES);

        Athena.vehicle.system.addCustomRule(VEHICLE_RULES.ENGINE, (player: alt.Player, vehicle: alt.Vehicle) => {
            if (!vehicle.driver || vehicle.driver.id !== player.id) {
                Athena.player.emit.notification(player, LOCALE_FUEL.VEHICLE_IS_NOT_DRIVER);
                return { status: false, response: LOCALE_FUEL.VEHICLE_IS_NOT_DRIVER };
            }

            if (!player.vehicle.engineOn && !FuelSystem.hasFuel(player.vehicle)) {
                Athena.player.emit.notification(player, LOCALE_FUEL.VEHICLE_NO_FUEL);
                return { status: false, response: LOCALE_FUEL.VEHICLE_NO_FUEL };
            }

            if (player.vehicle.isRefueling) {
                Athena.player.emit.notification(player, LOCALE_FUEL.VEHICLE_IS_BEING_REFUELED);
                return { status: false, response: LOCALE_FUEL.VEHICLE_IS_BEING_REFUELED };
            }

            return { status: true, response: '' };
        });

        Athena.vehicle.funcs.addBeforeCreateInjection((document: IVehicle) => {
            const vehicleInfo = VehicleData.find((x) => x.name === document.model);

            document.fuel = FUEL_CONFIG.FUEL_ON_NEW_VEHICLE_CREATE;

            if (vehicleInfo && vehicleInfo.class === VEHICLE_CLASS.CYCLE) {
                document.fuel = FUEL_CONFIG.MAXIMUM_FUEL;
                document.behavior = Vehicle_Behavior.UNLIMITED_FUEL | Vehicle_Behavior.NEED_KEY_TO_START;
            }

            return document;
        });

        FuelCommands.init();
    }

    /**
     * For each vehicle in the game, check if it has a driver and if so, tick the fuel system
     */
    static updateDrivingPlayers() {
        for (let i = 0; i < alt.Vehicle.all.length; i++) {
            const vehicle = alt.Vehicle.all[i];
            if (!vehicle || !vehicle.valid || !vehicle.driver || !vehicle.driver.valid) {
                continue;
            }

            FuelSystem.tick(vehicle);
        }
    }

    /**
     * If the vehicle has unlimited fuel, return true. If the vehicle has no fuel data, return true. If
     * the vehicle has no fuel, return false. Otherwise, return true
     * @param vehicle - The vehicle that is being checked.
     * @returns {boolean}
     */
    static hasFuel(vehicle: alt.Vehicle) {
        if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
            return true;
        }

        if (!vehicle.data) {
            return true;
        }

        if (vehicle.data.fuel === undefined || vehicle.data.fuel === null) {
            vehicle.data.fuel = FUEL_CONFIG.MAXIMUM_FUEL;
            return true;
        }

        if (vehicle.data.fuel <= 0) {
            return false;
        }

        return true;
    }

    /**
     * The tick function is called every time the vehicle is updated
     * @param vehicle - alt.Vehicle
     * @returns Nothing.
     */
    static tick(vehicle: alt.Vehicle) {
        if (!vehicle || !vehicle.valid) {
            return;
        }

        if (!vehicle.data) {
            vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, FUEL_CONFIG.MAXIMUM_FUEL);
            return;
        }

        if (!vehicle.data.behavior) {
            vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, FUEL_CONFIG.MAXIMUM_FUEL);
            return;
        }

        // Has unlimited fuel. Always set to 100.
        if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
            vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, FUEL_CONFIG.MAXIMUM_FUEL);
            return;
        }

        if (vehicle.data.fuel === undefined || vehicle.data.fuel === null) {
            vehicle.data.fuel = 100;
        }

        // Emits the distance travelled from one point to another.
        // Does not emit if distance is less than 5
        if (!vehicle.lastPosition) {
            vehicle.lastPosition = vehicle.pos;
        }

        const dist = distance2d(vehicle.pos, vehicle.lastPosition);
        if (dist >= 5) {
            // const potentialSpeed = (dist / timeBetweenUpdates) * 1000;
            // const feetPerSecond = potentialSpeed * 1.4666666667;
            // const distanceTraveled = (potentialSpeed / 3600) * timeBetweenUpdates;

            VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.DISTANCE_TRAVELED, vehicle, dist);
            vehicle.lastPosition = vehicle.pos;
        }

        // Do nothing with the fuel if the engine is off.
        if (!vehicle.engineOn) {
            vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.data.fuel);
            return;
        }

        vehicle.data.fuel = vehicle.data.fuel - FUEL_CONFIG.FUEL_LOSS_PER_TICK;

        if (vehicle.data.fuel < 0) {
            vehicle.data.fuel = 0;

            if (vehicle.engineOn) {
                vehicle.engineOn = false;
            }
        }

        vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.data.fuel);
        vehicle.setSyncedMeta(VEHICLE_STATE.POSITION, vehicle.pos);

        if (!vehicle.nextSave || Date.now() > vehicle.nextSave) {
            Athena.vehicle.funcs.save(vehicle, { fuel: vehicle.data.fuel });
            vehicle.nextSave = Date.now() + 15000;
        }
    }

    static enterVehicle(player: alt.Player, vehicle: alt.Vehicle) {
        if (!vehicle.data) {
            vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, FUEL_CONFIG.MAXIMUM_FUEL);
            return;
        }

        if (vehicle.data.fuel === undefined || vehicle.data.fuel === null) {
            vehicle.data.fuel = 100;
        }

        vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.data.fuel);
    }
}

alt.on('playerEnteredVehicle', FuelSystem.enterVehicle);
