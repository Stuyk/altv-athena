import * as alt from 'alt-client';
import * as native from 'natives';
import { Timer } from './timers';

const MAX_ATTEMPTS = 100;
const textureData = {};

export function loadTexture(dictionary: string) {
    return new Promise((resolve: Function) => {
        let attempts = 0;

        if (native.hasStreamedTextureDictLoaded(dictionary)) {
            resolve();
            return;
        }

        const interval = Timer.createInterval(() => {
            native.requestStreamedTextureDict(dictionary, false);
            if (attempts > MAX_ATTEMPTS) {
                resolve();
                Timer.clearInterval(interval);
                return;
            }

            if (!native.hasStreamedTextureDictLoaded(dictionary)) {
                attempts += 1;
                return;
            }

            Timer.clearInterval(interval);
            return resolve();
        }, 100);
    });
}

export function drawTexture2D(
    dictionary: string,
    name: string,
    position: alt.IVector2,
    scale: number = 1,
    opacity: number = 255
) {
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

    native.drawSprite(dictionary, name, position.x, position.y, width, height, 0, 255, 255, 255, opacity, false);
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
