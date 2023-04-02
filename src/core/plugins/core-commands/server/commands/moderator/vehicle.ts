import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';
import { VehicleState } from '@AthenaShared/interfaces/vehicleState';

Athena.systems.messenger.commands.register(
    'tempvehicle',
    '/tempvehicle [model] - Adds a temporary vehicle to drive around. Despawns on exit.',
    ['admin'],
    (player: alt.Player, model: string) => {
        if (!model) {
            Athena.player.emit.message(player, `No model specified.`);
            return;
        }

        const vehicle = Athena.vehicle.spawn.temporary({ model, pos: player.pos, rot: player.rot }, true);
        if (!vehicle) {
            return;
        }

        player.setIntoVehicle(vehicle, Athena.vehicle.shared.SEAT.DRIVER);
    },
);

Athena.systems.messenger.commands.register(
    'addvehicle',
    '/addvehicle [model] - Adds an owned vehicle to self',
    ['admin'],
    (player: alt.Player, model: string) => {
        if (!model) {
            Athena.player.emit.message(player, `No model specified.`);
            return;
        }

        const data = Athena.document.character.get(player);
        if (data.isDead) {
            return;
        }

        const fwd = Athena.utility.vector.getVectorInFrontOfPlayer(player, 5);
        Athena.vehicle.add.toPlayer(player, model, fwd);
    },
);

Athena.systems.messenger.commands.register(
    'vehiclerepair',
    '/vehiclerepair - Repairs the nearest vehicle',
    ['admin'],
    (player: alt.Player) => {
        const vehicle = player.vehicle ? player.vehicle : Athena.utility.closest.getClosestVehicle(player.pos);

        if (!vehicle) {
            Athena.player.emit.message(player, 'No spawned vehicle.');
            return;
        }

        if (Athena.utility.vector.distance(player.pos, vehicle.pos) > 4) {
            Athena.player.emit.message(player, 'No vehicle in range.');
            return;
        }

        Athena.vehicle.damage.repair(vehicle);
        Athena.vehicle.controls.updateLastUsed(vehicle);
        Athena.vehicle.controls.update(vehicle);

        const hash = typeof vehicle.model === 'number' ? vehicle.model : alt.hash(vehicle.model);

        let vehInfo = Athena.utility.hashLookup.vehicle.hash(hash);

        Athena.player.emit.message(player, `${vehInfo.displayName} got repaired.`);
    },
);

// The setLivery command has two possible commands that call both the same function. This is needed since it's not possible anymore to declare more than one name like in V4.

Athena.systems.messenger.commands.register(
    'setVehicleLivery',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEHICLE_LIVERY, '/setVehicleLivery'),
    ['admin'],
    setLivery,
);

Athena.systems.messenger.commands.register(
    'svl',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEHICLE_LIVERY, '/svl'),
    ['admin'],
    setLivery,
);

function setLivery(player: alt.Player, livery: number) {
    const vehicle = player.vehicle ? player.vehicle : Athena.utility.closest.getClosestVehicle(player.pos);

    if (!vehicle) {
        Athena.player.emit.message(player, 'No spawned vehicle.');
        return;
    }

    if (Athena.utility.vector.distance(player.pos, vehicle.pos) > 4) {
        Athena.player.emit.message(player, 'No vehicle in range.');
        return;
    }

    const liveryState: Partial<VehicleState> = { livery };

    Athena.vehicle.tuning.applyState(vehicle, liveryState);
    Athena.vehicle.controls.updateLastUsed(vehicle);
    Athena.vehicle.controls.update(vehicle);

    const hash = typeof vehicle.model === 'number' ? vehicle.model : alt.hash(vehicle.model);

    let vehInfo = Athena.utility.hashLookup.vehicle.hash(hash);

    Athena.player.emit.message(player, `Livery of ${vehInfo.displayName} was set to ID ${livery}.`);
}

Athena.systems.messenger.commands.register(
    'setvehicledirtLevel',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEH_DIRT_LEVEL, '/setvehicledirtLevel'),
    ['admin'],
    setVehicleDirtlevel,
);

Athena.systems.messenger.commands.register(
    'svdl',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEH_DIRT_LEVEL, '/svdl'),
    ['admin'],
    setVehicleDirtlevel,
);

function setVehicleDirtlevel(player: alt.Player, dirtLevel: number) {
    const vehicle = player.vehicle ? player.vehicle : Athena.utility.closest.getClosestVehicle(player.pos);

    if (!vehicle) {
        Athena.player.emit.message(player, 'No spawned vehicle.');
        return;
    }

    if (Athena.utility.vector.distance(player.pos, vehicle.pos) > 4) {
        Athena.player.emit.message(player, 'No vehicle in range.');
        return;
    }

    const dirtlevelState: Partial<VehicleState> = { dirtLevel };

    Athena.vehicle.tuning.applyState(vehicle, dirtlevelState);
    Athena.vehicle.controls.updateLastUsed(vehicle);
    Athena.vehicle.controls.update(vehicle);

    const hash = typeof vehicle.model === 'number' ? vehicle.model : alt.hash(vehicle.model);

    let vehInfo = Athena.utility.hashLookup.vehicle.hash(hash);

    Athena.player.emit.message(player, `Dirtlevel of ${vehInfo.displayName} was set to ID ${dirtLevel}.`);
}

Athena.systems.messenger.commands.register(
    'sessionvehicle',
    LocaleController.get(LOCALE_KEYS.COMMAND_SESSION_VEHICLE, '/sessionvehicle'),
    ['admin'],
    (player: alt.Player, model: string) => {
        if (!model) {
            Athena.player.emit.message(player, `No model specified.`);
            return;
        }

        const vehicle = Athena.vehicle.spawn.temporary({ model, pos: player.pos, rot: player.rot }, false);
        if (!vehicle) {
            return;
        }

        player.setIntoVehicle(vehicle, Athena.vehicle.shared.SEAT.DRIVER);
    },
);

Athena.systems.messenger.commands.register(
    'fullTuneVehicle',
    LocaleController.get(LOCALE_KEYS.COMMAND_FULL_TUNE_VEHICLE, '/fullTuneVehicle'),
    ['admin'],
    (player: alt.Player) => {
        const vehicle = player.vehicle ? player.vehicle : Athena.utility.closest.getClosestVehicle(player.pos);

        if (!vehicle) {
            Athena.player.emit.message(player, 'No spawned vehicle.');
            return;
        }

        if (Athena.utility.vector.distance(player.pos, vehicle.pos) > 4) {
            Athena.player.emit.message(player, 'No vehicle in range.');
            return;
        }

        if (vehicle.modKit == 0 && vehicle.modKitsCount > 0) {
            Athena.vehicle.tuning.applyTuning(vehicle, { modkit: 1 });
        }

        if (vehicle.modKit == 0) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_HAS_NO_MOD_KIT));
            return;
        }

        for (let i = 0; i < 70; ++i) {
            const maxId = vehicle.getModsCount(i);

            if (maxId > 0) {
                Athena.vehicle.tuning.applyTuning(vehicle, { mods: [{ id: i, value: maxId }] });
                Athena.vehicle.controls.updateLastUsed(vehicle);
                Athena.vehicle.controls.update(vehicle);
            }
        }
    },
);

// import { command } from '@AthenaServer/decorators/commands';
// import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
// import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
// import { LocaleController } from '@AthenaShared/locale/locale';
// import { getClosestEntity } from '@AthenaServer/utility/vector';

// class VehicleCommands {
//

//     @command(
//         ['setVehicleHandling', 'sh'],
//         LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEHICLE_HANDLING, '/sh'),
//         PERMISSIONS.ADMIN,
//     )
//     private static setVehicleHandlingCommand(player: alt.Player, key: string, value: string): void {
//         const vehicle = player.vehicle;
//         if (!vehicle?.valid) return;
//         if (!vehicle?.data) return;
//         if (!vehicle.data.tuning) vehicle.data.tuning = {};
//         if (!vehicle.data.tuning.handling) vehicle.data.tuning.handling = {};
//         const nValue = parseInt(value) ?? 0;
//         vehicle.data.tuning.handling[key] = nValue;
//         vehicle.setStreamSyncedMeta('handlingData', vehicle.data.tuning.handling);
//         Athena.vehicle.funcs.save(vehicle, vehicle.data);
//     }

//     @command(
//         ['toggleneonlights', 'tnl'],
//         LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_NEON_LIGHTS, '/tnl'),
//         PERMISSIONS.ADMIN,
//     )
//     private static toggleVehicleNeonLightsCommand(player: alt.Player): void {
//         const vehicle = player.vehicle;

//         if (!vehicle?.valid || vehicle.isTemporary) return;

//         const lightsEnabled = !(vehicle.data.tuning.neonEnabled ?? false);

//         Athena.vehicle.funcs.setNeonLightsEnabled(vehicle, lightsEnabled);
//         Athena.vehicle.funcs.save(vehicle, vehicle.data);
//     }

//     @command(
//         ['setneonlights', 'snl'],
//         LocaleController.get(LOCALE_KEYS.COMMAND_SET_VEH_NEON_LIGHTS, '/snl'),
//         PERMISSIONS.ADMIN,
//     )
//     private static setVehicleNeonLightsCommand(
//         player: alt.Player,
//         left: string,
//         right: string,
//         front: string,
//         back: string,
//     ): void {
//         const vehicle = player.vehicle;

//         if (!vehicle?.valid || vehicle.isTemporary) return;

//         Athena.vehicle.funcs.setNeon(vehicle, {
//             left: left === '1',
//             right: right === '1',
//             front: front === '1',
//             back: back === '1',
//         });
//         Athena.vehicle.funcs.save(vehicle, vehicle.data);
//     }
// }
