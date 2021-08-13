import * as alt from 'alt-server';
import { INTERIOR_SYSTEM, INTERIOR_TYPES } from '../../shared/flags/InteriorFlags';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { InputMenu, InputOptionType, InputResult } from '../../shared/interfaces/InputMenus';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { InteriorSystem } from '../systems/interior';
import { isFlagEnabled } from '../../shared/utility/flags';
import { Vector3 } from '../../shared/interfaces/Vector';
import { Interior } from '../../shared/interfaces/Interior';

ChatController.addCommand('addhouse', '/addhouse', PERMISSIONS.ADMIN, addhouse);

async function addhouse(player: alt.Player) {
    const menu: InputMenu = {
        title: 'Create House (Unchecked. Do it right.)',
        options: [
            {
                id: 'name',
                desc: 'Name of Property',
                placeholder: 'Property Name',
                type: InputOptionType.TEXT,
                error: 'Must specify property name.'
            },
            {
                id: 'price',
                desc: 'Price of Property',
                placeholder: '5000...',
                type: InputOptionType.NUMBER,
                error: 'Must specify property value.'
            },
            {
                id: 'interior',
                desc: 'Position of Property Interior. As JSON String.',
                placeholder: '{ "x": 0, "y": 0, "z": 0 }',
                type: InputOptionType.TEXT,
                error: 'Must specify property position.'
            },
            {
                id: 'ipl',
                desc: 'Optional IPL to load on enter if necessary.',
                placeholder: 'Google it.',
                type: InputOptionType.TEXT
            }
        ],
        serverEvent: 'cmd:Create:House'
    };

    playerFuncs.emit.inputMenu(player, menu);
}

alt.onClient('cmd:Create:House', async (player: alt.Player, results: InputResult[]) => {
    if (!player.accountData) {
        return;
    }

    if (!isFlagEnabled(player.accountData.permissionLevel, PERMISSIONS.ADMIN)) {
        return;
    }

    const [name, price, interior, ipl] = results;

    if (!name || !price || !interior) {
        playerFuncs.emit.message(player, `Please make sure all fields are valid.`);
        return;
    }

    if (!name.value || !price.value || !interior.value) {
        playerFuncs.emit.message(player, `Please make sure all fields are valid.`);
        return;
    }

    let actualPos: Vector3;

    try {
        actualPos = JSON.parse(interior.value);
    } catch (err) {
        playerFuncs.emit.message(player, `Not a valid Vector3 JSON`);
        return;
    }

    if (!actualPos) {
        playerFuncs.emit.message(player, `Not a valid Vector3 JSON`);
        return;
    }

    const houseData: Interior = {
        name: name.value,
        outside: { x: player.pos.x, y: player.pos.y, z: player.pos.z },
        inside: actualPos,
        objects: [],
        price: parseInt(price.value),
        isUnlocked: true,
        system:
            INTERIOR_SYSTEM.HAS_LOCK |
            INTERIOR_SYSTEM.HAS_OWNER |
            INTERIOR_SYSTEM.HAS_PRICE |
            INTERIOR_SYSTEM.HAS_STORAGE,
        type: INTERIOR_TYPES.HOUSE
    };

    if (ipl && ipl.value) {
        houseData.ipl = ipl.value;
    }

    await InteriorSystem.create(houseData);
    playerFuncs.emit.message(player, `Created House.`);
});
