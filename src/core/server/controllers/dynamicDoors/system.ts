import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import Database from '@stuyk/ezmongodb';
import { DoorInfo, DynamicDoor, dDynamicDoor } from './interfaces.js';

let areDoorsLoading = false;

/**
 * Builds a dynamic door entrance or exist based on specifications.
 * @param {string} uid - A unique identifier for the door being built.
 * @param {DoorInfo} door - The `door` parameter is an object that contains information about a door
 * @param [isEnter=false] - The isEnter parameter is a boolean value that determines whether the door
 * is an entrance or an exit.
 */
function build(uid: string, startDoor: DoorInfo, endDoor: DoorInfo, isEnter = false) {
    const actualIdentifier = uid + (isEnter ? '-enter' : '-leave');
    const bottomPos = new alt.Vector3(startDoor.pos).sub(0, 0, 1);
    const topPos = new alt.Vector3(startDoor.pos).add(0, 0, 1);

    Athena.controllers.interaction.append({
        uid: actualIdentifier,
        position: bottomPos,
        dimension: startDoor.dimension,
        callback(player: alt.Player) {
            goto(player, endDoor);
        },
    });

    let enterText = `UID: ${uid}`;
    if (startDoor.text) {
        enterText = `${startDoor.text}` + `~n~` + `~n~` + enterText;
    }

    Athena.controllers.textLabel.append({
        uid: actualIdentifier,
        pos: topPos,
        text: enterText,
        dimension: startDoor.dimension,
    });

    if (startDoor.marker) {
        startDoor.marker.pos = new alt.Vector3(startDoor.marker.pos);
        startDoor.marker.dimension = startDoor.dimension;
        startDoor.marker.uid = actualIdentifier;
        Athena.controllers.marker.append(startDoor.marker);
    }
}

/**
 * Remove a Dynamic Door, but do not remove from the database.
 *
 * @export
 * @param {string} uid
 */
export function cleanup(uid: string) {
    const leaveUid = uid + '-leave';
    const enterUid = uid + '-enter';

    Athena.controllers.interaction.remove(leaveUid);
    Athena.controllers.interaction.remove(enterUid);

    Athena.controllers.marker.remove(leaveUid);
    Athena.controllers.marker.remove(enterUid);

    Athena.controllers.textLabel.remove(leaveUid);
    Athena.controllers.textLabel.remove(enterUid);
}

/**
 * Generates a dynamic door based on its properties and builds it in both directions.
 * @param {dDynamicDoor} door
 */
export function generate(door: dDynamicDoor) {
    door._id = String(door._id);

    if (typeof door.enter.dimension === 'undefined') {
        door.enter.dimension = 0;
    }

    if (typeof door.leave.dimension === 'undefined') {
        door.leave.dimension = 0;
    }

    build(door.uid, door.enter, door.leave, true);
    build(door.uid, door.leave, door.enter, false);
}

/**
 * Load into a door, if the door IPL fails to load, the player will not move.
 *
 * The door is the place you are going to.
 *
 * @export
 * @param {alt.Player} player
 * @param {DoorInfo} door
 */
export async function goto(player: alt.Player, door: DoorInfo) {
    if (!Athena.controllers.dynamicDoors.cooldowns.isCooldownDone(player)) {
        const expTime = Athena.controllers.dynamicDoors.cooldowns.getExpiration(player);
        Athena.player.emit.notification(player, `${Math.floor((expTime - Date.now()) / 1000)}s`);
        return;
    }

    if (player.vehicle && !door.allowVehicles) {
        return;
    }

    if (player.vehicle && door.allowVehicles) {
        if (player.vehicle.driver && player.vehicle.driver.id !== player.id) {
            return;
        }
    }

    if (door.beforeEnter) {
        const result = await door.beforeEnter(player, door);
        if (!result) {
            return;
        }
    }

    if (Athena.controllers.dynamicDoors.player.isLoading(player)) {
        return;
    }

    Athena.controllers.dynamicDoors.cooldowns.updateCooldown(player);
    Athena.controllers.dynamicDoors.player.register(player);
    Athena.player.emit.createSpinner(player, { text: 'Loading Door', duration: 5000, type: 4 });
    Athena.player.emit.fadeScreenToBlack(player, 250);

    // Handle IPLs
    if (door.ipl) {
        const didLoad = await Athena.controllers.dynamicDoors.utility.handleIpl(player, door.ipl, false);
        if (!didLoad) {
            await alt.Utils.wait(250);
            Athena.player.emit.fadeScreenFromBlack(player, 250);
            Athena.player.emit.clearSpinner(player);
            Athena.controllers.dynamicDoors.player.unregister(player);
            return;
        }
    }

    if (door.iplUnload) {
        Athena.controllers.dynamicDoors.utility.handleIpl(player, door.ipl, true);
    }

    // Handle YTYPs
    if (door.ytyp) {
        await Athena.controllers.dynamicDoors.utility.handleYtyp(player, door.ytyp, false);
    }

    if (door.ytypUnload) {
        await Athena.controllers.dynamicDoors.utility.handleYtyp(player, door.ytypUnload, true);
    }

    // Handle Vehicle
    if (player.vehicle) {
        const vehicle = player.vehicle;
        vehicle.dimension = door.dimension;
        vehicle.pos = new alt.Vector3(door.pos);
        Athena.document.vehicle.setBulk(vehicle, { pos: vehicle.pos, dimension: door.dimension });
        const passengers = Athena.getters.vehicle.passengers(player.vehicle);

        alt.nextTick(() => {
            for (let i = 0; i < passengers.length; i++) {
                const passenger = passengers[i];
                passenger.dimension = door.dimension;
                passenger.setIntoVehicle(vehicle, i + 1);
                Athena.document.character.setBulk(passenger, { pos: vehicle.pos, dimension: door.dimension });
            }
        });
    } else {
        player.pos = new alt.Vector3(door.pos);
        player.dimension = door.dimension;
        Athena.document.character.setBulk(player, { pos: door.pos, dimension: door.dimension });
    }

    await alt.Utils.wait(250);
    Athena.player.emit.fadeScreenFromBlack(player, 250);
    Athena.player.emit.clearSpinner(player);

    // Do something when the door is fully entered...
    if (door.afterEnter) {
        door.afterEnter(player, door);
    }

    Athena.controllers.dynamicDoors.player.unregister(player);
}

/**
 * Create a dynamic door and adds it to the database
 *
 * Ignores already pre-created doors.
 *
 * @export
 * @param {DynamicDoor} door
 * @return {Promise<void>}
 */
export async function create(door: DynamicDoor): Promise<void> {
    await alt.Utils.waitFor(() => areDoorsLoading === false, 60000);
    const existingDoor = await Database.fetchData<dDynamicDoor>(
        'uid',
        door.uid,
        Athena.database.collections.DynamicDoors,
    );

    if (existingDoor) {
        return;
    }

    const newDoor = await Database.insertData(door as dDynamicDoor, Athena.database.collections.DynamicDoors, true);
    newDoor._id = String(newDoor._id);
    generate(newDoor);
}

/**
 * Delete a Dynamic Door from the Database & in-game
 *
 * @export
 * @param {string} uid
 */
export async function deleteDoor(uid: string) {
    const existingDoor = await Database.fetchData<dDynamicDoor>('uid', uid, Athena.database.collections.DynamicDoors);

    if (!existingDoor) {
        return;
    }

    await Database.deleteById(String(existingDoor._id), Athena.database.collections.DynamicDoors);
    cleanup(uid);
}

async function init() {
    areDoorsLoading = true;

    const doors = await Database.fetchAllData<dDynamicDoor>(Athena.database.collections.DynamicDoors);
    for (let door of doors) {
        door._id = String(door._id);
        await generate(door);
    }

    areDoorsLoading = false;
}

init();
