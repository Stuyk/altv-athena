import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'clearinventory',
    '/clearinventory [id]',
    ['admin'],
    async (player: alt.Player, id: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            return;
        }

        Athena.document.character.set(target, 'inventory', []);
    },
);

Athena.systems.messenger.commands.register(
    'cleartoolbar',
    '/cleartoolbar [id]',
    ['admin'],
    async (player: alt.Player, id: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            return;
        }

        Athena.document.character.set(target, 'toolbar', []);
    },
);
