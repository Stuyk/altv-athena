import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

export class ToolbarController {
    static handleToolbarSwitch(key: number) {
        const slot: number = parseInt(String.fromCharCode(key)) - 1;
        const item = alt.Player.local.meta.toolbar.find((item) => item.slot === slot);

        if (!item) {
            alt.log(`No item in slot`);
            return;
        }

        alt.emitServer(SYSTEM_EVENTS.PLAYER_TOOLBAR_SET, slot);
    }
}
