// import * as alt from 'alt-client';
// import * as native from 'natives';
// import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
// import { AthenaClient } from '@AthenaClient/api/athena';

// alt.onServer(SYSTEM_EVENTS.TICKS_START, async () => {
//     await alt.Utils.wait(2000);
//     await AthenaClient.rmlui.menu.create({
//         header: {
//             title: 'My Menu',
//             color: new alt.RGBA(100, 100, 0, 255),
//         },
//         options: [
//             {
//                 type: 'Toggle',
//                 title: 'Toggleable',
//                 description: 'Toggles something...',
//                 value: false,
//                 callback: (newValue: boolean) => {
//                     console.log(newValue); // true
//                 },
//             },
//             {
//                 type: 'Range',
//                 title: 'Range Index',
//                 description: 'Increments +/- 1',
//                 value: 0,
//                 min: 0,
//                 max: 10,
//                 increment: 1,
//                 callback: (newValue: number) => {
//                     console.log(newValue); // 1
//                 },
//             },
//             {
//                 type: 'Selection',
//                 title: 'Array Based Option',
//                 description: 'Sends Results by Index Increment',
//                 options: ['zero', 'one', 'two'],
//                 value: 0,
//                 callback: (newValue: string) => {
//                     console.log(newValue); // zero
//                 },
//             },
//             {
//                 type: 'Invoke',
//                 title: 'Invoker',
//                 description: 'Triggers something...',
//                 callback: () => {
//                     console.log('hi!');
//                 },
//             },
//             {
//                 type: 'Invoke',
//                 title: 'Close',
//                 description: 'Close the Menu',
//                 callback: AthenaClient.rmlui.menu.close,
//             },
//         ],
//     });
// });
