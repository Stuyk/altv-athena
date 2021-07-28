import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

class ArrestSystem {
    /**
     * The cuffer is in charge of the cuffed.
     * The cuffed will be required to always be in front of the cuffer.
     * @static
     * @param {alt.Player} cuffer
     * @param {alt.Player} cuffed
     * @memberof ArrestSystem
     */
    static cuff(cuffer: alt.Player, cuffed: alt.Player) {
        alt.emitClient(cuffed, SYSTEM_EVENTS.PLAYER_CUFF, cuffer);
    }

    static uncuff(player: alt.Player, target: alt.Player) {
        target.resetNetOwner(false);

        //alt.emitClient(player, SYSTEM_EVENTS.PLAYER_UNCUFF, target);
    }
}

alt.onClient(SYSTEM_EVENTS.PLAYER_UNCUFF, ArrestSystem.uncuff);
alt.onClient(SYSTEM_EVENTS.PLAYER_CUFF, ArrestSystem.cuff);
