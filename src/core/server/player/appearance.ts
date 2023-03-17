import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Appearance } from '@AthenaShared/interfaces/appearance';

export type Decorator = { overlay: string; collection: string };
export type HairStyle = { hair: number; dlc?: string | number; color1: number; color2: number; decorator: Decorator };
export type BaseStyle = { style: number; opacity: number; color: number };

/**
 * Set a player's hairstyle.
 *
 * Automatically saves it to Database.
 *
 * @export
 * @param {alt.Player} player
 * @param {HairStyle} style
 * @return {*}
 */
export async function setHairStyle(player: alt.Player, style: HairStyle) {
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
    Athena.player.sync.appearance(player, data.appearance as Appearance);
    Athena.systems.inventory.clothing.update(player);
}

/**
 * Apply facial hair style to a player.
 *
 * Automatically saves to database.
 *
 * @export
 * @param {alt.Player} player
 * @param {FacialHair} style
 * @return {*}
 */
export async function setFacialHair(player: alt.Player, choice: BaseStyle) {
    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.facialHair = choice.style;
    data.appearance.facialHairColor1 = choice.color;
    data.appearance.facialHairOpacity = choice.opacity;

    await Athena.document.character.set(player, 'appearance', data.appearance);
    Athena.player.sync.appearance(player, data.appearance as Appearance);
    Athena.systems.inventory.clothing.update(player);
}

/**
 * Update eyebrow style for a player.
 *
 * Automatically saves to the database.
 *
 * @export
 * @param {alt.Player} player
 * @param {BaseStyle} choice
 * @return {*}
 */
export async function setEyebrows(player: alt.Player, choice: BaseStyle) {
    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.eyebrows = choice.style;
    data.appearance.eyebrowsColor1 = choice.color;
    data.appearance.eyebrowsOpacity = choice.opacity;

    await Athena.document.character.set(player, 'appearance', data.appearance);
    Athena.player.sync.appearance(player, data.appearance as Appearance);
    Athena.systems.inventory.clothing.update(player);
}

/**
 * Change the base model of the player to either a masculine base, or feminine base.
 *
 * Automatically saves to database.
 *
 * @export
 * @param {alt.Player} player
 * @param {boolean} isFeminine
 * @return {*}
 */
export async function setModel(player: alt.Player, isFeminine: boolean) {
    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.sex = isFeminine ? 0 : 1;
    await Athena.document.character.set(player, 'appearance', data.appearance);
    Athena.player.sync.appearance(player, data.appearance as Appearance);
    Athena.systems.inventory.clothing.update(player);
}

/**
 * Set an eye color on a player.
 *
 * Automatically saves to database.
 *
 * @export
 * @param {alt.Player} player
 * @param {number} color
 * @return {*}
 */
export async function setEyeColor(player: alt.Player, color: number) {
    const data = Athena.document.character.get(player);
    if (!data || !data.appearance) {
        return;
    }

    data.appearance.eyes = color;
    await Athena.document.character.set(player, 'appearance', data.appearance);
    Athena.player.sync.appearance(player, data.appearance as Appearance);
    Athena.systems.inventory.clothing.update(player);
}

/**
 * Used to update tattoos, and a hair overlay if present.
 * Add the 'decorators' paramater to override player appearance.
 *
 * @export
 * @param {alt.Player} player
 * @param {Array<{ overlay: string; collection: string }>} [decorators=undefined]
 */
export function updateTattoos(player: alt.Player, decorators: Array<Decorator> = undefined) {
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
