// import * as alt from 'alt-client';
// import * as native from 'natives';
// import { HotkeyRegistry } from '@AthenaClient/systems/hotkeyRegistry';
// import { drawText3D } from './text';
// import { AthenaClient } from '@AthenaClient/api/athena';

// function whilePressed() {
//     const vehicles = [...alt.Vehicle.streamedIn];
//     const players = [...alt.Player.streamedIn];
//     const objects = [...alt.Object.all];

//     for (let vehicle of vehicles) {
//         drawText3D(`ID: ${vehicle.id}~n~MODEL: ${vehicle.model}`, vehicle.pos, 0.5, new alt.RGBA(255, 255, 255, 150));
//     }

//     for (let player of players) {
//         drawText3D(`ID: ${player.id}~n~MODEL: ${player.model}`, player.pos, 0.5, new alt.RGBA(255, 255, 255, 150));
//     }

//     for (let object of objects) {
//         drawText3D(`ID: ${object.id}~n~MODEL: ${object.model}`, object.pos, 0.5, new alt.RGBA(255, 255, 255, 150));
//     }
// }

// HotkeyRegistry.add({ key: 113, whilePressed, identifier: 'draw-info-on-screen' });

// HotkeyRegistry.add({
//     key: 114,
//     identifier: 'trigger-in-five-seconds',
//     delayedKeyDown: {
//         msToTrigger: 1000,
//         callback() {
//             AthenaClient.screen.spinner.clear();
//             const veh = AthenaClient.utility.getClosestVehicle(alt.Player.local.pos);
//             native.setVehicleDoorOpen(veh.scriptID, 2, false, false);
//             native.setVehicleDoorOpen(veh.scriptID, 3, false, false);
//         },
//     },
//     keyDown() {
//         AthenaClient.screen.spinner.create({ duration: -1, text: 'Opening Trunk', type: 0 });
//     },
//     keyUp() {
//         AthenaClient.screen.spinner.clear();
//     },

// });
