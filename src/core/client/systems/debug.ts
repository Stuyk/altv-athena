import * as alt from 'alt-client';
import * as native from 'natives';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { KeybindController } from '../events/keyup';

export class DebugController {
    static registerKeybinds() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.DEBUG_KEY,
            singlePress: DebugController.handleDebugMessages,
        });
    }

    static handleDebugMessages() {
        alt.log(`POSITION:`);
        const pos = { ...alt.Player.local.pos };
        alt.log(JSON.stringify(pos));

        alt.log(`ROTATION:`);
        const rot = { ...alt.Player.local.rot };
        alt.log(JSON.stringify(rot));

        alt.log(`HEADING:`);
        const heading = native.getEntityHeading(alt.Player.local.scriptID);
        alt.log(heading);

        const nativeRotation = native.getEntityRotation(alt.Player.local.scriptID, 1);
        alt.log(`NATIVE ROTATION: ${nativeRotation}`);

        if (alt.Player.local.isAiming) {
            alt.log(`AIM POSITION:`);
            const aimPos = alt.Player.local.aimPos;
            alt.log(JSON.stringify(aimPos));
        }

        alt.emit('debug:Time');
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, DebugController.registerKeybinds);
