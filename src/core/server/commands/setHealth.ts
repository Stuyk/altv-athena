import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { CommandsLocale } from '../../shared/locale/commands';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'sethealth',
    '/sethealth [99 - 200] [player_id]* - Set health for self or others',
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player, value: number = 100, targetPlayerID: string | null = null): void {
    if (isNaN(value)) {
        playerFuncs.emit.message(player, ChatController.getDescription('sethealth'));
        return;
    }

    if (value < 99) {
        value = 99;
    }

    if (value > 200) {
        value = 200;
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
    playerFuncs.safe.addHealth(target, value, true);
    playerFuncs.emit.message(target, `${CommandsLocale.HEALTH_SET_TO}${value}`);
}
