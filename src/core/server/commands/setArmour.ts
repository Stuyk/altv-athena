import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { CommandsLocale } from '../../shared/locale/commands';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'setarmour',
    '/setarmour [0 - 100] [player_id]* - Set armour for self or others',
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player, value: number = 100, targetPlayerID: string | null = null): void {
    if (isNaN(value)) {
        playerFuncs.emit.message(player, ChatController.getDescription('setarmour'));
        return;
    }

    if (value < 0) {
        value = 0;
    }

    if (value > 100) {
        value = 100;
    }

    if (targetPlayerID === null) {
        finishSetArmour(player, value);
        return;
    }

    const target: alt.Player = [...alt.Player.all].find((x) => x.id.toString() === targetPlayerID);
    if (!target) {
        playerFuncs.emit.message(player, CommandsLocale.CANNOT_FIND_PLAYER);
        return;
    }

    finishSetArmour(target, value);
}

function finishSetArmour(target: alt.Player, value: number) {
    playerFuncs.safe.addArmour(target, value, true);
    playerFuncs.emit.message(target, `${CommandsLocale.ARMOUR_SET_TO}${value}`);
}
