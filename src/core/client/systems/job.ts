import * as alt from 'alt-client';
import natives from 'natives';

import JobEnums, { Objective } from '@AthenaShared/interfaces/job';
import { isFlagEnabled } from '@AthenaShared/utility/flags';
import { distance } from '@AthenaShared/utility/vector';
import { drawMarker } from '@AthenaClient/utility/marker';
import { drawText3D } from '@AthenaClient/utility/text';
import { Timer } from '@AthenaClient/utility/timers';
import { HudSystem } from './hud';

let objective: Objective | null;
let interval: number;
let cooldown: number;
let blip: alt.Blip;

const ObjectiveController = {
    updateObjective(data: Objective | null) {
        objective = data;
    },

    /**
     * If the objective is null, clear the objective and blip. Otherwise, set the objective and blip.
     * @param {uniontype} data - Objective | null
     * @returns The Objective object.
     */
    handleSync(data: Objective | null) {
        if (interval) {
            Timer.clearInterval(interval);
            interval = null;
        }

        if (blip && blip.destroy) {
            try {
                blip.destroy();
            } catch (err) {}
        }

        if (!data) {
            objective = null;
            HudSystem.setObjective(null);
            return;
        }

        if (data.blip) {
            blip = new alt.PointBlip(data.blip.pos.x, data.blip.pos.y, data.blip.pos.z);
            blip.scale = data.blip.scale;

            // Beta Feature? Not implemented yet.
            if (blip.hasOwnProperty('size')) {
                blip.size = { x: data.blip.scale, y: data.blip.scale } as alt.Vector2;
            }

            blip.sprite = data.blip.sprite;
            blip.color = data.blip.color;
            blip.shortRange = data.blip.shortRange;
            blip.name = data.blip.text;
            blip.route = true;
        }

        HudSystem.setObjective(data.description);
        objective = { ...data };
        interval = Timer.createInterval(ObjectiveController.verifyObjective, 0, 'job.ts');
    },

    getVector3Range() {
        return new alt.Vector3(objective.range, objective.range, objective.range);
    },

    verifyType(dist: number): boolean {
        if (isFlagEnabled(objective.type, JobEnums.ObjectiveType.WAYPOINT)) {
            if (dist <= objective.range) {
                return true;
            }
        }

        if (isFlagEnabled(objective.type, JobEnums.ObjectiveType.CAPTURE_POINT)) {
            if (dist <= objective.range) {
                return true;
            }
        }

        return false;
    },

    verifyCriteria(dist: number): boolean {
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_VEHICLE)) {
            if (alt.Player.local.vehicle) {
                return false;
            }
        }

        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.IN_VEHICLE)) {
            if (!alt.Player.local.vehicle) {
                return false;
            }
        }

        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.VEHICLE_ENGINE_OFF)) {
            const engineOn = natives.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);
            if (engineOn) return false;
        }

        return true;
    },

    verifyObjective() {
        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (!objective) {
            return;
        }

        const dist = distance(alt.Player.local.pos, objective.pos);

        if (objective.marker && dist <= objective.range * 25) {
            const scale = objective.marker.scale ? objective.marker.scale : ObjectiveController.getVector3Range();

            drawMarker(objective.marker.type, objective.marker.pos as alt.Vector3, scale, objective.marker.color);
        }

        if (objective.textLabel && dist <= objective.range * 10) {
            drawText3D(
                objective.textLabel.data,
                objective.textLabel.pos as alt.Vector3,
                0.4,
                new alt.RGBA(255, 255, 255, 255),
            );
        }

        if (objective.captureProgress >= 1 && dist <= objective.range * 10) {
            const progressText = `${objective.captureProgress}/${objective.captureMaximum}`;
            drawText3D(progressText, objective.pos as alt.Vector3, 0.4, new alt.RGBA(255, 255, 255, 255));
        }

        if (cooldown && Date.now() < cooldown) {
            return;
        }

        cooldown = Date.now() + 250;

        if (!ObjectiveController.verifyType(dist)) {
            return;
        }

        if (!ObjectiveController.verifyCriteria(dist)) {
            return;
        }

        alt.emitServer(JobEnums.ObjectiveEvents.JOB_VERIFY);
    },
};

alt.onServer(JobEnums.ObjectiveEvents.JOB_SYNC, ObjectiveController.handleSync);
alt.onServer(JobEnums.ObjectiveEvents.JOB_UPDATE, ObjectiveController.updateObjective);
