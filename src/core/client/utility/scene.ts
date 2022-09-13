import * as native from 'natives';
import { Vector3 } from '../../shared/interfaces/vector';
import { Timer } from './timers';

export function loadSceneAtCoords(pos: Vector3): Promise<boolean> {
    let timerHandle: number;
    return new Promise<boolean>((resolve) => {
        // noinspection JSSuspiciousNameCombination
        native.newLoadSceneStartSphere(pos.x, pos.y, pos.z ?? native.getApproxHeightForPoint(pos.x, pos.y), 2, 1);

        timerHandle = Timer.createInterval(
            () => {
                if (!native.isNewLoadSceneActive()) {
                    return resolve(false);
                }

                if (!native.isNewLoadSceneLoaded()) {
                    return;
                }

                return resolve(true);
            },
            10,
            'scene.ts',
        );
    }).finally(() => {
        native.newLoadSceneStop();
        Timer.clearInterval(timerHandle);
    });
}
