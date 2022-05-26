import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

const PLUGIN_NAME = 'Tuning Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});

/*
primaryColor: number;
customPrimaryColor: shared.RGBA;
customSecondaryColor: shared.RGBA;
secondaryColor: number;
customTires: boolean;
darkness: number;
dashboardColor: number;
headlightColor: number;
interiorColor: number;
lightsMultiplier: number;
livery: number;
modKit: number;
readonly modKitsCount: number;
neon: IVehicleNeon;
neonColor: shared.RGBA;
numberPlateIndex: NumberPlateStyle;
pearlColor: number;
roofLivery: number;
roofState: boolean;
tireSmokeColor: shared.RGBA;
wheelColor: number;
windowTint: WindowTint;
driftModeEnabled: boolean;

public getMod(modType: VehicleModType): number;
public getMod<T extends number>(modType: T): number;
public getModsCount(modType: VehicleModType): number;
public getModsCount<T extends number>(modType: T): number;
public setMod(modType: VehicleModType, modId: number): void;
public setMod<T extends number>(modType: T, modId: number): void;
*/
