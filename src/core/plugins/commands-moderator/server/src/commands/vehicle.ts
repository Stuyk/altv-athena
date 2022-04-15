import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function createTemporaryVehicle(player: alt.Player, model: string): void {
    if (!model) {
        Athena.player.emit.message(player, Athena.controllers.chat.getDescription('tempvehicle'));
        return;
    }

    if (player.data.isDead) {
        Athena.player.emit.message(player, `Cannot do this while dead...`);
        return;
    }

    const fwd = Athena.utility.vector.getVectorInFrontOfPlayer(player, 5);

    try {
        Athena.vehicle.funcs.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));
    } catch (err) {
        Athena.player.emit.message(player, 'Invalid Vehicle Model');
    }
}

export function addVehicleToPlayer(player: alt.Player, model: string): void {
    if (!model) {
        Athena.player.emit.message(player, Athena.controllers.chat.getDescription('addvehicle'));
        return;
    }

    if (player.data.isDead) {
        Athena.player.emit.message(player, `Cannot do this while dead...`);
        return;
    }

    const fwd = Athena.utility.vector.getVectorInFrontOfPlayer(player, 5);

    try {
        const veh = Athena.vehicle.funcs.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));

        Athena.vehicle.funcs.add(
            { owner: player.data._id.toString(), fuel: 100, model, position: veh.pos, rotation: veh.rot },
            false,
        );
        veh.destroy();
    } catch (err) {
        console.log(err);
        Athena.player.emit.message(player, 'Invalid Vehicle Model');
        return;
    }
}
