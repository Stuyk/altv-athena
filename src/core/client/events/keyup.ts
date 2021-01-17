import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { InteractionController } from '../systems/interaction';
import { VehicleController } from '../systems/vehicle';
import { ChatController } from '../views/hud/controllers/chatController';
import { HelpController } from '../views/hud/controllers/helpController';
import { LeaderboardController } from '../views/hud/controllers/leaderBoardController';
import { InventoryController } from '../views/inventory/inventory';

export const KEY_BINDS = {
    DEBUG_KEY: 112, // F1
    LEADERBOARD: 113, // F12
    CHAT: 84, // T
    INVENTORY: 73, // I
    VEHICLE_FUNCS: 70, // F
    VEHICLE_LOCK: 88, // X
    INTERACT: 69, // E
    INTERACTION_MODE: 18 // Left Alt
};

const DELAY_BETWEEN_LONG_PRESSES = 800;
const DELAY_BETWEEN_PRESSES = 500;
const KEY_UP_BINDS = {
    [KEY_BINDS.DEBUG_KEY]: {
        singlePress: handleDebugMessages
    },
    [KEY_BINDS.LEADERBOARD]: {
        singlePress: LeaderboardController.focusLeaderBoard
    },
    [KEY_BINDS.INVENTORY]: {
        singlePress: () => InventoryController.handleView()
    },
    [KEY_BINDS.VEHICLE_LOCK]: {
        singlePress: () => VehicleController.triggerVehicleFunction('pressedLockKey')
    },
    [KEY_BINDS.VEHICLE_FUNCS]: {
        singlePress: () => VehicleController.triggerVehicleFunction('pressedVehicleFunction'),
        longPress: () => VehicleController.triggerVehicleFunction('pressedVehicleFunctionAlt')
    },
    [KEY_BINDS.CHAT]: {
        singlePress: ChatController.focusChat
    },
    [KEY_BINDS.INTERACT]: {
        singlePress: InteractionController.triggerInteraction
    },
    [KEY_BINDS.INTERACTION_MODE]: {
        singlePress: InteractionController.toggleInteractionMode
    }
};

let keyPressTimes = {};
let nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

alt.onServer(SYSTEM_EVENTS.TICKS_START, startKeyListeners);

function startKeyListeners() {
    alt.on('keyup', handleKeyUp);
    alt.on('keydown', handleKeyDown);
}

function handleKeyDown(key: number) {
    if (alt.Player.local.isMenuOpen) {
        return;
    }

    keyPressTimes[key] = Date.now();

    if (!KEY_UP_BINDS[key]) {
        return;
    }

    if (!KEY_UP_BINDS[key].longPress) {
        return;
    }

    HelpController.setHelpState(true);
    alt.setTimeout(() => {
        if (!keyPressTimes[key]) {
            return;
        }

        HelpController.setHelpState(false);
        keyPressTimes[key] = null;
        KEY_UP_BINDS[key].longPress();
    }, DELAY_BETWEEN_LONG_PRESSES);
}

function handleKeyUp(key: number) {
    if (!KEY_UP_BINDS[key]) {
        return;
    }

    HelpController.setHelpState(false);

    if (alt.Player.local.isMenuOpen) {
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
    if (
        keyPressTimes[key] &&
        keyPressTimes[key] + DELAY_BETWEEN_LONG_PRESSES < Date.now() &&
        KEY_UP_BINDS[key].longPress
    ) {
        keyPressTimes[key] = null;
        KEY_UP_BINDS[key].longPress();
        return;
    }

    keyPressTimes[key] = null;
    // Single Press
    KEY_UP_BINDS[key].singlePress();
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
