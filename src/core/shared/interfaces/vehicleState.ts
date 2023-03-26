import { WindowTint } from 'alt-server';
import { IVehicleNeon } from 'alt-server';
import * as alt from 'alt-shared';

/**
 * Wraps the alt.Vehicle properties that can be set.
 *
 * Used to auto-sync a vehicle from a database.
 *
 *
 * @interface VehicleState
 */
export interface VehicleState {
    /**
     * Gets or sets the active radio station.
     *
     */
    activeRadioStation: number;

    /**
     * Gets or sets the additional body health.
     */
    bodyAdditionalHealth: number;
    /**
     * Gets or sets the body health.
     */
    bodyHealth: number;

    /**
     * Gets or sets the custom primary color as a RGBA type
     */
    customPrimaryColor: alt.RGBA;

    /**
     * Gets or sets the custom secondary color as a RGBA type.
     * #### Example
     * ```js
     * const someVehicle = new alt.Vehicle('elegy', 0, 0, 0, 0, 0, 0);
     * someVehicle.customSecondaryColor = new alt.RGBA(255, 0, 0);
     * console.log(`Vehicle custom secondary color was set to red`);
     * ```
     */
    customSecondaryColor: alt.RGBA;

    /**
     * Gets or sets if the vehicle instance has custom tires.
     */
    customTires: boolean;

    /**
     * Applies some decoration effects to the vehicle (e.g.: It makes the hydra looking rusty or applies snow to the front bumper of `policeold1`). Does not work on every vehicle model.
     */
    darkness: number;

    /**
     * Gets or sets the dashboard color of the vehicle.
     *
     * Dash board colors range from 0 to 159.
     *
     */
    dashboardColor: number;

    /**
     * Gets or sets the dirt level of the vehicle.
     */
    dirtLevel: number;

    /**
     * Gets or sets the current engine health.
     *
     * Default maximum engine health is 1000.
     * The `vehicle.repair()` function should be used to repair a vehicle if the engine health is less than or equal to zero.
     *
     */
    engineHealth: number;

    /**
     * Gets or sets the engine state of the vehicle.
     *
     * The functionality of the vehicle engine can be triggered on either client-side or server-side. If you want to trigger the engine on client-side use native.setVehicleEngineOn.
     *
     */
    engineOn: boolean;

    /**
     * Gets or sets the headlight color of a vehicle.
     */
    headlightColor: number;
    /**
     * Gets or sets the interior color of a vehicle.
     */
    interiorColor: number;
    /**
     * Gets or sets the lights intensity and distance of a vehicle.
     */
    lightsMultiplier: number;
    /**
     * Gets or sets the livery of a vehicle.
     */
    livery: number;
    /**
     * Gets or sets the lock state of a vehicle.
     */
    lockState: alt.VehicleLockState;
    /**
     * Enables or disables the manual engine control.
     */
    manualEngineControl: boolean;

    /**
     * Enables or disables a neon light on a specific position.
     */
    neon: IVehicleNeon;

    /**
     * Gets or sets the color of the neon lights.
     */
    neonColor: alt.RGBA;

    /**
     * Gets or sets the current number plate style.
     */
    numberPlateIndex: number;

    /**
     * Gets or sets the current text displayed on the number plate.
     */
    numberPlateText: string;

    /**
     * Gets or sets the pearl color of a vehicle.
     */
    pearlColor: number;

    /**
     * Gets or sets the current health amount of the petrol tank.
     */
    petrolTankHealth: number;

    /**
     * Gets or sets the current primary color of a vehicle.
     */
    primaryColor: number;

    /**
     * Gets or sets the roof livery of a vehicle.
     */
    roofLivery: number;

    /**
     * Gets or sets the roof state of a vehicle (closed or open).
     */
    roofState: boolean;

    /**
     * Gets or sets the current secondary color.
     */
    secondaryColor: number;

    /**
     * Gets or sets the siren state of a vehicle.
     */
    sirenActive: boolean;

    /**
     * Gets or sets the color of the tire smoke.
     */
    tireSmokeColor: alt.RGBA;

    /**
     * Gets or sets the wheel color.
     */
    wheelColor: number;

    /**
     * Gets or sets the window tint of a vehicle.
     */
    windowTint: WindowTint;

    /**
     * Gets or sets the drift mode state of the vehicle.
     */
    driftModeEnabled: boolean;

    /**
     * Gets or sets if the created train is a mission train.
     */
    isMissionTrain: boolean;

    /**
     * Gets or sets the track id of the train.
     *
     * @remarks Valid track ids are between 0 and 11.
     */
    trainTrackId: number;

    /**
     * Gets or sets the trains config index.
     *
     * @remarks You can find a list of all possible config indices in the trains.xml. Valid indices are between 1 and 25.
     */
    trainConfigIndex: number;

    /**
     * Gets or sets the distance of the trains to the engine.
     */
    trainDistanceFromEngine: number;

    /**
     * Gets or sets if the train is the engine of the train.
     */
    isTrainEngine: boolean;

    /**
     * Gets or sets if the train is a caboose.
     */
    isTrainCaboose: boolean;

    /**
     * Gets or sets if the train is a passenger carriage.
     */
    trainPassengerCarriages: boolean;

    /**
     * Gets or sets the direction of the train.
     */
    trainDirection: boolean;

    /**
     * Gets or sets if the trains is rendered derailed.
     */
    trainRenderDerailed: boolean;

    /**
     * Gets or sets if the doors of the trains should be forced open.
     */
    trainForceDoorsOpen: boolean;

    /**
     * Gets or sets the cruise speed of the train.
     */
    trainCruiseSpeed: number;

    /**
     * Gets or sets the config index of the train's carriage.
     */
    trainCarriageConfigIndex: number;

    trainUnk1: boolean;

    trainUnk2: boolean;

    trainUnk3: boolean;

    boatAnchorActive: boolean;

    lightState: number;

    rocketRefuelSpeed: number;

    counterMeasureCount: number;

    scriptMaxSpeed: number;

    hybridExtraActive: boolean;

    hybridExtraState: number;
}
