import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';
import { CharacterInfo } from '@AthenaShared/interfaces/characterInfo.js';
import { CHARACTER_CREATOR_CONFIG } from '../../shared/config.js';
import { CHARACTER_CREATOR_EVENTS } from '../../shared/events.js';

const CreatorList: { [key: string]: number } = {};

class InternalFunctions {
    /**
     * Verifies if a name is available during the Character Creation process.
     *
     * @static
     * @param {alt.Player} player An alt:V Player Entity
     * @param {string} name
     *
     */
    static verifyName(player: alt.Player, name: string) {
        const isValidName = Athena.systems.character.isNameTaken(name);
        alt.emitClient(player, CHARACTER_CREATOR_EVENTS.VERIFY_NAME, isValidName);
    }

    /**
     * Check if this player has character count available.
     *
     * @static
     * @param {(number | null | undefined)} characterCount
     * @return {void}
     *
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

        const didCreate = await Athena.systems.character.create(player, appearance, info, name);
        if (didCreate) {
            return;
        }

        InternalFunctions.show(player, CreatorList[player.id] ? CreatorList[player.id] : 0);
    }

    static show(player: alt.Player, totalCharacters: number) {
        CreatorList[player.id] = totalCharacters;

        player.visible = false;
        player.frozen = true;
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
        Athena.systems.character.setCreatorCallback(InternalFunctions.show);

        alt.onClient(CHARACTER_CREATOR_EVENTS.VERIFY_NAME, InternalFunctions.verifyName);
        alt.onClient(CHARACTER_CREATOR_EVENTS.DONE, InternalFunctions.done);
    }
}
