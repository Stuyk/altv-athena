import alt from 'alt-server';
import { VehicleEvents } from '../../../server/events/vehicleEvents';
import VehicleFuncs from '../../../server/extensions/vehicleFuncs';
import { ATHENA_EVENTS_VEHICLE } from '../../../shared/enums/athenaEvents';
import { IVehicle } from '../../../shared/interfaces/iVehicle';

export class VehicleHandler {
    public static init(): void {
        VehicleEvents.on(ATHENA_EVENTS_VEHICLE.SPAWNED, this.handleVehicleSpawned);
        VehicleFuncs.addBeforeCreateInjection(VehicleHandler.convertOldVehicleData);
    }

    private static handleVehicleSpawned(vehicle: alt.Vehicle): void {
        if (!vehicle?.data?.tuning) return;

        const data = vehicle.data.tuning;

        if (data.modkit) vehicle.modKit = data.modkit;
        if (data.mods) data.mods.forEach((mod) => vehicle.setMod(mod.id, mod.value));
        if (data.handling) vehicle.setStreamSyncedMeta('handlingData', data.handling);

        if (data.primaryFinish) vehicle.primaryColor = data.primaryFinish;
        if (data.secondaryFinish) vehicle.secondaryColor = data.secondaryFinish;

        if (data.primaryColor) {
            if (typeof data.primaryColor === 'number') vehicle.primaryColor = data.primaryColor;
            else
                vehicle.customPrimaryColor = new alt.RGBA(
                    data.primaryColor.r,
                    data.primaryColor.g,
                    data.primaryColor.b,
                    data.primaryColor.a,
                );
        }

        if (data.secondaryColor) {
            if (typeof data.secondaryColor === 'number') vehicle.secondaryColor = data.secondaryColor;
            else
                vehicle.customSecondaryColor = new alt.RGBA(
                    data.secondaryColor.r,
                    data.secondaryColor.g,
                    data.secondaryColor.b,
                    data.secondaryColor.a,
                );
        }

        if (data.customTires) vehicle.customTires = true;
        if (typeof data.darkness == 'number') vehicle.darkness = data.darkness;
        if (typeof data.dashboardColor == 'number') vehicle.dashboardColor = data.dashboardColor;
        if (typeof data.headlightColor == 'number') vehicle.headlightColor = data.headlightColor;
        if (typeof data.interiorColor == 'number') vehicle.interiorColor = data.interiorColor;
        if (typeof data.lightsMultiplier == 'number') vehicle.lightsMultiplier = data.lightsMultiplier;
        if (typeof data.livery == 'number') vehicle.livery = data.livery;

        if (data.neon) {
            vehicle.neon = {
                left: data.neon.left ?? false,
                right: data.neon.right ?? false,
                front: data.neon.front ?? false,
                back: data.neon.back ?? false,
            };
        }

        if (data.neonColor)
            vehicle.neonColor = new alt.RGBA(data.neonColor.r, data.neonColor.g, data.neonColor.b, data.neonColor.a);

        if (typeof data.numberPlateIndex == 'number') vehicle.numberPlateIndex = data.numberPlateIndex;
        if (typeof data.pearlColor == 'number') vehicle.pearlColor = data.pearlColor;
        if (typeof data.roofLivery == 'number') vehicle.roofLivery = data.roofLivery;
        if (typeof data.roofState == 'boolean') vehicle.roofState = data.roofState;
        if (data.tireSmokeColor)
            vehicle.tireSmokeColor = new alt.RGBA(
                data.tireSmokeColor.r,
                data.tireSmokeColor.g,
                data.tireSmokeColor.b,
                data.tireSmokeColor.a,
            );
        if (typeof data.wheelColor == 'number') vehicle.wheelColor = data.wheelColor;
        if (typeof data.windowTint == 'number') vehicle.windowTint = data.windowTint;
        if (typeof data.driftModeEnabled == 'boolean') vehicle.driftModeEnabled = data.driftModeEnabled;
    }

    private static convertOldVehicleData(vehicle: IVehicle): IVehicle | void {
        let hasChanged = false;

        if (vehicle.pearl) {
            if (!vehicle.tuning) vehicle.tuning = {};
            vehicle.tuning.pearlColor = vehicle.pearl;
            delete vehicle.pearl;
            hasChanged = true;
        }

        if (vehicle.color) {
            if (!vehicle.tuning) vehicle.tuning = {};

            if (typeof vehicle.color == 'number') vehicle.tuning.primaryColor = vehicle.color;
            else
                vehicle.tuning.primaryColor = new alt.RGBA(
                    vehicle.color.r,
                    vehicle.color.g,
                    vehicle.color.b,
                    vehicle.color.a,
                );

            delete vehicle.color;
            hasChanged = true;
        }

        if (vehicle.color2) {
            if (!vehicle.tuning) vehicle.tuning = {};

            if (typeof vehicle.color2 == 'number') vehicle.tuning.secondaryColor = vehicle.color2;
            else
                vehicle.tuning.secondaryColor = new alt.RGBA(
                    vehicle.color2.r,
                    vehicle.color2.g,
                    vehicle.color2.b,
                    vehicle.color2.a,
                );

            delete vehicle.color2;
            hasChanged = true;
        }

        if (vehicle.finish1) {
            if (!vehicle.tuning) vehicle.tuning = {};
            vehicle.tuning.primaryFinish = vehicle.finish1;
            delete vehicle.finish1;
        }

        if (vehicle.finish2) {
            if (!vehicle.tuning) vehicle.tuning = {};
            vehicle.tuning.secondaryFinish = vehicle.finish2;
            delete vehicle.finish2;
        }

        if (hasChanged) return vehicle;
    }
}
