import IVehiclePartDamage from "./iVehiclePartDamage";

export default interface IVehicleDamage {
    parts: { [part: string]: IVehiclePartDamage };
    bumpers: { [part: string]: IVehiclePartDamage };
    windows: { [part: string]: IVehiclePartDamage }
    wheels: Array<IVehiclePartDamage>;
    lights: Array<IVehiclePartDamage>;
}