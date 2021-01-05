import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';
import { focusChat, focusLeaderBoard } from '../views/hud/hud';

const keyupBinds = {
    112: handleDebugMessages, // F1
    113: focusLeaderBoard, // F2
    84: focusChat // T
};

alt.onServer(Events_Misc.StartTicks, handleStart);

function handleStart() {
    alt.on('keyup', handleKeyUp);
}

function handleKeyUp(key: number) {
    if (!keyupBinds[key]) {
        return;
    }

    keyupBinds[key]();
}

function handleDebugMessages() {
    alt.log(`POSITION:`);
    const pos = { ...alt.Player.local.pos };
    alt.log(JSON.stringify(pos));

    alt.log(`ROTATION:`);
    const rot = { ...alt.Player.local.rot };
    alt.log(JSON.stringify(rot));

    alt.log(`HEADING:`);
    const heading = native.getEntityHeading(alt.Player.local.scriptID);
    alt.log(heading);

    alt.emit('debug:Time');
}
