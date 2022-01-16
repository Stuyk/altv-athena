import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../client/extensions/view2';
import ViewModel from '../../client/models/viewModel';
import PedEditCamera from '../../client/utility/camera';
import { isAnyMenuOpen } from '../../client/utility/menus';
import { CLOTHING_INTERACTIONS } from '../../shared-plugins/core-clothing/events';
import { IClothingStore } from '../../shared-plugins/core-clothing/interfaces';
import { LOCALE_CLOTHING_VIEW } from '../../shared-plugins/core-clothing/locales';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ClothingComponent } from '../../shared/interfaces/clothing';
import { Item } from '../../shared/interfaces/item';

const PAGE_NAME = 'Clothing';
const CAMERA_POSITIONS = [
    { zpos: 0.6, fov: 33 }, // Hat
    { zpos: 0.6, fov: 33 }, // Mask
    { zpos: 0.18999999999999967, fov: 49 }, // Shirt
    { zpos: -0.47000000000000064, fov: 59 }, // Bottoms
    { zpos: -0.7100000000000009, fov: 53 }, // Shoes
    { zpos: 0.61, fov: 29 }, // Glasses
    { zpos: 0.62, fov: 29 }, // Earrings / Earpieces
    { zpos: 0.2799999999999997, fov: 57 }, // Backpacks
    { zpos: 0.2799999999999997, fov: 57 }, // Armour
    { zpos: -0.09999999999999902, fov: 45 }, // Wrist Watch
    { zpos: -0.09999999999999902, fov: 45 }, // Bracelet
];

let storeData: IClothingStore = null;
let isOpen = false;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async open(_storeData: IClothingStore) {
        if (isAnyMenuOpen()) {
            return;
        }

        storeData = _storeData;

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.on(`${PAGE_NAME}:Update`, InternalFunctions.update);
        view.on(`${PAGE_NAME}:Purchase`, InternalFunctions.purchase);
        view.on(`${PAGE_NAME}:Populate`, InternalFunctions.populate);
        view.on(`${PAGE_NAME}:DisableControls`, InternalFunctions.controls);
        view.on(`${PAGE_NAME}:PageUpdate`, InternalFunctions.pageUpdate);
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        if (PedEditCamera.exists) {
            await PedEditCamera.destroy();
        }

        await PedEditCamera.create(alt.Player.local.scriptID, { x: -0.2, y: 0, z: 0 }, true);
        PedEditCamera.setCamParams(0.6, 65);

        alt.Player.local.isMenuOpen = true;
        isOpen = true;
    }

    static async close() {
        PedEditCamera.destroy();

        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.off(`${PAGE_NAME}:Update`, InternalFunctions.update);
        view.off(`${PAGE_NAME}:Purchase`, InternalFunctions.purchase);
        view.off(`${PAGE_NAME}:Populate`, InternalFunctions.populate);
        view.off(`${PAGE_NAME}:DisableControls`, InternalFunctions.controls);
        view.off(`${PAGE_NAME}:PageUpdate`, InternalFunctions.pageUpdate);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        alt.emitServer(CLOTHING_INTERACTIONS.EXIT);
        isOpen = false;
    }

    /**
     * Updates the camera position on page changes.
     * @static
     * @param {number} page
     * @memberof InternalFunctions
     */
    static async pageUpdate(page: number) {
        if (!PedEditCamera.exists()) {
            await PedEditCamera.create(alt.Player.local.scriptID, { x: -0.2, y: 0, z: 0 }, true);
        }

        if (!CAMERA_POSITIONS[page]) {
            PedEditCamera.setCamParams(0.6, 65);
            return;
        }

        PedEditCamera.setCamParams(CAMERA_POSITIONS[page].zpos, CAMERA_POSITIONS[page].fov);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetData`, storeData);
        view.emit(`${PAGE_NAME}:SetLocale`, LOCALE_CLOTHING_VIEW);
        view.emit(`${PAGE_NAME}:SetBankData`, alt.Player.local.meta.bank, alt.Player.local.meta.cash);
    }

    static async handleMetaChanged(key: string, items: Array<Item>, oldValue: any) {
        if (key === 'equipment') {
            InternalFunctions.setEquipment(items);
        }

        if (key === 'bank' || (key === 'cash' && isOpen)) {
            const view = await WebViewController.get();
            view.emit(`${PAGE_NAME}:SetBankData`, alt.Player.local.meta.bank, alt.Player.local.meta.cash);
        }
    }

    static setEquipment(items: Array<Item>) {
        const clothingComponents = new Array(11).fill(null);
        native.clearAllPedProps(alt.Player.local.scriptID);

        if (items && Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
                clothingComponents[items[i].slot] = items[i].data;
            }
        }

        // Default Components
        if (alt.Player.local.model !== 1885233650) {
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

        InternalFunctions.update(clothingComponents, true);
    }

    static controls(value: boolean) {
        PedEditCamera.disableControls(value);
    }

    /**
     * Handles how clothes are purchased.
     * @static
     * @param {string} uid
     * @param {number} index
     * @param {ClothingComponent} component
     * @param {string} name
     * @param {string} desc
     * @memberof InternalFunctions
     */
    static purchase(uid: string, index: number, component: ClothingComponent, name: string, desc: string) {
        alt.emitServer(CLOTHING_INTERACTIONS.PURCHASE, uid, index, component, name, desc);
    }

    static async populate(components: Array<ClothingComponent>) {
        if (typeof components === 'string') {
            components = JSON.parse(components);
        }

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
                } else {
                    // Get Current Value of Component Player is Wearing
                    value = native.getPedDrawableVariation(alt.Player.local.scriptID, id);
                    component.drawables[index] = value;

                    textureValue = native.getPedTextureVariation(alt.Player.local.scriptID, id);
                    component.textures[index] = textureValue;

                    totalDrawables = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, id);
                    totalTextures = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, id, value);
                }

                component.maxDrawables[index] = totalDrawables - 1;
                component.maxTextures[index] = totalTextures - 1;
            }
        }

        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Propagate`, components);
    }

    static async update(components: Array<ClothingComponent>, justSync = false, populateData = false) {
        if (typeof components === 'string') {
            components = JSON.parse(components);
        }

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

        PedEditCamera.update(alt.Player.local.scriptID);

        // Only update data if necessary.
        if (!populateData) {
            return;
        }

        InternalFunctions.populate(components);
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InternalFunctions.handleMetaChanged);
alt.onServer(CLOTHING_INTERACTIONS.OPEN, InternalFunctions.open);
