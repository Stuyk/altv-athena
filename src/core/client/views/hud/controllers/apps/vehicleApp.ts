import * as alt from 'alt-client';
import * as native from 'natives';
import { BaseHUD } from '../../hud';
import { SYSTEM_EVENTS } from '../../../../../shared/enums/system';
import { ChatController } from '../chatController';

let vehicles = [];

export class VehicleAppController {
    static init() {
        BaseHUD.view.on('phone:Vehicles:Populate', VehicleAppController.populate);
        BaseHUD.view.on('phone:Vehicles:Locate', VehicleAppController.locate);
        BaseHUD.view.on('phone:Vehicles:Spawn', VehicleAppController.spawn);
        BaseHUD.view.on('phone:Vehicles:Despawn', VehicleAppController.despawn);
    }

    static spawn(index: number) {
        if (!vehicles[index]) {
            return;
        }

        alt.emitServer(SYSTEM_EVENTS.VEHICLES_VIEW_SPAWN, index);
    }

    static populate() {
        vehicles = alt.Player.local.meta.vehicles ? alt.Player.local.meta.vehicles : [];
        BaseHUD.view.emit('phone:SetData', 'vehicles', vehicles);
    }

    static locate(index: number) {
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

        ChatController.appendMessage(`Vehicle Located. Blip will be active for {00FFFF}30s`);

        alt.setTimeout(() => {
            blip.destroy();
        }, 30000);
    }

    static despawn() {
        alt.emitServer(SYSTEM_EVENTS.VEHICLES_VIEW_DESPAWN);
    }
}
