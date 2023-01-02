// import { Athena } from '@AthenaServer/api/athena';
// import { Character } from '@AthenaShared/interfaces/character';
// import * as alt from 'alt-server';

// interface ExtendedCharacter extends Character {
//     newField1: string;
//     newField2: string;
//     newField3: number;
// }

// alt.on('playerConnect', async (player) => {
//     const data = Athena.document.character.get<ExtendedCharacter>(player);
//     data.newField1 = 'Hello World!';

//     await Athena.document.character.set<ExtendedCharacter>(player, 'newField1', data.newField1);

//     // Alternatively... update based on bulk data.
//     const newData = {
//         newField1: 'Hello 1',
//         newField2: 'Hello 2',
//         newField3: 5,
//     };

//     await Athena.document.character.setBulk<ExtendedCharacter>(player, newData);
// });

// function newFieldChange(player: alt.Player, newValue: string, oldValue: string) {
//     console.log(`Data Change: `, newValue, 'from', oldValue);
// }

// Athena.document.character.onChange<ExtendedCharacter>('newField1', newFieldChange);
