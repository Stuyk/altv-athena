import * as alt from 'alt-shared';
import { Blip } from './blip.js';
import { EventCall } from './eventCall.js';
import { Marker } from './marker.js';
import { TextLabel } from './textLabel.js';
import { JobAnimation } from './animation.js';
import { Particle } from './particle.js';
import { JobAttachable } from './iAttachable.js';

/**
 *
 *
 *
 * @enum {number}
 */
export enum ObjectiveCriteria {
    NO_VEHICLE = 1,
    NO_WEAPON = 2,
    NO_DYING = 4,
    IN_VEHICLE = 8,
    IN_JOB_VEHICLE = 16,
    FAIL_ON_JOB_VEHICLE_DESTROY = 32,
    JOB_VEHICLE_NEARBY = 64,
    VEHICLE_ENGINE_OFF = 128,
}

/**
 *
 *
 *
 * @enum {number}
 */
export enum ObjectiveType {
    WAYPOINT = 1,
    CAPTURE_POINT = 2,
    PRESS_INTERACT_TO_COMPLETE = 4,
}

export enum ObjectiveEvents {
    JOB_SYNC = 'job:Sync',
    JOB_VERIFY = 'job:Verify',
    JOB_UPDATE = 'job:Update',
}

/**
 * Used to pass objective information from server to client.
 *
 *
 * @interface Objective
 */
export interface Objective {
    /**
     * A unique identifier that can be assigned to an objective to help identify it easily.
     *
     * @type {string}
     *
     */
    uid?: string;

    /**
     * The criteria necessary to complete this Objective.
     * @type {ObjectiveCriteria}
     *
     */
    criteria: ObjectiveCriteria;

    /**
     * An objective type that is unique to this objective.
     * @type {ObjectiveType}
     *
     */
    type: ObjectiveType;

    /**
     * The 3D Position of this objective.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The range which this objective can be completed in.
     * Usually set to around 2.
     * @type {number}
     *
     */
    range: number;

    /**
     * A description of what to do to complete this objective.
     * @type {string}
     *
     */
    description: string;

    /**
     * An optional internal tracker for how far this objective is along.
     * @type {number}
     *
     */
    captureProgress?: number;

    /**
     * An optional internal tracker for how much progress needs to be done to complete it.
     * @type {number}
     *
     */
    captureMaximum?: number;

    /**
     * The time between captures. This should be left alone.
     * @type {number}
     *
     */
    nextCaptureTime?: number;

    /**
     * A local marker to associate with this objective.
     * @type {Marker}
     *
     */
    marker?: Marker;

    /**
     * A local text label to associate with this objective.
     * @type {TextLabel}
     *
     */
    textLabel?: TextLabel;

    /**
     * A local blip to associate with this objective.
     * @type {Blip}
     *
     */
    blip?: Blip;

    /**
     * An animation to associate with this objective.
     * @type {JobAnimation}
     *
     */
    animation?: JobAnimation;

    /**
     * An object to associate with this objective.
     * @type {JobAttachable}
     *
     */
    attachable?: JobAttachable;

    /**
     * An event that can be triggered when the objective is started, completed, etc.
     * Useful for adding custom functionality to an objective.
     * @type {EventCall}
     *
     */
    eventCall?: EventCall;

    /**
     * Particles to show in the area of the objective.
     * Useful to add some 'flavor' to your objective.
     * @type {Particle}
     *
     */
    particle?: Particle;

    /**
     * Turns off all other objective checks, and only does the `callbackOnCheck` callback provided.
     *
     * @type {boolean}
     *
     */
    onlyCallbackCheck?: boolean;

    /**
     * Data to put on this objective.
     * Do not add callbacks.
     *
     * @type {{ [key: string]: any }}
     *
     */
    data?: { [key: string]: any };

    /**
     * Server-side callback when objective is started.
     *
     */
    callbackOnStart?: (player: any) => void;

    /**
     *
     *
     */
    callbackOnCheck?: (player: any) => Promise<boolean>;

    /**
     * Server-side callback when objective is completed.
     *
     */
    callbackOnFinish?: (player: any) => void;
}

export default {
    ObjectiveCriteria,
    ObjectiveType,
    ObjectiveEvents,
};
