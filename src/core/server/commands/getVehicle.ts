import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';
import { getDescription } from '../../shared/commands/commandList';

addCommand('getvehicle', handleCommand);

function handleCommand(player: alt.Player, name: string): void {
    if (!name) {
        player.send(getDescription('getvehicle'));
        return;
    }

    try {
        const veh = new alt.Vehicle(name, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    } catch (err) {
        player.send(`Vehicle model is not valid`);
    }
}
