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
        if (!player.vehicle) {
            return;
        }
        Athena.vehicle.funcs.repair(player.vehicle);
        if (!player.vehicle.data) {
            return;
        }
        player.vehicle.data.bodyHealth = 1000;
        player.vehicle.data.engineHealth = 1000;
        Athena.vehicle.funcs.save(player.vehicle, player.vehicle.data);
        Athena.player.emit.notification(player, `Vehicle successfully repaired.`);
    }

    @command('tempvehicle', '/tempvehicle', PERMISSIONS.ADMIN)
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

    @command(['setVehicleHandling', 'sh'], 'Sets vehicle handling value', PERMISSIONS.ADMIN)
    private static setVehicleHandlingCommand(player: alt.Player, key: string, value: string): void {
        const vehicle = player.vehicle;
        if (!vehicle?.valid) return;
        if (!vehicle?.data) return;

        if (!vehicle.data.tuning) vehicle.data.tuning = {};
        if (!vehicle.data.tuning.handling) vehicle.data.tuning.handling = {};

        const nValue = parseInt(value) ?? 0;
        vehicle.data.tuning.handling[key] = nValue;
        vehicle.setStreamSyncedMeta('handlingData', vehicle.data.tuning.handling);

        Athena.vehicle.funcs.save(vehicle, vehicle.data);
    }

    @command('sessionvehicle', '/sessionvehicle', PERMISSIONS.ADMIN)
    private static createSessionVehicle(player: alt.Player, model: string): void {
        let vehicle: alt.Vehicle;

        try {
            vehicle = Athena.vehicle.funcs.sessionVehicle(player, model, player.pos, new alt.Vector3(0, 0, 0));
        } catch (err) {
            Athena.player.emit.message(player, `Invalid vehicle model`);
        }

        if (!vehicle) {
            return;
        }

        Athena.player.emit.message(player, `Created Vehicle`);

        alt.nextTick(() => {
            player.setIntoVehicle(vehicle, 1);
        });
    }

    @command(['fullTuneVehicle', 'ft'], 'Full tunes a vehicle', PERMISSIONS.ADMIN)
    private static fullTuneVehicleCommand(player: alt.Player): void {
        const vehicle = player.vehicle;
        if (!vehicle?.valid || !vehicle?.data) return;

        if (!vehicle.data.tuning) vehicle.data.tuning = {};
        delete vehicle.data.tuning.mods;

        if (vehicle.modKit == 0 && vehicle.modKitsCount > 0) Athena.vehicle.funcs.setModKit(vehicle, 1);

        if (vehicle.modKit == 0) {
            Athena.player.emit.message(player, "Vehicle doesn't have a mod kit.");
            return;
        }

        for (let i = 0; i < 70; ++i) {
            const maxId = vehicle.getModsCount(i);

            if (maxId > 0) {
                Athena.vehicle.funcs.setMod(vehicle, i, maxId);
            }
        }

        Athena.vehicle.funcs.save(vehicle, vehicle.data);
    }
}
