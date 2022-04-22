import * as alt from 'alt-server';
import { ServerMarkerController } from '../../../../server/streamers/marker';
import { ServerBlipController } from '../../../../server/systems/blip';
import { InteractionController } from '../../../../server/systems/interaction';
import { Job } from '../../../../server/systems/job';
import { MARKER_TYPE } from '../../../../shared/enums/markerTypes';
import { Objective } from '../../../../shared/interfaces/job';
import { Vector3 } from '../../../../shared/interfaces/vector';
import JOB_DATA from './data';
import JobEnums from '../../../../shared/interfaces/job';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { Athena } from '../../../../server/api/athena';

const START_POINT = { x: -1289.2508544921875, y: -1388.552734375, z: 3.481008052825928 };
const TOTAL_DROP_OFFS = 5;

export class PizzaJob {
    /**
     * Create In-World Job Location(s)
     * @static
     * @memberof Job
     */
    static init() {
        ServerBlipController.append({
            sprite: 465,
            color: 5,
            pos: START_POINT,
            scale: 1,
            shortRange: true,
            text: 'Pizza Delivery',
        });

        ServerMarkerController.append({
            pos: START_POINT,
            color: new alt.RGBA(255, 255, 255, 150),
            type: MARKER_TYPE.CYLINDER,
            scale: new alt.Vector3(1, 1, 1),
        });

        InteractionController.add({
            callback: PizzaJob.begin,
            description: 'Deliver Pizzas',
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
        const openSpot = await PizzaJob.getVehicleSpawnPoint();
        if (!openSpot) {
            Athena.player.emit.notification(player, `~r~No room for vehicles right now. Please wait...`);
            return;
        }

        const randomPoints = PizzaJob.getRandomPoints(TOTAL_DROP_OFFS);
        const objectives: Array<Objective> = [];
        objectives.push({
            description: 'Hop on the Faggio',
            type: JobEnums.ObjectiveType.WAYPOINT,
            pos: openSpot.pos,
            range: 4,
            marker: {
                pos: {
                    x: openSpot.pos.x,
                    y: openSpot.pos.y,
                    z: openSpot.pos.z - 1,
                },
                type: MARKER_TYPE.CYLINDER,
                color: new alt.RGBA(0, 255, 0, 100),
            },
            textLabel: {
                data: 'Hop on the Faggio',
                pos: {
                    x: openSpot.pos.x,
                    y: openSpot.pos.y,
                    z: openSpot.pos.z + 1.5,
                },
            },
            criteria:
                JobEnums.ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY |
                JobEnums.ObjectiveCriteria.IN_JOB_VEHICLE |
                JobEnums.ObjectiveCriteria.NO_DYING,
            callbackOnStart: (player: alt.Player) => {
                Athena.player.emit.notification(player, `Hop on the Faggio`);
            },
        });

        for (let i = 0; i < randomPoints.length; i++) {
            const rPoint = randomPoints[i];
            objectives.push({
                description: 'Drive to the Point',
                type: JobEnums.ObjectiveType.WAYPOINT,
                pos: rPoint.drop,
                range: 2,
                marker: {
                    pos: rPoint.drop,
                    type: MARKER_TYPE.CYLINDER,
                    color: new alt.RGBA(0, 255, 0, 100),
                },
                textLabel: {
                    data: 'Throw the Pizza',
                    pos: {
                        x: rPoint.drop.x,
                        y: rPoint.drop.y,
                        z: rPoint.drop.z + 1.5,
                    },
                },
                blip: {
                    text: 'Drive to the Point',
                    color: 2,
                    pos: rPoint.drop,
                    scale: 1,
                    shortRange: true,
                    sprite: 271,
                },
                criteria:
                    JobEnums.ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY |
                    JobEnums.ObjectiveCriteria.NO_DYING |
                    JobEnums.ObjectiveCriteria.IN_JOB_VEHICLE,
                callbackOnStart: (player: alt.Player) => {
                    Athena.player.emit.notification(player, `Drive to the Drop Off Point`);
                },
                callbackOnFinish: (player: alt.Player) => {
                    Athena.player.emit.soundFrontend(player, 'BASE_JUMP_PASSED', 'HUD_AWARDS');
                    Athena.player.emit.notification(player, `Pizza Delivered!`);
                    Athena.player.emit.tempObjectLerp(
                        player,
                        'prop_pizza_box_01',
                        { x: rPoint.drop.x, y: rPoint.drop.y, z: rPoint.drop.z + 1 },
                        rPoint.target,
                        1,
                    );
                },
            });

            objectives.push({
                description: 'Get the Next Order',
                type: JobEnums.ObjectiveType.WAYPOINT,
                pos: openSpot.pos,
                range: 4,
                marker: {
                    pos: {
                        x: openSpot.pos.x,
                        y: openSpot.pos.y,
                        z: openSpot.pos.z - 1,
                    },
                    type: MARKER_TYPE.CYLINDER,
                    color: new alt.RGBA(0, 255, 0, 100),
                },
                blip: {
                    text: 'Get the Next Order',
                    color: 2,
                    pos: openSpot.pos,
                    scale: 1,
                    shortRange: true,
                    sprite: 271,
                },
                textLabel: {
                    data: 'Get the Next Order',
                    pos: {
                        x: openSpot.pos.x,
                        y: openSpot.pos.y,
                        z: openSpot.pos.z + 1.5,
                    },
                },
                criteria:
                    JobEnums.ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY |
                    JobEnums.ObjectiveCriteria.IN_JOB_VEHICLE |
                    JobEnums.ObjectiveCriteria.NO_DYING,
                callbackOnStart: (player: alt.Player) => {
                    Athena.player.emit.notification(player, `Get the Next Order`);
                },
                callbackOnFinish: (player: alt.Player) => {
                    Athena.player.emit.soundFrontend(
                        player,
                        'PICKUP_WEAPON_BALL',
                        'HUD_FRONTEND_WEAPONS_PICKUPS_SOUNDSET',
                    );
                },
            });
        }

        objectives.push({
            description: 'Drop Off Vehicle',
            type: JobEnums.ObjectiveType.WAYPOINT,
            pos: openSpot.pos,
            range: 4,
            marker: {
                pos: {
                    x: openSpot.pos.x,
                    y: openSpot.pos.y,
                    z: openSpot.pos.z - 1,
                },
                type: MARKER_TYPE.CYLINDER,
                color: new alt.RGBA(0, 255, 0, 100),
            },
            blip: {
                text: 'Park Vehicle',
                color: 2,
                pos: openSpot.pos,
                scale: 1,
                shortRange: true,
                sprite: 271,
            },
            textLabel: {
                data: 'Park Vehicle',
                pos: {
                    x: openSpot.pos.x,
                    y: openSpot.pos.y,
                    z: openSpot.pos.z + 1.5,
                },
            },
            criteria:
                JobEnums.ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY |
                JobEnums.ObjectiveCriteria.IN_JOB_VEHICLE |
                JobEnums.ObjectiveCriteria.NO_DYING,
            callbackOnStart: (player: alt.Player) => {
                Athena.player.emit.notification(player, `Drive the Bike Back`);
            },
            callbackOnFinish: (player: alt.Player) => {
                // Payout 100 - 200; Random;
                const earned = Math.floor(Math.random() * 100) + 100;
                Athena.player.currency.add(player, CurrencyTypes.CASH, earned);
                Athena.player.emit.notification(player, `~g~$${earned}`);
            },
        });

        const job = new Job();
        job.addVehicle(
            player,
            'faggio',
            openSpot.pos,
            openSpot.rot,
            new alt.RGBA(255, 255, 255, 255),
            new alt.RGBA(255, 255, 255, 255),
        );

        job.loadObjectives(objectives);
        job.addPlayer(player);
    }

    /**
     * Creates and checks if a vehicle is in a spot and returns a spot if it is open.
     * @static
     * @return {({ pos: Vector3; rot: Vector3 } | null)}
     * @memberof PizzaJob
     */
    static async getVehicleSpawnPoint(): Promise<{ pos: Vector3; rot: Vector3 } | null> {
        for (let i = 0; i < JOB_DATA.PARKING_POINTS.length; i++) {
            const point = JOB_DATA.PARKING_POINTS[i];
            const pointTest = new alt.ColshapeSphere(point.pos.x, point.pos.y, point.pos.z - 1, 2);

            // Have to do a small sleep to the ColShape propogates entities inside of it.
            await new Promise((resolve: Function) => {
                alt.setTimeout(() => {
                    resolve();
                }, 250);
            });

            const spaceOccupied = alt.Vehicle.all.find((veh) => veh && veh.valid && pointTest.isEntityIn(veh));

            try {
                pointTest.destroy();
            } catch (err) {}

            if (spaceOccupied) {
                continue;
            }

            return point;
        }

        return null;
    }

    /**
     * Get random point from list of points.
     * @static
     * @return {Array<Vector3>}
     * @memberof Job
     */
    static getRandomPoints(amount: number): Array<{ drop: Vector3; target: Vector3 }> {
        const points = [];

        while (points.length < amount) {
            points.push(JOB_DATA.DROP_OFF_SPOTS[Math.floor(Math.random() * JOB_DATA.DROP_OFF_SPOTS.length)]);
        }

        return points;
    }
}
