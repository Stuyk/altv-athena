import alt from 'alt-server';
import { VehicleEvents } from '../../../server/events/vehicleEvents';
import VehicleFuncs from '../../../server/extensions/vehicleFuncs';
import { ATHENA_EVENTS_VEHICLE } from '../../../shared/enums/athenaEvents';
import { IVehicle } from '../../../shared/interfaces/iVehicle';

export class VehicleHandler {
    public static init(): void {
        VehicleEvents.on(ATHENA_EVENTS_VEHICLE.SPAWNED, this.handleVehicleSpawned);

        /*VehicleFuncs.addBeforeCreateInjection((vehicle: IVehicle) => {
            const tuning = {
                modkit: 1,
                mods: [],

                primaryColor: new alt.RGBA(255, 0, 255, 255),
                secondaryColor: new alt.RGBA(0, 0, 0, 255),
                customTires: false,
                darkness: 0,
                dashboardColor: 0,
                headlightColor: 0,
                interiorColor: 0,
                lightsMultiplier: 0,
                livery: 0,
                neon: {
                    left: false,
                    right: true,
                    front: true,
                    back: true,
                },
                neonColor: new alt.RGBA(0, 255, 255, 255),
                numberPlateIndex: 1,
                pearlColor: 2,
                roofLivery: 0,
                roofState: true,
                tireSmokeColor: new alt.RGBA(255, 157, 0, 255),
                wheelColor: 0,
                windowTint: 1,
                driftModeEnabled: false,
            };

            // vehicle.tuning = tuning;
            // return vehicle;
        });*/
    }

    private static handleVehicleSpawned(vehicle: alt.Vehicle): void {
        if (!vehicle?.data?.tuning) return;

        const data = vehicle.data.tuning;

        if (data.modkit) vehicle.modKit = data.modkit;
        if (data.mods) data.mods.forEach((mod) => vehicle.setMod(mod.id, mod.value));
        if (data.handling) vehicle.setStreamSyncedMeta('handlingData', data.handling);

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
}
