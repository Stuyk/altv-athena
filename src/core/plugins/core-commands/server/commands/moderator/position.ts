import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import ChatController from '../../../../../server/systems/chat';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

class PositionCommand {
    @command('position',LocaleController.get(LOCALE_KEYS.COMMAND_COORDS, '/coords'),
    PERMISSIONS.ADMIN)
    private static handleCommand(player: alt.Player, x: string, y: string, z: string): void {
        try {
            Athena.player.safe.setPosition(player, parseFloat(x), parseFloat(y), parseFloat(z));
        } catch (err) {
            Athena.player.emit.message(player, ChatController.getDescription('coords'));
        }
    }
}
