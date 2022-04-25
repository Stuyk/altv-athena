import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { getPlayerJob } from '../../../../../server/systems/job';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

class JobCommands {
    @command('quitjob', LocaleController.get(LOCALE_KEYS.COMMAND_QUIT_JOB, '/quitjob'), PERMISSIONS.NONE)
    private static handleCommand(player: alt.Player): void {
        if (!player || !player.valid) {
            return;
        }

        const job = getPlayerJob(player);

        if (!job) {
            Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.JOB_NOT_WORKING));
            return;
        }

        job.quit(LocaleController.get(LOCALE_KEYS.JOB_QUIT));
    }
}
