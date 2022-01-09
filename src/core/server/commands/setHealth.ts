import * as alt from 'alt-server';

import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';

import ChatController from '../systems/chat';

ChatController.addCommand(
    'sethealth',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_HEALTH, '/sethealth'),
    PERMISSIONS.ADMIN,
    handleCommand,
);

function handleCommand(player: alt.Player, value: number = 100, id: string | null = null): void {
    if (isNaN(value)) {
        playerFuncs.emit.message(player, ChatController.getDescription('sethealth'));
        return;
    }

    if (value < 99) {
        value = 99;
    }

    if (value > 199) {
        value = 199;
    }

    if (id === null || id === undefined) {
        finishSetHealth(player, value);
        return;
    }

    const target = playerFuncs.get.findByUid(id);
    if (!target) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
        return;
    }

    finishSetHealth(target, value);
}

function finishSetHealth(target: alt.Player, value: number) {
    playerFuncs.safe.addHealth(target, value, true);
    playerFuncs.emit.message(target, LocaleController.get(LOCALE_KEYS.PLAYER_HEALTH_SET_TO, value));
}
