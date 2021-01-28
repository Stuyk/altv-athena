import * as alt from 'alt-server';
import { ItemType } from '../../shared/enums/itemType';
import { Item } from '../../shared/interfaces/Item';
import { playerFuncs } from '../extensions/Player';
import { assert, executeTest } from './base';
import logger from '../utility/athenaLogger';

const player: alt.Player = {
    data: {
        inventory: [[], [], [], [], [], []],
        equipment: [],
        toolbar: []
    }
} as alt.Player;

const smgItem: Item = {
    name: `Micro SMG`,
    uuid: `test`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'gun',
    slot: 4,
    quantity: 1,
    weight: 2,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.IS_WEAPON,
    data: {
        test: 'test',
        hash: 0x13532244
    }
};

export default async function runTests() {
    logger.info(`Inventory Tests`);

    await testEmpty();
    await testInventoryInsertion();
    await testRemoveFromInventory();
    await testAddToToolbar();
    await removeItemFromToolbar();
}

async function testEmpty() {
    const testName = `Verify slot and tab are empty`;
    // Slot Open Check
    let result: any = await executeTest<{ tab: number; slot: number }>(
        testName,
        playerFuncs.inventory.getFreeInventorySlot,
        player
    );

    assert(result.tab, 0, `Tab was not equal to zero.`);
    assert(result.slot, 0, `Slot was not equal to zero.`);

    logger.passed(testName);
}

async function testInventoryInsertion() {
    const testName = `Insert Item into Inventory`;
    let result = await executeTest<boolean>(testName, playerFuncs.inventory.inventoryAdd, player, smgItem, 0, 0);

    assert(result, true, `Could not insert item into inventory.`);
    assert(player.data.inventory[0].length, 1, `One item was not inserted into inventory.`);
    assert(player.data.inventory[0][0].data.test, 'test', `Data in item was not maintained in insertion.`);

    logger.passed(testName);
}

async function testRemoveFromInventory() {
    let testName = `Get item from inventory`;
    let result: any = await executeTest<Item>(testName, playerFuncs.inventory.getInventoryItem, player, 0, 0);
    assert(result.uuid, smgItem.uuid, `Ensure result is not null`);
    assert(result.data.test, smgItem.data.test, `Ensure data from result is not null`);

    logger.passed(testName);

    // Split Test

    testName = `Remove item from inventory`;
    result = await executeTest<boolean>(testName, playerFuncs.inventory.inventoryRemove, player, 0, 0);

    assert(result, true, `Was not able to remove that item from the player's inventory.`);
    assert(player.data.inventory[0].length, 0, `Inventory did not splice one item from its array.`);

    logger.passed(testName);
}

async function testAddToToolbar() {
    const testName = `Insert item into Toolbar`;
    let result = await executeTest<boolean>(testName, playerFuncs.inventory.toolbarAdd, player, smgItem, 0);

    assert(result, true, `Could not add the inventory item to the toolbar.`);
    assert(player.data.toolbar.length, 1, `Toolbar does not have a single item inside of it.`);
    assert(player.data.toolbar[0].uuid, smgItem.uuid, `Toolbar item does not have uuid`);
    assert(player.data.toolbar[0].data.test, 'test', `Toolbar item data does not have test parameter inside`);
    logger.passed(testName);
}

async function removeItemFromToolbar() {
    let testName = `Get item from toolbar`;
    const itemClone = await executeTest<Item>(testName, playerFuncs.inventory.getToolbarItem, player, 0);
    assert(itemClone.uuid, smgItem.uuid, `UUID did not match for toolbar item removal.`);
    assert(itemClone.data.test, 'test', `Test data inside item did not match from toolbar removal`);
    logger.passed(testName);

    testName = `Remove item from Toolbar`;
    let result = await executeTest<boolean>(testName, playerFuncs.inventory.toolbarRemove, player, 0);

    assert(result, true, `Could not remove item from toolbar`);
    assert(player.data.toolbar.length, 0, `Toolbar did not splice item from toolbar data.`);
    logger.passed(testName);
}
