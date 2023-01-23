import { Athena } from '@AthenaServer/api/athena';
// import { Item } from '@AthenaShared/interfaces/inventory';
import * as alt from 'alt-server';

// function newFieldChange(player: alt.Player, newValue: number, oldValue: number) {
//     console.log('Cash CHANGE!');

//     console.log(`Old Value:`);
//     console.log(JSON.stringify(oldValue));

//     console.log(`New Value:`);
//     console.log(JSON.stringify(newValue));
// }

// Athena.document.character.onChange('cash', newFieldChange);

// Athena.systems.effects.add('edible', (player: alt.Player, slot: number, type: 'inventory' | 'toolbar') => {
//     console.log('eat item effect...');

//     const data = Athena.document.character.get(player);
//     if (typeof data === 'undefined') {
//         return;
//     }

//     if (typeof data[String(type)] === 'undefined') {
//         return;
//     }

//     const storedItem = Athena.systems.itemManager.slot.getAt(slot, data[String(type)]);
//     if (typeof storedItem === 'undefined') {
//         return;
//     }

//     console.log('jkljklkl');
// });
