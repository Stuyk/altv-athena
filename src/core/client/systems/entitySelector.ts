import * as alt from 'alt-client';
import * as native from 'natives';

import { AthenaClient } from '@AthenaClient/api/athena';
import { drawMarkerSimple } from '@AthenaClient/utility/marker';
import { MARKER_TYPE } from '@AthenaShared/enums/markerTypes';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { handleFrontendSound } from './sound';
import { NpcWheelMenu } from '@AthenaClient/menus/npc';
import { PlayerWheelMenu } from '@AthenaClient/menus/player';
import { VehicleWheelMenu } from '@AthenaClient/menus/vehicle';
import { ClientItemDrops } from '@AthenaClient/streamers/item';

type ValidEntityTypes = 'object' | 'pos' | 'npc' | 'player' | 'vehicle';
type TargetInfo = { id: number; pos: alt.IVector3; type: ValidEntityTypes; dist: number; height: number };

const TIME_TO_TOGGLE_TAB = 250;

const TAB_KEY_GAME_CONTROL = 37;
const ENTER_KEY_GAME_CONTROL = 18;
const E_KEY = 69;

let MAX_TARGETS = 10;
let MAX_DISTANCE = 10;
let everyTick: number;
let isSelecting = false;
let selections: Array<TargetInfo> = [];
let selectionIndex = 0;
let tabStartTime = 0;
let startPosition;
let isReleased = true;
let isAlwaysOn = false;
let nextUpdate = Date.now();
let showMarker = true;
let color: alt.RGBA = new alt.RGBA(255, 255, 255, 100);
let size = new alt.Vector3(0.1, 0.05, 0.1);

const Internal = {
    init() {
        everyTick = alt.everyTick(Internal.tick);
        AthenaClient.events.keyBinds.registerKeybind({
            key: E_KEY,
            singlePress: Internal.invokeSelection,
        });
    },
    toggle() {
        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        if (isSelecting) {
            isSelecting = false;
            startPosition = undefined;
            selections = [];
            handleFrontendSound('BACK', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            return;
        }

        startPosition = alt.Player.local.pos;
        selectionIndex = 0;
        isSelecting = true;
        Internal.updateSelectionList();
        handleFrontendSound('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    },
    convert(dataSet: Array<alt.Entity>, type: ValidEntityTypes): Array<TargetInfo> {
        let entityInfo: Array<TargetInfo> = [];

        for (let i = 0; i < dataSet.length; i++) {
            if (type === 'player' && dataSet[i].id === alt.Player.local.scriptID) {
                continue;
            }

            const [_, min, max] = native.getModelDimensions(dataSet[i].model);
            const height = Math.abs(min.z) + Math.abs(max.z);
            const dist = AthenaClient.utility.distance2D(alt.Player.local.pos, dataSet[i].pos);
            entityInfo.push({ id: dataSet[i].scriptID, dist, type, pos: dataSet[i].pos, height });
        }

        return entityInfo;
    },
    updateSelectionList() {
        if (!isSelecting) {
            return;
        }

        const players = [...alt.Player.streamedIn];
        const vehicles = [...alt.Vehicle.streamedIn];
        const objects = [...alt.Object.all];

        let entityInfo: Array<TargetInfo> = Internal.convert(players, 'player');
        entityInfo = entityInfo.concat(Internal.convert(vehicles, 'vehicle'));
        entityInfo = entityInfo.concat(Internal.convert(objects, 'object'));

        entityInfo.sort((a, b) => {
            return a.dist - b.dist;
        });

        selections = entityInfo.slice(0, entityInfo.length < 5 ? entityInfo.length : MAX_TARGETS);
    },
    selectClosestEntity() {
        if (!isSelecting) {
            return;
        }

        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        if (typeof everyTick !== 'number') {
            return;
        }

        selectionIndex += 1;
        if (selectionIndex >= selections.length) {
            selectionIndex = 0;
        }

        handleFrontendSound('SKIP', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    },
    handleControlToggling() {
        const isShortPress = Date.now() - tabStartTime < TIME_TO_TOGGLE_TAB;
        if (native.isDisabledControlJustPressed(0, TAB_KEY_GAME_CONTROL) && isReleased) {
            isReleased = false;
            tabStartTime = Date.now();
            return;
        }

        if (native.isDisabledControlJustReleased(0, TAB_KEY_GAME_CONTROL)) {
            isReleased = true;
            if (!isShortPress) {
                return;
            }

            Internal.selectClosestEntity();
            return;
        }

        if (!isShortPress && !isReleased) {
            isReleased = true;
            Internal.toggle();
        }
    },
    invokeSelection() {
        const selection = selections[selectionIndex];

        switch (selection.type) {
            case 'npc':
                Internal.toggle();
                NpcWheelMenu.openMenu(selection.id);
                break;
            case 'player':
                const targetPlayer = alt.Player.all.find((x) => x.scriptID === selection.id);
                if (!targetPlayer || !targetPlayer.valid) {
                    break;
                }

                Internal.toggle();
                PlayerWheelMenu.openMenu(targetPlayer);
                break;
            case 'vehicle':
                const targetVehicle = alt.Vehicle.all.find((x) => x.scriptID === selection.id);
                if (!targetVehicle || !targetVehicle.valid) {
                    break;
                }

                Internal.toggle();
                VehicleWheelMenu.openMenu(targetVehicle);
                break;
            case 'object':
                const object = alt.Object.all.find((x) => x.scriptID === selection.id);
                if (typeof object === 'undefined') {
                    // wheel menu;
                    break;
                }

                const droppedItem = ClientItemDrops.getDroppedItem(object.scriptID);
                if (typeof droppedItem === 'undefined') {
                    break;
                }

                if (alt.Player.local.vehicle) {
                    return;
                }

                native.taskGoToCoordAnyMeans(
                    alt.Player.local.scriptID,
                    droppedItem.pos.x,
                    droppedItem.pos.y,
                    droppedItem.pos.z,
                    2,
                    0,
                    false,
                    786603,
                    0,
                );

                Internal.toggle();
                alt.emitServer(SYSTEM_EVENTS.INTERACTION_PICKUP_ITEM, droppedItem._id);
                break;
            case 'pos':
                console.log('lol position');
                break;
        }
    },
    tick() {
        if (!isAlwaysOn) {
            Internal.handleControlToggling();
        }

        if (!isSelecting) {
            return;
        }

        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        if (isAlwaysOn && Date.now() > nextUpdate) {
            nextUpdate = Date.now() + 250;
            selectionIndex = 0;
            Internal.updateSelectionList();
        }

        if (!isAlwaysOn) {
            const dist = AthenaClient.utility.distance2D(alt.Player.local.pos, startPosition);
            if (dist > MAX_DISTANCE && !alt.Player.local.vehicle) {
                Internal.toggle();
                return;
            }
        }

        if (selections.length <= 0) {
            return;
        }

        const pos = new alt.Vector3(selections[selectionIndex].pos).add(
            0,
            0,
            isNaN(selections[selectionIndex].height) ? 1 : selections[selectionIndex].height,
        );

        if (showMarker) {
            drawMarkerSimple(MARKER_TYPE.CHEVRON_UP, pos, new alt.Vector3(0, 180, 0), size, color, true);
        }

        const enterKeyPressed =
            native.isControlJustReleased(0, ENTER_KEY_GAME_CONTROL) ||
            native.isDisabledControlJustReleased(0, ENTER_KEY_GAME_CONTROL);

        if (!enterKeyPressed) {
            return;
        }

        Internal.invokeSelection();
    },
};

export const EntitySelector = {
    /**
     * Is the entity selector currently running?
     *
     * @return {boolean}
     */
    isSelecting(): boolean {
        return isSelecting;
    },
    get: {
        /**
         * Return the currently selected entity.
         *
         * @return {(TargetInfo | undefined)}
         */
        selection(): TargetInfo | undefined {
            if (selections.length <= 0) {
                return undefined;
            }

            return selections[selectionIndex];
        },
        /**
         * Get all of the current entities in the player's radius.
         *
         * @return {Array<TargetInfo>}
         */
        selectables(): Array<TargetInfo> {
            return selections;
        },
    },
    set: {
        /**
         * Never turns off entity selection.
         * Forces the closest object to always be selected.
         * Very performance heavy, and not recommended for most PCs.
         *
         */
        alwaysOn() {
            isAlwaysOn = true;
            if (!isSelecting) {
                Internal.toggle();
            }
        },
        /**
         * Turn the marker off.
         *
         */
        markerOff() {
            showMarker = false;
        },
        /**
         * Change the defualt marker colour.
         *
         * @param {alt.RGBA} customColor
         */
        markerColor(customColor: alt.RGBA) {
            color = customColor;
        },
        /**
         * Change the defualt marker size.
         *
         * @param {alt.Vector3} markerSize
         */
        markerSize(markerSize: alt.Vector3) {
            size = markerSize;
        },
    },
};

alt.onServer(SYSTEM_EVENTS.TICKS_START, Internal.init);
