import * as alt from 'alt-client';
import JobEnums, { Objective } from '../../shared/interfaces/Job';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance } from '../../shared/utility/vector';
import { drawMarker } from '../utility/marker';
import { drawText2D } from '../utility/text';

class ObjectiveController {
    static objective: Objective | null;
    static interval: number;
    static cooldown: number;

    static handleSync(data: Objective | null) {
        if (ObjectiveController.interval) {
            alt.clearInterval(ObjectiveController.interval);
        }

        if (!data) {
            ObjectiveController.objective = null;
            return;
        }

        ObjectiveController.objective = data;
        ObjectiveController.interval = alt.setInterval(ObjectiveController.verifyObjective, 0);
    }

    private static getVector3Range() {
        return new alt.Vector3(
            ObjectiveController.objective.range,
            ObjectiveController.objective.range,
            ObjectiveController.objective.range
        );
    }

    private static verifyObjective() {
        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (!ObjectiveController.objective) {
            return;
        }

        if (ObjectiveController.cooldown && Date.now() < ObjectiveController.cooldown) {
            return;
        }

        drawText2D('You are now doing objectives...', { x: 0.5, y: 0.9 }, 0.4, new alt.RGBA(255, 255, 255, 255));

        const dist = distance(alt.Player.local.pos, ObjectiveController.objective.pos);

        if (ObjectiveController.objective.marker && dist <= ObjectiveController.objective.range * 10) {
            drawMarker(
                1,
                ObjectiveController.objective.marker.pos as alt.Vector3,
                ObjectiveController.getVector3Range(),
                ObjectiveController.objective.marker.color
            );
        }

        if (dist > ObjectiveController.objective.range) {
            return;
        }

        ObjectiveController.cooldown = Date.now() + 250;
        alt.emitServer(JobEnums.ObjectiveEvents.JOB_VERIFY);
    }
}

alt.onServer(JobEnums.ObjectiveEvents.JOB_SYNC, ObjectiveController.handleSync);
