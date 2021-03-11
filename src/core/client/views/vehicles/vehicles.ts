import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Vehicle } from '../../../shared/interfaces/Vehicle';
import { View } from '../../extensions/view';
import { isAnyMenuOpen } from '../../utility/menus';
import { ChatController } from '../hud/controllers/chatController';

// const url = `http://127.0.0.1:5500/src/core/client/views/vehicles/html/index.html`;
const url = `http://resource/client/views/vehicles/html/index.html`;
let vehicles: Array<Vehicle>;
let view: View;
let isOpen = false;

export class VehiclesController {
    static async handleView() {
        if (isAnyMenuOpen()) {
            return;
        }

        if (alt.Player.local.isPhoneOpen) {
            return;
        }

        vehicles = alt.Player.local.meta.vehicles ? alt.Player.local.meta.vehicles : [];
        view = await View.getInstance(url, true, false, true);
        view.on('vehicles:Spawn', VehiclesController.spawn);
        view.on('vehicles:Exit', VehiclesController.exit);
        view.on('vehicles:Locate', VehiclesController.locate);
        view.on('vehicles:Despawn', VehiclesController.despawn);
        view.on('ready', VehiclesController.ready);
        alt.toggleGameControls(false);
        isOpen = true;
    }

    static spawn(index: number) {
        if (!vehicles[index]) {
            return;
        }

        alt.emitServer(SYSTEM_EVENTS.VEHICLES_VIEW_SPAWN, index);
    }

    static locate(index: number) {
        VehiclesController.exit();

        if (!vehicles[index]) {
            return;
        }

        native.clearGpsPlayerWaypoint();
        native.deleteWaypoint();

        const pos = vehicles[index].position;
        const blip = new alt.PointBlip(pos.x, pos.y, pos.z);
        blip.sprite = 270;
        blip.color = 15;
        blip.name = 'Vehicle Locator';
        blip['routeColor'] = new alt.RGBA(255, 0, 0, 255);
        blip.route = true;

        // const blip = native.addBlipForCoord(pos.x, pos.y, pos.z);
        // native.setBlipSprite(blip, 270);
        // native.setBlipColour(blip, 15);
        // native.setBlipNameToPlayerName(blip, 'Vehicle Locator' as any);
        // native.setBlipRouteColour(blip, 15);
        // native.setBlipRoute(blip, true);

        ChatController.appendMessage(`Vehicle Located. Blip will be active for {00FFFF}30s`);

        alt.setTimeout(() => {
            blip.destroy();
        }, 30000);
    }

    static despawn() {
        alt.emitServer(SYSTEM_EVENTS.VEHICLES_VIEW_DESPAWN);
    }

    static exit() {
        isOpen = false;
        alt.toggleGameControls(true);

        if (!view) {
            return;
        }

        view.close();
    }

    static ready() {
        if (!view) {
            return;
        }

        view.emit('vehicles:Data', vehicles);
    }
}
