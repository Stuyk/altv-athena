import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';

export type Decorator = { overlay: string; collection: string };
export type HairStyle = { hair: number; dlc?: string | number; color1: number; color2: number; decorator: Decorator };
export type BaseStyle = { style: number; opacity: number; color: number };

/**
 * Set a player's hairstyle.
 *
 * Automatically saves it to Database.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {HairStyle} style
 * @return {void}
 */
export async function setHairStyle(player: alt.Player, style: HairStyle) {
    if (Overrides.setHairStyle) {
        return Overrides.setHairStyle(player, style);
    }

    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.hair = style.hair;
    data.appearance.hairColor1 = style.color1;
    data.appearance.hairColor2 = style.color2;

    if (style.dlc) {
        data.appearance.hairDlc = typeof style.dlc === 'number' ? style.dlc : alt.hash(style.dlc);
    } else {
        player.setClothes(2, style.hair, 0, 0);
        const dlcInfo = player.getDlcClothes(2);
        data.appearance.hair = dlcInfo.drawable;
        data.appearance.hairDlc = dlcInfo.dlc;
    }

    data.appearance.hairOverlay = style.decorator;

    await Athena.document.character.set(player, 'appearance', data.appearance);
}

/**
 * Apply facial hair style to a player.
 *
 * Automatically saves to database.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {FacialHair} style
 * @return {void}
 */
export async function setFacialHair(player: alt.Player, choice: BaseStyle) {
    if (Overrides.setFacialHair) {
        return Overrides.setFacialHair(player, choice);
    }

    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.facialHair = choice.style;
    data.appearance.facialHairColor1 = choice.color;
    data.appearance.facialHairOpacity = choice.opacity;

    await Athena.document.character.set(player, 'appearance', data.appearance);
}

/**
 * Update eyebrow style for a player.
 *
 * Automatically saves to the database.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {BaseStyle} choice
 * @return {void}
 */
export async function setEyebrows(player: alt.Player, choice: BaseStyle) {
    if (Overrides.setEyebrows) {
        return Overrides.setEyebrows(player, choice);
    }

    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.eyebrows = choice.style;
    data.appearance.eyebrowsColor1 = choice.color;
    data.appearance.eyebrowsOpacity = choice.opacity;

    await Athena.document.character.set(player, 'appearance', data.appearance);
}

/**
 * Change the base model of the player to either a masculine base, or feminine base.
 *
 * Automatically saves to database.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {boolean} isFeminine
 * @return {void}
 */
export async function setModel(player: alt.Player, isFeminine: boolean) {
    if (Overrides.setModel) {
        return Overrides.setModel(player, isFeminine);
    }

    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.sex = isFeminine ? 0 : 1;
    await Athena.document.character.set(player, 'appearance', data.appearance);
}

/**
 * Set player appearance to a skin / model / ped.
 *
 * @export
 * @param {alt.Player} player
 * @param {(string | number)} model
 */
export async function setSkin(player: alt.Player, model: string | number) {
    Athena.systems.inventory.clothing.setSkin(player, model);
}

/**
 * Clear player custom model.
 *
 * @export
 * @param {alt.Player} player
 */
export async function clearSkin(player: alt.Player) {
    Athena.systems.inventory.clothing.clearSkin(player);
}

/**
 * Set an eye color on a player.
 *
 * Automatically saves to database.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} color
 * @return {void}
 */
export async function setEyeColor(player: alt.Player, color: number) {
    if (Overrides.setEyeColor) {
        return Overrides.setEyeColor(player, color);
    }

    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.eyes = color;
    await Athena.document.character.set(player, 'appearance', data.appearance);
}

/**
 * Change the player's face
 *
 * @export
 * @param {alt.Player} player
 * @param {{
 *         faceFather: number;
 *         faceMother: number;
 *         skinFather: number;
 *         skinMother: number;
 *         faceMix: number;
 *         skinMix: number;
 *     }} faceData
 * @return {*}
 */
export async function setHeadBlendData(
    player: alt.Player,
    faceData: {
        faceFather: number;
        faceMother: number;
        skinFather: number;
        skinMother: number;
        faceMix: number;
        skinMix: number;
    },
) {
    if (Overrides.setHeadBlendData) {
        return Overrides.setHeadBlendData(player, faceData);
    }

    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance = { ...data.appearance, ...faceData };
    await Athena.document.character.set(player, 'appearance', data.appearance);
}

/**
 * Used to update tattoos, and a hair overlay if present.
 * Add the 'decorators' paramater to override player appearance.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Array<{ overlay: string; collection: string }>} [decorators=undefined]
 */
export function updateTattoos(player: alt.Player, decorators: Array<Decorator> = undefined) {
    if (Overrides.updateTattoos) {
        return Overrides.updateTattoos(player, decorators);
    }

    if (decorators && Array.isArray(decorators)) {
        player.emit(SYSTEM_EVENTS.SET_PLAYER_DECORATIONS, decorators);
        return;
    }

    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    const decoratorsToSync = [];
    if (data.appearance.hairOverlay) {
        decoratorsToSync.push(data.appearance.hairOverlay);
    }

    if (decoratorsToSync.length >= 1) {
        player.emit(SYSTEM_EVENTS.SET_PLAYER_DECORATIONS, decoratorsToSync);
    }
}

interface AppearanceFuncs {
    setHairStyle: typeof setHairStyle;
    setFacialHair: typeof setFacialHair;
    setEyebrows: typeof setEyebrows;
    setModel: typeof setModel;
    setEyeColor: typeof setEyeColor;
    updateTattoos: typeof updateTattoos;
    setHeadBlendData: typeof setHeadBlendData;
}

const Overrides: Partial<AppearanceFuncs> = {};

export function override(functionName: 'setHairStyle', callback: typeof setHairStyle);
export function override(functionName: 'setFacialHair', callback: typeof setFacialHair);
export function override(functionName: 'setHeadBlendData', callback: typeof setHeadBlendData);
export function override(functionName: 'setEyebrows', callback: typeof setEyebrows);
export function override(functionName: 'setModel', callback: typeof setModel);
export function override(functionName: 'setEyeColor', callback: typeof setEyeColor);
export function override(functionName: 'updateTattoos', callback: typeof updateTattoos);
/**
 * Used to override any appearance setter functions.
 *
 *
 * @param {keyof AppearanceFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof AppearanceFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
