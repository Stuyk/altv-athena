import * as alt from 'alt-client';
import * as native from 'natives';
import { ClothingComponent } from '../../shared/interfaces/clothing';
import { Appearance } from '../../shared/interfaces/appearance';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Item } from '../../shared/interfaces/item';

export class CharacterSystem {
    /**
     * Apply Appearance Data
     * @static
     * @param {number} ped
     * @param {Appearance} appearance
     * @return {*}
     * @memberof CharacterSystem
     */
    static applyAppearance(ped: number, appearance: Appearance) {
        if (!ped || !native.doesEntityExist(ped)) {
            return;
        }

        native.clearPedBloodDamage(ped);
        native.clearPedDecorations(ped);

        native.setPedHeadBlendData(ped, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        native.setPedHeadBlendData(ped, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        native.setPedHeadBlendData(
            ped,
            appearance.faceMother,
            appearance.faceFather,
            0,
            appearance.skinMother,
            appearance.skinFather,
            0,
            parseFloat(appearance.faceMix.toString()),
            parseFloat(appearance.skinMix.toString()),
            0,
            false,
        );

        // Facial Features
        for (let i = 0; i < appearance.structure.length; i++) {
            const value = appearance.structure[i];
            native.setPedFaceFeature(ped, i, value);
        }

        // Overlay Features - NO COLORS
        for (let i = 0; i < appearance.opacityOverlays.length; i++) {
            const overlay = appearance.opacityOverlays[i];
            native.setPedHeadOverlay(ped, overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
        }

        // Hair
        const collection = native.getHashKey(appearance.hairOverlay.collection);
        const overlay = native.getHashKey(appearance.hairOverlay.overlay);
        native.addPedDecorationFromHashes(ped, collection, overlay);
        native.setPedComponentVariation(ped, 2, appearance.hair, 0, 0);
        native.setPedHairColor(ped, appearance.hairColor1, appearance.hairColor2);

        // Facial Hair
        native.setPedHeadOverlay(ped, 1, appearance.facialHair, appearance.facialHairOpacity);
        native.setPedHeadOverlayColor(ped, 1, 1, appearance.facialHairColor1, appearance.facialHairColor1);

        // Chest Hair
        if (appearance.chestHair !== null && appearance.chestHair !== undefined) {
            native.setPedHeadOverlay(ped, 10, appearance.chestHair, appearance.chestHairOpacity);
            native.setPedHeadOverlayColor(ped, 10, 1, appearance.chestHairColor1, appearance.chestHairColor1);
        }

        // Eyebrows
        native.setPedHeadOverlay(ped, 2, appearance.eyebrows, appearance.eyebrowsOpacity);
        native.setPedHeadOverlayColor(ped, 2, 1, appearance.eyebrowsColor1, appearance.eyebrowsColor1);

        // Decor
        for (let i = 0; i < appearance.colorOverlays.length; i++) {
            const overlay = appearance.colorOverlays[i];
            const color2 = overlay.color2 ? overlay.color2 : overlay.color1;
            native.setPedHeadOverlay(ped, overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
            native.setPedHeadOverlayColor(ped, overlay.id, 1, overlay.color1, color2);
        }

        // Eyes
        native.setPedEyeColor(ped, appearance.eyes);
        native.clearAllPedProps(ped);
    }

    /**
     * Should only use this to apply clothing to a custom ped.
     * Do not use it for anything else.
     * @static
     * @param {number} ped
     * @param {Array<ClothingComponent>} components
     * @memberof CharacterSystem
     */
    static applyEquipment(ped: number, components: Array<Item>, isMale = false) {
        if (!ped || !native.doesEntityExist(ped)) {
            return;
        }

        native.clearAllPedProps(ped);

        if (!isMale) {
            native.setPedComponentVariation(ped, 1, 0, 0, 0); // mask
            native.setPedComponentVariation(ped, 3, 15, 0, 0); // arms
            native.setPedComponentVariation(ped, 4, 14, 0, 0); // pants
            native.setPedComponentVariation(ped, 5, 0, 0, 0); // bag
            native.setPedComponentVariation(ped, 6, 35, 0, 0); // shoes
            native.setPedComponentVariation(ped, 7, 0, 0, 0); // accessories
            native.setPedComponentVariation(ped, 8, 15, 0, 0); // undershirt
            native.setPedComponentVariation(ped, 9, 0, 0, 0); // body armour
            native.setPedComponentVariation(ped, 11, 15, 0, 0); // torso
        } else {
            native.setPedComponentVariation(ped, 1, 0, 0, 0); // mask
            native.setPedComponentVariation(ped, 3, 15, 0, 0); // arms
            native.setPedComponentVariation(ped, 5, 0, 0, 0); // bag
            native.setPedComponentVariation(ped, 4, 14, 0, 0); // pants
            native.setPedComponentVariation(ped, 6, 34, 0, 0); // shoes
            native.setPedComponentVariation(ped, 7, 0, 0, 0); // accessories
            native.setPedComponentVariation(ped, 8, 15, 0, 0); // undershirt
            native.setPedComponentVariation(ped, 9, 0, 0, 0); // body armour
            native.setPedComponentVariation(ped, 11, 91, 0, 0); // torso
        }

        if (!components || !Array.isArray(components)) {
            return;
        }

        for (let i = 0; i < components.length; i++) {
            const component = components[i].data as ClothingComponent;
            if (!component) {
                continue;
            }

            for (let index = 0; index < component.drawables.length; index++) {
                const texture = component.textures[index];
                const value = component.drawables[index];
                const id = component.ids[index];

                if (component.isProp) {
                    if (value <= -1) {
                        native.clearPedProp(ped, id);
                        continue;
                    }

                    native.setPedPropIndex(ped, id, value, texture, true);
                } else {
                    native.setPedComponentVariation(ped, id, value, texture, 0);
                }
            }
        }
    }
}

alt.onServer(SYSTEM_EVENTS.SYNC_APPEARANCE, (appearance: Appearance) => {
    CharacterSystem.applyAppearance(alt.Player.local.scriptID, appearance);
});
