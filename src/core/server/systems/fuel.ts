import * as alt from 'alt-server';

import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { CurrencyTypes } from '../../shared/enums/currency';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vehicle_Behavior } from '../../shared/enums/vehicle';
import fuel from '../../shared/information/fuel';
import { JobTrigger } from '../../shared/interfaces/jobTrigger';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance2d } from '../../shared/utility/vector';
import { playerFuncs } from '../extensions/Player';
import VehicleFuncs from '../extensions/VehicleFuncs';
import { getClosestEntity } from '../utility/vector';
import { ServerBlipController } from './blip';
import { InteractionController } from './interaction';

// player.id to retrieve
const FUEL_START_EVENT = 'fuel:Start';
const FUEL_CANCEL_EVENT = 'fuel:Cancel';

const maximumFuel = 100;
const fuelInfo: { [playerID: string]: FuelStatus } = {};

interface FuelStatus {
    vehicle: alt.Vehicle;
    cost: number;
    fuel: number;
}

class FuelSystem {
    static init() {
        for (let i = 0; i < fuel.length; i++) {
            const fuelPump = fuel[i];
            if (fuelPump.isBlip) {
                ServerBlipController.append({
                    text: 'Fuel',
                    color: 1,
                    sprite: 361,
                    scale: 1,
                    shortRange: true,
                    pos: fuelPump,
                    uid: `fuel-${i}`,
                });
            }

            InteractionController.add({
                position: fuelPump,
                description: 'Refuel Vehicle',
                type: 'fuel',
                callback: FuelSystem.request,
            });
        }
    }

    static request(player: alt.Player) {
        if (fuelInfo[player.id]) {
            playerFuncs.emit.notification(player, `Currently already refueling...`);
            return;
        }

        const closestVehicle = getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 2, true);
        if (!closestVehicle) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_TOO_FAR_FROM_PUMP));
            return;
        }

        if (!isFlagEnabled(closestVehicle.behavior, Vehicle_Behavior.CONSUMES_FUEL)) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_ALREADY_FULL));
            return;
        }

        if (closestVehicle.engineOn) {
            playerFuncs.emit.notification(player, `~r~Turn the Engine Off`);
            return;
        }

        if (closestVehicle.isRefueling) {
            playerFuncs.emit.notification(player, `Vehicle already being refueled...`);
            return;
        }

        const dist = distance2d(player.pos, closestVehicle.pos);
        if (dist >= 4) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_TOO_FAR_FROM_PUMP));
            return;
        }

        if (!closestVehicle.data) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_ALREADY_FULL));
            return;
        }

        if (closestVehicle.data.fuel >= 99) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_ALREADY_FULL));
            return;
        }

        const currentFuel = closestVehicle.data.fuel;
        let missingFuel = maximumFuel - currentFuel;
        let maximumCost = missingFuel * SHARED_CONFIG.FUEL_PRICE;

        // re-calculate based on what the player can afford.
        if (player.data.cash < maximumCost) {
            maximumCost = SHARED_CONFIG.FUEL_PRICE * player.data.cash;
            missingFuel = missingFuel - SHARED_CONFIG.FUEL_PRICE * player.data.cash;
            if (missingFuel <= 2) {
                playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_CANNOT_AFFORD));
                return;
            }
        }

        const trigger: JobTrigger = {
            header: 'Fuel Vehicle',
            event: FUEL_START_EVENT,
            cancelEvent: FUEL_CANCEL_EVENT,
            image: '../../assets/images/refuel.jpg',
            summary: `Refill ${missingFuel.toFixed(2)}% of fuel in the ${
                closestVehicle.data.model
            } for $${maximumCost.toFixed(2)}?`,
        };

        fuelInfo[player.id] = {
            cost: maximumCost,
            fuel: missingFuel,
            vehicle: closestVehicle,
        };

        alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_JOB, trigger);
    }

    static start(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        const id = player.id;
        if (!fuelInfo[id]) {
            playerFuncs.emit.notification(player, `Try again...`);
            return;
        }

        const data = fuelInfo[id];

        if (data.vehicle.isRefueling) {
            playerFuncs.emit.notification(player, `Vehicle already being refueled...`);
            delete fuelInfo[id];
            return;
        }

        if (data.vehicle.engineOn) {
            playerFuncs.emit.notification(player, `~r~Turn the Engine Off`);
            return;
        }

        if (!playerFuncs.currency.sub(player, CurrencyTypes.CASH, data.cost)) {
            playerFuncs.emit.notification(player, `Not enough cash on hand... $${data.cost}`);
            delete fuelInfo[id];
            return;
        }

        data.vehicle.isRefueling = true;
        playerFuncs.emit.createProgressBar(player, {
            uid: `FUEL-${player.data._id.toString()}`,
            color: { r: 255, g: 0, b: 0, a: 200 },
            distance: 15,
            milliseconds: 10000,
            position: data.vehicle.pos,
            text: `Fueling...`,
        });

        alt.setTimeout(() => {
            if (player) {
                playerFuncs.emit.removeProgressBar(player, `FUEL-${player.data._id.toString()}`);
                playerFuncs.emit.notification(
                    player,
                    LocaleController.get(LOCALE_KEYS.FUEL_PAID, data.cost.toFixed(2), data.fuel.toFixed(2)),
                );
            }

            if (data.vehicle && data.vehicle.valid) {
                data.vehicle.isRefueling = false;
                data.vehicle.data.fuel += data.fuel;
                VehicleFuncs.save(data.vehicle, { fuel: data.vehicle.data.fuel });
            }

            delete fuelInfo[id];
        }, 10000);
    }

    static cancel(player: alt.Player) {
        if (fuelInfo[player.id]) {
            delete fuelInfo[player.id];
        }
    }
}

alt.on(FUEL_START_EVENT, FuelSystem.start);
alt.on(FUEL_CANCEL_EVENT, FuelSystem.cancel);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, FuelSystem.init);
