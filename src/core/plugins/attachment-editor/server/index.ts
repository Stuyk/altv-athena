import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { Events } from '../shared/events';

Athena.systems.plugins.registerPlugin('attachment-editor', () => {
    Athena.commands.register('attachmenteditor', '/attachmenteditor', ['admin'], (player: alt.Player) => {
        player.emit(Events.toClient.open);
    });
});
