import * as alt from 'alt-server';
import { Character } from '../../../shared/interfaces/Character';
import { Account } from '../../interface/Account';
import { Permissions } from '../../../shared/enums/permissions';
import { getUniquePlayerHash } from '../../utility/encryption';
import { Database, getDatabase } from 'simplymongo';
import { Events_Misc } from '../../../shared/enums/events';
import { Player_Status } from '../../../shared/enums/player';
import { DEFAULT_CONFIG } from '../../athena/main';
import { distance2d } from '../../../shared/utility/vector';

const db: Database = getDatabase();

export interface SetPrototype {
    character(characterData: Partial<Character>): void;
    account(accountData: Partial<Account>): Promise<void>;
    frozen(value: boolean): void;
    respawned(position: alt.Vector3 | null): void;
}

export function bind(): SetPrototype {
    const _this = this;
    _this.character = character;
    _this.account = account;
    _this.frozen = frozen;
    _this.respawned = respawned;
    return _this;
}

/**
 * Set the current character data for this player.
 * @param {Partial<Character>} characterData
 * @memberof SetPrototype
 */
function character(characterData: Partial<Character>): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    p.data = characterData;

    if (p.data.isDead) {
        p.nextDeathSpawn = Date.now() + 30000;
        p.emit().meta('isDead', true);
    } else {
        p.emit().meta('isDead', false);
    }
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

        p.emit().meta(Events_Misc.DiscordTokenUpdate, p.discord.id);
    }

    p.emit().meta('permissionLevel', accountData.permissionLevel);
    p.accountData = accountData;
}

/**
 * Set this player as frozen or unfrozen.
 * @param {boolean} value
 * @memberof SetPrototype
 */
function frozen(value: boolean): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.emit().event(Player_Status.SetFreeze, value);
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
