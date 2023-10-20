import * as alt from 'alt-server';
import * as Athena from '../api/index.js';
import * as emit from './emit.js';
import * as PlayerEvents from '@AthenaServer/player/events.js';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { ActionMenu } from '@AthenaShared/interfaces/actions.js';
import { Account } from '../../shared/interfaces/iAccount.js';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced.js';

/**
 * Set the current account data for this player.
 *
 * @param {Partial<Account>} accountData
 * @return {Promise<void>}
 *
 */
export async function account(player: alt.Player, accountData: Account): Promise<void> {
    if (Overrides.account) {
        return Overrides.account(player, accountData);
    }

    // Setup JWT Storage
    accountData._id = accountData._id.toString();
    const newToken = await Athena.systems.jwt.create(accountData as Account);
    alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, newToken);

    player.setSyncedMeta(PLAYER_SYNCED_META.ACCOUNT_ID, accountData.id);
    emit.meta(player, 'permissions', accountData.permissions);

    Athena.document.account.bind(player, accountData);
    PlayerEvents.trigger('set-account-data', player);
}

export function actionMenu(player: alt.Player, actionMenu: ActionMenu) {
    if (Overrides.actionMenu) {
        return Overrides.actionMenu(player, actionMenu);
    }

    alt.emitClient(player, SYSTEM_EVENTS.SET_ACTION_MENU, actionMenu);
}

/**
 * Set this player as respawned.
 * @param {(alt.Vector3 | null)} position Use null to find closest hospital.
 *
 */
export function respawned(player: alt.Player, position: alt.IVector3): void {
    if (Overrides.respawned) {
        return Overrides.respawned(player, position);
    }

    Athena.document.character.set(player, 'isDead', false);
    emit.meta(player, 'isDead', false);
    PlayerEvents.trigger('respawned', player, position);
}

interface SetterFunctions {
    account: typeof account;
    actionMenu: typeof actionMenu;
    respawned: typeof respawned;
}

const Overrides: Partial<SetterFunctions> = {};

export function override(functionName: 'account', callback: typeof account);
export function override(functionName: 'actionMenu', callback: typeof actionMenu);
export function override(functionName: 'respawned', callback: typeof respawned);
/**
 * Used to override any setter functions
 *
 *
 * @param {keyof SetterFunctions} functionName
 * @param {*} callback
 */
export function override(functionName: keyof SetterFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
