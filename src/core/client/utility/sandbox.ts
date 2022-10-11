// import * as alt from 'alt-client';
// import * as native from 'natives';
// import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
// import { AthenaClient } from '@AthenaClient/api/athena';

// alt.onServer(SYSTEM_EVENTS.TICKS_START, async () => {
//     await alt.Utils.wait(2000);

//     // const response = await AthenaClient.rmlui.questionBox.create({
//     //     placeholder: 'Would you like to proceed?',
//     //     blur: true,
//     //     darken: true,
//     //     hideHud: true,
//     // });

//     // alt.log(response);

//     AthenaClient.rmlui.progressBar.create({
//         color: new alt.RGBA(255, 0, 0, 255),
//         distance: 25,
//         milliseconds: 10000,
//         position: alt.Player.local.pos,
//         percentageEnabled: true,
//     });
// });

// const B = new alt.Vector3({ x: 319.4985046386719, y: -735.1348266601562, z: 29.30983543395996 });
// let positions = [];
// let didCollide = false;

// async function handleKeyUp(key: number) {
//     if (key !== 191) {
//         return;
//     }

//     console.log(isEntityBlockingPosition(B));
// }
