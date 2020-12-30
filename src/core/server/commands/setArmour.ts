import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';

addCommand('setarmour', handleCommand);

function handleCommand(player: alt.Player, value: number = 100, targetPlayerID: number | null = null): void {
    if (isNaN(value)) {
        player.send(`/setarmour <value> <target_id>`);
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

    const target: alt.Player = [...alt.Player.all].find((x) => x.id === targetPlayerID);
    if (!target) {
        player.send(`That Player ID does not exist.`);
        return;
    }

    finishSetArmour(target, value);
}

function finishSetArmour(target: alt.Player, value: number) {
    target.safeAddArmour(value, true);
    target.send(`Your Armour was set to: ${value}`);
}
