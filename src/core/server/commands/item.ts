import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Item } from '../../shared/interfaces/Item';
import { Permissions } from '../../shared/flags/permissions';
import { ItemType } from '../../shared/enums/itemType';

const itemRef: Item = {
    name: `Gun`,
    uuid: `some_hash_thing_ground`,
    description: `Forbidden pez dispenser go brrr.`,
    icon: 'gun',
    slot: 0,
    quantity: 1,
    weight: 2,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.IS_WEAPON,
    data: {
        bang: true,
        ammo: 25,
        'gluten-free': true,
        owner: 'some_guy_off_main',
        condition: 50,
        rarity: `A+`
    }
};

ChatController.addCommand('dummyitem', '/dummyitem - Get a dummy item for debug', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player): void {
    const itemClone = { ...itemRef };
    itemClone.slot = 0;
    player.data.inventory[0].push(itemClone);
    player.save().field('inventory', player.data.inventory);
    player.sync().inventory();
}
