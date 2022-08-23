import { Blip } from './blip';
import { EventCall } from './eventCall';
import { Marker } from './marker';
import { TextLabel } from './textLabel';
import { Vector3 } from './vector';
import { JobAnimation } from './animation';
import { Particle } from './particle';
import { JobAttachable } from './iAttachable';

enum ObjectiveCriteria {
    NO_VEHICLE = 1,
    NO_WEAPON = 2,
    NO_DYING = 4,
    IN_VEHICLE = 8,
    IN_JOB_VEHICLE = 16,
    FAIL_ON_JOB_VEHICLE_DESTROY = 32,
    JOB_VEHICLE_NEARBY = 64,
}

enum ObjectiveType {
    WAYPOINT = 1,
    CAPTURE_POINT = 2,
}

enum ObjectiveEvents {
    JOB_SYNC = 'job:Sync',
    JOB_VERIFY = 'job:Verify',
    JOB_UPDATE = 'job:Update',
}

export interface Objective {
    /**
     * The criteria necessary to complete this Objective.
     * @type {ObjectiveCriteria}
     * @memberof Objective
     */
    criteria: ObjectiveCriteria;

    /**
     * An objective type that is unique to this objective.
     * @type {ObjectiveType}
     * @memberof Objective
     */
    type: ObjectiveType;

    /**
     * The 3D Position of this objective.
     * @type {Vector3}
     * @memberof Objective
     */
    pos: Vector3;

    /**
     * The range which this objective can be completed in.
     * Usually set to around 2.
     * @type {number}
     * @memberof Objective
     */
    range: number;

    /**
     * A description of what to do to complete this objective.
     * @type {string}
     * @memberof Objective
     */
    description: string;

    /**
     * An optional internal tracker for how far this objective is along.
     * @type {number}
     * @memberof Objective
     */
    captureProgress?: number;

    /**
     * An optional internal tracker for how much progress needs to be done to complete it.
     * @type {number}
     * @memberof Objective
     */
    captureMaximum?: number;

    /**
     * The time between captures. This should be left alone.
     * @type {number}
     * @memberof Objective
     */
    nextCaptureTime?: number;

    /**
     * A local marker to associate with this objective.
     * @type {Marker}
     * @memberof Objective
     */
    marker?: Marker;

    /**
     * A local text label to associate with this objective.
     * @type {TextLabel}
     * @memberof Objective
     */
    textLabel?: TextLabel;

    /**
     * A local blip to associate with this objective.
     * @type {Blip}
     * @memberof Objective
     */
    blip?: Blip;

    /**
     * An animation to associate with this objective.
     * @type {JobAnimation}
     * @memberof Objective
     */
    animation?: JobAnimation;

    /**
     * An object to associate with this objective.
     * @type {JobAttachable}
     * @memberof Objective
     */
    attachable?: JobAttachable;

    /**
     * An event that can be triggered when the objective is started, completed, etc.
     * Useful for adding custom functionality to an objective.
     * @type {EventCall}
     * @memberof Objective
     */
    eventCall?: EventCall;

    /**
     * Particles to show in the area of the objective.
     * Useful to add some 'flavor' to your objective.
     * @type {Particle}
     * @memberof Objective
     */
    particle?: Particle;

    /**
     * Turns off all other objective checks, and only does the `callbackOnCheck` callback provided.
     *
     * @type {boolean}
     * @memberof Objective
     */
    onlyCallbackCheck?: boolean;

    /**
     * Server-side callback when objective is started.
     * @memberof Objective
     */
    callbackOnStart?: (player: any) => void;

    /**
     *
     * @memberof Objective
     */
    callbackOnCheck?: (player: any) => Promise<boolean>;

    /**
     * Server-side callback when objective is completed.
     * @memberof Objective
     */
    callbackOnFinish?: (player: any) => void;
}

export default {
    ObjectiveCriteria,
    ObjectiveType,
    ObjectiveEvents,
};
