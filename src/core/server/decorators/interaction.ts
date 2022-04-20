import alt, { IVector3 } from 'alt-server';
import { Athena } from '../api/athena';

export function interaction(
    pos: IVector3,
    description: string,
    range: number,
    dim: number,
    debug?: boolean,
    playerOnly?: boolean,
    vehicleOnly?: boolean,
    uid?: string,
) {
    return (_target: Function, _propertyName: string, descriptor: PropertyDescriptor) => {
        const callback: (player: alt.Player, ...args: any[]) => void = descriptor.value;
        Athena.controllers.interaction.add({
            position: pos,
            description: description,
            dimension: dim,
            isPlayerOnly: playerOnly,
            isVehicleOnly: vehicleOnly,
            range: range,
            debug: debug,
            uid: uid,
            callback: callback,
        });
    };
}
