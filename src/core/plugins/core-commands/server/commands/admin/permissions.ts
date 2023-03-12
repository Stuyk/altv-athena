import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'addperm',
    '/addperm [account or character] [ingame-id] [permission] - Add an account permission',
    ['admin'],
    async (player: alt.Player, type: string, id: string, permission: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            Athena.player.emit.notification(player, `User with that ID was not found.`);
            return;
        }

        if (type !== 'account' && type !== 'character') {
            Athena.player.emit.notification(player, `Type must be account or character.`);
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

        await Athena.systems.permission.add<typeof permission>(type, target, permission);
        Athena.player.emit.notification(target, `Added ${type} permission - ${permission}`);
        Athena.player.emit.notification(player, `Added ${type} permission ${permission} to ${character.name}`);
    },
);

Athena.systems.messenger.commands.register(
    'removeperm',
    '/removeperm [account or character] [ingame-id] [permission] - Remove an account permission',
    ['admin'],
    async (player: alt.Player, type: string, id: string, permission: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            Athena.player.emit.notification(player, `User with that ID was not found.`);
            return;
        }

        if (type !== 'account' && type !== 'character') {
            Athena.player.emit.notification(player, `Type must be account or character.`);
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

        await Athena.systems.permission.remove<typeof permission>(type, target, permission);
        Athena.player.emit.notification(target, `Removed ${type} permission - ${permission}`);
        Athena.player.emit.notification(player, `Removed ${type} permission ${permission} from ${character.name}`);
    },
);

Athena.systems.messenger.commands.register(
    'getperms',
    '/getperms [account or character] [ingame-id] - Show current perms a player has',
    ['admin'],
    async (player: alt.Player, type: string, id: string, permission: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            Athena.player.emit.notification(player, `User with that ID was not found.`);
            return;
        }

        if (type !== 'account' && type !== 'character') {
            Athena.player.emit.notification(player, `Type must be account or character.`);
            return;
        }

        if (type === 'account') {
            const account = Athena.document.account.get(target);
            if (!account) {
                Athena.player.emit.notification(player, `User is not fully logged in yet.`);
                return;
            }

            Athena.player.emit.message(player, `Perms: ${account.permissions.join(',')}`);
            return;
        }

        const character = Athena.document.character.get(target);
        if (typeof character === 'undefined') {
            Athena.player.emit.notification(player, `User is not fully logged in yet.`);
            return;
        }

        if (typeof character.permissions === 'undefined') {
            Athena.player.emit.message(player, `No Permissions Found`);
            return;
        }

        Athena.player.emit.message(player, `Perms: ${character.permissions.join(',')}`);
    },
);
