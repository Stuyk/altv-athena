import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Clothing } from '../../../shared/enums/views';
import { ClothingComponent } from '../../../shared/interfaces/Clothing';
import { Item } from '../../../shared/interfaces/Item';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../../utility/camera';

const url = `http://resource/client/views/clothing/html/index.html`;
let view: View;
let open = false;

alt.on(SYSTEM_EVENTS.META_CHANGED, handleMetaChanged);
alt.on('consoleCommand', (name) => {
    if (name !== 'clothes') {
        return;
    }

    handleView();
});

async function handleView() {
    view = await View.getInstance(url, true);
    view.on('clothing:Update', handleUpdate);
    view.on('clothing:Purchase', handlePurchase);
    view.on('clothing:Populate', handlePopulateData);
    view.on('clothing:Exit', handleExit);
    open = true;
    createPedEditCamera();
    setFov(50);
    setZPos(0.6);
}

function handleMetaChanged(key: string, items: Array<Item>, oldValue: any): void {
    if (key !== 'equipment') {
        return;
    }

    const clothingComponents = new Array(11).fill(null);
    native.clearAllPedProps(alt.Player.local.scriptID);

    // Default Components
    if (alt.Player.local.meta.appearance.sex === 0) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 35, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // shirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 15, 0, 0); // torso
    } else {
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 34, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // shirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 91, 0, 0); // torso
    }

    for (let i = 0; i < items.length; i++) {
        clothingComponents[items[i].slot] = items[i].data;
    }

    handleUpdate(clothingComponents, true);
}

function handleExit() {
    destroyPedEditCamera();
    alt.emitServer(View_Events_Clothing.Exit);
    view.close();
    open = false;
}

function handlePurchase(index: number, component: ClothingComponent) {
    alt.emitServer(View_Events_Clothing.Purchase, index, component);
}

export function handlePopulateData(components: Array<ClothingComponent>) {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (!component) {
            continue;
        }

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

export function handleUpdate(components: Array<ClothingComponent>, justSync = false) {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (!component) {
            continue;
        }

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

    if (justSync) {
        return;
    }

    if (!open) {
        return;
    }

    handlePopulateData(components);
}
