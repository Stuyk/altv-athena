import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { View_Events_Clothing } from '../../shared/enums/Views';
import { ClothingComponent } from '../../shared/interfaces/Clothing';
import { Item } from '../../shared/interfaces/Item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import PedEditCamera from '../utility/camera';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

const PAGE_NAME = 'Clothing';

class ClothingView implements ViewModel {
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, ClothingView.ready);
        view.on(`${PAGE_NAME}:Close`, ClothingView.close);
        view.on(`${PAGE_NAME}:Update`, ClothingView.update);
        view.on(`${PAGE_NAME}:Purchase`, ClothingView.purchase);
        view.on(`${PAGE_NAME}:Populate`, ClothingView.populate);
        view.on(`${PAGE_NAME}:DisableControls`, ClothingView.controls);
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);

        await PedEditCamera.create(alt.Player.local.scriptID, { x: -0.15, y: 0, z: 0 });
        PedEditCamera.setFov(70);
        PedEditCamera.setZPos(0.6);

        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        PedEditCamera.destroy();

        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, ClothingView.ready);
        view.off(`${PAGE_NAME}:Close`, ClothingView.close);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CLOTHING));
    }

    static handleMetaChanged(key: string, items: Array<Item>, oldValue: any) {
        if (key !== 'equipment') {
            return;
        }

        ClothingView.setEquipment(items);
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

        ClothingView.update(clothingComponents, true);
    }

    static controls(value: boolean) {
        PedEditCamera.disableControls(value);
    }

    static purchase(index: number, component: ClothingComponent, name: string, desc: string) {
        alt.emitServer(View_Events_Clothing.Purchase, index, component, name, desc);
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

    static async update(components: Array<ClothingComponent>, justSync = false) {
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

        if (!justSync) {
            return;
        }

        PedEditCamera.update(alt.Player.local.scriptID);
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, ClothingView.handleMetaChanged);
alt.onServer(View_Events_Clothing.Open, ClothingView.open);
