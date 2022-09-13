import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { getClosestEntity } from '../../../../../server/utility/vector';

class VehicleCommands {
    @command(
        'refillVehicle',
        LocaleController.get(LOCALE_KEYS.COMMAND_REFILL_VEHICLE, '/refillVehicle'),
        PERMISSIONS.ADMIN,
    )
    private static refillVehicleCommand(player: alt.Player) {
        if (!player.vehicle || !player.vehicle.data.fuel) {
            return;
        }

        player.vehicle.data.fuel = 100;
        Athena.vehicle.funcs.save(player.vehicle, player.vehicle.data);
        Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_REFILLED));
    }

    @command(
        'repairVehicle',
        LocaleController.get(LOCALE_KEYS.COMMAND_REPAIR_VEHICLE, '/repairVehicle'),
        PERMISSIONS.ADMIN,
    )
    private static repairVehicleCommand(player: alt.Player) {
        const vehicle = player.vehicle
            ? player.vehicle
            : getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 2);
        if (!vehicle) {
            return;
        }
        Athena.vehicle.funcs.repair(vehicle);
        if (!vehicle.data) {
            return;
        }
        vehicle.data.bodyHealth = 1000;
        vehicle.data.engineHealth = 1000;
        Athena.vehicle.funcs.save(vehicle, vehicle.data);
        Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_REPAIRED));
    }

    @command('tempvehicle', LocaleController.get(LOCALE_KEYS.COMMAND_TEMP_VEHICLE, '/tempvehicle'), PERMISSIONS.ADMIN)
    private static createTemporaryVehicleCommand(player: alt.Player, model: string): void {
        if (!model) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('tempvehicle'));
            return;
        }

        if (player.data.isDead) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
            return;
        }

        const fwd = Athena.utility.vector.getVectorInFrontOfPlayer(player, 5);

        try {
            Athena.vehicle.funcs.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));
        } catch (err) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_MODEL_INVALID));
        }
    }

    @command('addvehicle', LocaleController.get(LOCALE_KEYS.COMMAND_ADD_VEHICLE, '/addvehicle'), PERMISSIONS.ADMIN)
    private static addVehicleToPlayerCommand(player: alt.Player, model: string): void {
        if (!model) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('addvehicle'));
            return;
        }

        if (player.data.isDead) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
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
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_MODEL_INVALID));
            return;
        }
    }

    @command(
        ['setVehicleHandling', 'sh'],
        LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEHICLE_HANDLING, '/sh'),
        PERMISSIONS.ADMIN,
    )
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

    @command(
        ['setVehicleLivery', 'svl'],
        LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEHICLE_LIVERY, '/svl'),
        PERMISSIONS.ADMIN,
    )
    private static setVehicleLiveryCommand(player: alt.Player, livery: number): void {
        const vehicle = player.vehicle;

        if (!vehicle?.valid) return;

        Athena.vehicle.funcs.setLivery(vehicle, livery);
    }

    @command(
        'sessionvehicle',
        LocaleController.get(LOCALE_KEYS.COMMAND_SESSION_VEHICLE, '/sessionvehicle'),
        PERMISSIONS.ADMIN,
    )
    private static createSessionVehicle(player: alt.Player, model: string): void {
        let vehicle: alt.Vehicle;

        try {
            vehicle = Athena.vehicle.funcs.sessionVehicle(player, model, player.pos, new alt.Vector3(0, 0, 0));
        } catch (err) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_MODEL_INVALID));
        }

        if (!vehicle) {
            return;
        }

        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_CREATED));

        alt.nextTick(() => {
            player.setIntoVehicle(vehicle, 1);
        });
    }

    @command(
        ['toggleneonlights', 'tnl'],
        LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_NEON_LIGHTS, '/tnl'),
        PERMISSIONS.ADMIN,
    )
    private static toggleVehicleNeonLightsCommand(player: alt.Player): void {
        const vehicle = player.vehicle;

        if (!vehicle?.valid || vehicle.isTemporary) return;

        const lightsEnabled = !(vehicle.data.tuning.neonEnabled ?? false);

        Athena.vehicle.funcs.setNeonLightsEnabled(vehicle, lightsEnabled);
        Athena.vehicle.funcs.save(vehicle, vehicle.data);
    }

    @command(
        ['setneonlights', 'snl'],
        LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEH_NEON_LIGHTS, '/snl'),
        PERMISSIONS.ADMIN,
    )
    private static setVehicleNeonLightsCommand(
        player: alt.Player,
        left: string,
        right: string,
        front: string,
        back: string,
    ): void {
        const vehicle = player.vehicle;

        if (!vehicle?.valid || vehicle.isTemporary) return;

        Athena.vehicle.funcs.setNeon(vehicle, {
            left: left === '1',
            right: right === '1',
            front: front === '1',
            back: back === '1',
        });
        Athena.vehicle.funcs.save(vehicle, vehicle.data);
    }

    @command(
        ['fullTuneVehicle', 'ft'],
        LocaleController.get(LOCALE_KEYS.COMMAND_FULL_TUNE_VEHICLE, '/ft'),
        PERMISSIONS.ADMIN,
    )
    private static fullTuneVehicleCommand(player: alt.Player): void {
        const vehicle = player.vehicle;
        if (!vehicle?.valid || !vehicle?.data) return;

        if (!vehicle.data.tuning) vehicle.data.tuning = {};
        delete vehicle.data.tuning.mods;

        if (vehicle.modKit == 0 && vehicle.modKitsCount > 0) Athena.vehicle.funcs.setModKit(vehicle, 1);

        if (vehicle.modKit == 0) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_HAS_NO_MOD_KIT));
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

    @command(
        ['addVehiclekey'],
        LocaleController.get(LOCALE_KEYS.COMMAND_ADD_VEHICLE_KEY, '/addVehiclekey'),
        PERMISSIONS.ADMIN,
    )
    private static addVehicleKeyCommand(player: alt.Player): void {
        const vehicle = player.vehicle;

        if (!vehicle?.valid) return;
        if (!vehicle?.data) return;

        Athena.vehicle.funcs.createKey(player, vehicle);
    }

    @command(['setvehicledirtLevel', 'svdl'], LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEH_DIRT_LEVEL, '/svdl'), PERMISSIONS.ADMIN)
    private static setVehicleDirtLevelCommand(player: alt.Player, dirtLevel: number): void {
        const vehicle = player.vehicle;

        if (!vehicle?.valid) return;

        vehicle.dirtLevel = dirtLevel;

        if (vehicle.data) {
            vehicle.data.dirtLevel = vehicle.dirtLevel;
            Athena.vehicle.funcs.save(vehicle, vehicle.data);
        }
    }
}
