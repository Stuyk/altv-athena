import * as alt from 'alt-client';
import * as native from 'natives';

export function load(pos: alt.IVector3): Promise<boolean> {
    let timerHandle: number;
    return new Promise<boolean>((resolve) => {
        // noinspection JSSuspiciousNameCombination
        native.newLoadSceneStartSphere(pos.x, pos.y, pos.z ?? native.getApproxHeightForPoint(pos.x, pos.y), 2, 1);

        timerHandle = alt.setInterval(() => {
            if (!native.isNewLoadSceneActive()) {
                return resolve(false);
            }

            if (!native.isNewLoadSceneLoaded()) {
                return;
            }

            return resolve(true);
        }, 10);
    }).finally(() => {
        native.newLoadSceneStop();
        alt.clearInterval(timerHandle);
    });
}
