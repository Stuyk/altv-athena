import alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { CurrencyTypes } from '@AthenaShared/enums/currency';

Athena.systems.messenger.commands.register(
    'setcash',
    'Set cash amount for a player to a specific amount.',
    ['amount', 'id'],
    ['admin'],
    (player: alt.Player, amount: string, id: string | undefined) => {
        if (typeof id === 'undefined') {
            Athena.player.currency.set(player, CurrencyTypes.CASH, parseInt(amount));
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot Find Player');
            return;
        }

        Athena.player.currency.set(target, CurrencyTypes.CASH, parseInt(amount));
    },
);

Athena.systems.messenger.commands.register(
    'addbank',
    'Add bank balance to a player.',
    ['amount', 'id'],
    ['admin'],
    (player: alt.Player, amount: string, id: string | undefined) => {
        if (typeof id === 'undefined') {
            Athena.player.currency.add(player, CurrencyTypes.BANK, parseInt(amount));
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot Find Player');
            return;
        }

        Athena.player.currency.add(target, CurrencyTypes.BANK, parseInt(amount));
    },
);

Athena.systems.messenger.commands.register(
    'setbank',
    'Set bank balance for a player.',
    ['amount', 'id'],
    ['admin'],
    (player: alt.Player, amount: string, id: string | undefined) => {
        if (typeof id === 'undefined') {
            Athena.player.currency.set(player, CurrencyTypes.BANK, parseInt(amount));
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot Find Player');
            return;
        }

        Athena.player.currency.set(target, CurrencyTypes.BANK, parseInt(amount));
    },
);

Athena.systems.messenger.commands.register(
    'addcash',
    'Add cash balance to a player.',
    ['amount', 'id'],
    ['admin'],
    (player: alt.Player, amount: string, id: string | undefined) => {
        if (typeof id === 'undefined') {
            Athena.player.currency.add(player, CurrencyTypes.CASH, parseInt(amount));
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot Find Player');
            return;
        }

        Athena.player.currency.add(target, CurrencyTypes.CASH, parseInt(amount));
    },
);
