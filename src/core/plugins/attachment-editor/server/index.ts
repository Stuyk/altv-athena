import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { Events } from '../shared/events.js';

Athena.systems.plugins.registerPlugin('attachment-editor', () => {
    Athena.commands.register('attachmenteditor', '/attachmenteditor', ['admin'], (player: alt.Player) => {
        player.emit(Events.toClient.open);
    });
});
