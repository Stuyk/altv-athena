import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { getPlayerJob } from '@AthenaServer/systems/job';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';

Athena.systems.messenger.commands.register('quitjob', '/quitjob', [], (player: alt.Player) => {
    if (!player || !player.valid) {
        return;
    }

    const job = getPlayerJob(player);

    if (!job) {
        Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.JOB_NOT_WORKING));
        return;
    }

    job.quit('Quit Job');
});
