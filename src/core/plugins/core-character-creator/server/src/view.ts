import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { CharacterSystem } from '../../../../server/systems/character';
import { Appearance } from '../../../../shared/interfaces/appearance';
import { Character, CharacterDefaults } from '../../../../shared/interfaces/character';
import { CharacterInfo } from '../../../../shared/interfaces/characterInfo';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';
import { CHARACTER_CREATOR_CONFIG } from '../../shared/config';
import { CHARACTER_CREATOR_EVENTS } from '../../shared/events';

const CreatorList: { [key: string]: number } = {};

class InternalFunctions {
    /**
     * Verifies if a name is available during the Character Creation process.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} name
     * @memberof CharacterCreatorView
     */
    static verifyName(player: alt.Player, name: string) {
        const isValidName = CharacterSystem.isNameTaken(name);
        alt.emitClient(player, CHARACTER_CREATOR_EVENTS.VERIFY_NAME, isValidName);
    }

    /**
     * Check if this player has character count available.
     *
     * @static
     * @param {(number | null | undefined)} characterCount
     * @return {*}
     * @memberof InternalFunctions
     */
    static isInvalid(characterCount: number | null | undefined) {
        if (typeof characterCount === 'number') {
            return false;
        }

        if (characterCount === null || characterCount === undefined) {
            return false;
        }

        return true;
    }

    static async done(player: alt.Player, appearance: Appearance, info: CharacterInfo, name: string) {
        if (!info || !appearance || !name) {
            const totalCharacters = CreatorList[player.id] ? CreatorList[player.id] : 0;
            InternalFunctions.show(player, totalCharacters);
            return;
        }

        if (InternalFunctions.isInvalid(CreatorList[player.id])) {
            InternalFunctions.show(player, 0);
            return;
        }

        const newDocument: Character = deepCloneObject<Character>(CharacterDefaults);
        newDocument.account_id = player.accountData._id;
        newDocument.appearance = appearance;
        newDocument.info = info;
        newDocument.name = name;

        const document = await Athena.database.funcs.insertData<Character>(
            newDocument,
            Athena.database.collections.Characters,
            true,
        );

        if (!document) {
            InternalFunctions.show(player, CreatorList[player.id] ? CreatorList[player.id] : 0);
            return;
        }

        document._id = document._id.toString(); // Re-cast id object as string.
        CharacterSystem.select(player, document);
    }

    static show(player: alt.Player, totalCharacters: number) {
        CreatorList[player.id] = totalCharacters;

        player.visible = false;
        Athena.player.set.frozen(player, true);
        Athena.player.safe.setPosition(
            player,
            CHARACTER_CREATOR_CONFIG.CHARACTER_CREATOR_POS.x,
            CHARACTER_CREATOR_CONFIG.CHARACTER_CREATOR_POS.y,
            CHARACTER_CREATOR_CONFIG.CHARACTER_CREATOR_POS.z,
        );

        alt.emitClient(
            player,
            CHARACTER_CREATOR_EVENTS.SHOW,
            CHARACTER_CREATOR_CONFIG.CHARACTER_CREATOR_POS,
            CHARACTER_CREATOR_CONFIG.CHARACTER_CREATOR_ROT,
            null,
            true,
            false,
            totalCharacters,
        ); // _oldCharacterData, _noDiscard, _noName
    }
}

export class CharacterCreatorView {
    static init() {
        // Makes this character creator the primary character creator if it is loaded...
        // This can be overwritten by changing the callback for this function.
        CharacterSystem.setCreatorCallback(InternalFunctions.show);

        alt.onClient(CHARACTER_CREATOR_EVENTS.VERIFY_NAME, InternalFunctions.verifyName);
        alt.onClient(CHARACTER_CREATOR_EVENTS.DONE, InternalFunctions.done);
    }
}
