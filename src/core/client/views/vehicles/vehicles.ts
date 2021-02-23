import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Vehicle } from '../../../shared/interfaces/Vehicle';
import { View } from '../../extensions/view';

// const url = `http://127.0.0.1:5500/src/core/client/views/vehicles/html/index.html`;
const url = `http://resource/client/views/vehicles/html/index.html`;
let vehicles: Array<Vehicle>;
let view: View;
let isOpen = false;

export class VehiclesController {
    static async handleView() {
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

        // Location Code Goes Brr
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
