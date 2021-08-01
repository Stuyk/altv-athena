import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'updateweather',
    LocaleController.get(LOCALE_KEYS.COMMAND_UPDATE_WEATHER, '/setweater'),
    PERMISSIONS.ADMIN,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    playerFuncs.sync.weather(player);
}
