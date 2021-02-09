import * as alt from 'alt-server';
import { AnimationFlags } from '../../shared/flags/animation';
import { Item } from '../../shared/interfaces/Item';
import { playerFuncs } from '../extensions/Player';
import { vehicleFuncs } from '../extensions/Vehicle';
import { getForwardVector } from '../utility/vector';

alt.on('effect:Vehicle:Repair', (player: alt.Player, item: Item, slot: number, tab: number) => {
    const closestVehicle = playerFuncs.utility.getVehicleInFrontOf(player, 2);

    if (!closestVehicle) {
        playerFuncs.emit.message(player, `Could not find a vehicle to use this on.`);
        return;
    }

    let passedAllTests = true;

    // In Inventory
    if (tab !== null && tab !== undefined) {
        passedAllTests = playerFuncs.inventory.inventoryRemove(player, slot, tab);
        playerFuncs.sync.inventory(player);
        playerFuncs.save.field(player, 'inventory', player.data.inventory);
    } else {
        // In Toolbar
        const currentItem = playerFuncs.inventory.getToolbarItem(player, item.slot);
        if (!currentItem) {
            playerFuncs.emit.message(player, `Could not find item.`);
            return;
        }

        passedAllTests = playerFuncs.inventory.toolbarRemove(player, currentItem.slot);
        playerFuncs.sync.inventory(player);
        playerFuncs.save.field(player, 'toolbar', player.data.toolbar);
    }

    if (!passedAllTests) {
        return;
    }

    const fwdVector = getForwardVector(closestVehicle.rot);
    const fwdPosition = {
        x: closestVehicle.pos.x + fwdVector.x * 2,
        y: closestVehicle.pos.y + fwdVector.y * 2,
        z: closestVehicle.pos.z
    };

    playerFuncs.emit.moveTo(player, fwdPosition as alt.Vector3);

    alt.setTimeout(() => {
        playerFuncs.emit.animation(
            player,
            'mp_car_bomb',
            'car_bomb_mechanic',
            AnimationFlags.NORMAL | AnimationFlags.REPEAT,
            12000
        );
    }, 2000);

    alt.setTimeout(() => {
        vehicleFuncs.utility.repair(closestVehicle);
    }, 12000);
});
