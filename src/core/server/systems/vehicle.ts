import * as alt from 'alt-server';
import { Vehicle_Events, Vehicle_Lock_State } from '../../shared/enums/vehicle';

alt.onClient(Vehicle_Events.SET_LOCK, handleCycleLock);

function handleCycleLock(player: alt.Player, vehicle: alt.Vehicle): void {
    if (!player || !player.valid) {
        return;
    }

    const lockState = vehicle.cycleLock(player);
    player.send(`Vehicle Lock Set To: ${Vehicle_Lock_State[lockState]}`);
}
