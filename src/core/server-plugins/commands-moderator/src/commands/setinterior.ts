import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
export function handleInteriorCmd(player: alt.Player, id: number, interior: string) {
    const target = playerFuncs.get.findByUid(id);
    if (!target || !target.valid || !id) {
        return;
    }

    target.data.interior = interior;
    playerFuncs.save.field(target, 'interior', target.data.interior);
    playerFuncs.emit.notification(player, `New Interior of ${target.data.name} is: ${interior}!`);
}
