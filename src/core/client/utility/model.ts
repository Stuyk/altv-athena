import * as alt from 'alt-client';
import * as native from 'natives';
import { Timer } from './timers';

export async function loadModel(hash: number): Promise<boolean> {
    return await new Promise((resolve: Function) => {
        native.requestModel(hash);
        let count = 0;

        const interval = Timer.createInterval(
            () => {
                if (count >= 100) {
                    resolve(false);
                    Timer.clearInterval(interval);
                    return;
                }

                if (!native.hasModelLoaded(hash)) {
                    count += 1;
                    return;
                }

                Timer.clearInterval(interval);
                resolve(true);
            },
            100,
            'model.ts'
        );
    });
}
