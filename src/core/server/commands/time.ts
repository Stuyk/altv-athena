import * as alt from 'alt-server';
import { WORLD_WEATHER } from '../../shared/enums/weather';

import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';
import { World } from '../systems/world';

function setTime(player: alt.Player, hour: number) {
    if (!player || !player.valid) {
        return;
    }

    if (typeof hour === 'string') {
        hour = parseInt(hour);
    }

    if (hour >= 24 || hour <= -1) {
        hour = 0;
    }

    playerFuncs.emit.message(player, `Time will now always be ${hour}`);
    playerFuncs.emit.message(player, `Use /cleartime to stop overriding the time.`);
    World.setOverrideTime(true, hour);
}

function clearTime(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    World.setOverrideTime(false, 0);
    playerFuncs.emit.message(player, `Time override is now disabled.`);
}

ChatController.addCommand(
    'settime',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_TIME, '/settime'),
    PERMISSIONS.ADMIN,
    setTime,
);

ChatController.addCommand(
    'cleartime',
    LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_TIME, '/cleartime'),
    PERMISSIONS.ADMIN,
    clearTime,
);
