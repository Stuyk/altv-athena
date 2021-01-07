import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';
import { getDescription } from '../../shared/commands/commandList';
import { getVectorInFrontOfPlayer } from '../utility/vector';

addCommand('getvehicle', handleCommand);

function handleCommand(player: alt.Player, name: string): void {
    if (!name) {
        player.send(getDescription('getvehicle'));
        return;
    }

    if (player.data.isDead) {
        player.send(`Unable to spawn vehicles while dead.`);
        return;
    }

    const forwardPosition = getVectorInFrontOfPlayer(player, 5);

    try {
        const veh = new alt.Vehicle(name, forwardPosition.x, forwardPosition.y, forwardPosition.z, 0, 0, 0);
    } catch (err) {
        player.send(`Vehicle model is not valid`);
    }
}
