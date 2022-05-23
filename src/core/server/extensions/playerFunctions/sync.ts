import * as alt from 'alt-server';
import { CurrencyTypes } from '../../../shared/enums/currency';
import { World } from '../../systems/world';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import emit from './emit';
import save from './save';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { Item } from '../../../shared/interfaces/item';
import { Appearance } from '../../../shared/interfaces/appearance';
import { ClothingComponent } from '../../../shared/interfaces/clothing';

/**
 * Synchronize currency data like bank, cash, etc.
 * @memberof SyncPrototype
 */
function currencyData(player: alt.Player): void {
    const keys: (keyof typeof CurrencyTypes)[] = <(keyof typeof CurrencyTypes)[]>Object.keys(CurrencyTypes);
    for (const key of keys) {
        const currencyName: string = CurrencyTypes[key];
        emit.meta(player, currencyName, player.data[currencyName]);
    }
}

function inventory(player: alt.Player): void {
    if (!player.data.inventory) {
        player.data.inventory = [];
    }

    if (!player.data.toolbar) {
        player.data.toolbar = [];
    }

    if (!player.data.equipment) {
        player.data.equipment = [];
    }

    equipment(player, player.data.equipment as Item[], player.data.appearance.sex === 1);

    emit.meta(player, 'inventory', player.data.inventory);
    emit.meta(player, 'equipment', player.data.equipment);
    emit.meta(player, 'toolbar', player.data.toolbar);
}

function appearance(player: alt.Player, appearance: Partial<Appearance>) {
    if (appearance.sex === 0) {
        player.model = 'mp_f_freemode_01';
    } else {
        player.model = 'mp_m_freemode_01';
    }

    // Set Face
    player.clearBloodDamage();
    player.setHeadBlendData(
        appearance.faceMother,
        appearance.faceFather,
        0,
        appearance.skinMother,
        appearance.skinFather,
        0,
        parseFloat(appearance.faceMix.toString()),
        parseFloat(appearance.skinMix.toString()),
        0,
    );

    // Facial Features
    for (let i = 0; i < appearance.structure.length; i++) {
        const value = appearance.structure[i];
        player.setFaceFeature(i, value);
    }

    // Overlay Features - NO COLORS
    for (let i = 0; i < appearance.opacityOverlays.length; i++) {
        const overlay = appearance.opacityOverlays[i];
        player.setHeadOverlay(overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
    }

    // Hair - Tattoo
    alt.emitClient(player, SYSTEM_EVENTS.SET_PLAYER_DECORATIONS, [appearance.hairOverlay]);

    // Hair
    player.setClothes(2, appearance.hair, 0, 0);
    player.setHairColor(appearance.hairColor1);
    player.setHairHighlightColor(appearance.hairColor2);

    // Facial Hair
    player.setHeadOverlay(1, appearance.facialHair, appearance.facialHairOpacity);
    player.setHeadOverlayColor(1, 1, appearance.facialHairColor1, appearance.facialHairColor1);

    // Chest Hair
    if (appearance.chestHair !== null && appearance.chestHair !== undefined) {
        player.setHeadOverlay(10, appearance.chestHair, appearance.chestHairOpacity);
        player.setHeadOverlayColor(10, 1, appearance.chestHairColor1, appearance.chestHairColor1);
    }

    // Eyebrows
    player.setHeadOverlay(2, appearance.eyebrows, appearance.eyebrowsOpacity);
    player.setHeadOverlayColor(2, 1, appearance.eyebrowsColor1, appearance.eyebrowsColor1);

    // Decor
    for (let i = 0; i < appearance.colorOverlays.length; i++) {
        const overlay = appearance.colorOverlays[i];
        const color2 = overlay.color2 ? overlay.color2 : overlay.color1;

        player.setHeadOverlay(overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
        player.setHeadOverlayColor(overlay.id, 1, overlay.color1, color2);
    }

    // Eyes
    player.setEyeColor(appearance.eyes);
}

function equipment(player: alt.Player, items: Array<Item<ClothingComponent>>, isMale = false) {
    const clothingComponents = new Array(11).fill(null);
    const propComponents = [0, 1, 2, 6, 7];

    for (let i = 0; i < propComponents.length; i++) {
        player.clearProp(propComponents[i]);
    }

    if (!isMale) {
        player.setClothes(1, 0, 0, 0); // mask
        player.setClothes(3, 0, 0, 0); // torso / arms
        player.setClothes(4, 14, 0, 0); // pants
        player.setClothes(5, 0, 0, 0); // bag
        player.setClothes(6, 35, 0, 0); // shoes
        player.setClothes(7, 0, 0, 0); // accessories
        player.setClothes(8, 15, 0, 0); // undershirt
        player.setClothes(9, 0, 0, 0); // body armour
        player.setClothes(11, 0, 0, 0); // tops
    } else {
        player.setClothes(1, 0, 0, 0); // mask
        player.setClothes(3, 15, 0, 0); // torso / arms
        player.setClothes(5, 0, 0, 0); // bag
        player.setClothes(4, 14, 0, 0); // pants
        player.setClothes(6, 34, 0, 0); // shoes
        player.setClothes(7, 0, 0, 0); // accessories
        player.setClothes(8, 15, 0, 0); // undershirt
        player.setClothes(9, 0, 0, 0); // body armour
        player.setClothes(11, 91, 0, 0); // tops
    }

    if (items && Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
            clothingComponents[items[i].slot] = items[i].data;
        }
    }

    for (let i = 0; i < clothingComponents.length; i++) {
        const component = clothingComponents[i] as ClothingComponent;
        if (!component) {
            continue;
        }

        for (let index = 0; index < component.drawables.length; index++) {
            const texture = component.textures[index];
            const value = component.drawables[index];
            const id = component.ids[index];

            if (component.dlcHashes && component.dlcHashes.length >= 1) {
                const dlc = component.dlcHashes[index];
                if (component.isProp) {
                    player.setDlcProp(dlc, id, value, texture);
                    continue;
                }

                player.setDlcClothes(dlc, id, value, texture, 0);
                continue;
            }

            if (component.isProp) {
                player.setProp(id, value, texture);
                continue;
            }

            player.setClothes(id, value, texture, 0);
        }
    }
}

/**
 * Synchronizes a single equipment item.
 *
 * @param {alt.Player} player
 * @param {ClothingComponent} component
 */
function singleEquipment(player: alt.Player, component: ClothingComponent) {
    for (let index = 0; index < component.drawables.length; index++) {
        const texture = component.textures[index];
        const value = component.drawables[index];
        const id = component.ids[index];

        if (component.dlcHashes && component.dlcHashes.length >= 1) {
            const dlc = component.dlcHashes[index];
            if (component.isProp) {
                player.setDlcProp(dlc, id, value, texture);
                continue;
            }

            player.setDlcClothes(dlc, id, value, texture, 0);
            continue;
        }

        if (component.isProp) {
            player.setProp(id, value, texture);
            continue;
        }

        player.setClothes(id, value, texture, 0);
    }
}

/**
 * Updates synced meta for the current player.
 * Basically updates data that may not be fully accessible everywhere.
 * @memberof SyncPrototype
 */
function syncedMeta(player: alt.Player): void {
    player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
    player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
    player.setSyncedMeta(PLAYER_SYNCED_META.WANTED_LEVEL, player.wanted);
}

/**
 * Update the player's time to match server time.
 * @memberof SyncPrototype
 */
function time(player: alt.Player): void {
    alt.emitClient(player, SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.getWorldHour(), World.getWorldMinute());
}

/**
 * Update the player's weather to match server weather based on grid space.
 * @memberof SyncPrototype
 */
function weather(player: alt.Player): void {
    player.gridSpace = World.getGridSpace(player);
    player.currentWeather = World.getWeatherByGrid(player.gridSpace);

    emit.meta(player, 'gridSpace', player.gridSpace);
    alt.emitClient(player, SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, player.currentWeather);
}

function playTime(player: alt.Player): void {
    if (!player.data.hours) {
        player.data.hours = 0;
    }

    player.data.hours += 0.0166666666666667;
    save.field(player, 'hours', player.data.hours);
}

function override(functionName: string, callback: (player: alt.Player, ...args: any[]) => void) {
    exports[functionName] = callback;
}

const exports = {
    appearance,
    currencyData,
    equipment,
    singleEquipment,
    inventory,
    playTime,
    override,
    syncedMeta,
    time,
    weather,
};

export default exports;
