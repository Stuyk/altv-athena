import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';
import { CommandsLocale } from '../../shared/locale/commands';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onClient(SYSTEM_EVENTS.NOCLIP_RESET, handleReset);
alt.onClient(SYSTEM_EVENTS.NOCLIP_UPDATE, handleCamUpdate);

addCommand('noclip', handleCommand);

function handleCommand(player: alt.Player): void {
    const isNoClipping: boolean | null = player.getSyncedMeta('NoClipping');

    if (!isNoClipping && !player.data.isDead) {
        player.setSyncedMeta('NoClipping', true);
        player.emit().message(`No Clip: ${CommandsLocale.ON}`);
        player.visible = false;
        return;
    }

    if (player.data.isDead) {
        player.emit().message(CommandsLocale.CANNOT_WHILE_DEAD);
    }

    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    player.setSyncedMeta('NoClipping', false);
    player.emit().message(`No Clip:  ${CommandsLocale.OFF}`);
    player.visible = true;
}

function handleReset(player: alt.Player) {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
}

function handleCamUpdate(player, pos) {
    player.pos = pos;
}
