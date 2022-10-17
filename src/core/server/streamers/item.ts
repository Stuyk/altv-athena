import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';
import { GroundItem } from '../../shared/interfaces/groundItem';

const globalItemDrops: Array<GroundItem> = [];
const KEY = 'item-drops';

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
const InternalController = {
    init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    },
    refresh() {
        StreamerService.updateData(KEY, globalItemDrops);
    },
    update(player: alt.Player, drops: Array<GroundItem>) {
        const dropsInPlayersDimension = drops.filter((item) => item.item.dimension === player.dimension);
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_ITEM_DROPS, dropsInPlayersDimension);
    },
};

type ItemControllerInjectionAppend = (object: GroundItem) => GroundItem;
type ItemControllerInjectionUpdate = (object: GroundItem) => GroundItem;
type ItemControllerInjectionRemove = (object: GroundItem) => GroundItem;

const AppendInjections: Array<ItemControllerInjectionAppend> = [];
const UpdateInjections: Array<ItemControllerInjectionUpdate> = [];
const RemoveInjections: Array<ItemControllerInjectionRemove> = [];
const ServerItemControllerConst = {
    /**
     * Allows the current added item to be modified.
     * Can also be used persist the item in a database.
     * Must always return the original item + your changes.
     *
     * @static
     * @param {ItemControllerInjectionAppend} callback
     * @memberof ItemController
     */
    addAppendInjection(callback: ItemControllerInjectionAppend) {
        AppendInjections.push(callback);
    },

    /**
     * Allows the current updated item to be modified.
     * Can also be used to update the item in a database.
     * Must always return the original item + your changes.
     *
     * @static
     * @param {ItemControllerInjectionUpdate} callback
     * @memberof ItemController
     */
    addUpdateInjection(callback: ItemControllerInjectionUpdate) {
        UpdateInjections.push(callback);
    },

    /**
     * Allows the current removed object to be modified.
     * Can also be used remove the object from a database.
     * Must always return the original object + your changes.
     *
     * @static
     * @param {ItemControllerInjectionRemove} callback
     * @memberof ItemController
     */
    addRemoveInjection(callback: ItemControllerInjectionRemove) {
        RemoveInjections.push(callback);
    },

     /**
     * Add an GroundItem to the global item drops.
     * @static
     * @param {GroundItem} groundItem to append
     * @return {string} uid for object
     * @memberof ItemController
     */
    append(itemInfo: GroundItem): string {
        if (!itemInfo.uid) {
            itemInfo.uid = sha256Random(JSON.stringify(itemInfo));
        }

        for (const callback of AppendInjections) {
            try {
                itemInfo = callback(itemInfo);
            } catch (err) {
                console.warn(`Got Object Append Injection Error: ${err}`);
                continue;
            }
        }

        globalItemDrops.push(itemInfo);
        InternalController.refresh();
        return itemInfo.uid;
    },

    /**
     * Update an GroundItem in global item drops.
     * @static
     * @param {GroundItem} groundItem to update
     * @return {boolean}
     * @memberof ItemController
     */
    update(itemInfo: GroundItem): boolean {
        let wasFound = false;
        for (let i = globalItemDrops.length - 1; i >= 0; i--) {
            if (globalItemDrops[i].uid !== itemInfo.uid) {
                continue;
            }

            for (const callback of UpdateInjections) {
                try {
                    callback(globalItemDrops[i]);
                } catch (err) {
                    console.warn(`Got Object Update Injection Error: ${err}`);
                    continue;
                }
            }

            globalItemDrops[i] = itemInfo;
            wasFound = true;
        }

        if (!wasFound) {
            return false;
        }

        InternalController.refresh();
        return true;
    },

    remove(uid: string): boolean {
        let wasFound = false;
        for (let i = globalItemDrops.length - 1; i >= 0; i--) {
            if (globalItemDrops[i].uid !== uid) {
                continue;
            }

            for (const callback of RemoveInjections) {
                try {
                    callback(globalItemDrops[i]);
                } catch (err) {
                    console.warn(`Got Object Remove Injection Error: ${err}`);
                    continue;
                }
            }

            globalItemDrops.splice(i, 1);
            wasFound = true;
        }

        if (!wasFound) {
            return false;
        }

        InternalController.refresh();
        return true;
    },
};

export const ServerItemController = {
    ...ServerItemControllerConst,
};

InternalController.init();
