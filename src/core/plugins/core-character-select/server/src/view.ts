import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { AgendaSystem } from '../../../../server/systems/agenda';
import { CharacterSystem } from '../../../../server/systems/character';
import { Character } from '../../../../shared/interfaces/character';
import { CHARACTER_SELECT_CONFIG } from '../../shared/config';
import { CHARACTER_SELECT_EVENTS } from '../../shared/events';

// Player identifiers and their characters...
const CharacterList: { [id: string]: Array<Character> } = {};

// Recommended as the last step before spawning a player
const AgendaIndex = 99;

class InternalFunctions {
    static init() {
        AgendaSystem.set(AgendaIndex, InternalFunctions.show);
        alt.onClient(CHARACTER_SELECT_EVENTS.SELECT, InternalFunctions.select);
        alt.onClient(CHARACTER_SELECT_EVENTS.NEW, InternalFunctions.newCharacter);
        alt.onClient(CHARACTER_SELECT_EVENTS.DELETE, InternalFunctions.deleteCharacter);
        alt.on('playerDisconnect', InternalFunctions.disconnect);
    }

    /**
     * Remove the player's characters when they disconnect.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} reason
     * @memberof InternalFunctions
     */
    static disconnect(player: alt.Player, reason: string) {
        const id = player.id;
        if (CharacterList[id]) {
            delete CharacterList[id];
        }
    }

    /**
     * Is the player currently pending a character selection...
     *
     * @static
     * @param {alt.Player} player
     * @return {*}  {boolean}
     * @memberof InternalFunctions
     */
    static isPendingSelect(player: alt.Player): boolean {
        return CharacterList[player.id] ? true : false;
    }

    /**
     * Final step before spawning the player fully.
     *
     * @static
     * @param {Player} player
     * @param {string} id
     * @memberof InternalFunctions
     */
    static select(player: Player, id: string): void {
        if (!InternalFunctions.isPendingSelect(player)) {
            return;
        }

        if (!id) {
            return;
        }

        const index = CharacterList[player.id].findIndex((x) => `${x._id}` === `${id}`);
        if (index <= -1) {
            alt.logWarning(`[Athena] Failed to find character. Sending ${player.id} back to character selection.`);
            InternalFunctions.show(player);
            return;
        }

        alt.emitClient(player, CHARACTER_SELECT_EVENTS.DONE);
        CharacterSystem.select(player, CharacterList[player.id][index]);

        if (CharacterList[player.id]) {
            delete CharacterList[player.id];
        }
    }

    /**
     * Called when a player needs to go to character select.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof CharacterSelectView
     */
    static async show(player: alt.Player) {
        const playerCharacters: Array<Character> = await Database.fetchAllByField<Character>(
            'account_id',
            player.accountData._id,
            Athena.database.collections.Characters,
        );

        if (!playerCharacters || playerCharacters.length <= 0) {
            if (CharacterList[player.id]) {
                delete CharacterList[player.id];
            }

            CharacterSystem.invokeCreator(player, 0);
            return;
        }

        // Fixes all character _id to string format.
        for (let i = 0; i < playerCharacters.length; i++) {
            playerCharacters[i]._id = playerCharacters[i]._id.toString();
        }

        if (CHARACTER_SELECT_CONFIG.MAX_CHARACTERS <= 1 && CHARACTER_SELECT_CONFIG.SKIP_SELECTOR) {
            if (CharacterList[player.id]) {
                delete CharacterList[player.id];
            }

            alt.emitClient(player, CHARACTER_SELECT_EVENTS.DONE);
            CharacterSystem.select(player, playerCharacters[0]);
            return;
        }

        // Add to object to fetch characters after selection process.
        CharacterList[player.id] = playerCharacters;

        player.visible = false;
        Athena.player.safe.setPosition(
            player,
            CHARACTER_SELECT_CONFIG.CHARACTER_SELECT_POS.x,
            CHARACTER_SELECT_CONFIG.CHARACTER_SELECT_POS.y,
            CHARACTER_SELECT_CONFIG.CHARACTER_SELECT_POS.z,
        );

        alt.emitClient(player, CHARACTER_SELECT_EVENTS.SHOW, playerCharacters);
    }

    /**
     * Delete a character by an identifier and then update character list.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} id
     * @return {*}
     * @memberof InternalFunctions
     */
    static async deleteCharacter(player: alt.Player, id: string) {
        if (!InternalFunctions.isPendingSelect(player)) {
            return;
        }

        await Database.deleteById(id, Athena.database.collections.Characters);
        InternalFunctions.show(player);
    }

    /**
     * Create a new character which will be automatically chosen upon completion.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof InternalFunctions
     */
    static async newCharacter(player: alt.Player) {
        if (!CharacterList[player.id]) {
            InternalFunctions.show(player);
            return;
        }

        if (CharacterList[player.id] && CharacterList[player.id].length >= CHARACTER_SELECT_CONFIG.MAX_CHARACTERS) {
            InternalFunctions.show(player);
            return;
        }

        alt.emitClient(player, CHARACTER_SELECT_EVENTS.DONE);
        CharacterSystem.invokeCreator(player, CharacterList[player.id].length);
    }
}

export class CharacterSelectView {
    static init() {
        InternalFunctions.init();
    }
}
