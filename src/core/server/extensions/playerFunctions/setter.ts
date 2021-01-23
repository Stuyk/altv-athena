import * as alt from 'alt-server';
import { Account } from '../../interface/Account';
import { Permissions } from '../../../shared/flags/permissions';
import { getUniquePlayerHash } from '../../utility/encryption';
import { Database, getDatabase } from 'simplymongo';
import { DEFAULT_CONFIG } from '../../athena/main';
import { distance2d } from '../../../shared/utility/vector';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import emit from './emit';
import save from './save';
import dataUpdater from './dataUpdater';
import safe from './safe';
import sync from './sync';

const db: Database = getDatabase();

/**
 * Set the current account data for this player.
 * @param {Partial<Account>} accountData
 * @return {*}  {Promise<void>}
 * @memberof SetPrototype
 */
async function account(p: alt.Player, accountData: Partial<Account>): Promise<void> {
    if (!accountData.permissionLevel) {
        accountData.permissionLevel = Permissions.None;
        db.updatePartialData(accountData._id, { permissionLevel: Permissions.None }, 'accounts');
    }

    if (!accountData.quickToken || Date.now() > accountData.quickTokenExpiration || p.needsQT) {
        const qt: string = getUniquePlayerHash(p, p.discord.id);

        db.updatePartialData(
            accountData._id,
            {
                quickToken: qt,
                quickTokenExpiration: Date.now() + 60000 * 60 * 48 // 48 Hours
            },
            'accounts'
        );

        alt.emitClient(p, SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, p.discord.id);
    }

    emit.meta(p, 'permissionLevel', accountData.permissionLevel);
    p.accountData = accountData;
}

/**
 *
 * @param {alt.Player} killer
 * @param {*} weaponHash
 * @memberof SetPrototype
 */
function dead(p: alt.Player, killer: alt.Player = null, weaponHash: any = null): void {
    p.spawn(p.pos.x, p.pos.y, p.pos.z, 0);

    if (!p.data.isDead) {
        p.data.isDead = true;
        emit.meta(p, 'isDead', true);
        save.field(p, 'isDead', true);
        alt.log(`(${p.id}) ${p.data.name} has died.`);
    }

    if (!p.nextDeathSpawn) {
        p.nextDeathSpawn = Date.now() + DEFAULT_CONFIG.RESPAWN_TIME;
    }
}

/**
 * Called when a player does their first connection to the server.
 * @memberof SetPrototype
 */
async function firstConnect(p: alt.Player): Promise<void> {
    if (!p || !p.valid) {
        return;
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    p.dimension = p.id + 1; // First ID is 0. We add 1 so everyone gets a unique dimension.
    p.pendingLogin = true;

    dataUpdater.init(p, null);
    safe.setPosition(p, pos.x, pos.y, pos.z);
    sync.time(p);
    sync.weather(p);

    alt.setTimeout(() => {
        if (!p || !p.valid) {
            return;
        }

        alt.emitClient(p, SYSTEM_EVENTS.QUICK_TOKEN_FETCH);
    }, 500);
}
/**
 * Set if this player should be frozen.
 * @param {boolean} value
 * @memberof SetPrototype
 */
function frozen(p: alt.Player, value: boolean): void {
    alt.emitClient(p, SYSTEM_EVENTS.PLAYER_SET_FREEZE, value);
}

/**
 * Set this player as respawned.
 * @param {(alt.Vector3 | null)} position Use null to find closest hospital.
 * @memberof SetPrototype
 */
function respawned(p: alt.Player, position: alt.Vector3 = null): void {
    p.nextDeathSpawn = null;
    p.data.isDead = false;
    emit.meta(p, 'isDead', false);
    save.field(p, 'isDead', false);

    if (DEFAULT_CONFIG.RESPAWN_LOSE_WEAPONS) {
        p.removeAllWeapons();
    }

    let nearestHopsital = position;
    if (!position) {
        const hospitals = [...DEFAULT_CONFIG.VALID_HOSPITALS];
        let index = 0;
        let lastDistance = distance2d(p.pos, hospitals[0]);

        for (let i = 1; i < hospitals.length; i++) {
            const distanceCalc = distance2d(p.pos, hospitals[i]);
            if (distanceCalc > lastDistance) {
                continue;
            }

            lastDistance = distanceCalc;
            index = i;
        }

        nearestHopsital = hospitals[index] as alt.Vector3;
    }

    safe.setPosition(p, nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    p.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    safe.addHealth(p, DEFAULT_CONFIG.RESPAWN_HEALTH, true);
    safe.addArmour(p, DEFAULT_CONFIG.RESPAWN_ARMOUR, true);
}

export default {
    account,
    dead,
    firstConnect,
    frozen,
    respawned
};
