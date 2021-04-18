import * as alt from 'alt-server';
import ChatController from '../systems/chat';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

alt.onClient(SYSTEM_EVENTS.NOCLIP_RESET, handleReset);
alt.onClient(SYSTEM_EVENTS.NOCLIP_UPDATE, handleCamUpdate);

ChatController.addCommand(
    'noclip',
    LocaleController.get(LOCALE_KEYS.COMMAND_NO_CLIP, '/noclip'),
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    const isNoClipping: boolean | null = player.getSyncedMeta('NoClipping');

    if (!isNoClipping && !player.data.isDead) {
        player.setSyncedMeta('NoClipping', true);
        playerFuncs.emit.message(player, `No Clip: ${LocaleController.get(LOCALE_KEYS.LABEL_ON)}`);
        player.visible = false;
        return;
    }

    if (player.data.isDead) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
    }

    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    player.setSyncedMeta('NoClipping', false);
    playerFuncs.emit.message(player, `No Clip: ${LocaleController.get(LOCALE_KEYS.LABEL_OFF)}`);
    player.visible = true;
}

function handleReset(player: alt.Player) {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
}

function handleCamUpdate(player, pos) {
    player.pos = pos;
}
