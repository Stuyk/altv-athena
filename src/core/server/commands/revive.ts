import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';

addCommand('revive', handleCommand);

function handleCommand(player: alt.Player, targetPlayerID: string | null = null): void {
    if (targetPlayerID === null) {
        finishRevive(player);
        return;
    }

    const target: alt.Player = [...alt.Player.all].find((x) => x.id.toString() === targetPlayerID);
    if (!target) {
        player.send(`That player does not exist.`);
        return;
    }

    finishRevive(target);
}

function finishRevive(target: alt.Player) {
    target.spawn(target.pos.x, target.pos.y, target.pos.z, 0);
    target.safeAddHealth(200, true);
    target.safeAddArmour(0, true);
}
