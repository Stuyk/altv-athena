import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';
import { ActionMenu } from '../../../shared/interfaces/actions';
import { distance2d } from '../../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../../athena/main';
import { ATHENA_EVENTS_PLAYER } from '../../../shared/enums/athenaEvents';
import { Account } from '../../interface/iAccount';
import { Collections } from '../../interface/iDatabaseCollections';
import Ares from '../../utility/ares';
import { playerFuncs } from '../extPlayer';
import dataUpdater from './dataUpdater';
import emit from './emit';
import safe from './safe';
import save from './save';
import sync from './sync';
import Database from '@stuyk/ezmongodb';
import ConfigUtil from '../../utility/config';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { PlayerEvents } from '../../events/playerEvents';

const config = ConfigUtil.get();

/**
 * Set the current account data for this player.
 * @param {Partial<Account>} accountData
 * @return {*}  {Promise<void>}
 * @memberof SetPrototype
 */
async function account(player: alt.Player, accountData: Partial<Account>): Promise<void> {
    if (!accountData.permissionLevel) {
        accountData.permissionLevel = PERMISSIONS.NONE;
        Database.updatePartialData(accountData._id, { permissionLevel: PERMISSIONS.NONE }, Collections.Accounts);
    }

    if (!accountData.quickToken || Date.now() > accountData.quickTokenExpiration || player.needsQT) {
        const qt: string = Ares.getUniquePlayerHash(player, player.discord.id);

        Database.updatePartialData(
            accountData._id,
            {
                quickToken: qt,
                quickTokenExpiration: Date.now() + 60000 * 60 * 48, // 48 Hours
            },
            Collections.Accounts,
        );

        alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, player.discord.id);
    }

    player.setSyncedMeta(PLAYER_SYNCED_META.ACCOUNT_ID, accountData.id);
    emit.meta(player, 'permissionLevel', accountData.permissionLevel);
    player.accountData = accountData;
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

    PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.DIED, player);
}

/**
 * Called when a player does their first connection to the server.
 * @memberof SetPrototype
 */
async function firstConnect(player: alt.Player): Promise<void> {
    if (!player || !player.valid) {
        return;
    }

    if (process.env.ATHENA_READY === 'false') {
        player.kick('Still warming up...');
        return;
    }

    const vueDefaultPath = ConfigUtil.getVueDebugMode()
        ? ConfigUtil.getViteServer()
        : `http://assets/webviews/index.html`;
    alt.emitClient(player, SYSTEM_EVENTS.WEBVIEW_INFO, vueDefaultPath);

    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };

    // First ID is 0. We add 1 so everyone gets a unique dimension.
    player.dimension = player.id + 1;
    player.pendingLogin = true;
    player.visible = false;

    // Some general initialization setup.
    dataUpdater.init(player, null);
    safe.setPosition(player, pos.x, pos.y, pos.z);
    sync.time(player);
    sync.weather(player);
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

    PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.SPAWNED, p);
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
    wantedLevel,
};
