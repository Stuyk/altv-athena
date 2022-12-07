import * as alt from 'alt-server';
import { command } from '@AthenaServer/decorators/commands';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';
import { Athena } from '@AthenaServer/api/athena';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { World } from '@AthenaServer/systems/world';

class TimeCommands {
    @command('settime', LocaleController.get(LOCALE_KEYS.COMMAND_SET_TIME, '/settime'), PERMISSIONS.ADMIN)
    private static setTimeCommand(player: alt.Player, hour: number) {
        if (!player || !player.valid) return;

        if (typeof hour === 'string') hour = parseInt(hour);
        if (hour >= 24 || hour <= -1) hour = 0;

        Athena.player.emit.message(player, `Time will now always be ${hour}`);
        Athena.player.emit.message(player, `Use /cleartime to stop overriding the time.`);
        World.setOverrideTime(true, hour);
    }

    @command('cleartime', LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_TIME, '/cleartime'), PERMISSIONS.ADMIN)
    private static clearTimeCommand(player: alt.Player) {
        if (!player || !player.valid) return;

        World.setOverrideTime(false, 0);
        Athena.player.emit.message(player, `Time override is now disabled.`);
    }
}
