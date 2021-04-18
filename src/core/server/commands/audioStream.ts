import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import { AudioStream } from '../../shared/interfaces/Audio';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

ChatController.addCommand(
    'audiostream',
    LocaleController.get(LOCALE_KEYS.COMMAND_AUDIOSTREAM, '/audiostream'),
    Permissions.Admin,
    handleCommand
);

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
