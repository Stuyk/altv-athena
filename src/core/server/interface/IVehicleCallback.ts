import * as alt from 'alt-server';
import { IResponse } from '../../shared/interfaces/IResponse';

export default interface IVehicleRule {
    (player: alt.Player, vehicle: alt.Vehicle): IResponse;
}
