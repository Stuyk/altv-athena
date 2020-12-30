import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';

addCommand('sethealth', handleCommand);

function handleCommand(player: alt.Player, value: number = 100, targetPlayerID: number | null = null): void {
    if (isNaN(value)) {
        player.send(`/sethealth <value> <target_id>`);
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

    const target: alt.Player = [...alt.Player.all].find((x) => x.id === targetPlayerID);
    if (!target) {
        player.send(`That Player ID does not exist.`);
        return;
    }

    finishSetArmour(target, value);
}

function finishSetArmour(target: alt.Player, value: number) {
    target.safeAddHealth(value, true);
    target.send(`Your Health was set to: ${value}`);
}
