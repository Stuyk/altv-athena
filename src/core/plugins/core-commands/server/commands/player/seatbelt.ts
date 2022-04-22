import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { VEHICLE_EVENTS } from '../../../../../shared/enums/vehicle';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

class SeatbeltCommand {
    @command('seatbelt', LocaleController.get(LOCALE_KEYS.COMMAND_SEATBELT, '/seatbelt'), PERMISSIONS.NONE)
    private static handleCommand(player: alt.Player): void {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }
    
        if (player.data.isDead) {
            return;
        }
    
        Athena.player.emit.sound2D(player, 'seatbelt_on', 0.75);
        Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.PLAYER_SEATBELT_ON));
        alt.emitClient(player, VEHICLE_EVENTS.SET_SEATBELT, true);
    }
}
