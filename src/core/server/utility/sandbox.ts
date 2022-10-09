// import * as alt from 'alt-server';
// import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
// import { Athena } from '../api/athena';

// let hasInit = false;

// Athena.events.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, async (player: alt.Player) => {
//     await alt.Utils.wait(5000);

//     alt.setInterval(() => {
//         if (!player || !player.valid) {
//             return;
//         }

//         if (!hasInit) {
//             hasInit = true;
//             console.log('CREATED');
//             Athena.controllers.object.addToPlayer(player, {
//                 uid: 'test',
//                 model: 'v_ind_cf_shelf2',
//                 pos: player.pos,
//                 maxDistance: 25,
//             });
//             return;
//         }

//         Athena.controllers.object.updatePosition('test', player.pos, player);
//     }, 1000);
// });
