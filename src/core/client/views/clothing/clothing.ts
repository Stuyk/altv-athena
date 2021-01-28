import * as alt from 'alt-client';
import * as native from 'natives';
import { Character } from '../../../shared/interfaces/Character';
import { ClothingComponent } from '../../../shared/interfaces/Clothing';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../../utility/camera';

const url = `http://resource/client/views/clothing/html/index.html`;
let view: View;
let characters: Partial<Character>[];
let open = false;

alt.on('consoleCommand', (name) => {
    if (name !== 'clothes') {
        return;
    }

    handleView();
});

async function handleView() {
    view = await View.getInstance(url, true);
    view.on('clothing:Update', handleUpdate);
    view.on('clothing:Populate', handlePopulateData);
    open = true;
    createPedEditCamera();
    setFov(50);
    setZPos(0.6);
}

export function handlePopulateData(components: Array<ClothingComponent>) {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        for (let index = 0; index < component.drawables.length; index++) {
            const id = component.ids[index];
            let value = component.drawables[index];
            let textureValue = component.textures[index];

            let totalTextures = 0;
            let totalDrawables = 0;

            if (component.isProp) {
                // Get Current Value of Prop Player is Wearing
                value = native.getPedPropIndex(alt.Player.local.scriptID, id);
                component.drawables[index] = value;

                textureValue = native.getPedPropTextureIndex(alt.Player.local.scriptID, id);
                component.textures[index] = textureValue;

                totalDrawables = native.getNumberOfPedPropDrawableVariations(alt.Player.local.scriptID, id);
                totalTextures = native.getNumberOfPedPropTextureVariations(alt.Player.local.scriptID, id, value);
                if (totalTextures !== 0) {
                    totalTextures -= 1;
                }
            } else {
                // Get Current Value of Component Player is Wearing
                value = native.getPedDrawableVariation(alt.Player.local.scriptID, id);
                component.drawables[index] = value;

                textureValue = native.getPedTextureVariation(alt.Player.local.scriptID, id);
                component.textures[index] = textureValue;

                totalDrawables = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, id);
                totalTextures = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, id, value);
                if (totalTextures !== 0) {
                    totalTextures -= 1;
                }
            }

            component.maxDrawables[index] = totalDrawables;
            component.maxTextures[index] = totalTextures;
        }
    }

    view.emit('clothing:Propagate', components);
}

export function handleUpdate(components: Array<ClothingComponent>) {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];

        for (let index = 0; index < component.drawables.length; index++) {
            const texture = component.textures[index];
            const value = component.drawables[index];
            const id = component.ids[index];

            if (component.isProp) {
                if (value <= -1) {
                    native.clearPedProp(alt.Player.local.scriptID, id);
                    continue;
                }

                native.setPedPropIndex(alt.Player.local.scriptID, id, value, texture, true);
            } else {
                native.setPedComponentVariation(alt.Player.local.scriptID, id, value, texture, 0);
            }
        }
    }

    if (!open) {
        return;
    }

    handlePopulateData(components);
}
