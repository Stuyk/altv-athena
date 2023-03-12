import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'accountaddpermission',
    '/accountaddpermission [ingame-id] [permission] - Add an account permission',
    ['admin'],
    async (player: alt.Player, id: string, permission: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            Athena.player.emit.notification(player, `User with that ID was not found.`);
            return;
        }

        if (!permission) {
            Athena.player.emit.notification(player, `Permission was not specified.`);
            return;
        }

        const character = Athena.document.character.get(target);
        if (typeof character === 'undefined') {
            Athena.player.emit.notification(player, `User is not fully logged in yet.`);
            return;
        }

        await Athena.systems.permission.add<typeof permission>('account', target, permission);
        Athena.player.emit.notification(target, `Added Account Permission: ${permission}`);
        Athena.player.emit.notification(player, `Added Account Permission: ${permission} to ${character.name}`);
    },
);

Athena.systems.messenger.commands.register(
    'accountremovepermission',
    '/accountremovepermission [ingame-id] [permission] - Remove an account permission',
    ['admin'],
    async (player: alt.Player, id: string, permission: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            Athena.player.emit.notification(player, `User with that ID was not found.`);
            return;
        }

        if (!permission) {
            Athena.player.emit.notification(player, `Permission was not specified.`);
            return;
        }

        const character = Athena.document.character.get(target);
        if (typeof character === 'undefined') {
            Athena.player.emit.notification(player, `User is not fully logged in yet.`);
            return;
        }

        await Athena.systems.permission.remove<typeof permission>('account', target, permission);
        Athena.player.emit.notification(target, `Removed Account Permission: ${permission}`);
        Athena.player.emit.notification(player, `Removed Account Permission: ${permission} from ${character.name}`);
    },
);
