import * as alt from 'alt-server';
import { playerFuncs } from '../../../server/extensions/extPlayer';
import VehicleFuncs from '../../../server/extensions/vehicleFuncs';
import ChatController from '../../../server/systems/chat';
import { Vehicle_Behavior, VEHICLE_STATE } from '../../../shared/enums/vehicle';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { FUEL_CONFIG } from './config';

function setFuel(player: alt.Player, amount: string) {
    let actualAmount = parseInt(amount);

    if (typeof actualAmount !== 'number') {
        playerFuncs.emit.message(player, `Invalid amount to fuel to.`);
        return;
    }

    if (actualAmount > FUEL_CONFIG.MAXIMUM_FUEL) {
        actualAmount = FUEL_CONFIG.MAXIMUM_FUEL;
    }

    if (!player.vehicle) {
        playerFuncs.emit.message(player, `Must be in a vehicle.`);
        return;
    }

    if (!isFlagEnabled(player.vehicle.data.behavior, Vehicle_Behavior.CONSUMES_FUEL)) {
        return;
    }

    player.vehicle.data.fuel = actualAmount;
    player.vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, player.vehicle.data.fuel);
    player.vehicle.setSyncedMeta(VEHICLE_STATE.POSITION, player.vehicle.pos);
    VehicleFuncs.save(player.vehicle, { fuel: player.vehicle.data.fuel });
}

export class FuelCommands {
    static init() {
        ChatController.addCommand('setfuel', '/setfuel [amount]', PERMISSIONS.ADMIN, setFuel);
    }
}
