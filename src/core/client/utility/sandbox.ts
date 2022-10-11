// import * as alt from 'alt-client';
// import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
// import { AthenaClient } from '@AthenaClient/api/athena';

// let isFocused = false;

// async function handleKeyUp(key: number) {
//     if (key !== 191) {
//         return;
//     }

//     if (isFocused) {
//         return;
//     }

//     isFocused = true;

//     // Let's ask some questions.
//     let answers = [];
//     let response = await AthenaClient.inputbox.create({
//         placeholder: 'What is your first name?',
//         blur: true,
//         darken: false,
//         hideHud: true,
//     });
//     answers.push(response);

//     response = await AthenaClient.inputbox.create({
//         placeholder: 'What is your last name?',
//         blur: true,
//         darken: false,
//         hideHud: true,
//     });
//     answers.push(response);

//     isFocused = false;
//     console.log(`Final Responses: ${JSON.stringify(answers)}`);
// }

// alt.onServer(SYSTEM_EVENTS.TICKS_START, async () => {
//     alt.on('keyup', handleKeyUp);
// });
