import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

class VehicleCommands {
    @command('refillVehicle', '/refillVehicle - Refills fuel of an vehicle by administrative power.', PERMISSIONS.ADMIN)
    private static refillVehicleCommand(player: alt.Player) {
        if (!player.vehicle || !player.vehicle.data.fuel) {
            return;
        }

        player.vehicle.data.fuel = 100;
        Athena.vehicle.funcs.save(player.vehicle, player.vehicle.data);
        Athena.player.emit.notification(player, `Vehicle refilled.`);
    }

    @command('repairVehicle', '/repairVehicle - Repairs an vehicle by administrative power.', PERMISSIONS.ADMIN)
    private static repairVehicleCommand(player: alt.Player) {
        if (!player.vehicle || !player.vehicle.data) {
            return;
        }
        player.vehicle.data.bodyHealth = 1000;
        player.vehicle.data.engineHealth = 1000;
        Athena.vehicle.funcs.repair(player.vehicle);
        Athena.vehicle.funcs.save(player.vehicle, player.vehicle.data);
        Athena.player.emit.notification(player, `Vehicle successfully repaired.`);
    }

    @command('vehicle', '/tempvehicle', PERMISSIONS.ADMIN)
    private static createTemporaryVehicleCommand(player: alt.Player, model: string): void {
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

    @command('addvehicle', '/addvehicle', PERMISSIONS.ADMIN)
    private static addVehicleToPlayerCommand(player: alt.Player, model: string): void {
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
}
