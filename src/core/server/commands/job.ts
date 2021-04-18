import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { getPlayerJob } from '../systems/job';

ChatController.addCommand(
    'quitjob',
    LocaleController.get(LOCALE_KEYS.COMMAND_QUIT_JOB, '/quitjob'),
    Permissions.None,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid) {
        return;
    }

    const job = getPlayerJob(player);

    if (!job) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.JOB_NOT_WORKING));
        return;
    }

    job.quit(LocaleController.get(LOCALE_KEYS.JOB_QUIT));
}
