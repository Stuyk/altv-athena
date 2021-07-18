import * as alt from 'alt-server';
import { DEFAULT_CONFIG } from '../athena/main';
import { InteractionController } from '../systems/interaction';
import { View_Events_Dealership } from '../../shared/enums/views';
import { BlipController } from '../systems/blip';
import { HologramController } from '../systems/hologram';
import { VehicleData } from '../../shared/information/vehicles';

class DealershipFunctions {
    static init() {
        for (let i = 0; i < DEFAULT_CONFIG.VEHICLE_DEALERSHIPS.length; i++) {
            const dealership = DEFAULT_CONFIG.VEHICLE_DEALERSHIPS[i];

            InteractionController.add({
                position: dealership.position,
                description: `Browse ${dealership.class}'s`,
                type: `dealership-${i}`,
                range: 2,
                callback: (player: alt.Player) => {
                    const vehicles = VehicleData.filter((x) => x.class === dealership.class);

                    alt.emitClient(
                        player,
                        View_Events_Dealership.Open,
                        dealership.vehiclePosition,
                        dealership.vehicleHeading,
                        vehicles,
                        `dealership-holo-${i}` // identifier
                    );
                }
            });

            HologramController.add({
                position: dealership.vehiclePosition,
                heading: dealership.vehicleHeading,
                identifier: `dealership-holo-${i}`,
                model: dealership.vehiclePreview
            });

            BlipController.add({
                text: `${dealership.class} Dealership`,
                color: 13,
                sprite: 225,
                scale: 1,
                shortRange: true,
                pos: dealership.position,
                uid: `dealership-${i}`
            });
        }
    }
}

DealershipFunctions.init();

// function handlePurchase(player: alt.Player, model: string, color: alt.RGBA) {
//     if (!player || !player.valid) {
//         return;
//     }

//     if (!model) {
//         return;
//     }

//     const vehicleData = VehicleData.find((veh) => veh.name === model);
//     if (!vehicleData) {
//         return;
//     }

//     if (!vehicleData.sell) {
//         playerFuncs.emit.message(player, `Nice try... but the ${model} is not for sale.`);
//         return;
//     }

//     if (!DEFAULT_CONFIG.VEHICLE_DEALERSHIP_SPAWNS[vehicleData.class]) {
//         playerFuncs.emit.message(player, `Notify Admin that vehicle class... ${vehicleData.class} has no spawn point.`);
//         return;
//     }

//     if (!playerFuncs.currency.subAllCurrencies(player, vehicleData.price)) {
//         playerFuncs.emit.message(player, `Not enough money for this vehicle. \$${vehicleData.price}.`);
//         return;
//     }

//     vehicleFuncs.new.add(player, {
//         model: vehicleData.name,
//         fuel: 100,
//         position: DEFAULT_CONFIG.VEHICLE_DEALERSHIP_SPAWNS[vehicleData.class],
//         rotation: { x: 0, y: 0, z: 0 },
//         color
//     });

//     playerFuncs.emit.message(
//         player,
//         `Vehicle has been added to your personal vehicles. Check your phone to locate it.`
//     );

//     playerFuncs.emit.notification(player, `~r~-\$${vehicleData.price}`);
//     playerFuncs.emit.sound2D(player, 'item_purchase');
// }
