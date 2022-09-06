import * as alt from 'alt-client';
import * as native from 'natives';

const textureData = {};

export function drawTexture2D(
    dictionary: string,
    name: string,
    position: alt.IVector2,
    scale: number = 1,
    opacity: number = 255,
) {
    if (!native.hasStreamedTextureDictLoaded(dictionary)) {
        native.requestStreamedTextureDict(dictionary, false);
        alt.log(`Requested Texture Dictionary: ${dictionary}`);
        return;
    }

    const identifier = `${dictionary}${name}`;
    if (!textureData[identifier]) {
        const [_, width, height] = native.getActiveScreenResolution(0, 0);
        const resolution = native.getTextureResolution(dictionary, name);
        textureData[identifier] = {
            x: resolution.x / width,
            y: resolution.y / height,
        };
    }

    const texture = textureData[identifier];
    if (!texture) {
        return;
    }

    const width = texture.x * scale;
    const height = texture.y * scale;
    native.drawSprite(
        dictionary,
        name,
        position.x,
        position.y,
        width,
        height,
        0,
        255,
        255,
        255,
        opacity,
        false,
        undefined,
    );
}

export function drawTexture(dictionary: string, name: string, position: alt.Vector3, scale: number = 1) {
    if (!native.hasStreamedTextureDictLoaded(dictionary)) {
        native.requestStreamedTextureDict(dictionary, false);
        alt.log(`Requested Texture Dictionary: ${dictionary}`);
        return;
    }

    const identifier = `${dictionary}${name}`;
    if (!textureData[identifier]) {
        const [_, width, height] = native.getActiveScreenResolution(0, 0);
        const resolution = native.getTextureResolution(dictionary, name);
        textureData[identifier] = {
            x: resolution.x / width,
            y: resolution.y / height,
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
    native.drawSprite(dictionary, name, 0, 0, width, height, 0, 255, 255, 255, 255, false, undefined);
    native.clearDrawOrigin();
}
