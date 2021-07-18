import * as alt from 'alt-server';

import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'seatbelt',
    LocaleController.get(LOCALE_KEYS.COMMAND_SEATBELT, '/seatbelt'),
    Permissions.None,
    handleCommand
);

ChatController.addCommand(
    'sb',
    LocaleController.get(LOCALE_KEYS.COMMAND_SEATBELT, '/sb'),
    Permissions.None,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    if (player.data.isDead) {
        return;
    }

    playerFuncs.emit.sound2D(player, 'seatbelt_on', 0.75);
    playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.PLAYER_SEATBELT_ON));
    alt.emitClient(player, VEHICLE_EVENTS.SET_SEATBELT);
}
