import * as alt from 'alt-server';
import JobEnums, { Objective } from '../../shared/interfaces/Job';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance } from '../../shared/utility/vector';
import { playerFuncs } from '../extensions/Player';

const JobInstances: { [key: string]: Job } = {};
alt.onClient(JobEnums.ObjectiveEvents.JOB_VERIFY, handleVerify);

export type PlayerDataName = string;

export class Job {
    private name: PlayerDataName;
    private player: alt.Player;
    private objectives: Array<Objective> = [];
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
        this.name = player.data.name as PlayerDataName;

        if (JobInstances[this.name]) {
            JobInstances[this.name].quit(`Switched Job`);
        }

        JobInstances[this.name] = this;
        this.startTime = Date.now();
        this.syncObjective();
    }

    /**
     * Add an objective to this job.
     * Use the objective interface to generate the objective information.
     * @param {Objective} objectiveData
     * @memberof Job
     */
    addObjective(objectiveData: Objective) {
        this.objectives.push(objectiveData);
    }

    /**
     * Appends a list of objectives into the Job Framework.
     * @param {Objective} objectiveData
     * @memberof Job
     */
    loadObjectives(objectiveData: Array<Objective>) {
        this.objectives = this.objectives.concat(objectiveData);
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

        // Plays an animation when the objective is complete.
        if (objective.animation) {
            playerFuncs.emit.animation(
                this.player,
                objective.animation.dict,
                objective.animation.name,
                objective.animation.flags,
                objective.animation.duration
            );
        }

        // Calls an event on server-side or client-side after objective is complete.
        if (objective.eventCall) {
            if (objective.eventCall.isServer) {
                alt.emit(objective.eventCall.eventName, this.player);
            } else {
                alt.emitClient(this.player, objective.eventCall.eventName);
            }
        }

        if (objective.particle) {
            playerFuncs.emit.particle(this.player, objective.particle, true);
        }

        this.goToNextObjective();
        return true;
    }

    quit(reason: string) {
        // Needs to wipe current player job data.
        playerFuncs.emit.message(this.player, reason);
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
            if (playerFuncs.inventory.hasWeapon(this.player)) {
                return false;
            }
        }

        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_DYING)) {
            if (this.player && this.player.data.isDead) {
                this.quit(`Died while on the job.`);
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
    private goToNextObjective() {
        this.objectives.shift();

        if (this.objectives.length <= 0) {
            playerFuncs.emit.message(this.player, `Job Completed`);
            alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
            return;
        }

        this.syncObjective();
    }

    /**
     * Emits data down to the player to start handling job information.
     * @private
     * @memberof Job
     */
    private syncObjective() {
        alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, this.getCurrentObjective());
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
    const instance = JobInstances[player.data.name];

    if (!instance) {
        alt.log(`${player.data.name} has a dead job instance.`);
        alt.emitClient(player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
        return;
    }

    alt.setTimeout(() => {
        instance.checkObjective();
    }, 0);
}
