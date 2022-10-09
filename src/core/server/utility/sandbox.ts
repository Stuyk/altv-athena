// import * as alt from 'alt-server';
// import { Athena } from '../api/athena';

// let hasInit = false;

// alt.everyTick(() => {
//     const player = alt.Player.all[0];

//     if (!player || !player.valid) {
//         return;
//     }

//     if (!hasInit) {
//         hasInit = true;
//         console.log('CREATED');
//         Athena.controllers.text.addToPlayer(player, {
//             uid: 'test',
//             data: 'this you?',
//             pos: player.pos,
//             maxDistance: 25,
//         });
//         return;
//     }

//     Athena.controllers.text.update('test', { pos: player.pos }, player);
// });
