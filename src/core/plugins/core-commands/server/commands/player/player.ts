import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register('id', '/id - Print your current identifier.', [], (player: alt.Player) => {
    const id = Athena.systems.identifier.getIdByStrategy(player);
    Athena.systems.messenger.messaging.send(player, `Current ID: ${id}`);
});
