import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';
import { toggleInteractionMode, triggerInteraction } from '../systems/interaction';
import { focusChat, focusLeaderBoard } from '../views/hud/hud';
import { triggerVehicleFunction, triggerVehicleFunctionAlt, triggerVehicleLock } from '../systems/vehicle';

const DELAY_BETWEEN_PRESSES = 500;
const keyupBinds = {
    112: { singlePress: handleDebugMessages }, // F1
    113: { singlePress: focusLeaderBoard }, // F2
    88: { singlePress: triggerVehicleLock }, // X
    70: { singlePress: triggerVehicleFunction, longPress: triggerVehicleFunctionAlt }, // F
    84: { singlePress: focusChat }, // T
    69: { singlePress: triggerInteraction }, // E
    18: { singlePress: toggleInteractionMode } // alt
};

let keyPressTimes = {};
let nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

alt.onServer(Events_Misc.StartTicks, handleStart);

function handleStart() {
    alt.on('keyup', handleKeyUp);
    alt.on('keydown', handleKeyDown);
}

function handleKeyDown(key: number) {
    keyPressTimes[key] = Date.now();

    if (!keyupBinds[key]) {
        return;
    }

    if (!keyupBinds[key].longPress) {
        return;
    }

    alt.setTimeout(() => {
        if (!keyPressTimes[key]) {
            return;
        }

        keyPressTimes[key] = null;
        keyupBinds[key].longPress();
    }, 1000);
}

function handleKeyUp(key: number) {
    if (!keyupBinds[key]) {
        return;
    }

    if (Date.now() < nextKeyPress) {
        return;
    }

    nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

    if (keyPressTimes[key] === null) {
        return;
    }

    // Long Press
    if (keyPressTimes[key] && keyPressTimes[key] + 1000 < Date.now() && keyupBinds[key].longPress) {
        keyPressTimes[key] = null;
        keyupBinds[key].longPress();
        return;
    }

    keyPressTimes[key] = null;
    // Single Press
    keyupBinds[key].singlePress();
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
