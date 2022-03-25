import * as alt from 'alt-client';
import * as native from 'natives';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import IAttachable from '../../shared/interfaces/iAttachable';
import { loadModel } from '../utility/model';

const cache: { [key: string]: Array<IAttachable> } = {};

class ClientAttachableSystem {
    /**
     * Called when an entity is in streaming range of the player.
     * @static
     * @param {alt.Entity} entity
     * @memberof ClientAttachableSystem
     */
    static create(entity: alt.Entity) {
        alt.nextTick(() => {
            if (!entity || !entity.valid) {
                return;
            }

            if (!(entity instanceof alt.Player)) {
                return;
            }

            const attachables = entity.getStreamSyncedMeta(PLAYER_SYNCED_META.ATTACHABLES);
            if (!attachables || !Array.isArray(attachables)) {
                return;
            }

            ClientAttachableSystem.create(entity);
        });
    }

    /**
     * When the stream synced meta is defined this will handle entities who are currently in range.
     * @static
     * @param {alt.Entity} entity
     * @param {string} key
     * @param {unknown} value
     * @param {unknown} old
     * @return {*}
     * @memberof ClientAttachableSystem
     */
    static attachablesChanged(entity: alt.Entity, key: string, value: Array<IAttachable>, old: unknown) {
        if (!entity || !entity.valid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        if (key !== PLAYER_SYNCED_META.ATTACHABLES) {
            return;
        }

        if (!value || !Array.isArray(value)) {
            ClientAttachableSystem.destroy(entity);
            return;
        }

        ClientAttachableSystem.update(entity, value);
    }

    /**
     * Called when an entity is out of the streaming range of the player.
     * @static
     * @param {alt.Entity} entity
     * @memberof ClientAttachableSystem
     */
    static async destroy(entity: alt.Entity) {
        if (!entity || !entity.valid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        alt.log(`Deleting Attachable for ${entity.id}`);

        await ClientAttachableSystem.remove(entity);

        delete cache[entity.id];
    }

    /**
     * Removes old attachables from a player.
     * @static
     * @param {alt.Player} player
     * @memberof ClientAttachableSystem
     */
    static remove(player: alt.Player) {
        // Remove old attachables
        if (cache[player.id]) {
            for (let i = 0; i < cache[player.id].length; i++) {
                const attachable = cache[player.id][i];

                if (attachable.clientObjectID === undefined || attachable.clientObjectID === null) {
                    continue;
                }

                if (!native.doesEntityExist(attachable.clientObjectID)) {
                    continue;
                }

                native.deleteEntity(attachable.clientObjectID);
            }
        }
    }

    /**
     * Updates current attachables for a player.
     * @static
     * @param {alt.Player} player
     * @param {Array<IAttachable>} attachables
     * @memberof ClientAttachableSystem
     */
    static async update(player: alt.Player, attachables: Array<IAttachable>) {
        await ClientAttachableSystem.remove(player);

        // Create new attachables
        cache[player.id] = [];

        for (let i = 0; i < attachables.length; i++) {
            const newAttachable = attachables[i];
            const objectHash = alt.hash(newAttachable.model);
            const didLoadObject = await loadModel(objectHash);
            if (!didLoadObject) {
                continue;
            }

            const newObjectIdentifier = native.createObjectNoOffset(
                objectHash,
                player.pos.x,
                player.pos.y,
                player.pos.z,
                false,
                false,
                false,
            );

            alt.nextTick(() => {
                native.attachEntityToEntity(
                    newObjectIdentifier,
                    player.scriptID,
                    native.getPedBoneIndex(player.scriptID, newAttachable.bone),
                    newAttachable.pos.x,
                    newAttachable.pos.y,
                    newAttachable.pos.z,
                    newAttachable.rot.x,
                    newAttachable.rot.y,
                    newAttachable.rot.z,
                    true,
                    true,
                    false,
                    true,
                    1,
                    true,
                );

                // Assign the new attachable to our cache
                newAttachable.clientObjectID = newObjectIdentifier;
                cache[player.id].push(newAttachable);
            });
        }
    }
}

alt.on('streamSyncedMetaChange', ClientAttachableSystem.attachablesChanged);
alt.on('gameEntityCreate', ClientAttachableSystem.create);
alt.on('gameEntityDestroy', ClientAttachableSystem.destroy);
