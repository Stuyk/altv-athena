import * as alt from 'alt-server';
import { ClothingComponent } from '../../../shared/interfaces/clothing';
import { Item } from '../../../shared/interfaces/item';
import { Injections } from '../injections';

type ClothingComponents = Array<Item<ClothingComponent>>;

export enum PlayerInjectionNames {
    BEFORE_CHARACTER_SELECT = 'before-character-select',
    AFTER_CHARACTER_SELECT = 'after-character-select',
    PLAYER_SAVE_TICK = 'player-save-tick',
    EQUIPMENT_UPDATE_START = 'player-equipment-update-start',
    EQUIPMENT_AFTER_DEFAULTS = 'player-equipment-after-defaults',
    EQUIPMENT_UPDATE_END = 'player-equipment-update-end',
}

type savePlayerTypes =
    //
    `${PlayerInjectionNames.PLAYER_SAVE_TICK}`;

type setEquipmentTypes =
    | `${PlayerInjectionNames.EQUIPMENT_UPDATE_START}`
    | `${PlayerInjectionNames.EQUIPMENT_AFTER_DEFAULTS}`
    | `${PlayerInjectionNames.EQUIPMENT_UPDATE_END}`;

type characterSelectTypes =
    | `${PlayerInjectionNames.BEFORE_CHARACTER_SELECT}`
    | `${PlayerInjectionNames.AFTER_CHARACTER_SELECT}`;

export type EquipmentSyncCallback = (player: alt.Player, items: ClothingComponents, isMale: boolean) => void;
export type PlayerSaveTickCallback = (player: alt.Player) => { [key: string]: any };
export type PlayerCallback = (player: alt.Player) => void;

/**
 * What to append to the save document during each character save tick.
 *
 * @param {savePlayerTypes} type
 * @param {PlayerSaveTickCallback} callback
 */
function saveTick(type: savePlayerTypes, callback: PlayerSaveTickCallback) {
    Injections.add(type, callback);
}

/**
 * Before, During, or after synchronization of equipment; different functions can be applied to the player.
 *
 * @param {setEquipmentTypes} type
 * @param {EquipmentSyncCallback} callback
 */
function updateEquipment(type: setEquipmentTypes, callback: EquipmentSyncCallback) {
    Injections.add(type, callback);
}

function characterSelect(type: characterSelectTypes, callback: PlayerCallback) {
    Injections.add(type, callback);
}

export const PlayerInjections = {
    characterSelect,
    saveTick,
    updateEquipment,
};
