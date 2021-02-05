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

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Marker {
    pos: Vector3;
    color: { r: number; g: number; b: number; a: number };
}

export interface TextLabel {
    pos: Vector3;
    data: string;
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
}

export default {
    ObjectiveCriteria,
    ObjectiveType,
    ObjectiveEvents
};
