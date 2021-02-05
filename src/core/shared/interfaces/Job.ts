import { Blip } from './Blip';
import { EventCall } from './EventCall';
import { Marker } from './Marker';
import { TextLabel } from './TextLabel';
import { Vector3 } from './Vector';

enum ObjectiveCriteria {
    NO_VEHICLE = 1,
    NO_WEAPON = 2,
    NO_DYING = 4
}

enum ObjectiveType {
    WAYPOINT = 1,
    CAPTURE_POINT = 2
}

enum ObjectiveEvents {
    JOB_SYNC = 'job:Sync',
    JOB_VERIFY = 'job:Verify'
}

export interface Objective {
    criteria: ObjectiveCriteria;
    type: ObjectiveType;
    pos: Vector3;
    range: number;
    description: string;
    // Optional Parameters
    captureProgress?: number;
    captureMaximum?: number;
    marker?: Marker;
    textLabel?: TextLabel;
    blip?: Blip;
    animation?: Animation;
    eventCall?: EventCall;
}

export default {
    ObjectiveCriteria,
    ObjectiveType,
    ObjectiveEvents
};
