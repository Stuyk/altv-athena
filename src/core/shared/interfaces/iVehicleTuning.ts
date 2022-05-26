import IVehicleHandling from './iVehicleHandling';
import IVehicleMod from './iVehicleMod';
import { IVehicleNeon, NumberPlateStyle, RGBA, WindowTint } from 'alt-server';

export default interface IVehicleTuning {
    modkit: number;
    mods: Array<IVehicleMod>;
    handling: Partial<IVehicleHandling>;

    primaryColor: number | RGBA;
    secondaryColor: number | RGBA;
    customTires: boolean;
    darkness: number;
    dashboardColor: number;
    headlightColor: number;
    interiorColor: number;
    lightsMultiplier: number;
    livery: number;
    neon: Partial<IVehicleNeon>;
    neonColor: RGBA;
    numberPlateIndex: NumberPlateStyle;
    pearlColor: number;
    roofLivery: number;
    roofState: boolean;
    tireSmokeColor: RGBA;
    wheelColor: number;
    windowTint: WindowTint;
    driftModeEnabled: boolean;
}
