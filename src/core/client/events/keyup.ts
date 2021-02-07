import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { InteractionController } from '../systems/interaction';
import { ToolbarController } from '../systems/toolbar';
import { VehicleController } from '../systems/vehicle';
import { ChatController } from '../views/hud/controllers/chatController';
import { HelpController } from '../views/hud/controllers/helpController';
import { LeaderboardController } from '../views/hud/controllers/leaderBoardController';
import { InventoryController } from '../views/inventory/inventory';

export const KEY_BINDS = {
    // Left Alt
    INTERACTION_MODE: 18,
    // 1 - 4
    TOOLBAR_ONE: 49,
    TOOLBAR_TWO: 50,
    TOOLBAR_THREE: 51,
    TOOLBAR_FOUR: 52,
    // E
    INTERACT: 69,
    // F
    VEHICLE_FUNCS: 70,
    // I
    INVENTORY: 73,
    // T
    CHAT: 84,
    // X
    VEHICLE_LOCK: 88,
    // F1
    DEBUG_KEY: 112,
    // F2
    LEADERBOARD: 113
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
        singlePress: (...args: any[]) => InventoryController.handleView()
    },
    [KEY_BINDS.VEHICLE_LOCK]: {
        singlePress: (...args: any[]) => VehicleController.triggerVehicleFunction('pressedLockKey')
    },
    [KEY_BINDS.VEHICLE_FUNCS]: {
        singlePress: (...args: any[]) => VehicleController.triggerVehicleFunction('pressedVehicleFunction'),
        longPress: (...args: any[]) => VehicleController.triggerVehicleFunction('pressedVehicleFunctionAlt')
    },
    [KEY_BINDS.CHAT]: {
        singlePress: ChatController.focusChat
    },
    [KEY_BINDS.INTERACT]: {
        singlePress: InteractionController.triggerInteraction
    },
    [KEY_BINDS.INTERACTION_MODE]: {
        singlePress: InteractionController.toggleInteractionMode
    },
    [KEY_BINDS.TOOLBAR_ONE]: {
        singlePress: ToolbarController.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_TWO]: {
        singlePress: ToolbarController.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_THREE]: {
        singlePress: ToolbarController.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_FOUR]: {
        singlePress: ToolbarController.handleToolbarSwitch
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
        KEY_UP_BINDS[key].longPress(key);
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

    keyPressTimes[key] = null;

    // Long Press
    const isLongPressReady = keyPressTimes[key] + DELAY_BETWEEN_LONG_PRESSES < Date.now();
    if (keyPressTimes[key] && isLongPressReady && KEY_UP_BINDS[key].longPress) {
        KEY_UP_BINDS[key].longPress(key);
    }

    // Single Press
    if (KEY_UP_BINDS[key] && KEY_UP_BINDS[key].singlePress) {
        KEY_UP_BINDS[key].singlePress(key);
    }
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

    if (alt.Player.local.isAiming) {
        alt.log(`AIM POSITION:`);
        const aimPos = alt.Player.local.aimPos;
        alt.log(JSON.stringify(aimPos));
    }

    alt.emit('debug:Time');
}
