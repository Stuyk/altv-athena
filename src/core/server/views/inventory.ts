import * as alt from 'alt-server';
import { sleep } from '../../client/utility/sleep';
import { View_Events_Inventory } from '../../shared/enums/views';
import { Item } from '../../shared/interfaces/Item';

alt.onClient(View_Events_Inventory.Process, handleProcess);

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

    console.log(`-- Debug`);
    console.log(selectedSlot);
    console.log(endSlot);
    console.log(pageIndex);
}

//     if (selectedSlot === endSlot) {
//         player.sync().inventory();
//         return;
//     }

//     // Handle ground drops first here.

//     const selectedItem = getItem(player, selectedSlot, pageIndex);
//     const endItem = getItem(player, endSlot, pageIndex);

//     console.log(selectedItem);
//     console.log(endItem);

//     if (!selectedItem || !endItem) {
//         player.sync().inventory();
//         return;
//     }

//     if (!selectedItem.item) {
//         player.sync().inventory();
//         return;
//     }

//     // Handle Same Category Moves
//     if (selectedItem.dataName === endItem.dataName) {
//         // Update 'i-' against a null item.
//         if (selectedItem.usesPageIndex && !endItem.item) {
//             p
//             player.data[selectedItem.dataName][pageIndex][selectedItem.index].slot = endItem.index;
//         } else {
//             player.data[selectedItem.dataName][selectedItem.index].slot = endItem.index;
//         }

//         player.save().field(selectedItem.dataName, player.data[selectedItem.dataName]);
//         player.sync().inventory();

//         console.log(player.data.inventory);
//         return;
//     }

//     console.log(selectedSlot);
//     console.log(endSlot);
// }

// /**
//  * Fetches item information, index, and what data slot it belongs to.
//  * @param {alt.Player} player
//  * @param {string} value
//  * @param {number} pageIndex
//  * @return {*}  {({ dataName: string; index: number; item: Partial<Item> | null })}
//  */
// function getItem(
//     player: alt.Player,
//     value: string,
//     pageIndex: number
// ): { dataName: string; index: number; item: Partial<Item> | null; usesPageIndex: boolean } {
//     const slot = stripCategory(value);

//     if (value.includes('i-')) {
//         const index = player.data.inventory[pageIndex].findIndex((item) => item.slot === slot);
//         if (index <= -1) {
//             return { dataName: 'inventory', index: slot, item: null, usesPageIndex: true };
//         }

//         return {
//             dataName: 'inventory',
//             index: slot,
//             item: player.data.inventory[pageIndex][slot],
//             usesPageIndex: true
//         };
//     }

//     if (value.includes('e-')) {
//         const item = player.data.equipment[slot];
//         if (!item) {
//             return { dataName: 'equipment', index: slot, item: null, usesPageIndex: false };
//         }

//         return { dataName: 'equipment', index: slot, item, usesPageIndex: false };
//     }

//     if (value.includes('t-')) {
//         const item = player.data.equipment[slot];
//         if (!item) {
//             return { dataName: 'toolbar', index: slot, item: null, usesPageIndex: false };
//         }

//         return { dataName: 'toolbar', index: slot, item, usesPageIndex: false };
//     }

//     return null;
// }

// function stripCategory(value: string): number {
//     return parseInt(value.replace(/.-/gm, ''));
// }
