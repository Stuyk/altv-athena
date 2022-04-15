import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function cmdSetArmour(player: alt.Player, value: number = 100, id: string | null = null): void {
    if (isNaN(value)) {
        Athena.player.emit.message(player, Athena.controllers.chat.getDescription('setarmour'));
        return;
    }

    if (value < 0) {
        value = 0;
    }

    if (value > 100) {
        value = 100;
    }

    if (id === null || id === undefined) {
        finishSetArmour(player, value);
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, 'Cannot find player with that ID.');
        return;
    }

    finishSetArmour(target, value);
}

function finishSetArmour(target: alt.Player, value: number) {
    Athena.player.safe.addArmour(target, value, true);
    Athena.player.emit.message(target, `Player armour was set to ${value}`);
}
