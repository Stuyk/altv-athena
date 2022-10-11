// import * as alt from 'alt-server';
// import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
// import { Athena } from '../api/athena';

// Athena.events.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, async (player: alt.Player) => {
//     alt.setTimeout(() => {
//         makeProgressBar(player);
//     }, 1500);
// });

// function makeProgressBar(player: alt.Player) {
//     const uid = Athena.player.emit.createProgressBar(player, {
//         position: player.pos,
//         color: new alt.RGBA(255, 255, 255, 255),
//         distance: 25,
//         milliseconds: 10000,
//         text: 'Loading...',
//     });

//     alt.setTimeout(() => {
//         Athena.player.emit.removeProgressBar(player, uid);
//         makeProgressBar(player);
//     }, 10000);
// }
