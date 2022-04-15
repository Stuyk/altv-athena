import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../../client/extensions/view2';
import ViewModel from '../../../../client/models/viewModel';
import { CinematicCam } from '../../../../client/utility/cinematic';
import { isAnyMenuOpen } from '../../../../client/utility/menus';
import { loadModel } from '../../../../client/utility/model';
import { VehicleInfo } from '../../../../shared/interfaces/vehicleInfo';
import { DEALERSHIP_EVENTS, DEALERSHIP_WEBVIEW_EVENTS } from '../../shared/events';
import { IDealership } from '../../shared/interfaces';

let vehicles: Array<VehicleInfo>;
let dealership: IDealership;
let vehicleIdentifier: number;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static init() {
        alt.onServer(DEALERSHIP_EVENTS.LOAD, InternalFunctions.show);
    }

    static async show(_dealership: IDealership): Promise<void> {
        vehicles = _dealership.vehicles;
        dealership = _dealership;

        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(DEALERSHIP_WEBVIEW_EVENTS.READY, InternalFunctions.ready);
        view.on(DEALERSHIP_WEBVIEW_EVENTS.EXIT, InternalFunctions.exit);
        view.on(DEALERSHIP_WEBVIEW_EVENTS.PURCHASE, InternalFunctions.purchase);
        view.on(DEALERSHIP_WEBVIEW_EVENTS.PREVIEW, InternalFunctions.preview);
        WebViewController.openPages([DEALERSHIP_WEBVIEW_EVENTS.PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;

        // Generate and show the first vehicle
        InternalFunctions.preview(vehicles[0]);

        CinematicCam.addNode({
            pos: dealership.cam,
            fov: 90,
            easeTime: 250,
            positionToTrack: dealership.vehiclePosition,
        });

        CinematicCam.next(false);
    }

    static async exit() {
        alt.emitServer(DEALERSHIP_EVENTS.EXIT);
        alt.toggleGameControls(true);

        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(DEALERSHIP_WEBVIEW_EVENTS.READY, InternalFunctions.ready);
        view.off(DEALERSHIP_WEBVIEW_EVENTS.EXIT, InternalFunctions.exit);
        view.off(DEALERSHIP_WEBVIEW_EVENTS.PURCHASE, InternalFunctions.purchase);

        WebViewController.closePages([DEALERSHIP_WEBVIEW_EVENTS.PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        InternalFunctions.destroyVehicle();
        CinematicCam.destroy();
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(DEALERSHIP_WEBVIEW_EVENTS.SET_VEHICLES, vehicles);
    }

    static purchase(vehicle: VehicleInfo) {
        alt.emitServer(DEALERSHIP_EVENTS.PURCHASE, vehicle);
    }

    static destroyVehicle() {
        if (vehicleIdentifier !== undefined && vehicleIdentifier !== null) {
            native.deleteEntity(vehicleIdentifier);
            vehicleIdentifier = null;
        }
    }

    static async preview(vehicle: VehicleInfo) {
        const model = alt.hash(vehicle.name);

        await loadModel(model);

        InternalFunctions.destroyVehicle();

        // Create Vehicle
        vehicleIdentifier = native.createVehicle(
            model,
            dealership.vehiclePosition.x,
            dealership.vehiclePosition.y,
            dealership.vehiclePosition.z,
            0,
            false,
            false,
            false,
        );

        native.setEntityInvincible(vehicleIdentifier, true);
        native.setEntityCoordsNoOffset(
            vehicleIdentifier,
            dealership.vehiclePosition.x,
            dealership.vehiclePosition.y,
            dealership.vehiclePosition.z + 0.2,
            false,
            false,
            false,
        );
    }
}

export class DealershipClientView {
    static init() {
        InternalFunctions.init();
    }
}
