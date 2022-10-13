// import * as alt from 'alt-client';
// import * as native from 'natives';
// import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
// import { AthenaClient } from '@AthenaClient/api/athena';

// alt.onServer(SYSTEM_EVENTS.TICKS_START, async () => {
//     await alt.Utils.wait(2000);

//     const startPos = { x: -839.8507690429688, y: -151.79005432128906, z: 19.950349807739258 };

//     for (let i = 0; i < 1000; i++) {
//         await AthenaClient.rmlui.staticText.upsert({
//             position: { x: -794.0873413085938 + i * 0.5, y: -73.61027526855469, z: 37.780914306640625 },
//             text: 'Hello World',
//             distance: 10,
//             uid: 'graffiti' + i,
//         });
//     }
// });
