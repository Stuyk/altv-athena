import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';
import { MAIN_CHARACTER_CREATOR_EVENTS } from '../shared/events.js';

let lastUsedDimension = 0;

Athena.systems.plugins.registerPlugin('character-creator', () => {
    Athena.systems.character.setCreatorCallback(showCreator);
});

function showCreator(player: alt.Player) {
    if (player.hasMeta('creating-character')) {
        player.kick('Already creating character');
        return;
    }

    lastUsedDimension += 1;
    if (lastUsedDimension >= 5000) {
        lastUsedDimension = 1;
    }

    player.setMeta('creating-character', true);

    player.pos = new alt.Vector3({ x: -1354.4071044921875, y: -1180.5870361328125, z: 4.421841621398926 });
    player.rot = new alt.Vector3({ x: 0, y: 0, z: 0 });
    player.visible = true;
    player.frozen = true;
    player.dimension = lastUsedDimension;

    player.emit(MAIN_CHARACTER_CREATOR_EVENTS.SHOW);
}

function update(player: alt.Player, appearance: Appearance) {
    if (!player.hasMeta('creating-character')) {
        player.kick('Did not request to create character');
        return;
    }

    Athena.player.sync.appearance(player, { appearance });
}

alt.onClient(MAIN_CHARACTER_CREATOR_EVENTS.UPDATE, update);
