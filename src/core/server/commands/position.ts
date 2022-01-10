import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'coords',
    LocaleController.get(LOCALE_KEYS.COMMAND_COORDS, '/coords'),
    PERMISSIONS.ADMIN,
    handleCommand,
);

function handleCommand(player: alt.Player, x: string, y: string, z: string): void {
    try {
        playerFuncs.safe.setPosition(player, parseFloat(x), parseFloat(y), parseFloat(z));
    } catch (err) {
        playerFuncs.emit.message(player, ChatController.getDescription('coords'));
    }
}
