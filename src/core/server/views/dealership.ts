import * as alt from 'alt-server';
import { PhoneEvents } from '../../shared/enums/phoneEvents';
import { VehicleData } from '../../shared/information/vehicles';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { vehicleFuncs } from '../extensions/Vehicle';

alt.onClient(PhoneEvents.DEALERSHIP_BUY.name, handlePurchase);

function handlePurchase(player: alt.Player, model: string, color: alt.RGBA) {
    if (!player || !player.valid) {
        return;
    }

    if (!model) {
        return;
    }

    const vehicleData = VehicleData.find((veh) => veh.name === model);
    if (!vehicleData) {
        return;
    }

    if (!vehicleData.sell) {
        playerFuncs.emit.message(player, `Nice try... but the ${model} is not for sale.`);
        return;
    }

    if (!DEFAULT_CONFIG.VEHICLE_DEALERSHIP_SPAWNS[vehicleData.class]) {
        playerFuncs.emit.message(player, `Notify Admin that vehicle class... ${vehicleData.class} has no spawn point.`);
        return;
    }

    if (!playerFuncs.currency.subAllCurrencies(player, vehicleData.price)) {
        playerFuncs.emit.message(player, `Not enough money for this vehicle. \$${vehicleData.price}.`);
        return;
    }

    vehicleFuncs.new.add(player, {
        model: vehicleData.name,
        fuel: 100,
        position: DEFAULT_CONFIG.VEHICLE_DEALERSHIP_SPAWNS[vehicleData.class],
        rotation: { x: 0, y: 0, z: 0 },
        color
    });

    playerFuncs.emit.message(
        player,
        `Vehicle has been added to your personal vehicles. Check your phone to locate it.`
    );

    playerFuncs.emit.notification(player, `~r~-\$${vehicleData.price}`);
    playerFuncs.emit.sound2D(player, 'item_purchase');
}
