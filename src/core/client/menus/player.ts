import * as alt from 'alt-client';
import * as native from 'natives';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance } from '../../shared/utility/vector';
import { isAnyMenuOpen } from '../utility/menus';
import { WheelMenu } from '../views/wheelMenu';

let interval: number;

function handleMenu() {
    if (alt.Player.local.vehicle) {
        return;
    }

    if (isAnyMenuOpen()) {
        return;
    }

    const fwd = native.getEntityForwardVector(alt.Player.local.scriptID);
    const pos = {
        x: alt.Player.local.pos.x + fwd.x * 1,
        y: alt.Player.local.pos.y + fwd.y * 1,
        z: alt.Player.local.pos.z,
    };

    const target = alt.Player.all.find((x) => {
        if (x.scriptID === alt.Player.local.scriptID) {
            return false;
        }

        const dist = distance(pos, x.pos);
        if (dist <= 2) {
            return true;
        }

        return false;
    });

    if (!target) {
        return;
    }

    const targetName = target.getSyncedMeta(PLAYER_SYNCED_META.NAME) as string;
    WheelMenu.open(
        targetName,
        [
            {
                name: 'Cuff & Drag',
                callback: () => {
                    alt.emitServer(SYSTEM_EVENTS.PLAYER_CUFF, target);
                },
            },
        ],
        true,
    );
}

function init() {
    // Removed for 2.0.2 Merge
    // KeybindController.registerKeybind({ key: KEY_BINDS.PLAYER_INTERACT, singlePress: handleMenu });
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, init);
