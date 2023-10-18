import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { Character } from '@AthenaShared/interfaces/character.js';
import Database from '@stuyk/ezmongodb';
import { CharSelectEvents } from '../shared/events.js';

const PLUGIN_NAME = 'Character Select';
const Characters: { [player_id: string]: Array<Character> } = {};
const CurrentIndex: { [player_id: string]: number } = {};

async function show(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    Athena.player.emit.createSpinner(player, { duration: -1, text: 'Loading Characters', type: 4 });

    const accountData = Athena.document.account.get(player);
    if (typeof accountData === 'undefined') {
        player.kick('No Account Data. Restart client.');
        return;
    }

    const characters = await Athena.getters.player.characters(player);
    if (characters.length <= 0) {
        Athena.systems.character.invokeCreator(player, 0);
        Athena.player.emit.fadeScreenFromBlack(player, 2000);
        Athena.player.emit.clearSpinner(player);
        return;
    }

    for (let i = 0; i < characters.length; i++) {
        characters[i]._id = characters[i]._id.toString();
    }

    Characters[player.id] = characters;
    CurrentIndex[player.id] = 0;
    showCharacter(player, 0);
    Athena.player.emit.clearSpinner(player);
    player.setDateTime(1, 1, 2023, 15, 2, 0);
}

async function showCharacter(player: alt.Player, index: number) {
    if (typeof Characters[player.id] === 'undefined') {
        return;
    }

    if (typeof Characters[player.id][index] === 'undefined') {
        return;
    }

    const pos = new alt.Vector3({ x: -1354.4071044921875, y: -1180.5870361328125, z: 4.421841621398926 });
    player.model = 'mp_m_freemode_01';
    player.spawn(pos);

    Athena.player.sync.appearance(player, Characters[player.id][index]);
    Athena.systems.inventory.clothing.update(player, Characters[player.id][index]);

    player.visible = true;
    player.pos = pos;
    player.rot = new alt.Vector3({ x: 0, y: 0, z: 2.6257832050323486 });
    player.frozen = true;

    Athena.player.emit.fadeScreenFromBlack(player, 2000);
    player.emit(CharSelectEvents.toClient.update, Characters[player.id][index], Characters[player.id].length);
}

async function handleDelete(player: alt.Player) {
    if (typeof Characters[player.id] === 'undefined') {
        return;
    }

    if (typeof CurrentIndex[player.id] === 'undefined') {
        return;
    }

    if (typeof Characters[player.id][CurrentIndex[player.id]] === 'undefined') {
        return;
    }

    if (Characters[player.id].length <= 1) {
        showCharacter(player, 0);
        return;
    }

    const character = Characters[player.id][CurrentIndex[player.id]];
    Athena.player.emit.fadeScreenToBlack(player, 200);
    Athena.player.emit.createSpinner(player, { duration: -1, text: 'Deleting Character', type: 4 });

    await Database.deleteById(String(character._id), Athena.database.collections.Characters);

    Athena.player.emit.fadeScreenFromBlack(player, 200);
    Athena.player.emit.clearSpinner(player);
    Characters[player.id].splice(CurrentIndex[player.id], 1);
    CurrentIndex[player.id] = 0;
    showCharacter(player, 0);
}

function handleSelect(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    if (typeof Characters[player.id] === 'undefined') {
        return;
    }

    if (typeof CurrentIndex[player.id] === 'undefined') {
        return;
    }

    if (typeof Characters[player.id][CurrentIndex[player.id]] === 'undefined') {
        return;
    }

    Athena.player.emit.fadeScreenToBlack(player, 200);
    const character = Characters[player.id][CurrentIndex[player.id]];
    Athena.systems.character.select(player, character);

    player.emit(CharSelectEvents.toClient.done);
    delete Characters[player.id];
    delete CurrentIndex[player.id];
}

function handleNew(player: alt.Player) {
    if (typeof Characters[player.id] === 'undefined') {
        return;
    }

    if (typeof CurrentIndex[player.id] === 'undefined') {
        return;
    }

    if (typeof Characters[player.id][CurrentIndex[player.id]] === 'undefined') {
        return;
    }

    const currentLength = Characters[player.id];

    delete Characters[player.id];
    delete CurrentIndex[player.id];

    player.emit(CharSelectEvents.toClient.done);
    Athena.systems.character.invokeCreator(player, Characters[player.id]);
}

function handleNext(player: alt.Player) {
    if (!Characters[player.id]) {
        return;
    }

    if (CurrentIndex[player.id] + 1 >= Characters[player.id].length) {
        CurrentIndex[player.id] = 0;
    } else {
        CurrentIndex[player.id] += 1;
    }

    showCharacter(player, CurrentIndex[player.id]);
}

function handlePrev(player: alt.Player) {
    if (!Characters[player.id]) {
        return;
    }

    if (CurrentIndex[player.id] - 1 <= -1) {
        CurrentIndex[player.id] = Characters[player.id].length - 1;
    } else {
        CurrentIndex[player.id] -= 1;
    }

    showCharacter(player, CurrentIndex[player.id]);
}

/**
 * Cleans up old data if a player disconnects.
 *
 * @param {alt.Player} player
 */
function handleDisconnect(player: alt.Player) {
    delete Characters[player.id];
    delete CurrentIndex[player.id];
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    Athena.systems.loginFlow.add('character-select', 99, show);
    alt.on('playerDisconnect', handleDisconnect);
    alt.onClient(CharSelectEvents.toServer.next, handleNext);
    alt.onClient(CharSelectEvents.toServer.prev, handlePrev);
    alt.onClient(CharSelectEvents.toServer.select, handleSelect);
    alt.onClient(CharSelectEvents.toServer.delete, handleDelete);
    alt.onClient(CharSelectEvents.toServer.new, handleNew);
});
