import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function handleInteriorCmd(player: alt.Player, id: number, interior: string) {
    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid || !id) {
        return;
    }

    target.data.interior = interior;
    Athena.player.save.field(target, 'interior', target.data.interior);
    Athena.player.emit.notification(player, `New Interior of ${target.data.name} is: ${interior}!`);
}
