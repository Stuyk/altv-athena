import * as alt from 'alt-server';
import { Account } from '../../interface/Account';
import { Permissions } from '../../../shared/flags/permissions';
import { getUniquePlayerHash } from '../../utility/encryption';
import { Database, getDatabase } from 'simplymongo';
import { DEFAULT_CONFIG } from '../../athena/main';
import { distance2d } from '../../../shared/utility/vector';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';

const db: Database = getDatabase();

export interface SetPrototype {
    /**
     * Set the account data for this player after they login.
     * @param {Partial<Account>} accountData
     * @return {*}  {Promise<void>}
     * @memberof SetPrototype
     */
    account(accountData: Partial<Account>): Promise<void>;

    /**
     *
     * @param {alt.Player} killer
     * @param {*} weaponHash
     * @memberof SetPrototype
     */
    dead(killer?: alt.Player, weaponHash?: any): void;

    /**
     * Called when a player does their first connection to the server.
     * @memberof SetPrototype
     */
    firstConnect(): void;

    /**
     * Set if this player should be frozen.
     * @param {boolean} value
     * @memberof SetPrototype
     */
    frozen(value: boolean): void;

    /**
     * Set this player as respawned.
     * @param {(alt.Vector3 | null)} position Use null to find closest hospital.
     * @memberof SetPrototype
     */
    respawned(position: alt.Vector3 | null): void;
}

export function bind(): SetPrototype {
    const _this = this;
    _this.account = account;
    _this.dead = dead;
    _this.firstConnect = firstConnect;
    _this.frozen = frozen;
    _this.respawned = respawned;
    return _this;
}

/**
 * Set the current account data for this player.
 * @param {Partial<Account>} accountData
 * @return {*}  {Promise<void>}
 * @memberof SetPrototype
 */
async function account(accountData: Partial<Account>): Promise<void> {
    const p: alt.Player = (this as unknown) as alt.Player;

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

        p.emit().meta(SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, p.discord.id);
    }

    p.emit().meta('permissionLevel', accountData.permissionLevel);
    p.accountData = accountData;
}

function dead(killer: alt.Player = null, weaponHash: any = null): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.spawn(p.pos.x, p.pos.y, p.pos.z, 0);

    if (!p.data.isDead) {
        p.data.isDead = true;
        p.emit().meta('isDead', true);
        p.save().field('isDead', true);
        alt.log(`(${p.id}) ${p.data.name} has died.`);
    }

    if (!p.nextDeathSpawn) {
        p.nextDeathSpawn = Date.now() + DEFAULT_CONFIG.RESPAWN_TIME;
    }
}

async function firstConnect(): Promise<void> {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (!p || !p.valid) {
        return;
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    p.dimension = p.id + 1; // First ID is 0. We add 1 so everyone gets a unique dimension.
    p.pendingLogin = true;

    p.dataUpdater().init(null);
    p.emit().event(SYSTEM_EVENTS.QUICK_TOKEN_FETCH);
    p.safe().setPosition(pos.x, pos.y, pos.z);
    p.sync().time();
    p.sync().weather();
}

/**
 * Set this player as frozen or unfrozen.
 * @param {boolean} value
 * @memberof SetPrototype
 */
function frozen(value: boolean): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.emit().event(SYSTEM_EVENTS.PLAYER_SET_FREEZE, value);
}

/**
 * Set this player as respawned.
 * Add a position if you want to override hospital spawn.
 * @param {alt.Vector3} [position=null]
 * @memberof SetPrototype
 */
function respawned(position: alt.Vector3 = null): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    p.nextDeathSpawn = null;
    p.data.isDead = false;
    p.emit().meta('isDead', false);
    p.save().field('isDead', false);

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

    p.safe().setPosition(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    p.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    p.safe().addHealth(DEFAULT_CONFIG.RESPAWN_HEALTH, true);
    p.safe().addArmour(DEFAULT_CONFIG.RESPAWN_ARMOUR, true);
}
