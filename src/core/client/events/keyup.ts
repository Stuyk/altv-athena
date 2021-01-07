import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';
import { toggleInteractionMode } from '../systems/interaction';
import { focusChat, focusLeaderBoard } from '../views/hud/hud';

const DELAY_BETWEEN_PRESSES = 500;
const keyupBinds = {
    112: handleDebugMessages, // F1
    113: focusLeaderBoard, // F2
    84: focusChat, // T
    18: toggleInteractionMode // alt
};

let nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

alt.onServer(Events_Misc.StartTicks, handleStart);

function handleStart() {
    alt.on('keyup', handleKeyUp);
}

function handleKeyUp(key: number) {
    if (!keyupBinds[key]) {
        return;
    }

    if (Date.now() < nextKeyPress) {
        return;
    }

    nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

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
