import * as alt from 'alt-client';
import * as native from 'natives';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

const NextUpdate = {
    freeze: Date.now() + 200,
};

class InternalFunctions {
    static init() {
        alt.onServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.start);
    }

    static start() {
        alt.setInterval(InternalFunctions.tick, 0);
    }

    static tick() {
        InternalFunctions.handleFreeze(200);
    }

    static handleFreeze(timeBetweenChecks: number) {
        if (NextUpdate.freeze && Date.now() < NextUpdate.freeze) {
            return;
        }

        NextUpdate.freeze = Date.now() + timeBetweenChecks;

        if (!alt.Player.local.hasSyncedMeta(PLAYER_SYNCED_META.IS_FROZEN)) {
            return;
        }

        let isFrozen = alt.Player.local.getSyncedMeta<boolean>(PLAYER_SYNCED_META.IS_FROZEN);
        if (isFrozen === undefined) {
            isFrozen = false;
        }

        native.freezeEntityPosition(alt.Player.local.scriptID, isFrozen);
    }
}

InternalFunctions.init();
