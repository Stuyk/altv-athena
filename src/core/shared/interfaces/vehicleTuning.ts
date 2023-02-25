import * as alt from 'alt-shared';
import IVehicleHandling from './vehicleHandling';
import IVehicleMod from './vehicleMod';
import { IVehicleNeon, NumberPlateStyle, RGBA, WindowTint } from 'alt-server';

type finish = number;

export type PaintFinish = [finish, finish];
export type PaintJob = [alt.RGBA, alt.RGBA];

export default interface IVehicleTuning {
    /**
     * Cannot exceed modkit count
     *
     * @type {number}
     * @memberof IVehicleTuning
     */
    modkit: number;

    /**
     * Mods to apply to this vehicle
     *
     * @type {Array<IVehicleMod>}
     * @memberof IVehicleTuning
     */
    mods: Array<IVehicleMod>;

    /**
     * Handling data to apply to this vehicle
     *
     * @type {Partial<IVehicleHandling>}
     * @memberof IVehicleTuning
     */
    handling: Partial<IVehicleHandling>;

    /**
     * The paint that should be applied to this vehicle
     *
     * ```
     * [1, 1]
     * // OR
     * [ new alt.RGBA(255, 0, 0, 255), new alt.RGBA(255, 0, 0, 255) ];
     * ```
     *
     * @type {(PaintJob | PaintFinish)}
     * @memberof IVehicle
     */
    paint?: PaintJob | PaintFinish;

    /**
     * Pearl Color, -1 does not apply
     *
     * @type {number}
     * @deprecated Use `tuning.pearlColor` instead.
     * @memberof IVehicle
     */
    pearl?: number;

    customTires: boolean;

    darkness: number;

    dashboardColor: number;

    headlightColor: number;

    interiorColor: number;

    lightsMultiplier: number;

    livery: number;

    neon: Partial<IVehicleNeon>;

    neonEnabled: boolean;

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
