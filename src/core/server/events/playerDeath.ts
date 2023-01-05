import { Athena } from '@AthenaServer/api/athena';
import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { VehicleSystem } from '../systems/vehicle';
import { PlayerEvents } from './playerEvents';

function handleDeath(victim: alt.Player, killer: alt.Entity, weaponHash: any): void {
    const victimData = Athena.document.character.get(victim);

    if (victim && victim.valid && victimData && victimData._id) {
        if (victim.vehicle) {
            victim.pos = victim.vehicle.pos;
        }

        // Stop the player from pushing a vehicle if it is being pushed.
        if (victim.isPushingVehicle) {
            VehicleSystem.stopPush(victim);
        }

        // Change the plugin if you want to modify death behavior.
        // It has everything you need to not touch this code here.
        // You can listen to ATHENA_EVENTS_PLAYER.DIED to see when someone dies.
        if (!victimData.isDead) {
            alt.log(`(${victim.id}) ${victimData.name} has died.`);

            try {
                Athena.document.character.set(victim, 'isDead', true);
                PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.DIED, victim);
            } catch (err) {
                alt.logError(err);
                alt.log(`Could not set player ${victimData.name} to dead.`);
            }
        }
    }

    if (killer instanceof alt.Player) {
        const killerData = Athena.document.character.get(killer);

        if (victim !== killer) {
            alt.log(`(${victim.id}) ${victimData.name} killed by ${killerData.name}.`);
        }

        if (victim === killer) {
            alt.log(`(${victim.id}) ${victimData.name} died.`);
        }
    }

    if (killer instanceof alt.Vehicle && killer.driver) {
        if (killer.driver) {
            const killerData = Athena.document.character.get(killer.driver);
            alt.log(`(${victim.id}) ${victimData.name} was killed in vehicular combat by ${killerData.name}`);
        }

        if (!killer.driver) {
            alt.log(`(${victim.id}) ${victimData.name} killed themself in a vehicular incident.`);
        }
    }
}

alt.on('playerDeath', handleDeath);
