import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';
import { ActionMenu } from '../../../shared/interfaces/actions';
import { DEFAULT_CONFIG } from '../../athena/main';
import { ATHENA_EVENTS_PLAYER } from '../../../shared/enums/athenaEvents';
import { Account } from '../../interface/iAccount';
import { Collections } from '../../interface/iDatabaseCollections';
import Ares from '../../utility/ares';
import emit from './emit';
import safe from './safe';
import save from './save';
import sync from './sync';
import Database from '@stuyk/ezmongodb';
import ConfigUtil from '../../utility/config';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { PlayerEvents } from '../../events/playerEvents';
import { StateManager } from '../../systems/stateManager';
import { Athena } from '../../api/athena';
import { JwtProvider } from '../../systems/jwt';

const Setter = {
    /**
     * Set the current account data for this player.
     * @param {Partial<Account>} accountData
     * @return {Promise<void>}
     * @memberof SetPrototype
     */
    async account(player: alt.Player, accountData: Partial<Account>): Promise<void> {
        if (typeof accountData.permissionLevel === 'undefined' || accountData.permissionLevel === null) {
            accountData.permissionLevel = PERMISSIONS.NONE;
            Database.updatePartialData(accountData._id, { permissionLevel: PERMISSIONS.NONE }, Collections.Accounts);
        }

        // Setup JWT Storage
        accountData._id = accountData._id.toString();
        const newToken = await JwtProvider.create(accountData as Account);
        alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, newToken);

        player.setSyncedMeta(PLAYER_SYNCED_META.ACCOUNT_ID, accountData.id);
        emit.meta(player, 'permissionLevel', accountData.permissionLevel);
        player.accountData = accountData;
        player.accountData._id = player.accountData._id.toString();
        PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.FINISHED_LOGIN, player);
    },

    actionMenu(player: alt.Player, actionMenu: ActionMenu) {
        alt.emitClient(player, SYSTEM_EVENTS.SET_ACTION_MENU, actionMenu);
    },

    /**
     * Called when a player does their first connection to the server.
     * @memberof SetPrototype
     */
    async firstConnect(player: alt.Player): Promise<void> {
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
        player.data = {} as any;
        safe.setPosition(player, pos.x, pos.y, pos.z);
        sync.time(player);
        sync.weather(player);
    },

    /**
     * Set if this player should be frozen.
     * @param {boolean} value
     * @memberof SetPrototype
     */
    frozen(player: alt.Player, value: boolean): void {
        player.setSyncedMeta(PLAYER_SYNCED_META.IS_FROZEN, value);
    },

    /**
     * Set this player as respawned.
     * @param {(alt.Vector3 | null)} position Use null to find closest hospital.
     * @memberof SetPrototype
     */
    respawned(player: alt.Player, position: alt.IVector3): void {
        StateManager.set(player, 'isDead', false);
        emit.meta(player, 'isDead', false);
        save.save(player, 'isDead', false);
        PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.SPAWNED, player, position);
    },

    wantedLevel(player: alt.Player, stars: number) {
        if (stars >= 6) {
            stars = 5;
        }

        player.wanted = stars;
        Athena.state.set(player, 'wanted', stars);
        player.setSyncedMeta(PLAYER_SYNCED_META.WANTED_LEVEL, stars);
    },
};

/**
 * It allows you to override a function in the player.setter file
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the player's property is set.
 */
function override<Key extends keyof typeof Setter>(functionName: Key, callback: typeof Setter[Key]): void {
    if (typeof funcs[functionName] === 'undefined') {
        alt.logError(`Athena.player.setter does not provide an export named ${functionName}`);
    }

    funcs[functionName] = callback;
}

const funcs: typeof Setter & { override?: typeof override } = {
    ...Setter,
    override,
};

export default funcs;
