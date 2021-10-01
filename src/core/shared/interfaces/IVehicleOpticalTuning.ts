import IVehicleOptical from './IVehicleOptical';

export default interface IVehicleOpticalTuning {
    modkit: number;
    mods: Array<IVehicleOptical>;
    parts: IVehicleOptical;
}