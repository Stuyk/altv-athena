import * as alt from 'alt-server';
import { System_Events_Voice } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';

let mainChannel: alt.VoiceChannel;

if (DEFAULT_CONFIG.VOICE_ON) {
    alt.on('playerDisconnect', handleDisconnect);
    alt.on(System_Events_Voice.AddToVoice, addToGlobalVoice);

    mainChannel = new alt.VoiceChannel(true, 25);
}

function handleDisconnect(player: alt.Player) {
    if (!DEFAULT_CONFIG.VOICE_ON || !player || !player.valid) {
        return;
    }

    try {
        mainChannel.removePlayer(player);
    } catch (err) {
        alt.log(`[Athena] Could not remove null player from voice. Likely due to reconnect.`);
    }
}

export function addToGlobalVoice(player: alt.Player) {
    if (mainChannel.isPlayerInChannel(player)) {
        return;
    }

    player.send(`[Athena] You have joined the global voice server.`);
    player.emit(System_Events_Voice.JoinedVoice);
    mainChannel.addPlayer(player);
}
