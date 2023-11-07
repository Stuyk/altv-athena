import * as alt from 'alt-client';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced.js';
import IAttachable from '@AthenaShared/interfaces/iAttachable.js';

const cache: { [key: string]: Array<IAttachable> } = {};

const ClientAttachableSystem = {
    /**
     * Called when an entity is in streaming range of the player.
     * @static
     * @param {alt.Entity} entity
     *
     */
    create(entity: alt.Entity) {
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

            ClientAttachableSystem.update(entity, attachables);
        });
    },

    /**
     * When the stream synced meta is defined this will handle entities who are currently in range.
     * @static
     * @param {alt.Entity} entity
     * @param {string} key
     * @param {unknown} value
     * @param {unknown} old
     * @return {void}
     *
     */
    attachablesChanged(entity: alt.Entity, key: string, value: Array<IAttachable>, old: unknown) {
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
    },

    /**
     * Called when an entity is out of the streaming range of the player.
     * @static
     * @param {alt.Entity} entity
     *
     */
    async destroy(entity: alt.Entity) {
        if (!entity || !entity.valid) {
            return;
        }

        if (!(entity instanceof alt.Player)) {
            return;
        }

        await ClientAttachableSystem.remove(entity);

        delete cache[entity.id];
    },

    /**
     * Removes old attachables from a player.
     * @static
     * @param {alt.Player} player An alt:V Player Entity
     *
     */
    remove(player: alt.Player) {
        // Remove old attachables
        if (cache[player.id]) {
            for (let i = 0; i < cache[player.id].length; i++) {
                const attachable = cache[player.id][i];

                if (attachable.entityID === undefined || attachable.entityID === null) {
                    continue;
                }

                const foundObject = alt.LocalObject.all.find((x) => x.id === attachable.entityID);
                if (typeof foundObject === 'undefined' || foundObject === null || foundObject.valid === false) {
                    continue;
                }

                foundObject.destroy();
            }
        }
    },

    /**
     * Updates current attachables for a player.
     * @static
     * @param {alt.Player} player An alt:V Player Entity
     * @param {Array<IAttachable>} attachables
     *
     */
    async update(player: alt.Player, attachables: Array<IAttachable>) {
        ClientAttachableSystem.remove(player);

        // Create new attachables
        cache[player.id] = [];

        for (let i = 0; i < attachables.length; i++) {
            const newObject = new alt.LocalObject(
                attachables[i].model,
                new alt.Vector3(attachables[i].pos),
                new alt.Vector3(attachables[i].rot),
                true,
                false,
            );

            await newObject.waitForSpawn();

            newObject.attachToEntity(
                player,
                attachables[i].bone,
                new alt.Vector3(attachables[i].pos),
                new alt.Vector3(attachables[i].rot),
                true,
                false,
                true,
            );
            cache[player.id].push(attachables[i]);
            attachables[i].entityID = newObject.id;
        }
    },
};

alt.on('streamSyncedMetaChange', ClientAttachableSystem.attachablesChanged);
alt.on('gameEntityCreate', ClientAttachableSystem.create);
alt.on('gameEntityDestroy', ClientAttachableSystem.destroy);
