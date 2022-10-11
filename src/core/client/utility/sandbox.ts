// import * as alt from 'alt-client';
// import * as native from 'natives';
// import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
// import { AthenaClient } from '@AthenaClient/api/athena';

// const B = new alt.Vector3({ x: 319.4985046386719, y: -735.1348266601562, z: 29.30983543395996 });
// let positions = [];
// let didCollide = false;

// alt.onServer(SYSTEM_EVENTS.TICKS_START, async () => {
//     alt.setTimeout(() => {
//         AthenaClient.progressbar.create({
//             position: alt.Player.local.pos,
//             color: new alt.RGBA(255, 255, 255, 255),
//             distance: 25,
//             milliseconds: 30000,
//         });
//     }, 5000);
// });

// async function handleKeyUp(key: number) {
//     if (key !== 191) {
//         return;
//     }

//     console.log(isEntityBlockingPosition(B));
// }
