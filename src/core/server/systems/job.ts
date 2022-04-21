import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vehicle_Behavior } from '../../shared/enums/vehicle';
import JobEnums, { Objective } from '../../shared/interfaces/job';
import { Vector3 } from '../../shared/interfaces/vector';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance, distance2d } from '../../shared/utility/vector';
import { Athena } from '../api/athena';
import { sha256Random } from '../utility/encryption';

const JobInstances: { [key: string]: Job } = {};
alt.onClient(JobEnums.ObjectiveEvents.JOB_VERIFY, handleVerify);
alt.onClient(SYSTEM_EVENTS.INTERACTION_JOB_ACTION, handleJobAction);

export class Job {
    /**
     * The ID of the player.
     * @private
     * @type {number}
     * @memberof Job
     */
    private id: number;
    private player: alt.Player;
    private objectives: Array<Objective> = [];
    private vehicles: Array<alt.Vehicle> = [];
    private startTime: number;

    /**
     * Creates an instance of a job handler.
     * Used to build a Job for usage.
     * This instance should be called each time to create new job instances.
     * @memberof Job
     */
    constructor() {}

    /**
     * Add the player to the job this job and start it.
     * Ensure that this Job is initialized with new Job first.
     * @param {alt.Player} player
     * @memberof Job
     */
    addPlayer(player: alt.Player) {
        this.player = player;
        this.id = this.player.id;

        if (JobInstances[this.player.id]) {
            JobInstances[this.player.id].quit(`Switched Job`);
        }

        JobInstances[this.player.id] = this;
        this.startTime = Date.now();
        this.syncObjective();

        Athena.player.emit.message(player, '/quitjob - To stop this job.');
    }

    /**
     * Add an objective to this job.
     * Use the objective interface to generate the objective information.
     * @param {Objective} objectiveData
     * @memberof Job
     */
    addObjective(objectiveData: Objective) {
        const callbackOnStart = objectiveData.callbackOnStart;
        const callbackOnFinish = objectiveData.callbackOnFinish;
        const objectiveClone = deepCloneObject<Objective>(objectiveData);

        objectiveClone.callbackOnStart = callbackOnStart;
        objectiveClone.callbackOnFinish = callbackOnFinish;
        this.objectives.push(objectiveClone);
    }

    /**
     * Create a unique vehicle for this job.
     * Objective eventually removes the job vehicle.
     * This unique job vehicle is temporarily assinged to the player.
     *
     * Returns a vehicle with a 'uid'.
     *
     * @param {string} model
     * @param {alt.RGBA} [color1]
     * @param {alt.RGBA} [color2]
     * @return {alt.Vehicle}
     * @memberof Job
     */
    addVehicle(
        player: alt.Player,
        model: string,
        pos: Vector3,
        rot: Vector3,
        color1?: alt.RGBA,
        color2?: alt.RGBA,
    ): alt.Vehicle {
        const uid = sha256Random(JSON.stringify(player.data));
        const veh = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
        veh.uid = uid;

        if (!color1) {
            color1 = new alt.RGBA(255, 255, 255, 255);
        }

        if (!color2) {
            color2 = new alt.RGBA(255, 255, 255, 255);
        }

        veh.player_id = player.id;
        veh.customPrimaryColor = color1;
        veh.customSecondaryColor = color2;
        veh.behavior = Vehicle_Behavior.UNLIMITED_FUEL | Vehicle_Behavior.NO_SAVE;
        this.vehicles.push(veh);
        return veh;
    }

    /**
     * Remove all vehicles from this job.
     * @memberof Job
     */
    removeAllVehicles() {
        for (let i = 0; i < this.vehicles.length; i++) {
            try {
                this.vehicles[i].destroy();
            } catch (err) {}
        }
    }

    /**
     * Remove a vehicle by unique identifier assigned when adding a vehicle.
     * @param {string} uid
     * @return {*}
     * @memberof Job
     */
    removeVehicle(uid: string) {
        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            if (this.vehicles[i].uid !== uid) {
                continue;
            }

            this.vehicles.splice(i, 1);
            return;
        }
    }

    /**
     * Appends a list of objectives into the Job Framework.
     * @param {Objective} objectiveData
     * @memberof Job
     */
    loadObjectives(objectiveData: Array<Objective>) {
        const uniqueObjectives = [];

        for (let i = 0; i < objectiveData.length; i++) {
            const callbackOnStart = objectiveData[i].callbackOnStart;
            const callbackOnFinish = objectiveData[i].callbackOnFinish;
            const objectiveClone = deepCloneObject<Objective>(objectiveData[i]);

            objectiveClone.callbackOnStart = callbackOnStart;
            objectiveClone.callbackOnFinish = callbackOnFinish;

            uniqueObjectives.push(objectiveClone);
        }

        this.objectives = this.objectives.concat(uniqueObjectives);
    }

    /**
     * Verify if an objective is completed by a user.
     * @memberof JobBuilder
     */
    checkObjective(): boolean {
        const objective = this.getCurrentObjective();

        const passedCritera = this.verifyCriteria(objective);
        if (!passedCritera) {
            return false;
        }

        const passedType = this.verifyType(objective);
        if (!passedType) {
            return false;
        }

        // Triggers an Animation at Objective End
        if (objective.animation && !objective.animation.atObjectiveStart) {
            this.tryAnimation();
        }

        // Calls an event on server-side or client-side after objective is complete.
        if (objective.eventCall && !objective.eventCall.callAtStart) {
            this.tryEventCall();
        }

        if (objective.particle) {
            Athena.player.emit.particle(this.player, objective.particle, true);
        }

        this.goToNextObjective();
        return true;
    }

    /**
     * Call this to cleanup a job.
     *
     * @param {string} reason
     * @memberof Job
     */
    quit(reason: string) {
        if (JobInstances[this.player.id]) {
            delete JobInstances[this.player.id];
        }

        if (this.player.valid) {
            alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
            Athena.player.emit.message(this.player, reason);
        }

        this.removeAllVehicles();
    }

    /**
     * Verifies mechanically important objective information.
     * This checks for positions, range, etc.
     * @private
     * @param {Objective} objective
     * @return {*}  {boolean}
     * @memberof JobBuilder
     */
    private verifyType(objective: Objective): boolean {
        if (isFlagEnabled(objective.type, JobEnums.ObjectiveType.WAYPOINT)) {
            if (distance(this.player.pos, objective.pos) <= objective.range) {
                return true;
            }
        }

        if (isFlagEnabled(objective.type, JobEnums.ObjectiveType.CAPTURE_POINT)) {
            if (distance(this.player.pos, objective.pos) > objective.range) {
                return false;
            }

            if (objective.captureMaximum === null || objective.captureMaximum === undefined) {
                objective.captureMaximum = 10;
            }

            if (!objective.captureProgress) {
                objective.captureProgress = 0;
            }

            if (objective.nextCaptureTime && Date.now() < objective.nextCaptureTime) {
                return false;
            }

            if (!objective.nextCaptureTime || Date.now() > objective.nextCaptureTime) {
                objective.nextCaptureTime = Date.now() + 1000;
            }

            objective.captureProgress += 1;

            if (objective.captureProgress >= objective.captureMaximum) {
                return true;
            } else {
                alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_UPDATE, objective);
            }
        }

        return false;
    }

    /**
     * Verifies objective criteria such as...
     * using a vehicle, no weapons, no dying, etc.
     * @private
     * @param {Objective} objective
     * @return {*}  {boolean}
     * @memberof JobBuilder
     */
    private verifyCriteria(objective: Objective): boolean {
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_VEHICLE)) {
            if (this.player && this.player.vehicle) {
                return false;
            }
        }

        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_WEAPON)) {
            if (Athena.player.inventory.hasWeapon(this.player)) {
                return false;
            }
        }

        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_DYING)) {
            if (this.player && this.player.data.isDead) {
                return false;
            }
        }

        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.IN_VEHICLE)) {
            if (this.player && !this.player.vehicle) {
                return false;
            }
        }

        // Check if the player is in a specific job vehicle or any job vehicle.
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.IN_JOB_VEHICLE)) {
            if (this.player && !this.player.vehicle) {
                return false;
            }

            if (!this.player.vehicle.uid) {
                return false;
            }

            let foundVehicle = false;
            for (let i = 0; i < this.vehicles.length; i++) {
                if (this.vehicles[i].uid === this.player.vehicle.uid) {
                    foundVehicle = true;
                    break;
                }
            }

            if (!foundVehicle) {
                return false;
            }
        }

        // Called when a job vehicle is destroyed.
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY)) {
            let allValid = true;
            for (let i = 0; i < this.vehicles.length; i++) {
                if (!this.vehicles[i].valid) {
                    continue;
                }

                if (this.vehicles[i].engineHealth <= 50) {
                    allValid = false;
                    break;
                }

                if (this.vehicles[i].destroyed) {
                    allValid = false;
                    break;
                }
            }

            if (!allValid) {
                return false;
            }
        }

        // Check if any vehicle is nearby.
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.JOB_VEHICLE_NEARBY)) {
            let foundValid = false;
            for (let i = 0; i < this.vehicles.length; i++) {
                if (!this.vehicles[i].valid) {
                    continue;
                }

                const dist = distance2d(this.vehicles[i].pos, objective.pos);
                if (dist >= 50) {
                    continue;
                }

                foundValid = true;
            }

            if (!foundValid) {
                return false;
            }
        }

        return true;
    }

    /**
     * Remove the first element of the objective list and move on to the next.
     * @private
     * @memberof JobBuilder
     */
    goToNextObjective() {
        const returnedObjective = this.objectives.shift();
        if (returnedObjective && returnedObjective.callbackOnFinish) {
            returnedObjective.callbackOnFinish(this.player);
        }

        if (this.objectives.length <= 0) {
            this.removeAllVehicles();
            Athena.player.emit.message(this.player, `Job Completed`);
            alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
            return;
        }

        this.syncObjective();
    }

    private tryEventCall() {
        const objective = this.getCurrentObjective();

        if (objective.eventCall.isServer) {
            alt.emit(objective.eventCall.eventName, this.player);
        } else {
            alt.emitClient(this.player, objective.eventCall.eventName);
        }
    }

    /**
     * Tries to play an animation if it is present
     * @private
     * @return {*}
     * @memberof Job
     */
    private tryAnimation() {
        const objective = this.getCurrentObjective();
        if (!objective.animation) {
            return;
        }

        let delay = 0;
        if (objective.animation.delay) {
            delay = objective.animation.delay;
        }

        setTimeout(() => {
            if (objective.animation.rotation) {
                this.player.rot = objective.animation.rotation as alt.Vector3;
            }

            alt.nextTick(() => {
                Athena.player.emit.animation(
                    this.player,
                    objective.animation.dict,
                    objective.animation.name,
                    objective.animation.flags,
                    objective.animation.duration,
                );
            });
        }, delay);
    }

    /**
     * Emits data down to the player to start handling job information.
     * @private
     * @memberof Job
     */
    private syncObjective() {
        const objective = this.getCurrentObjective();

        if (objective.callbackOnStart) {
            objective.callbackOnStart(this.player);
        }

        if (objective.animation && objective.animation.atObjectiveStart) {
            this.tryAnimation();
        }

        if (objective.eventCall && objective.eventCall.callAtStart) {
            this.tryEventCall();
        }

        alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, deepCloneObject(objective));
    }

    /**
     * Get the current objective the player is completing.
     * @return {*}  {(Objective | null)}
     * @memberof JobBuilder
     */
    getCurrentObjective(): Objective | null {
        return this.objectives[0];
    }
}

function handleVerify(player: alt.Player) {
    const instance = JobInstances[player.id];

    if (!instance) {
        alt.log(`${player.data.name} has a dead job instance.`);
        alt.emitClient(player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
        return;
    }

    alt.setTimeout(() => {
        instance.checkObjective();
    }, 0);
}

function handleJobAction(player: alt.Player, triggerName: string) {
    alt.emit(triggerName, player);
}

/**
 * Get the player's current Job Instance.
 * @export
 * @param {alt.Player} player
 * @return {Job | null}  {(Job | null)}
 */
export function getPlayerJob(player: alt.Player): Job | null {
    return JobInstances[player.id];
}

alt.on('playerDisconnect', (player: alt.Player) => {
    const id = player.id;

    if (!JobInstances[player.id]) {
        return;
    }

    JobInstances[player.id].quit('Disconnected');
});
