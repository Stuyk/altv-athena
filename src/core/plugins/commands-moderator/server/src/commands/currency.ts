import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { CurrencyTypes } from '../../../../../shared/enums/currency';

export function handleSetCash(player: alt.Player, amount: string, id: string | null = null): void {
    if (id === null || id === undefined) {
        Athena.player.currency.set(player, CurrencyTypes.CASH, parseInt(amount));
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, 'Cannot Find Player');
        return;
    }

    Athena.player.currency.set(target, CurrencyTypes.CASH, parseInt(amount));
}

export function handleSetBank(player: alt.Player, amount: string, id: string | null = null): void {
    if (id === null || id === undefined) {
        Athena.player.currency.set(player, CurrencyTypes.CASH, parseInt(amount));
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, 'Cannot Find Player');
        return;
    }

    Athena.player.currency.set(target, CurrencyTypes.BANK, parseInt(amount));
}

export function handleAddCash(player: alt.Player, amount: string, id: string | null = null): void {
    if (id === null || id === undefined) {
        Athena.player.currency.set(player, CurrencyTypes.CASH, parseInt(amount));
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, 'Cannot Find Player');
        return;
    }

    Athena.player.currency.add(target, CurrencyTypes.CASH, parseInt(amount));
}

export function handleAddBank(player: alt.Player, amount: string, id: string | null = null): void {
    if (id === null || id === undefined) {
        Athena.player.currency.set(player, CurrencyTypes.CASH, parseInt(amount));
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, 'Cannot Find Player');
        return;
    }

    Athena.player.currency.add(target, CurrencyTypes.BANK, parseInt(amount));
}
