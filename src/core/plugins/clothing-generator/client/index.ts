import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';
import { Events } from '../shared/events';
import { PLUGIN_NAME } from '../shared/pluginName';
import { maleClothes } from '../shared/maleClothes';
import { femaleClothes } from '../shared/femaleClothes';
import { ClothingList } from '../shared/interfaces';

const maxDrawable = 1000;
const maxTextureValue = 26;
const components = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const props = [0, 1, 2, 6, 7];

let interval: number;
let status = `PROP`;

function tick() {
    AthenaClient.screen.text.drawText2D(
        `Generating... ${status}`,
        { x: 0.2, y: 0.2 },
        0.8,
        new alt.RGBA(255, 255, 255, 255),
    );
}

export async function buildClothingMaximums() {
    if (!interval) {
        interval = alt.setInterval(tick, 0);
    }

    for (let id of props) {
        alt.log(`Starting ID: ${id}`);
        status = `PROP IDs ${id}`;

        let shouldBreakDrawable = false;

        for (let drawable = 1; drawable < maxDrawable; drawable++) {
            if (shouldBreakDrawable) {
                break;
            }

            for (let texture = 0; texture < maxTextureValue; texture++) {
                await alt.Utils.wait(5);

                // Returns '0' if invalid handle
                const isValidProp = native.setPedPreloadPropData(alt.Player.local.scriptID, id, drawable, texture);
                if (!isValidProp) {
                    if (texture === 0) {
                        shouldBreakDrawable = true;
                    }

                    break;
                }

                native.releasePedPreloadPropData(alt.Player.local.scriptID);
                alt.emitServerRaw(Events.toServer.set, id, drawable, texture, true);
                alt.log(`PROP | ID: ${id} | Drawable: ${drawable} | Texture: ${texture}`);
            }
        }
    }

    for (let id of components) {
        status = `CLOTHING IDs ${id}`;

        let shouldBreakDrawable = false;
        for (let drawable = 0; drawable < maxDrawable; drawable++) {
            if (shouldBreakDrawable) {
                break;
            }

            for (let texture = 0; texture < maxTextureValue; texture++) {
                await alt.Utils.wait(5);
                if (!native.isPedComponentVariationValid(alt.Player.local.scriptID, id, drawable, texture)) {
                    if (texture === 0) {
                        shouldBreakDrawable = true;
                    }
                    break;
                }

                alt.emitServerRaw(Events.toServer.set, id, drawable, texture, false);
                alt.log(`CLOTHING | ID: ${id} | Drawable: ${drawable} | Texture: ${texture}`);
            }
        }
    }

    alt.clearInterval(interval);
    alt.emitServer(Events.toServer.finish);
}

if (alt.debug) {
    alt.onServer(Events.toClient.start, buildClothingMaximums);
}

// Plugin Exports
const clothingData = {
    getMaleClothes(): ClothingList {
        return maleClothes;
    },
    getFemaleClothes(): ClothingList {
        return femaleClothes;
    },
};

declare global {
    export interface ClientPluginAPI {
        [PLUGIN_NAME]: typeof clothingData;
    }
}

AthenaClient.systems.plugins.addAPI(PLUGIN_NAME, clothingData);
