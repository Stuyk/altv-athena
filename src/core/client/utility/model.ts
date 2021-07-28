import * as alt from 'alt-client';
import * as native from 'natives';

export async function loadModel(hash: number): Promise<boolean> {
    return await new Promise((resolve: Function) => {
        native.requestModel(hash);
        let count = 0;

        if (native.hasModelLoaded(hash)) {
            resolve(true);
            return;
        }

        const interval = alt.setInterval(() => {
            if (count >= 100) {
                resolve(false);
                alt.clearInterval(interval);
                return;
            }

            if (!native.hasModelLoaded(hash)) {
                count += 1;
                return;
            }

            alt.clearInterval(interval);
            resolve(true);
        }, 100);
    });
}
