import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';
import { updatePlayerWeather } from '../systems/world';

addCommand('updateweather', handleCommand);

function handleCommand(player: alt.Player): void {
    updatePlayerWeather(player);
}
