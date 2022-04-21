import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { World } from '../../../../../server/systems/world';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
class TimerCommands {
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
