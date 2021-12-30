import IVehicleHandling from './iVehicleHandling';
import IVehicleMod from './iVehicleMod';

export default interface IVehicleTuning {
    modkit: number;
    mods: Array<IVehicleMod>;
    handling: IVehicleHandling;
}
