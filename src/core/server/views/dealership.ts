import * as alt from 'alt-server';
import { DEFAULT_CONFIG } from '../athena/main';
import { InteractionController } from '../systems/interaction';
import { View_Events_Dealership } from '../../shared/enums/views';
import { ServerBlipController } from '../systems/blip';
import { HologramController } from '../systems/hologram';
import { VehicleData } from '../../shared/information/vehicles';
import { playerFuncs } from '../extensions/extPlayer';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { PlayerEvents } from '../events/playerEvents';

class DealershipFunctions {
    static init() {
        for (let i = 0; i < DEFAULT_CONFIG.VEHICLE_DEALERSHIPS.length; i++) {
            const dealership = DEFAULT_CONFIG.VEHICLE_DEALERSHIPS[i];

            InteractionController.add({
                position: dealership.position,
                description: `Browse ${dealership.class}'s`,
                uid: `dealership-${i}`,
                range: 2,
                callback: (player: alt.Player) => {
                    const vehicles = VehicleData.filter((x) => x.class === dealership.class);

                    alt.emitClient(
                        player,
                        View_Events_Dealership.Open,
                        dealership.vehiclePosition,
                        dealership.vehicleHeading,
                        vehicles,
                        `dealership-holo-${i}`, // identifier
                    );
                },
                isPlayerOnly: true,
            });

            HologramController.add({
                position: dealership.vehiclePosition,
                heading: dealership.vehicleHeading,
                identifier: `dealership-holo-${i}`,
                model: dealership.vehiclePreview,
            });

            if (dealership.createBlip) {
                ServerBlipController.append({
                    text: `${dealership.name}`,
                    color: 13,
                    sprite: 225,
                    scale: 1,
                    shortRange: true,
                    pos: dealership.position,
                    uid: `dealership-${i}`,
                });
            }
        }
    }

    static purchase(player: alt.Player, model: string) {
        if (!player || !player.valid) {
            return;
        }

        if (!model) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const vehicleData = VehicleData.find((x) => x.name === model);
        if (!vehicleData || !vehicleData.sell) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (player.data.bank + player.data.cash < vehicleData.price) {
            playerFuncs.emit.notification(player, `~r~Invalid Balance`);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (!playerFuncs.currency.subAllCurrencies(player, vehicleData.price)) {
            playerFuncs.emit.notification(player, `~r~Invalid Balance`);
            return;
        }

        VehicleFuncs.add(
            {
                owner: player.data._id.toString(),
                model: vehicleData.name,
                fuel: 100,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                color: { r: 255, g: 255, b: 255 },
            },
            true,
        );

        playerFuncs.emit.notification(player, `Visit a garage to spawn your new vehicle.`);
        playerFuncs.emit.sound2D(player, 'item_purchase');
        PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.PURCHASED_VEHICLE, player, vehicleData.name);
    }
}

alt.onClient(View_Events_Dealership.Purchase, DealershipFunctions.purchase);
DealershipFunctions.init();
