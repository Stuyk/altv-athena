import alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';

Athena.systems.messenger.commands.register('id', '/id - Print your current identifier.', [], (player: alt.Player) => {
    const id = Athena.systems.identifier.getIdByStrategy(player);
    Athena.systems.messenger.player.send(player, `Current ID: ${id}`);
});
