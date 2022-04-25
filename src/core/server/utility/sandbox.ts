import * as alt from 'alt-server';
import { Athena } from '../api/athena';
import { Global } from '../systems/global';

// Does nothing. Just writing some code here.
// May change from version to version but it's mostly just Stuyk's notepad.

// Athena.player.emit.override('notification', (player: alt.Player, message: string) => {
//     console.log(`This was overrided, and you can't see ${message} in-game.`);
// });

// Athena.player.emit.notification()

// async function testing() {
//     for (let i = 0; i < 100; i++) {
//         await Global.increase('bankNumber', 1, 10000000);
//         const result = await Global.getKey<number>('bankNumber');
//         console.log(`Bank Number Current Value: ${result}`);
//     }
// }

// testing();