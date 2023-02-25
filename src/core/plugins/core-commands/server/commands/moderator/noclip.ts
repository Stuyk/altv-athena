import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';

Athena.systems.messenger.commands.register('noclip', '/noclip', ['admin'], (player: alt.Player) => {
    const isNoClipping: boolean | null = player.getSyncedMeta('NoClipping') as boolean;
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return;
    }

    if (!isNoClipping && !data.isDead) {
        player.setSyncedMeta('NoClipping', true);
        Athena.player.emit.message(player, `No Clip: ${LocaleController.get(LOCALE_KEYS.LABEL_ON)}`);
        player.visible = false;
        return;
    }

    if (data.isDead) {
        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
    }

    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    player.setSyncedMeta('NoClipping', false);
    Athena.player.emit.message(player, `No Clip: ${LocaleController.get(LOCALE_KEYS.LABEL_OFF)}`);
    player.visible = true;
    player.health = 199;
});

function handleReset(player: alt.Player) {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
}

function handleCamUpdate(player: alt.Player, pos: alt.Vector3) {
    Athena.player.safe.setPosition(player, pos.x, pos.y, pos.z);
}

alt.onClient(SYSTEM_EVENTS.NOCLIP_RESET, handleReset);
alt.onClient(SYSTEM_EVENTS.NOCLIP_UPDATE, handleCamUpdate);
