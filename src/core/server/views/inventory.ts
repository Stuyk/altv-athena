import * as alt from 'alt-server';
import { sleep } from '../../client/utility/sleep';
import { View_Events_Inventory } from '../../shared/enums/views';
import { Item } from '../../shared/interfaces/Item';

alt.onClient(View_Events_Inventory.Process, handleProcess);

const DataNames: Array<{ abbrv: string; name: string }> = [
    { abbrv: 'i-', name: 'inventory' },
    { abbrv: 'g-', name: 'ground' },
    { abbrv: 't-', name: 'toolbar' },
    { abbrv: 'e-', name: 'equipment' }
];

// Need to process the current slot against the dropped slot.
// If the current slot is the same as drop. Do nothing. *
// If the current slot is in the same category as the drop. Update.
// --- If the current slot is prefixed with 'i' use inventory tab index to determine place to put it.
// --- If the current slot is dropped on a 'tab' it should find a place to put it. Open slot.
// --- If the current slot is prefixed with 'g' the items hould leave the player's inventory.
// --- If the current slot is prefixed with 't' the item should go to the player's hotbar.
// --- If the current slot is prefixed with 'e' the item should 'attempt' to go to the player's equipment.

function handleProcess(player: alt.Player, selectedSlot: string, endSlot: string, pageIndex: number): void {
    if (!player || !player.valid) {
        return;
    }

    if (selectedSlot === endSlot) {
        player.sync().inventory();
        return;
    }

    console.log(selectedSlot);
    console.log(endSlot);

    // The data locations on `player.data` we are using.
    const selectData = DataNames.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));
    const endData = DataNames.find((dataInfo) => endSlot.includes(dataInfo.abbrv));

    console.log(selectData);
    console.log(endData);

    const selectSlotIndex = stripCategory(selectedSlot);
    const endSlotIndex = stripCategory(endSlot);

    console.log(selectSlotIndex);
    console.log(endSlotIndex);

    // Remove From Slots
    const selectItems: Array<Item> = removeFromSlot(
        player,
        selectData.name,
        selectSlotIndex,
        selectData.name === 'inventory' ? pageIndex : null
    );

    console.log(selectItems);

    if (selectItems.length <= 0) {
        player.sync().inventory();
        return;
    }

    const endItems: Array<Item> = removeFromSlot(
        player,
        endData.name,
        endSlotIndex,
        endData.name === 'inventory' ? pageIndex : null
    );

    console.log(endItems);

    const selectItem = selectItems[0];
    const endItem = endItems[0];

    if (endItems.length <= 0) {
        console.log('placing');
        addToSlot(player, selectItem, endData.name, endSlotIndex, endData.name === 'inventory' ? pageIndex : null);
    } else {
        console.log('swapping');
        addToSlot(player, selectItem, endData.name, endSlotIndex, selectData.name === 'inventory' ? pageIndex : null);
        addToSlot(player, endItem, selectData.name, selectSlotIndex, endData.name === 'inventory' ? pageIndex : null);
    }

    if (selectData.name !== endData.name) {
        // Uses different name variables
        player.save().field(selectData.name, player.data[selectData.name]);
        player.save().field(endData.name, player.data[endData.name]);
    } else {
        // Uses same name variable
        player.save().field(endData.name, player.data[endData.name]);
    }
    alt.log(`Should have moved: ${selectedSlot} to ${endSlot}`);
    player.sync().inventory();
}

function addToSlot(
    player: alt.Player,
    existingItem: Item,
    dataName: string,
    slot: number,
    pageIndex: number = null
): boolean {
    if (!player.data[dataName]) {
        alt.log(`${dataName} does not exist for inventory data.`);
        return false;
    }

    console.log(`${dataName}, ${slot}, ${pageIndex}`);

    existingItem.slot = slot;

    if (pageIndex !== null) {
        player.data[dataName][pageIndex].push(existingItem);
        return true;
    }

    player.data[dataName].push(existingItem);
    return true;
}

function removeFromSlot(player: alt.Player, dataName: string, index: number, pageIndex: number = null): Array<Item> {
    if (pageIndex !== null) {
        console.log('reading inventory data');
        const itemIndex = player.data[dataName][pageIndex].findIndex((x: Item) => x.slot === index);
        if (itemIndex <= -1) {
            return [];
        }

        return player.data[dataName][pageIndex].splice(itemIndex, 1);
    }

    const itemIndex = player.data[dataName].findIndex((x: Item) => x.slot === index);
    return player.data[dataName].splice(itemIndex, 1);
}

function stripCategory(value: string): number {
    return parseInt(value.replace(/.-/gm, ''));
}
