import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Permissions } from '../../../shared/flags/permissions';
import { ActionMenu } from '../../../shared/interfaces/Actions';
import { distance2d } from '../../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../../athena/main';
import { ATHENA_EVENTS_PLAYER } from '../../enums/athenaEvents';
import { Account } from '../../interface/Account';
import { Collections } from '../../interface/DatabaseCollections';
import Ares from '../../utility/ares';
import { playerFuncs } from '../Player';
import dataUpdater from './dataUpdater';
import emit from './emit';
import safe from './safe';
import save from './save';
import sync from './sync';
import Database from '@stuyk/ezmongodb';
import dotenv from 'dotenv';
import { IConfig } from '../../interface/IConfig';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';

const config: IConfig = dotenv.config().parsed as IConfig;

/**
 * Set the current account data for this player.
 * @param {Partial<Account>} accountData
 * @return {*}  {Promise<void>}
 * @memberof SetPrototype
 */
async function account(p: alt.Player, accountData: Partial<Account>): Promise<void> {
    if (!accountData.permissionLevel) {
        accountData.permissionLevel = Permissions.None;
        Database.updatePartialData(accountData._id, { permissionLevel: Permissions.None }, Collections.Accounts);
    }

    if (!accountData.quickToken || Date.now() > accountData.quickTokenExpiration || p.needsQT) {
        const qt: string = Ares.getUniquePlayerHash(p, p.discord.id);

        Database.updatePartialData(
            accountData._id,
            {
                quickToken: qt,
                quickTokenExpiration: Date.now() + 60000 * 60 * 48 // 48 Hours
            },
            Collections.Accounts
        );

        alt.emitClient(p, SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, p.discord.id);
    }

    emit.meta(p, 'permissionLevel', accountData.permissionLevel);
    p.accountData = accountData;
}

function actionMenu(player: alt.Player, actionMenu: ActionMenu) {
    alt.emitClient(player, SYSTEM_EVENTS.SET_ACTION_MENU, actionMenu);
}

/**
 *
 * @param {alt.Player} killer
 * @param {*} weaponHash
 * @memberof SetPrototype
 */
function dead(player: alt.Player, weaponHash: any = null): void {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);

    if (!player.data.isDead) {
        player.data.isDead = true;
        emit.meta(player, 'isDead', true);
        save.field(player, 'isDead', true);
        alt.log(`(${player.id}) ${player.data.name} has died.`);
    }

    if (!player.nextDeathSpawn) {
        player.nextDeathSpawn = Date.now() + DEFAULT_CONFIG.RESPAWN_TIME;
    }

    alt.emit(ATHENA_EVENTS_PLAYER.DIED, player);
}

/**
 * Called when a player does their first connection to the server.
 * @memberof SetPrototype
 */
async function firstConnect(p: alt.Player): Promise<void> {
    if (!p || !p.valid) {
        return;
    }

    if (process.env.ATHENA_READY === 'false') {
        p.kick('Still warming up...');
        return;
    }

    // Used to set the custom View instance with a Web Server URL.
    alt.emitClient(p, SYSTEM_EVENTS.SET_VIEW_URL, config.WEBSERVER_IP);

    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };

    p.dimension = p.id + 1; // First ID is 0. We add 1 so everyone gets a unique dimension.
    p.pendingLogin = true;

    dataUpdater.init(p, null);
    safe.setPosition(p, pos.x, pos.y, pos.z);
    sync.time(p);
    sync.weather(p);
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

        if (DEFAULT_CONFIG.RESPAWN_LOSE_WEAPONS) {
            playerFuncs.inventory.removeAllWeapons(p);
        }
    }

    safe.setPosition(p, nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    p.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);

    alt.nextTick(() => {
        p.clearBloodDamage();
        safe.addHealth(p, DEFAULT_CONFIG.RESPAWN_HEALTH, true);
        safe.addArmour(p, DEFAULT_CONFIG.RESPAWN_ARMOUR, true);
    });

    alt.emit(ATHENA_EVENTS_PLAYER.SPAWNED, p);
}

function wantedLevel(player: alt.Player, stars: number) {
    if (stars >= 6) {
        stars = 5;
    }

    player.wanted = stars;
    player.data.wanted = stars;
    playerFuncs.save.field(player, 'wanted', player.data.wanted);
    player.setSyncedMeta(PLAYER_SYNCED_META.WANTED_LEVEL, stars);
}

export default {
    account,
    actionMenu,
    dead,
    firstConnect,
    frozen,
    respawned,
    wantedLevel
};
