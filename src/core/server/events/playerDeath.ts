import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { StateManager } from '../systems/stateManager';
import { VehicleSystem } from '../systems/vehicle';
import { PlayerEvents } from './playerEvents';

function handleDeath(player: alt.Player, killer: alt.Entity, weaponHash: any): void {
    if (player && player.valid && player.data && player.data._id) {
        if (player.vehicle) {
            player.pos = player.vehicle.pos;
        }

        // Stop the player from pushing a vehicle if it is being pushed.
        if (player.isPushingVehicle) {
            VehicleSystem.stopPush(player);
        }

        // Change the plugin if you want to modify death behavior.
        // It has everything you need to not touch this code here.
        // You can listen to ATHENA_EVENTS_PLAYER.DIED to see when someone dies.
        if (!player.data.isDead) {
            alt.log(`(${player.id}) ${player.data.name} has died.`);

            try {
                StateManager.set(player, 'isDead', true);
                PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.DIED, player);
            } catch (err) {
                alt.logError(err);
                alt.log(`Could not set player ${player.data.name} to dead.`);
            }
        }
    }

    if (killer instanceof alt.Player && player !== killer) {
        alt.log(`(${player.id}) ${player.data.name} killed by ${killer.data.name}.`);
    }

    if (killer instanceof alt.Player && player === killer) {
        alt.log(`(${player.id}) ${player.data.name} died.`);
    }

    if (killer instanceof alt.Vehicle && killer.driver) {
        alt.log(`(${player.id}) ${player.data.name} was killed in vehicular combat by ${killer.driver.data.name}`);
    }

    if (killer instanceof alt.Vehicle && !killer.driver) {
        alt.log(`(${player.id}) ${player.data.name} killed themself in a vehicular incident.`);
    }
}

alt.on('playerDeath', handleDeath);
