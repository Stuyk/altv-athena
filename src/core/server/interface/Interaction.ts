import { Vector3 } from '../../shared/interfaces/Vector';

export interface Interaction {
    description?: string;
    position?: Vector3;
    range?: number;
    identifier?: string;
    type?: string;
    dimension?: number;
    callback?: Function;
    drawMarker?: boolean;
    data?: Array<any>;
}
