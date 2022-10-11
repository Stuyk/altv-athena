// import * as alt from 'alt-client';
// import { ProgressBar } from '@AthenaClient/rmlui/progressbar';
// import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

// alt.onServer(SYSTEM_EVENTS.TICKS_START, async () => {
//     await alt.Utils.wait(1000);

//     let count = 0;
//     alt.setInterval(() => {
//         ProgressBar.create({
//             uid: 'progress-bar' + count,
//             position: alt.Player.local.pos,
//             color: new alt.RGBA(255, 255, 255, 255),
//             distance: 25,
//             milliseconds: 5000,
//         });

//         count += 1;
//     }, 5000);
// });
