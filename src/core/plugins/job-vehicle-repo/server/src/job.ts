import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { Job } from '../../../../server/systems/job';
import { ServerMarkerController } from '../../../../server/streamers/marker';
import { JOB_VEHICLE_REPO_EVENTS } from '../../shared/events';
import { JOB_VEHICLE_REPO_OPTIONS } from '../../shared/options';
import JOB_DATA from './data';
import JobEnums from '../../../../shared/interfaces/job';
import { Objective } from '../../../../shared/interfaces/job';
import { MARKER_TYPE } from '../../../../shared/enums/markerTypes';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { VEHICLE_HASH } from '../../../../shared/enums/VehicleHash';
import { ServerBlipController } from '../../../../server/systems/blip';
import { InteractionController } from '../../../../server/systems/interaction';
import { randomNumberBetween, getRandomRGB } from '../../../../shared/utility/random';

const START_POINT = new alt.Vector3(-28.58901023864746, -1085.3275146484375, 25.5);
const YELLOW_RGBA = new alt.RGBA(235, 213, 52, 255);

export class VehicleRepoJob {
    static blipUid: string;
    static markerUid: string;
    static interactionUid: string;

    /**
     * Create In-World Job Location(s)
     * @static
     * @memberof Job
     */
    static init() {
        VehicleRepoJob.blipUid = ServerBlipController.append({
            sprite: 293,
            color: 2,
            pos: START_POINT,
            scale: 1,
            shortRange: true,
            text: 'Simeon',
        });

        VehicleRepoJob.markerUid = ServerMarkerController.append({
            pos: START_POINT,
            color: YELLOW_RGBA,
            type: MARKER_TYPE.CYLINDER,
            scale: alt.Vector3.one.mul(1.25),
        });

        VehicleRepoJob.interactionUid = InteractionController.add({
            callback: VehicleRepoJob.begin,
            description: 'Repossession',
            position: START_POINT,
            range: 2,
            isPlayerOnly: true,
        });
    }

    /**
     * Call this to start the job. Usually called through interaction point.
     * @static
     * @param {alt.Player} player
     * @memberof Job
     */
    static async begin(player: alt.Player) {
        // Make job available only to one player at a time
        ServerBlipController.remove(VehicleRepoJob.blipUid);
        ServerMarkerController.remove(VehicleRepoJob.markerUid);
        InteractionController.remove(VehicleRepoJob.interactionUid);

        // Mission Start Shard
        Athena.player.emit.createShard(player, {
            title: '~y~Repossession',
            text: '~w~Client did not pay, repo his car back here!',
            duration: 7000,
        });

        // Get a random vehicle
        const randomVehicle = await VehicleRepoJob.getRandomVehicle();

        // Create Objectives
        const objectives: Array<Objective> = [];
        objectives.push({
            description: 'Go Repo Vehicle',
            type: JobEnums.ObjectiveType.WAYPOINT,
            pos: randomVehicle.pos,
            range: 4,
            blip: {
                text: 'Repo Vehicle',
                color: 5,
                pos: randomVehicle.pos,
                scale: 1.25,
                shortRange: false,
                sprite: 523,
            },
            marker: {
                color: YELLOW_RGBA,
                type: MARKER_TYPE.CHEVRON_UP_SINGLE,
                pos: new alt.Vector3(0, 0, 1).add(randomVehicle.pos),
                bobUpAndDown: true,
                rotate: true,
                scale: alt.Vector3.one.mul(0.25),
            },
            criteria:
                JobEnums.ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY |
                JobEnums.ObjectiveCriteria.IN_JOB_VEHICLE |
                JobEnums.ObjectiveCriteria.NO_DYING,
            callbackOnStart: (player: alt.Player) => {
                Athena.player.emit.message(player, '/quitjob - To stop this job.');
                alt.emitClient(
                    player,
                    JOB_VEHICLE_REPO_EVENTS.SET_OBJECTIVE,
                    'Repo the ~y~[vehicle_name]~w~ on [street_name]~n~',
                    randomVehicle.model,
                    randomVehicle.pos,
                );
            },
            callbackOnFinish: (player: alt.Player) => {
                setTimeout(() => {
                    Athena.player.emit.soundFrontend(player, 'Phone_Text_Arrive', 'DLC_H4_MM_Sounds');

                    const randomSpeech = JOB_DATA.SPEECHES[randomNumberBetween(0, JOB_DATA.SPEECHES.length)];
                    Athena.player.emit.message(player, `Simeon: ${randomSpeech}`);
                }, 3000);
            },
        });

        // Final Objective
        objectives.push({
            description: 'Drop Off Vehicle',
            type: JobEnums.ObjectiveType.WAYPOINT,
            pos: START_POINT,
            range: 4,
            marker: {
                pos: {
                    x: START_POINT.x,
                    y: START_POINT.y,
                    z: START_POINT.z - 1,
                },
                type: MARKER_TYPE.CYLINDER,
                color: YELLOW_RGBA,
            },
            blip: {
                text: 'Park Vehicle',
                color: 5,
                pos: START_POINT,
                scale: 1,
                shortRange: false,
                sprite: 271,
            },
            textLabel: {
                data: 'Park Vehicle',
                pos: {
                    x: START_POINT.x,
                    y: START_POINT.y,
                    z: START_POINT.z + 1.5,
                },
            },
            criteria:
                JobEnums.ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY |
                JobEnums.ObjectiveCriteria.IN_JOB_VEHICLE |
                JobEnums.ObjectiveCriteria.NO_DYING,
            callbackOnStart: (player: alt.Player) => {
                alt.emitClient(player, JOB_VEHICLE_REPO_EVENTS.SET_OBJECTIVE, 'Drive the vehicle back to ~y~Simeon');
            },
            callbackOnFinish: (player: alt.Player) => {
                alt.emitClient(player, JOB_VEHICLE_REPO_EVENTS.UNSET_OBJECTIVE);
            },
        });

        // Create the job
        const job = new Job();

        // Start the job max time timer
        const jobTimer = alt.setTimeout(() => job.quit('user'), JOB_VEHICLE_REPO_OPTIONS.MAXTIME * 1000 * 60);

        const randomColor = getRandomRGB();

        // Create the job vehicle
        const vehicle = job.addVehicle(
            player,
            randomVehicle.model,
            randomVehicle.pos,
            randomVehicle.rot,
            randomColor,
            randomColor,
        );

        vehicle.numberPlateText = 'REPO JOB';

        const bodyHealth = vehicle.bodyHealth;
        const engineHealth = vehicle.engineHealth;
        const petrolTankHealth = vehicle.petrolTankHealth;

        // Load the objectives
        job.loadObjectives(objectives);

        // Assign the player to the job
        job.addPlayer(player);

        // Handle job completed
        job.addCompletedCallback(async (job: Job) => {
            alt.clearTimeout(jobTimer);

            alt.emitClient(player, JOB_VEHICLE_REPO_EVENTS.JOB_COMPLETED);

            vehicle.frozen = true;

            const bodyHealthPercent = vehicle.bodyHealth / bodyHealth;
            const engineHealthPercent = vehicle.engineHealth / engineHealth;
            const petrolTankHealthPercent = vehicle.petrolTankHealth / petrolTankHealth;

            Athena.player.emit.createSpinner(player, {
                text: 'Receiving payment...',
                duration: 2000,
            });

            // Get the raw payout from the distance
            const payoutFromDistance =
                START_POINT.distanceTo(randomVehicle.pos) * JOB_VEHICLE_REPO_OPTIONS.PAYOUT_DISTANCE_MULTIPLIER;

            // Cap the payout to the max payout
            let earned = Math.floor(Math.min(payoutFromDistance, JOB_VEHICLE_REPO_OPTIONS.MAX_PAYOUT));

            // Get total total percentage of damage
            let totalDamagePercent = Math.min(
                1 - bodyHealthPercent + (1 - engineHealthPercent) + (1 - petrolTankHealthPercent),
                1,
            );

            // Calculate the repair cost
            let repairCost = Math.ceil(earned * totalDamagePercent);

            // Substract the repair cost from the payout
            earned = Math.max(0, Math.floor(earned - repairCost));

            await alt.Utils.wait(2000);

            Athena.player.currency.add(player, CurrencyTypes.CASH, earned);
            Athena.player.emit.soundFrontend(player, 'Mission_Pass_Notify', 'DLC_HEISTS_GENERAL_FRONTEND_SOUNDS');
            Athena.player.emit.createShard(player, {
                title: '~y~Job Completed',
                text: `~w~Received $${earned} ${repairCost > 0 ? '~n~~r~-$' + repairCost + ' repair cost' : ''}`,
                duration: 7000,
            });

            // Re-init the job if the player completes it
            setTimeout(VehicleRepoJob.init, JOB_VEHICLE_REPO_OPTIONS.COOLDOWN);
        });

        // Handle job failed
        job.addQuitCallback((job, reason) => {
            alt.clearTimeout(jobTimer);

            alt.emitClient(player, JOB_VEHICLE_REPO_EVENTS.UNSET_OBJECTIVE);

            Athena.player.emit.soundFrontend(player, 'ScreenFlash', 'MissionFailedSounds');
            Athena.player.emit.createShard(player, {
                title: '~r~Job Failed',
                text: "~w~C'mon man I needed that car!",
                duration: 7000,
            });

            // Re-init the job if the player completes it
            setTimeout(VehicleRepoJob.init, JOB_VEHICLE_REPO_OPTIONS.COOLDOWN);
        });
    }

    /**
     * Get random vehicle model and position
     * @static
     * @return { model: string, pos: alt.Vector3; rot: alt.Vector3 }
     * @memberof Job
     */
    static getRandomVehicle(): { model: VEHICLE_HASH; pos: alt.Vector3; rot: alt.Vector3 } {
        let models = Object.values(JOB_DATA.MODELS);
        let positions = Object.values(JOB_DATA.POSITIONS);
        let position = positions[randomNumberBetween(0, positions.length)];
        return {
            model: models[randomNumberBetween(0, models.length)],
            pos: position.pos,
            rot: position.rot,
        };
    }
}
