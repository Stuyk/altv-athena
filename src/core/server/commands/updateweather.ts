import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';

addCommand('updateweather', handleCommand);

function handleCommand(player: alt.Player): void {
    player.sync().weather();
}
