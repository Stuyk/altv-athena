import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Clothing } from '../../shared/enums/views';
import { ClothingComponent } from '../../shared/interfaces/Clothing';
import { Item } from '../../shared/interfaces/Item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { View } from '../extensions/view';
import {
    createPedEditCamera,
    destroyPedEditCamera,
    setFov,
    setShouldDisableControls,
    setZPos
} from '../utility/camera';
import { BaseHUD } from './hud/hud';

const url = `http://assets/webview/client/clothing/index.html`;
let view: View;
let open = false;

alt.on(SYSTEM_EVENTS.META_CHANGED, handleMetaChanged);
alt.onServer(View_Events_Clothing.Open, handleView);

async function handleView() {
    view = await View.getInstance(url, true);
    view.on('clothing:Update', handleUpdate);
    view.on('clothing:Purchase', handlePurchase);
    view.on('clothing:Populate', handlePopulateData);
    view.on('clothing:Exit', handleExit);
    view.on('clothing:DisableControls', handleControls);
    view.on('clothing:Ready', handleReady);
    open = true;
    BaseHUD.setHudVisibility(false);
    createPedEditCamera({ x: 0.15, y: -0.5, z: 0 });
    setFov(70);
    setZPos(0.6);
}

function handleReady() {
    if (!view) {
        return;
    }

    view.emit('clothing:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CLOTHING));
}

function handleMetaChanged(key: string, items: Array<Item>, oldValue: any): void {
    if (key !== 'equipment') {
        return;
    }

    handleEquipment(items);
}

export function handleEquipment(items: Array<Item>) {
    const clothingComponents = new Array(11).fill(null);
    native.clearAllPedProps(alt.Player.local.scriptID);

    if (items && Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
            clothingComponents[items[i].slot] = items[i].data;
        }
    }

    // Default Components
    if (alt.Player.local.meta.appearance.sex === 0) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 35, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 15, 0, 0); // torso
    } else {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 34, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 91, 0, 0); // torso
    }

    if (!items || !Array.isArray(items)) {
        return;
    }

    handleUpdate(clothingComponents, true);
}

function handleControls(value: boolean) {
    setShouldDisableControls(value);
}

function handleExit() {
    destroyPedEditCamera();
    alt.emitServer(View_Events_Clothing.Exit);
    view.close();
    open = false;
    BaseHUD.setHudVisibility(true);
}

function handlePurchase(index: number, component: ClothingComponent, name: string, desc: string) {
    alt.emitServer(View_Events_Clothing.Purchase, index, component, name, desc);
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

            component.maxDrawables[index] = totalDrawables - 1;
            component.maxTextures[index] = totalTextures - 1;
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
