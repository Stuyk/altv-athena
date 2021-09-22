import * as alt from 'alt-server';
import { IResponse } from '../../shared/interfaces/IResponse';

export interface IVehicleRule {
    (player: alt.Player, vehicle: alt.Vehicle): IResponse;
}

export interface IVehicleDoorRule {
    (player: alt.Player, vehicle: alt.Vehicle, door: number): IResponse;
}
