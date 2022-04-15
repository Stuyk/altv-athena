import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function cmdSetHealth(player: alt.Player, value: number = 100, id: string | null = null): void {
    if (isNaN(value)) {
        Athena.player.emit.message(player, Athena.controllers.chat.getDescription('sethealth'));
        return;
    }

    if (value < 99) {
        value = 99;
    }

    if (value > 199) {
        value = 199;
    }

    if (id === null || id === undefined) {
        finishSetHealth(player, value);
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, 'Cannot find player with that ID.');
        return;
    }

    finishSetHealth(target, value);
}

function finishSetHealth(target: alt.Player, value: number) {
    Athena.player.safe.addHealth(target, value, true);
    Athena.player.emit.message(target, `Player health was set to ${value}`);
}
