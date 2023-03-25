import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'clearweapons',
    '/clearweapons [id]',
    ['admin'],
    async (player: alt.Player, id: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            return;
        }

        const didRemove = await Athena.player.weapons.clear(target);
        const message = didRemove ? 'Weapons Removed!' : 'No Weapons Found!';
        Athena.player.emit.notification(player, message);
    },
);

Athena.systems.messenger.commands.register(
    'getweapons',
    '/getweapons [id]',
    ['admin'],
    async (player: alt.Player, id: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            return;
        }

        const weaponInfo = await Athena.player.weapons.get(target);
        const message = `Weapon Total: ${weaponInfo.inventory.length + weaponInfo.toolbar.length}`;
        Athena.player.emit.notification(player, message);
    },
);
