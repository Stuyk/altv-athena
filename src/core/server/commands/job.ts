import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';
import { getPlayerJob } from '../systems/job';

ChatController.addCommand(
    'quitjob',
    LocaleController.get(LOCALE_KEYS.COMMAND_QUIT_JOB, '/quitjob'),
    PERMISSIONS.NONE,
    handleCommand,
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
