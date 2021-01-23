import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { CommandsLocale } from '../../shared/locale/commands';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand('revive', '/revive [player_id]* - Revive self or others', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player, targetPlayerID: string | null = null): void {
    if (targetPlayerID === null) {
        playerFuncs.set.respawned(player, player.pos);
        return;
    }

    const target: alt.Player = [...alt.Player.all].find((x) => x.id.toString() === targetPlayerID);
    if (!target) {
        playerFuncs.emit.message(player, CommandsLocale.CANNOT_FIND_PLAYER);
        return;
    }

    if (!target.data.isDead) {
        playerFuncs.emit.message(player, CommandsLocale.PLAYER_IS_NOT_DEAD);
        return;
    }

    playerFuncs.set.respawned(target, target.pos);
}
