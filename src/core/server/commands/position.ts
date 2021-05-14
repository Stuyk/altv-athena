import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'coords',
    LocaleController.get(LOCALE_KEYS.COMMAND_COORDS, '/coords'),
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player, x: string, y: string, z: string): void {
    try {
        playerFuncs.safe.setPosition(player, parseFloat(x), parseFloat(y), parseFloat(z));
    } catch (err) {
        playerFuncs.emit.message(player, ChatController.getDescription('coords'));
    }
}
