import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'joaat',
    '/joaat [string]',
    ['admin'],
    async (player: alt.Player, dataToHash: string | undefined) => {
        if (typeof dataToHash === 'undefined') {
            Athena.player.emit.message(player, `Must specify a string to hash.`);
            return;
        }

        const result = alt.hash(dataToHash);
        const message = `Hashed Result: ${result}`;

        console.log(message);
        Athena.player.emit.message(player, message);
    },
);
