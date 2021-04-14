import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'setwater',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_WATER, '/setwater'),
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player, value: string): void {
    let waterLevel = parseInt(value);

    if (isNaN(waterLevel)) {
        playerFuncs.emit.message(player, ChatController.getDescription('setwater'));
        return;
    }

    if (waterLevel > 100) {
        waterLevel = 100;
    }

    if (waterLevel < 0) {
        waterLevel = 0;
    }

    player.data.water = waterLevel;
    playerFuncs.save.field(player, 'water', player.data.food);
    playerFuncs.sync.water(player);
    playerFuncs.emit.message(player, `Set Water to: ${waterLevel}`);
}
