import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import VehicleFuncs from '../../../../server/extensions/vehicleFuncs';
import { ItemFactory } from '../../../../server/systems/item';
import { ItemEffects } from '../../../../server/systems/itemEffects';
import { getForwardVector } from '../../../../server/utility/vector';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { INVENTORY_TYPE } from '../../../../shared/enums/inventoryTypes';
import { Item } from '../../../../shared/interfaces/item';
import { IWheelItem } from '../../../../shared/interfaces/iWheelMenu';
import { distance } from '../../../../shared/utility/vector';
import { CUFF_EFFECTS } from '../../shared/effects';
import { CUFF_INTERACTIONS } from '../../shared/events';
import { CUFF_ITEM_DB_NAMES } from '../../shared/items';
import { CuffItems } from './items';

type cuffedID = string;
type cufferID = string;

const cufferRegistry: { [cufferID: string]: cuffedID } = {};
const cuffedRegistry: { [cuffedID: string]: cufferID } = {};

export class CuffSystem {
    /**
     * Initializes the Cuffing System
     */
    static async init() {
        for (let i = 0; i < CuffItems.length; i++) {
            await ItemFactory.add(CuffItems[i]);
        }

        ItemEffects.add(CUFF_EFFECTS.CUFF, CuffSystem.cuff);
        ItemEffects.add(CUFF_EFFECTS.MANAGE, CuffSystem.cuffMenu);
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.DIED, CuffSystem.handleDeath);
    }

    /**
     * Uncuff any player who dies while being cuffed.
     * Uncuff the player if the cuffer dies.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof CuffSystem
     */
    static handleDeath(player: alt.Player) {
        if (player.isCuffed) {
            CuffSystem.uncuffByCuffed(player);
        }

        if (cufferRegistry[player.id]) {
            CuffSystem.uncuffByCuffer(player);
        }
    }

    /**
     * Validate if a cuffed (player) is cuffed by a cuffer (player)
     *
     * @static
     * @param {alt.Player} cuffer
     * @param {alt.Player} cuffed
     * @return {boolean}
     * @memberof CuffSystem
     */
    static validateCuffedAction(cuffer: alt.Player, cuffed: alt.Player): boolean {
        if (cufferRegistry[cuffer.id] !== cuffed.id.toString()) {
            return false;
        }

        if (cuffedRegistry[cuffed.id] !== cuffer.id.toString()) {
            return false;
        }

        return true;
    }

    /**
     * Find a vehicle directly in front of a player.
     *
     * @param player - alt.Player - The player that is trying to find a vehicle in front of them.
     * @returns alt.Vehicle
     */
    static findVehicleInFrontOf(player: alt.Player): alt.Vehicle {
        const fwdVector = getForwardVector(player.rot);
        const fwdPos = {
            x: player.pos.x + fwdVector.x * 1,
            y: player.pos.y + fwdVector.y * 1,
            z: player.pos.z,
        };

        const vehicles = [...alt.Vehicle.all];
        let target: alt.Vehicle;
        let dist: number = 2;

        for (let i = 0; i < vehicles.length; i++) {
            const potentialVehicle = vehicles[i];
            if (!potentialVehicle || !potentialVehicle.valid) {
                continue;
            }

            if (potentialVehicle.id === player.id) {
                continue;
            }

            const potentialVehicleDist = distance(fwdPos, potentialVehicle.pos);
            if (potentialVehicleDist > dist) {
                continue;
            }

            dist = potentialVehicleDist;
            target = potentialVehicle;
        }

        return target;
    }

    /**
     * Find a player directly in front of a player.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof CuffSystem
     */
    static findPlayerInFrontOf(player: alt.Player) {
        const fwdVector = getForwardVector(player.rot);
        const fwdPos = {
            x: player.pos.x + fwdVector.x * 1,
            y: player.pos.y + fwdVector.y * 1,
            z: player.pos.z,
        };

        const players = [...alt.Player.all];
        let target: alt.Player;
        let dist: number = 2;

        for (let i = 0; i < players.length; i++) {
            const potentialPlayer = players[i];
            if (!potentialPlayer.valid || !potentialPlayer.data || !potentialPlayer.hasFullySpawned) {
                continue;
            }

            if (potentialPlayer.id === player.id) {
                continue;
            }

            const potentialPlayerDist = distance(fwdPos, potentialPlayer.pos);
            if (potentialPlayerDist > dist) {
                continue;
            }

            dist = potentialPlayerDist;
            target = potentialPlayer;
        }

        return target;
    }

    /**
     * Cuffs a player in front of the cuffer and forces them into a cuff state.
     *
     * @static
     * @param {alt.Player} cuffer
     * @param {Item} item
     * @param {number} slot
     * @param {string} inventoryType
     * @return {*}
     * @memberof CuffSystem
     */
    static async cuff(cuffer: alt.Player, item: Item, slot: number, inventoryType: INVENTORY_TYPE) {
        const target = CuffSystem.findPlayerInFrontOf(cuffer);

        if (target.isDead || cuffer.isDead) {
            return;
        }

        if (!target) {
            Athena.player.emit.notification(cuffer, `Could not find a target player.`);
            return;
        }

        if (target.isCuffed) {
            Athena.player.emit.notification(cuffer, `Target is already cuffed.`);
            return;
        }

        if (inventoryType === INVENTORY_TYPE.TOOLBAR) {
            if (!Athena.player.inventory.toolbarRemove(cuffer, item.slot)) {
                Athena.player.emit.notification(cuffer, `Could not find cuffs`);
                return;
            }

            Athena.player.save.field(cuffer, 'toolbar', cuffer.data.toolbar);
        }

        if (inventoryType === INVENTORY_TYPE.INVENTORY) {
            if (!Athena.player.inventory.inventoryRemove(cuffer, item.slot)) {
                Athena.player.emit.notification(cuffer, `Could not find cuffs`);
                return;
            }
        }

        const keyItem = await ItemFactory.get(CUFF_ITEM_DB_NAMES.KEY);
        const invRef = Athena.player.inventory.getFreeInventorySlot(cuffer);

        if (!invRef) {
            Athena.player.emit.notification(cuffer, `No room in inventory`);
            return;
        }

        // Add the Key Item to the Cuffer
        Athena.player.inventory.inventoryAdd(cuffer, keyItem, invRef.slot);

        // Save Inventory & Synchronize Changes
        Athena.player.save.partial(cuffer, { inventory: cuffer.data.inventory, toolbar: cuffer.data.toolbar });
        Athena.player.sync.inventory(cuffer);

        // Register Cuff Information
        cufferRegistry[cuffer.id] = `${target.id}`;
        cuffedRegistry[target.id] = `${cuffer.id}`;

        // Attach the cuffed player to the cuffer
        CuffSystem.attach(cuffer);
    }

    /**
     * Call this when a player has cuffed another player to uncuff them.
     *
     * @static
     * @param {alt.Player} cuffer The player who has cuffed another player.
     * @memberof CuffSystem
     */
    static uncuffByCuffer(cuffer: alt.Player) {
        if (!cufferRegistry[cuffer.id]) {
            return;
        }

        const target = alt.Player.all.find((t) => t.id.toString() === cufferRegistry[cuffer.id]);
        if (!target) {
            const cuffedID = cufferRegistry[cuffer.id];
            delete cuffedRegistry[cuffedID];
            delete cufferRegistry[cuffer.id];
            return;
        }

        delete cufferRegistry[cuffer.id];
        delete cuffedRegistry[target.id];
        target.detach();
    }

    /**
     * Removes the key, and uncuffs the cuffed user.
     *
     * @static
     * @param {alt.Player} cuffer
     * @memberof CuffSystem
     */
    static disposeOfKey(cuffer: alt.Player) {
        //
    }

    /**
     * Call this when a player is cuffed but don't know cuffer.
     *
     * @static
     * @param {alt.Player} cuffed The player who is cuffed.
     * @memberof CuffSystem
     */
    static uncuffByCuffed(cuffed: alt.Player) {
        if (!cuffedRegistry[cuffed.id]) {
            return;
        }

        cuffed.isCuffed = false;
        cuffed.isCuffedFreeMoving = false;

        const cuffer = alt.Player.all.find((t) => t.id.toString() === cuffedRegistry[cuffed.id]);
        if (!cuffer) {
            const cufferID = cuffedRegistry[cuffed.id];
            delete cufferRegistry[cufferID];
            delete cuffedRegistry[cuffed.id];
            return;
        }

        delete cufferRegistry[cuffer.id];
        delete cuffedRegistry[cuffed.id];
        cuffed.detach();
    }

    /**
     * Detaches the cuffed player and allows them to move freely.
     *
     * @static
     * @param {alt.Player} cuffer
     * @memberof CuffSystem
     */
    static detach(cuffer: alt.Player) {
        if (!cufferRegistry[cuffer.id]) {
            return;
        }

        const target = alt.Player.all.find((t) => t.id.toString() === cufferRegistry[cuffer.id]);
        if (!target) {
            const cuffedID = cufferRegistry[cuffer.id];
            delete cuffedRegistry[cuffedID];
            delete cufferRegistry[cuffer.id];
            return;
        }

        target.detach();
        target.isCuffed = true;
        target.isCuffedFreeMoving = true;
        Athena.player.emit.animation(target, 'mp_arresting', 'idle', 49);
    }

    /**
     * Attach a cuffed player back to the cuffer
     *
     * @static
     * @param {alt.Player} cuffer
     * @return {*}
     * @memberof CuffSystem
     */
    static attach(cuffer: alt.Player) {
        if (!cufferRegistry[cuffer.id]) {
            return;
        }

        const target = alt.Player.all.find((t) => t.id.toString() === cufferRegistry[cuffer.id]);
        if (!target) {
            const cuffedID = cufferRegistry[cuffer.id];
            delete cuffedRegistry[cuffedID];
            delete cufferRegistry[cuffer.id];
            return;
        }

        target.isCuffed = true;
        target.isCuffedFreeMoving = false;
        Athena.player.emit.animation(target, 'mp_arresting', 'idle', 49);
        target.attachTo(
            cuffer,
            0,
            0,
            { x: 0.2, y: 1, z: 0 } as alt.Vector3,
            { x: 0, y: 0, z: 0 } as alt.Vector3,
            false,
            false,
        );
    }

    /**
     * Put the cuffed player attached to the cuffer into the closest vehicle.
     *
     * @static
     * @param {alt.Player} cuffer
     * @return {*}
     * @memberof CuffSystem
     */
    static putIntoVehicle(cuffer: alt.Player) {
        const target = alt.Player.all.find((t) => t.id.toString() === cufferRegistry[cuffer.id]);
        if (!target) {
            const cuffedID = cufferRegistry[cuffer.id];
            delete cuffedRegistry[cuffedID];
            delete cufferRegistry[cuffer.id];
            return;
        }

        const vehicle = CuffSystem.findVehicleInFrontOf(cuffer);
        if (!vehicle) {
            Athena.player.emit.notification(cuffer, `Could not find vehicle close enough.`);
            return;
        }

        if (!VehicleFuncs.hasOwnership(cuffer, vehicle)) {
            Athena.player.emit.notification(cuffer, `This is not your vehicle.`);
            return;
        }

        CuffSystem.detach(cuffer);
        target.setIntoVehicle(vehicle, 1);
    }

    /**
     * Remove the cuffed player from the vehicle. Auto-attaching them to the cuffer.
     *
     * @static
     * @param {alt.Player} cuffer
     * @return {*}
     * @memberof CuffSystem
     */
    static removeFromVehicle(cuffer: alt.Player) {
        const target = alt.Player.all.find((t) => t.id.toString() === cufferRegistry[cuffer.id]);
        if (!target) {
            const cuffedID = cufferRegistry[cuffer.id];
            delete cuffedRegistry[cuffedID];
            delete cufferRegistry[cuffer.id];
            return;
        }

        const vehicle = CuffSystem.findVehicleInFrontOf(cuffer);
        if (!vehicle || !vehicle.valid) {
            Athena.player.emit.notification(cuffer, `Could not find vehicle close enough.`);
            return;
        }

        if (target.vehicle.id !== vehicle.id) {
            Athena.player.emit.notification(cuffer, `Cuffed player is not in this vehicle.`);
            return;
        }

        Athena.player.safe.setPosition(target, cuffer.pos.x, cuffer.pos.y, cuffer.pos.z);
        CuffSystem.attach(cuffer);
    }

    /**
     * Only called when a user uses a cuff key and has someone cuffed
     *
     * @static
     * @param {alt.Player} cuffer
     * @return {*}
     * @memberof CuffSystem
     */
    static cuffMenu(cuffer: alt.Player) {
        const cuffed = alt.Player.all.find((t) => t.id.toString() === cufferRegistry[cuffer.id]);
        if (!cuffed) {
            const cuffedID = cufferRegistry[cuffer.id];
            delete cuffedRegistry[cuffedID];
            delete cufferRegistry[cuffer.id];
            return;
        }

        const options: Array<IWheelItem> = [];

        // Uncuff Menu Option
        if (cuffed.isCuffed) {
            options.push({
                name: 'Uncuff',
                emitServer: CUFF_INTERACTIONS.UNCUFF,
            });
        }

        // Attach & Detach - Restrict Movement
        if (cuffed.isCuffedFreeMoving) {
            options.push({
                name: 'Attach',
                emitServer: CUFF_INTERACTIONS.ATTACH,
            });
        } else {
            options.push({
                name: 'Detach',
                emitServer: CUFF_INTERACTIONS.DETACH,
            });
        }

        // In Vehicle & Out of Vehicle
        if (cuffed.vehicle) {
            options.push({
                name: 'Remove from Vehicle',
                emitServer: CUFF_INTERACTIONS.REMOVE_FROM_VEHICLE,
            });
        } else {
            options.push({
                name: 'Put into Vehicle',
                emitServer: CUFF_INTERACTIONS.PUT_INTO_VEHICLE,
            });
        }

        // Emit the wheel menu
        Athena.player.emit.wheelMenu(cuffer, `${cuffed.data.name}`, options);
    }
}

// Bind Cuff Menu Events
alt.onClient(CUFF_INTERACTIONS.UNCUFF, CuffSystem.uncuffByCuffer);
alt.onClient(CUFF_INTERACTIONS.ATTACH, CuffSystem.attach);
alt.onClient(CUFF_INTERACTIONS.DETACH, CuffSystem.detach);
alt.onClient(CUFF_INTERACTIONS.PUT_INTO_VEHICLE, CuffSystem.putIntoVehicle);
alt.onClient(CUFF_INTERACTIONS.REMOVE_FROM_VEHICLE, CuffSystem.removeFromVehicle);
