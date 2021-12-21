import * as alt from 'alt-client';
import * as native from 'natives';
import { View_Events_Dealership } from '../../shared/enums/views';
import { Vector3 } from '../../shared/interfaces/Vector';
import { VehicleInfo } from '../../shared/interfaces/VehicleInfo';
import { isAnyMenuOpen } from '../utility/menus';
import { loadModel } from '../utility/model';
import { HologramSystem } from '../../client/systems/hologram';
import { drawText2D } from '../utility/text';
import { distance2d } from '../../shared/utility/vector';
import { getScaledCursorPosition } from '../utility/mouse';
import { handleFrontendSound } from './sound';
import { Timer } from '../utility/timers';

const HOVER_DISTANCE = 0.05;
const MAX_DISTANCE_BEFORE_EXIT = 5;
const LABEL = { x: 0.5, y: 0.85 };
const PURCHASE = { x: 0.5, y: 0.92 };
const PRICE = { x: 0.5, y: 0.78 };
const LEFT_ARROW = { x: 0.4, y: 0.85 };
const RIGHT_ARROW = { x: 0.6, y: 0.85 };

let interval;
let nextClick = Date.now() + 250;
let updating = false;
let index = -1; // Always start at -1 and increment with next function.
let identifier: string; // Hologram Identifier
let vehicles: Array<VehicleInfo>;
let position: Vector3;
let heading: number;
let oldVehicleRef: number;

class DealershipView {
    static async open(_position: Vector3, _heading: number, _vehicles: Array<VehicleInfo>, _identifier: string) {
        if (isAnyMenuOpen()) {
            return;
        }

        DealershipView.close();

        position = _position;
        heading = _heading;
        vehicles = _vehicles;
        identifier = _identifier;
        index = -1;

        HologramSystem.toggleVisibility(identifier, true);
        DealershipView.next();
        interval = Timer.createInterval(DealershipView.render, 0, 'dealership.ts');
    }

    static async resetVehicleModel() {
        const hash = alt.hash(vehicles[index].name);
        await loadModel(hash);

        if (oldVehicleRef) {
            native.deleteEntity(oldVehicleRef);
        }

        oldVehicleRef = native.createVehicle(hash, position.x, position.y, position.z, heading, false, false, false);

        alt.nextTick(() => {
            native.freezeEntityPosition(oldVehicleRef, true);
        });
    }

    static async next() {
        nextClick = Date.now() + 100;
        updating = true;
        handleFrontendSound('NAV_LEFT_RIGHT', 'HUD_FREEMODE_SOUNDSET');

        if (index + 1 >= vehicles.length) {
            index = 0;
        } else {
            index += 1;
        }

        await DealershipView.resetVehicleModel();
        updating = false;
    }

    static async prev() {
        nextClick = Date.now() + 100;
        updating = true;
        handleFrontendSound('NAV_LEFT_RIGHT', 'HUD_FREEMODE_SOUNDSET');

        if (index - 1 <= -1) {
            index = vehicles.length - 1;
        } else {
            index -= 1;
        }

        await DealershipView.resetVehicleModel();
        updating = false;
    }

    static close() {
        if (interval) {
            Timer.clearInterval(interval);
            interval = null;
        }

        if (oldVehicleRef) {
            native.deleteEntity(oldVehicleRef);
            oldVehicleRef = null;
        }

        if (identifier) {
            HologramSystem.toggleVisibility(identifier, false);
            identifier = null;
        }
    }

    static purchase() {
        alt.emitServer(View_Events_Dealership.Purchase, vehicles[index].name);
        DealershipView.close();
    }

    static render() {
        if (isAnyMenuOpen()) {
            return;
        }

        // Close when they leave the area.
        const dist = distance2d(alt.Player.local.pos, position);
        if (dist >= MAX_DISTANCE_BEFORE_EXIT) {
            DealershipView.close();
            return;
        }

        const cursor = getScaledCursorPosition();
        const leftArrowDist = distance2d(LEFT_ARROW, cursor);
        const rightArrowDist = distance2d(RIGHT_ARROW, cursor);
        const selectDist = distance2d(PURCHASE, cursor);

        // Disable Left-Click While Browsing
        native.disableControlAction(0, 24, true);
        native.setMouseCursorActiveThisFrame();
        native.setMouseCursorSprite(1);

        // Disable Camera Rotation
        if (cursor.y >= 0.6) {
            native.disableControlAction(0, 1, true);
            native.disableControlAction(0, 2, true);
            native.disableControlAction(0, 3, true);
            native.disableControlAction(0, 4, true);
            native.disableControlAction(0, 5, true);
            native.disableControlAction(0, 6, true);
            native.disableControlAction(0, 12, true);
            native.disableControlAction(0, 13, true);
            native.disableControlAction(0, 69, true);
            native.disableControlAction(0, 200, true);
            native.disableControlAction(0, 257, true);
        }

        if (updating) {
            return;
        }

        // Display Name
        drawText2D(`~g~$${vehicles[index].price}`, PRICE, 0.8, new alt.RGBA(255, 255, 255, 255), 0);
        drawText2D(vehicles[index].display, LABEL, 0.8, new alt.RGBA(255, 255, 255, 255), 0);

        // Show Arrow Navigation Elements
        if (leftArrowDist <= HOVER_DISTANCE) {
            native.setMouseCursorSprite(5);
            drawText2D('<', LEFT_ARROW, 1, new alt.RGBA(255, 165, 0, 255), 0);

            if (native.isDisabledControlJustReleased(0, 24) && Date.now() > nextClick) {
                DealershipView.prev();
            }
        } else {
            drawText2D('<', LEFT_ARROW, 1, new alt.RGBA(255, 255, 255, 255), 0);
        }

        if (rightArrowDist <= HOVER_DISTANCE) {
            native.setMouseCursorSprite(5);
            drawText2D('>', RIGHT_ARROW, 1, new alt.RGBA(255, 165, 0, 255), 0);

            if (native.isDisabledControlJustReleased(0, 24) && Date.now() > nextClick) {
                DealershipView.next();
            }
        } else {
            drawText2D('>', RIGHT_ARROW, 1, new alt.RGBA(255, 255, 255, 255), 0);
        }

        if (selectDist <= HOVER_DISTANCE) {
            native.setMouseCursorSprite(5);
            drawText2D('Purchase', PURCHASE, 1, new alt.RGBA(255, 165, 0, 255), 0);

            if (native.isDisabledControlJustReleased(0, 24) && Date.now() > nextClick) {
                DealershipView.purchase();
            }
        } else {
            drawText2D('Purchase', PURCHASE, 1, new alt.RGBA(255, 255, 255, 255), 0);
        }
    }
}

alt.onServer(View_Events_Dealership.Open, DealershipView.open);
