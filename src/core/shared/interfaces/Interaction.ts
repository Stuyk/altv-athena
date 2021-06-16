import { Blip } from './Blip';
import { EventCall } from './EventCall';
import { Vector3 } from './Vector';

export interface Interaction {
    description?: string;
    position?: Vector3;
    identifier?: string;
    type?: string;
    blip?: Blip;
    event?: EventCall;
}
