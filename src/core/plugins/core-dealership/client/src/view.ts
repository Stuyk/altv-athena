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

let isUpdating = false;
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
        view.on(DEALERSHIP_WEBVIEW_EVENTS.CAMERA, InternalFunctions.camera);

        WebViewController.openPages([DEALERSHIP_WEBVIEW_EVENTS.PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;

        // Generate and show the first vehicle
        await InternalFunctions.preview(vehicles[0], 5);

        // Clear Cinematic Camera
        CinematicCam.destroy();

        const points = InternalFunctions.generateCameraPoints(vehicleIdentifier);

        // Add Camera Ponts to Cinematic Cam List
        for (let i = 0; i < points.length; i++) {
            CinematicCam.addNode({
                pos: points[i],
                fov: 80,
                easeTime: 250,
                positionToTrack: dealership.vehiclePosition,
            });
        }

        CinematicCam.next(false);
    }

    static async updatePoints() {
        const points = InternalFunctions.generateCameraPoints(vehicleIdentifier);

        const cameraNodes = points.map((point) => {
            return {
                pos: point,
                fov: 90,
                easeTime: 100,
                positionToTrack: dealership.vehiclePosition,
            };
        });

        CinematicCam.overrideNodes(cameraNodes);
    }

    static async camera() {
        await InternalFunctions.updatePoints();
        CinematicCam.next(false);
    }

    private static async isUpdating(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (isUpdating) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 200);
        });
    }

    static async exit() {
        alt.emitServer(DEALERSHIP_EVENTS.EXIT);
        alt.toggleGameControls(true);

        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(DEALERSHIP_WEBVIEW_EVENTS.READY, InternalFunctions.ready);
        view.off(DEALERSHIP_WEBVIEW_EVENTS.EXIT, InternalFunctions.exit);
        view.off(DEALERSHIP_WEBVIEW_EVENTS.PURCHASE, InternalFunctions.purchase);
        view.off(DEALERSHIP_WEBVIEW_EVENTS.PREVIEW, InternalFunctions.preview);
        view.off(DEALERSHIP_WEBVIEW_EVENTS.CAMERA, InternalFunctions.camera);

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
        view.emit(DEALERSHIP_WEBVIEW_EVENTS.SET_BANK, alt.Player.local.meta.cash + alt.Player.local.meta.bank);
    }

    static purchase(vehicle: VehicleInfo, color: number) {
        alt.emitServer(DEALERSHIP_EVENTS.PURCHASE, vehicle, color);
        InternalFunctions.exit();
    }

    static destroyVehicle() {
        if (vehicleIdentifier !== undefined && vehicleIdentifier !== null) {
            while (native.doesEntityExist(vehicleIdentifier)) {
                native.deleteEntity(vehicleIdentifier);
            }

            vehicleIdentifier = null;
        }
    }

    static async preview(vehicle: VehicleInfo, color: number) {
        await InternalFunctions.isUpdating();

        isUpdating = true;

        await InternalFunctions.destroyVehicle();

        const model = alt.hash(vehicle.name);

        await loadModel(model);

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
        native.setVehicleColours(vehicleIdentifier, color, color);

        alt.setTimeout(() => {
            if (!native.doesEntityExist(vehicleIdentifier)) {
                return;
            }

            native.setVehicleEngineOn(vehicleIdentifier, true, false, false);
            native.setVehicleLights(vehicleIdentifier, 3);
        }, 200);

        await InternalFunctions.updatePoints();

        isUpdating = false;
    }

    static generateCameraPoints(vehicle: number): Array<alt.Vector3> {
        const cameraPoints = [];
        const zPos = alt.Player.local.pos.z + 1;

        const [_, min, max] = native.getModelDimensions(native.getEntityModel(vehicle));
        const offsetCalculations = [];
        const additional = 1.5;

        // Top Left
        offsetCalculations.push({
            x: min.x - additional,
            y: max.y + additional,
            z: zPos,
        });

        // Top Middle
        offsetCalculations.push({
            x: 0,
            y: max.y + additional,
            z: zPos,
        });

        // Top Right
        offsetCalculations.push({
            x: max.x + additional,
            y: max.y + additional,
            z: zPos,
        });

        // Middle Right
        offsetCalculations.push({
            x: max.x + additional * 2,
            y: 0,
            z: zPos,
        });

        // Back Right
        offsetCalculations.push({
            x: max.x + additional,
            y: min.y - additional,
            z: zPos,
        });

        // Middle Center
        offsetCalculations.push({
            x: 0,
            y: min.y - additional,
            z: zPos,
        });

        // Bottom Left
        offsetCalculations.push({
            x: min.x - additional,
            y: min.y - additional,
            z: zPos,
        });

        // Middle Left
        offsetCalculations.push({
            x: min.x - additional * 2,
            y: 0,
            z: zPos,
        });

        for (let i = 0; i < offsetCalculations.length; i++) {
            const calc = native.getOffsetFromEntityInWorldCoords(
                vehicle,
                offsetCalculations[i].x,
                offsetCalculations[i].y,
                1,
            );

            cameraPoints.push(calc);
        }

        return cameraPoints;
    }
}

export class DealershipClientView {
    static init() {
        InternalFunctions.init();
    }
}
