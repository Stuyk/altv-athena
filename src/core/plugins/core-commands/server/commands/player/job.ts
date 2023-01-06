// import * as alt from 'alt-server';
// import { Athena } from '@AthenaServer/api/athena';
// import { command } from '@AthenaServer/decorators/commands';
// import { getPlayerJob } from '@AthenaServer/systems/job';
// import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
// import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
// import { LocaleController } from '@AthenaShared/locale/locale';

// class JobCommands {
//     @command('quitjob', LocaleController.get(LOCALE_KEYS.COMMAND_QUIT_JOB, '/quitjob'), PERMISSIONS.NONE)
//     private static handleCommand(player: alt.Player): void {
//         if (!player || !player.valid) {
//             return;
//         }

//         const job = getPlayerJob(player);

//         if (!job) {
//             Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.JOB_NOT_WORKING));
//             return;
//         }

//         job.quit('Job quitted');
//     }
// }
