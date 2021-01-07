import * as alt from 'alt-server';
import { CommandsLocale } from '../../shared/locale/commands';
import { addCommand } from '../systems/chat';

addCommand('revive', handleCommand);

function handleCommand(player: alt.Player, targetPlayerID: string | null = null): void {
    if (targetPlayerID === null) {
        player.send(CommandsLocale.CANNOT_WHILE_DEAD);
        finishRevive(player);
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

    finishRevive(target);
}

function finishRevive(target: alt.Player) {
    target.spawn(target.pos.x, target.pos.y, target.pos.z, 0);
    target.safeAddHealth(200, true);
    target.safeAddArmour(0, true);
    target.data.isDead = false;
    target.saveField('isDead', false);
    target.nextDeathSpawn = null;
}
