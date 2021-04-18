import * as alt from 'alt-client';
import * as native from 'natives';

const MAX_ATTEMPTS = 100;
const textureData = {};

export function loadTexture(dictionary: string) {
    return new Promise((resolve: Function) => {
        let attempts = 0;

        const interval = alt.setInterval(() => {
            native.requestStreamedTextureDict(dictionary, false);
            if (attempts > MAX_ATTEMPTS) {
                resolve();
                alt.clearInterval(interval);
                return;
            }

            if (!native.hasStreamedTextureDictLoaded(dictionary)) {
                attempts += 1;
                return;
            }

            alt.clearInterval(interval);
            return resolve();
        }, 100);
    });
}

export function drawTexture(dictionary: string, name: string, position: alt.Vector3, scale: number = 1) {
    const identifier = `${dictionary}${name}`;
    if (!textureData[identifier]) {
        const [_, width, height] = native.getActiveScreenResolution(0, 0);
        const resolution = native.getTextureResolution(dictionary, name);
        textureData[identifier] = {
            x: resolution.x / width,
            y: resolution.y / height
        };
    }

    const texture = textureData[identifier];
    if (!texture) {
        return;
    }

    const width = texture.x * scale;
    const height = texture.y * scale;
    const [visible, x, y] = native.getScreenCoordFromWorldCoord(position.x, position.y, position.z);

    if (!visible) {
        return;
    }

    native.setDrawOrigin(position.x, position.y, position.z, 0);
    native.drawSprite(dictionary, name, 0, 0, width, height, 0, 255, 255, 255, 255, false);
    native.clearDrawOrigin();
}
