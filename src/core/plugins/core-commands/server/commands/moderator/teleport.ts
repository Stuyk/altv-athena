// import alt from 'alt-server';
// import * as Athena from '@AthenaServer/api/athena';
// import { command } from '@AthenaServer/decorators/commands';
// import ChatController from '@AthenaPlugins/core-chat/server/src/chat';
// import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
// import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
// import { LocaleController } from '@AthenaShared/locale/locale';

// class TeleportCommands {
//     @command('gethere', '/gethere <ID> - Teleports a player to your position.', PERMISSIONS.ADMIN)
//     private static GetHereCommand(player: alt.Player, id: number) {
//         const target = Athena.systems.identifier.getPlayer(id);

//         if (!target || !target.valid || !id || target === player) {
//             return;
//         }

//         const data = Athena.document.character.get(target);

//         Athena.player.safe.setPosition(target, player.pos.x + 1, player.pos.y, player.pos.z);
//         Athena.player.emit.notification(player, `Successfully teleported ${data.name} to your position!`);
//     }

//     @command('goto', '/goto <ID> - Teleports you to the specified player.', PERMISSIONS.ADMIN)
//     private static goToCommand(player: alt.Player, id: number) {
//         const target = Athena.systems.identifier.getPlayer(id);

//         if (!target || !target.valid || !id || target === player) {
//             return;
//         }

//         Athena.player.safe.setPosition(player, target.pos.x + 1, target.pos.y, target.pos.z);
//     }

//     @command('tpwp', LocaleController.get(LOCALE_KEYS.COMMAND_TELEPORT_WAYPOINT, '/tpwp'), PERMISSIONS.ADMIN)
//     private static tpWpCommand(player: alt.Player) {
//         if (!player.currentWaypoint) {
//             Athena.player.emit.message(player, `Set a waypoint first.`);
//             return;
//         }

//         Athena.player.safe.setPosition(
//             player,
//             player.currentWaypoint.x,
//             player.currentWaypoint.y,
//             player.currentWaypoint.z,
//         );
//     }

//     @command('coords', LocaleController.get(LOCALE_KEYS.COMMAND_COORDS, '/coords'), PERMISSIONS.ADMIN)
//     private static handleCommand(player: alt.Player, x: string, y: string, z: string): void {
//         try {
//             Athena.player.safe.setPosition(player, parseFloat(x), parseFloat(y), parseFloat(z));
//         } catch (err) {
//             Athena.player.emit.message(player, ChatController.getDescription('coords'));
//         }
//     }

//     @command('getcar', '/getcar [id]', PERMISSIONS.ADMIN)
//     private static handleGetCar(player: alt.Player, id: string): void {
//         const tmpID = parseInt(id);
//         if (isNaN(tmpID)) {
//             return;
//         }

//         // Find the vehicle
//         const validVehicle = alt.Vehicle.all.find((veh) => {
//             if (!veh || !veh.valid) {
//                 return false;
//             }

//             return veh.id === tmpID;
//         });

//         // no spawned vehicle was found
//         if (!validVehicle || !validVehicle.valid) {
//             return;
//         }

//         // Move the vehicle to the player.
//         validVehicle.pos = player.pos;

//         // Check if it is saveable.
//         if (!validVehicle.data) {
//             return;
//         }

//         validVehicle.data.position = validVehicle.pos;
//         Athena.vehicle.funcs.save(validVehicle, { position: validVehicle.pos });
//     }

//     @command('tpto', '/tpto <partial_name>', PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR)
//     private static handleTeleportTo(player: alt.Player, name: string) {
//         if (!name) {
//             Athena.player.emit.message(player, `tpto <partial_name>`);
//             return;
//         }

//         if (name.includes('_')) {
//             name = name.replace('_', '');
//         }

//         const target = Athena.get.player.byPartialName(name);
//         if (!target || !target.valid) {
//             Athena.player.emit.message(player, `Could not find that player.`);
//             return;
//         }

//         if (player.vehicle) {
//             player.vehicle.pos = target.pos;
//             return;
//         }

//         Athena.player.safe.setPosition(player, target.pos.x, target.pos.y, target.pos.z);
//     }

//     @command('tphere', '/tphere <partial_name>', PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR)
//     private static handleTeleportHere(player: alt.Player, name: string) {
//         if (!name) {
//             Athena.player.emit.message(player, `tpto <partial_name>`);
//             return;
//         }

//         if (name.includes('_')) {
//             name = name.replace('_', '');
//         }

//         const target = Athena.get.player.byPartialName(name);
//         if (!target || !target.valid) {
//             Athena.player.emit.message(player, `Could not find that player.`);
//             return;
//         }

//         if (target.vehicle) {
//             target.vehicle.pos = player.pos;
//             return;
//         }

//         Athena.player.safe.setPosition(target, player.pos.x, player.pos.y, player.pos.z);
//     }

//     @command('tpall', '/tpall', PERMISSIONS.ADMIN)
//     private static handleTeleportAll(player: alt.Player) {
//         const onlinePlayers = Athena.get.players.online();
//         for (let target of onlinePlayers) {
//             if (!target || !target.valid) {
//                 return;
//             }

//             Athena.player.safe.setPosition(target, player.pos.x, player.pos.y, player.pos.z);
//         }
//     }
// }
