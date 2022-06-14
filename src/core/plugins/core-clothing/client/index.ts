import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import PedEditCamera from '../../../client/utility/camera';
import { PedCharacter } from '../../../client/utility/characterPed';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { sleep } from '../../../client/utility/sleep';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Appearance } from '../../../shared/interfaces/appearance';
import { ClothingComponent } from '../../../shared/interfaces/clothing';
import { Item } from '../../../shared/interfaces/item';
import { CLOTHING_CONFIG } from '../shared/config';
import { CLOTHING_INTERACTIONS } from '../shared/events';
import { CLOTHING_DLC_INFO, IClothingStore } from '../shared/interfaces';
import { ComponentVueInfo } from '../shared/types';

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

let equipment: Array<Item> = [];
let appearance: Appearance = null;
let storeData: IClothingStore = null;
let isOpen = false;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async open(_storeData: IClothingStore, _appearance: Appearance, _equipment: Array<Item>) {
        if (isAnyMenuOpen()) {
            return;
        }

        storeData = _storeData;
        appearance = _appearance;
        equipment = _equipment;

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
        view.on(`${PAGE_NAME}:PurchaseAll`, InternalFunctions.purchaseAll);

        native.doScreenFadeOut(100);

        await PedCharacter.destroy();
        await sleep(100);

        native.setEntityAlpha(alt.Player.local.scriptID, 0, false);

        await PedCharacter.create(
            appearance.sex === 1 ? true : false,
            alt.Player.local.pos,
            native.getEntityHeading(alt.Player.local.scriptID),
        );

        await PedCharacter.apply(appearance);
        await sleep(300);

        if (PedEditCamera.exists()) {
            await PedEditCamera.destroy();
        }

        await PedEditCamera.create(PedCharacter.get(), { x: -0.2, y: 0, z: 0 }, false);
        PedEditCamera.setCamParams(0.6, 65);

        InternalFunctions.setEquipment(equipment);

        alt.Player.local.isMenuOpen = true;
        isOpen = true;

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        // Top Left
        alt.setWatermarkPosition(2);
    }

    static async close() {
        native.doScreenFadeOut(100);

        await sleep(100);

        PedEditCamera.destroy();
        PedCharacter.destroy();

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
        view.off(`${PAGE_NAME}:PurchaseAll`, InternalFunctions.purchaseAll);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        native.setEntityAlpha(alt.Player.local.scriptID, 255, false);
        alt.emitServer(CLOTHING_INTERACTIONS.EXIT);
        isOpen = false;

        native.doScreenFadeIn(100);

        alt.setWatermarkPosition(4);
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
        view.emit(`${PAGE_NAME}:SetBankData`, alt.Player.local.meta.bank + alt.Player.local.meta.cash);
        native.doScreenFadeIn(100);
    }

    static async handleMetaChanged(key: string, _items: Array<Item>, _oldValue: any) {
        if (key === 'bank' || (key === 'cash' && isOpen)) {
            const view = await WebViewController.get();
            view.emit(`${PAGE_NAME}:SetBankData`, alt.Player.local.meta.bank + alt.Player.local.meta.cash);
        }
    }

    static setEquipment(items: Array<Item>) {
        const clothingComponents = new Array(11).fill(null);
        native.clearAllPedProps(PedCharacter.get());

        if (items && Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
                clothingComponents[items[i].slot] = items[i].data;
            }
        }

        // Default Components
        if (alt.Player.local.model !== 1885233650) {
            // Check if not male
            native.setPedComponentVariation(PedCharacter.get(), 1, 0, 0, 0); // mask
            native.setPedComponentVariation(PedCharacter.get(), 3, 0, 0, 0); // arms
            native.setPedComponentVariation(PedCharacter.get(), 4, 14, 0, 0); // pants
            native.setPedComponentVariation(PedCharacter.get(), 5, 0, 0, 0); // bag
            native.setPedComponentVariation(PedCharacter.get(), 6, 35, 0, 0); // shoes
            native.setPedComponentVariation(PedCharacter.get(), 7, 0, 0, 0); // accessories
            native.setPedComponentVariation(PedCharacter.get(), 8, 15, 0, 0); // undershirt
            native.setPedComponentVariation(PedCharacter.get(), 9, 0, 0, 0); // body armour
            native.setPedComponentVariation(PedCharacter.get(), 11, 0, 0, 0); // torso
        } else {
            native.setPedComponentVariation(PedCharacter.get(), 1, 0, 0, 0); // mask
            native.setPedComponentVariation(PedCharacter.get(), 3, 15, 0, 0); // arms
            native.setPedComponentVariation(PedCharacter.get(), 5, 0, 0, 0); // bag
            native.setPedComponentVariation(PedCharacter.get(), 4, 14, 0, 0); // pants
            native.setPedComponentVariation(PedCharacter.get(), 6, 34, 0, 0); // shoes
            native.setPedComponentVariation(PedCharacter.get(), 7, 0, 0, 0); // accessories
            native.setPedComponentVariation(PedCharacter.get(), 8, 15, 0, 0); // undershirt
            native.setPedComponentVariation(PedCharacter.get(), 9, 0, 0, 0); // body armour
            native.setPedComponentVariation(PedCharacter.get(), 11, 91, 0, 0); // torso
        }

        if (!items || !Array.isArray(items)) {
            return;
        }

        InternalFunctions.update(clothingComponents, true);
    }

    static controls(value: boolean) {
        PedEditCamera.disableControls(value);
    }

    static getDlcClothingCount(sex: number, id: number, isProp: boolean = false): number {
        const dlcInfos = CLOTHING_CONFIG[isProp ? 'DLC_PROPS' : 'DLC_CLOTHING'][id] as Array<CLOTHING_DLC_INFO>;

        let totalCount = 0;

        for (let i = 0; i < dlcInfos.length; i++) {
            if (dlcInfos[i].count[sex]) {
                totalCount += dlcInfos[i].count[sex];
            }
        }

        return totalCount;
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
    static purchase(
        uid: string,
        index: number,
        component: ClothingComponent,
        name: string,
        desc: string,
        noSound = false,
    ) {
        alt.emitServer(CLOTHING_INTERACTIONS.PURCHASE, uid, index, component, name, desc, noSound);
    }

    /**
     * Purchases all components from a shop.
     *
     * @static
     * @param {Array<ComponentVueInfo>} components
     * @memberof InternalFunctions
     */
    static purchaseAll(components: Array<ComponentVueInfo>) {
        alt.emitServer(CLOTHING_INTERACTIONS.PURCHASE_ALL, components);
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

                let maxTextures = 0;
                let maxDrawables = 0;

                if (component.isProp) {
                    // Get Current Value of Prop Player is Wearing
                    value = native.getPedPropIndex(PedCharacter.get(), id);
                    if (typeof component.startValue === 'undefined') {
                        component.startValue = value;
                    }

                    component.drawables[index] = value;

                    textureValue = native.getPedPropTextureIndex(PedCharacter.get(), id);
                    component.textures[index] = textureValue;

                    maxDrawables =
                        CLOTHING_CONFIG.MAXIMUM_PROP_VALUES[appearance.sex][id] +
                        InternalFunctions.getDlcClothingCount(appearance.sex, id, true);

                    maxTextures = native.getNumberOfPedPropTextureVariations(PedCharacter.get(), id, value);
                } else {
                    // Get Current Value of Component Player is Wearing
                    value = native.getPedDrawableVariation(PedCharacter.get(), id);
                    component.drawables[index] = value;

                    if (typeof component.startValue === 'undefined') {
                        component.startValue = value;
                    }

                    textureValue = native.getPedTextureVariation(PedCharacter.get(), id);
                    component.textures[index] = textureValue;

                    maxDrawables =
                        CLOTHING_CONFIG.MAXIMUM_COMPONENT_VALUES[appearance.sex][id] +
                        InternalFunctions.getDlcClothingCount(appearance.sex, id, false);

                    maxTextures = native.getNumberOfPedTextureVariations(PedCharacter.get(), id, value);
                }

                component.maxDrawables[index] = maxDrawables;
                component.maxTextures[index] = maxTextures;
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
                const id = component.ids[index];
                const drawable = component.drawables[index];
                const texture = component.textures[index];

                if (component.dlcHashes && component.dlcHashes.length >= 1) {
                    let dlc = component.dlcHashes[index];
                    if (typeof dlc === 'string') {
                        dlc = alt.hash(dlc);
                    }

                    if (component.isProp) {
                        if (drawable <= -1) {
                            native.clearPedProp(PedCharacter.get(), id);
                            continue;
                        }

                        alt.setPedDlcProp(PedCharacter.get(), dlc, id, drawable, texture);
                        continue;
                    }

                    alt.setPedDlcClothes(PedCharacter.get(), dlc, id, drawable, texture, 0);
                    continue;
                }

                if (component.isProp) {
                    if (drawable <= -1) {
                        native.clearPedProp(PedCharacter.get(), id);
                        continue;
                    }

                    native.setPedPropIndex(PedCharacter.get(), id, drawable, texture, true);
                } else {
                    native.setPedComponentVariation(PedCharacter.get(), id, drawable, texture, 0);
                }
            }
        }

        if (justSync) {
            return;
        }

        PedEditCamera.update(PedCharacter.get());

        // Only update data if necessary.
        if (!populateData) {
            return;
        }

        InternalFunctions.populate(components);
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InternalFunctions.handleMetaChanged);
alt.onServer(CLOTHING_INTERACTIONS.OPEN, InternalFunctions.open);
