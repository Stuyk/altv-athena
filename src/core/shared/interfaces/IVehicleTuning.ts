import IVehicleHandling from '../IVehicleHandling';
import IVehicleMod from './IVehicleMod';

export default interface IVehicleTuning {
    modkit: number;
    mods: Array<IVehicleMod>;
    handling: IVehicleHandling;
}
