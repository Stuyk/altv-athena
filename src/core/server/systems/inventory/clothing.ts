import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { ClothingComponent, ClothingInfo, StoredItem } from '@AthenaShared/interfaces/item';
import { isNullOrUndefined } from '@AthenaShared/utility/undefinedCheck';
import { Character } from '@AthenaShared/interfaces/character';

const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);

// Do not customize. Use the function 'setDefaults'
let femaleClothes = {
    0: 1, // mask
    3: 15, // torso
    4: 14, // pants
    5: 0, // bag
    6: 35, // shoes
    7: 0, // accessories
    8: 15, // undershirt
    9: 0, // body armour
    11: 15, // top
};

// Do not customize. Use the function 'setDefaults'
let maleClothes = {
    0: 1, // mask
    3: 15, // torso
    5: 0, // pants
    4: 14, // bag
    6: 34, // shoes
    7: 0, // accessories
    8: 15, // undershirt
    9: 0, // body armour
    11: 91, // top
};

/**
 * This TypeScript function sets a uniform for a player in a game.
 *
 * @param player - The player parameter is an instance of the alt.Player class, which represents a
 * player in the game. It is used to identify the player for whom the uniform is being set.
 *
 * @param components - An array of ClothingComponent objects that represent the clothing items to be
 * set as the player's uniform.
 *
 * @returns a Promise that resolves to a boolean value.
 */
export async function setUniform(player: alt.Player, components: Array<ClothingComponent>): Promise<boolean> {
    if (Overrides.setUniform) {
        return await Overrides.setUniform(player, components);
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    await Athena.document.character.set(player, 'uniform', components);
    Athena.player.events.trigger('player-uniform-set', player);
    return true;
}

/**
 * This function clears a player's uniform and triggers an event.
 *
 * @param player - The "player" parameter is an instance of the alt.Player class, which represents a
 * player in the game. It is used to identify which player's uniform should be cleared.
 *
 * @returns a Promise that resolves to void (i.e., nothing).
 */
export async function clearUniform(player: alt.Player): Promise<void> {
    if (Overrides.clearUniform) {
        return await Overrides.clearUniform(player);
    }

    await Athena.document.character.set(player, 'uniform', undefined);
    Athena.player.events.trigger('player-uniform-cleared', player);
}

/**
 * Set a custom model on a player.
 *
 * If a custom model is set; no appearance or clothing updates will be called.
 *
 * Uniforms are also ignored if a skin is set.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(string | number)} model
 * @return {void}
 */
export async function setSkin(player: alt.Player, model: string | number) {
    if (Overrides.setSkin) {
        return await Overrides.setSkin(player, model);
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    await Athena.document.character.set(player, 'skin', typeof model === 'string' ? alt.hash(model) : model);
    Athena.player.events.trigger('player-skin-set', player);
    return true;
}

/**
 * Clears a custom model on a player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export async function clearSkin(player: alt.Player) {
    if (Overrides.clearSkin) {
        return await Overrides.clearSkin(player);
    }

    await Athena.document.character.set(player, 'skin', undefined);
    Athena.player.events.trigger('player-skin-cleared', player);
}

/**
 * Create a clothing item from DLC components.
 *
 * If you know the relative ids for dlc clothing; this is how you generate the item or an outfit from it.
 *
 * @param {(0 | 1)} sex
 * @param {Array<ClothingComponent>} componentList
 * @return {StoredItem<ClothingInfo>}
 */
export function outfitFromDlc(sex: 0 | 1, componentList: Array<ClothingComponent>): StoredItem<ClothingInfo> {
    if (Overrides.outfitFromDlc) {
        return Overrides.outfitFromDlc(sex, componentList);
    }

    const storableItem: StoredItem<ClothingInfo> = {
        dbName: 'clothing',
        quantity: 1,
        slot: -1,
        isEquipped: false,
        data: {
            sex,
            components: componentList,
        },
    };

    return storableItem;
}

/**
 * Create a clothing item from the current clothes applies to a player.
 *
 * Specify which ids you want to include in the outfit; and mark whichever as props.
 *
 * You should apply 'absolute' values to the player before running this function.
 *
 * Use the normal player.setClothes functions, and then call this function to generate an outfit from it.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Array<{ id: number; isProp?: boolean }>} components
 * @return {(StoredItem | undefined)}
 */
export function outfitFromPlayer(
    player: alt.Player,
    components: Array<{ id: number; isProp?: boolean }>,
    setEquipToTrue = false,
): StoredItem | undefined {
    if (Overrides.outfitFromPlayer) {
        return Overrides.outfitFromPlayer(player, components, setEquipToTrue);
    }

    if (!player || !player.valid) {
        return undefined;
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined' || typeof data.appearance === 'undefined') {
        return undefined;
    }

    const componentList: Array<ClothingComponent> = [];
    for (let i = 0; i < components.length; i++) {
        componentList.push({
            id: components[i].id,
            ...(components[i].isProp ? player.getDlcProp(components[i].id) : player.getDlcClothes(components[i].id)),
            isProp: components[i].isProp ? true : false,
        });
    }

    const storableItem: StoredItem<ClothingInfo> = {
        dbName: 'clothing',
        quantity: 1,
        slot: -1,
        isEquipped: setEquipToTrue,
        data: {
            sex: data.appearance.sex,
            components: componentList,
        },
    };

    return storableItem;
}

/**
 * This function updates a player's appearance and clothing based on their character data.
 *
 * @param player - An object representing a player in the game.
 * @param {Character} document - The `document` parameter is an optional parameter of type `Character`.
 * If it is not provided, the function will retrieve the character data for the player from the
 * `Athena.document.character` object. If it is provided, the function will use the provided
 * `Character` object instead.
 *
 * @returns The function does not always return a value. It may return the result of the
 * `Overrides.update` function if it exists and is called, but otherwise it may not return anything.
 */
export function update(player: alt.Player, document: Character = undefined) {
    if (Overrides.update) {
        return Overrides.update(player);
    }

    if (!player || !player.valid) {
        return;
    }

    let data: Character;
    if (typeof document === 'undefined') {
        data = Athena.document.character.get(player);
    } else {
        data = document;
    }

    if (typeof data === 'undefined') {
        return;
    }

    const propComponents = [0, 1, 2, 6, 7];
    for (let i = 0; i < propComponents.length; i++) {
        player.clearProp(propComponents[i]);
    }

    if (isNullOrUndefined(data.skin)) {
        const useModel = data.appearance.sex === 1 ? mModel : fModel;
        if (player.model !== useModel) {
            player.model = useModel;
        }
    } else {
        const customModel = typeof data.skin !== 'number' ? alt.hash(data.skin) : data.skin;
        if (player.model === customModel) {
            return;
        }

        player.model = customModel;
        return;
    }

    const dataSet = data.appearance.sex === 0 ? femaleClothes : maleClothes;
    Object.keys(dataSet).forEach((key) => {
        player.setDlcClothes(0, parseInt(key), parseInt(dataSet[key]), 0, 0);
    });

    if (typeof data.inventory === 'undefined') {
        data.inventory = [];
    }

    const inventoryBySlot = data.inventory.sort((a, b) => {
        return a.slot - b.slot;
    });

    for (let i = 0; i < inventoryBySlot.length; i++) {
        const item = inventoryBySlot[i] as StoredItem<{ components: Array<ClothingComponent> }>;
        if (typeof item === 'undefined' || typeof item.data === 'undefined') {
            continue;
        }

        if (!item.isEquipped) {
            continue;
        }

        if (!Object.hasOwn(item.data, 'components')) {
            continue;
        }

        // We look at the equipped item data sets; and find compatible clothing information in the 'data' field.
        // Check if the data property is the correct format for the item.
        for (let component of item.data.components) {
            if (component.isProp) {
                player.setDlcProp(component.dlc, component.id, component.drawable, component.texture);
            } else {
                const palette = typeof component.palette === 'number' ? component.palette : 0;
                player.setDlcClothes(component.dlc, component.id, component.drawable, component.texture, palette);
            }
        }
    }

    if (typeof data.uniform === 'undefined') {
        return;
    }

    for (let i = 0; i < data.uniform.length; i++) {
        const component = data.uniform[i];

        // We look at the equipped item data sets; and find compatible clothing information in the 'data' field.
        // Check if the data property is the correct format for the item.
        if (component.isProp) {
            player.setDlcProp(component.dlc, component.id, component.drawable, component.texture);
        } else {
            const palette = typeof component.palette === 'number' ? component.palette : 0;
            player.setDlcClothes(component.dlc, component.id, component.drawable, component.texture, palette);
        }
    }
}

/**
 * Used to change default clothing for either male or female.
 *
 * #### Example
 * ```ts
 * Athena.systems.inventory.clothing.setDefaults('female', {
 *     0: 1, // mask
 *     3: 15, // torso
 *     4: 14, // pants
 *     5: 0, // bag
 *     6: 35, // shoes
 *     7: 0, // accessories
 *     8: 15, // undershirt
 *     9: 0, // body armour
 *     11: 15, // top
 * });
 * ```
 *
 *
 * @param {('male' | 'female')} type
 * @param {(typeof maleClothes | typeof femaleClothes)} clothes
 */
export function setDefaults(sex: 0 | 1, clothes: typeof maleClothes | typeof femaleClothes) {
    if (Overrides.setDefaults) {
        return Overrides.setDefaults(sex, clothes);
    }

    if (sex === 0) {
        femaleClothes = clothes;
    }

    if (sex === 1) {
        maleClothes = clothes;
    }
}

interface ClothingFuncs {
    setUniform: typeof setUniform;
    clearUniform: typeof clearUniform;
    setSkin: typeof setSkin;
    clearSkin: typeof clearSkin;
    outfitFromDlc: typeof outfitFromDlc;
    outfitFromPlayer: typeof outfitFromPlayer;
    setDefaults: typeof setDefaults;
    update: typeof update;
}

const Overrides: Partial<ClothingFuncs> = {};

export function override(functionName: 'clearSkin', callback: typeof clearSkin);
export function override(functionName: 'clearUniform', callback: typeof clearUniform);
export function override(functionName: 'outfitFromDlc', callback: typeof outfitFromDlc);
export function override(functionName: 'outfitFromPlayer', callback: typeof outfitFromPlayer);
export function override(functionName: 'setDefaults', callback: typeof setDefaults);
export function override(functionName: 'setSkin', callback: typeof setSkin);
export function override(functionName: 'setUniform', callback: typeof setUniform);
export function override(functionName: 'update', callback: typeof update);
/**
 * Used to override inventory clothing functionality
 *
 *
 * @param {keyof ClothingFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof ClothingFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
