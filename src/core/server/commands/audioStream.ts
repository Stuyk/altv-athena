import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Permissions } from 'core/shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import { AudioStream } from 'core/shared/interfaces/Audio';

ChatController.addCommand('audiostream', '/audiostream [youtube_id]', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player, identifier: string): void {
    if (!identifier) {
        playerFuncs.emit.message(player, ChatController.getDescription('audiostream'));
        return;
    }

    const stream: AudioStream = {
        position: player.pos,
        streamName: identifier,
        duration: 217000 // This is in milliseconds btw.
    };

    playerFuncs.emit.audioStream(stream);
}
