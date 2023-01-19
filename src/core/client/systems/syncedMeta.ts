import * as alt from 'alt-client';
import * as native from 'natives';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';

const NextUpdate = {
    freeze: Date.now() + 200,
};

const InternalFunctions = {
    start() {
        alt.setInterval(InternalFunctions.tick, 0);
    },

    tick() {
        InternalFunctions.handleFreeze(200);
    },

    handleFreeze(timeBetweenChecks: number) {
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
    },
};

onTicksStart.add(InternalFunctions.start);
