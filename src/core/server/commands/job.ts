import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { getPlayerJob } from '../systems/job';

ChatController.addCommand('quitjob', '/quitjob - Will quit your current job.', Permissions.None, handleCommand);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid) {
        return;
    }

    const job = getPlayerJob(player);

    if (!job) {
        playerFuncs.emit.notification(player, `You are not currently working a job.`);
        return;
    }

    job.quit('You have quit the job at hand.');
}
