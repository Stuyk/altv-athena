import * as alt from 'alt-server';
import { CommandsLocale } from '../../shared/locale/commands';
import { addCommand } from '../systems/chat';

addCommand('revive', handleCommand);

function handleCommand(player: alt.Player, targetPlayerID: string | null = null): void {
    if (targetPlayerID === null) {
        player.handleDeathRespawn(player.pos);
        return;
    }

    const target: alt.Player = [...alt.Player.all].find((x) => x.id.toString() === targetPlayerID);
    if (!target) {
        player.send(CommandsLocale.CANNOT_FIND_PLAYER);
        return;
    }

    if (!target.data.isDead) {
        player.send(CommandsLocale.PLAYER_IS_NOT_DEAD);
        return;
    }

    target.handleDeathRespawn(target.pos);
}
