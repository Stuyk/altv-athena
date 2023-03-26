import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Load a model based on string or hash
 *
 *
 * @param {number} hash
 * @return {Promise<boolean>}
 */
export async function load(model: number | string): Promise<boolean> {
    const hash = typeof model === 'string' ? alt.hash(model) : model;

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
