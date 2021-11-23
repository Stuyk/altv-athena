import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/AthenaEvents';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { View_Events_Discord } from '../../shared/enums/Views';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import VehicleFuncs from '../extensions/VehicleFuncs';
import { Account } from '../interface/Account';
import { Collections } from '../interface/DatabaseCollections';
import { DiscordUser } from '../interface/DiscordUser';
import Ares from '../utility/ares';
import { goToCharacterSelect } from '../views/characters';
import { StorageView } from '../views/storage';
import { EventController } from './athenaEvent';
import { OptionsController } from './options';

import '../views/login';
import './job';
import '../streamers/marker';
import './ped';
import '../streamers/textlabel';
import './tick';
import './voice';
import { VehicleSystem } from './vehicle';

const UserRelation: { [key: number]: string } = {};

export class LoginController {
    /**
     * Called when the player is attemping to login to their account.
     * At this stage we already have all the Discord Information or a Discord ID.
     * @static
     * @param {alt.Player} player
     * @param {Partial<DiscordUser>} data
     * @param {Partial<Account>} account
     * @return {*}  {Promise<void>}
     * @memberof LoginController
     */
    static async tryLogin(
        player: alt.Player,
        data: Partial<DiscordUser>,
        account: Partial<Account> = null,
    ): Promise<void> {
        delete player.pendingLogin;
        delete player.discordToken;

        // Whitelist Handling
        if (DEFAULT_CONFIG.WHITELIST) {
            if (!OptionsController.isWhitelisted(data.id)) {
                player.kick(`You are not currently whitelisted.`);
                return;
            }
        }

        player.setMeta('Athena:Discord:Info', data);

        if (data.username) {
            alt.log(`[Athena] (${player.id}) ${data.username} has authenticated.`);
        }

        if (account && account.discord) {
            alt.log(`[Athena] (${player.id}) Discord ${account.discord} has logged in with a Quick Token `);
        }

        const currentPlayers = [...alt.Player.all];
        const index = currentPlayers.findIndex((p) => p.discord && p.discord.id === data.id && p.id !== player.id);

        if (index >= 1) {
            player.kick('That ID is already logged in.');
            return;
        }

        player.discord = data as DiscordUser;
        alt.emitClient(player, View_Events_Discord.Close);

        // Used for DiscordToken skirt.
        if (!account) {
            // Generate New Account for Database
            let accountData: Partial<Account> | null = await Database.fetchData<Account>(
                'discord',
                data.id,
                Collections.Accounts,
            );

            if (!accountData) {
                const newDocument: Partial<Account> = {
                    discord: player.discord.id,
                    ips: [player.ip],
                    hardware: [player.hwidHash, player.hwidExHash],
                    lastLogin: Date.now(),
                    permissionLevel: PERMISSIONS.NONE,
                };

                if (player.discord.email) {
                    newDocument.email = player.discord.email;
                }

                account = await Database.insertData<Partial<Account>>(newDocument, Collections.Accounts, true);
            } else {
                account = accountData;

                // Update Email if Non-Existant
                // Update Email if Does Not Match
                if (
                    (!account.email && player.discord.email) ||
                    (player.discord.email && account.email !== player.discord.email)
                ) {
                    account.email = player.discord.email;
                    await Database.updatePartialData(
                        account._id.toString(),
                        { email: player.discord.email },
                        Collections.Accounts,
                    );
                }
            }
        }

        if (account.banned) {
            player.kick(account.reason);
            return;
        }

        await playerFuncs.set.account(player, account);
        goToCharacterSelect(player);
    }

    static tryDisconnect(player: alt.Player, reason: string): void {
        if (!player || !player.valid || !player.data) {
            return;
        }

        if (player.isPushingVehicle) {
            VehicleSystem.stopPush(player);
        }

        StorageView.removeStorageBinding(player.id);

        if (DEFAULT_CONFIG.DESPAWN_VEHICLES_ON_LOGOUT) {
            VehicleFuncs.despawnAll(LoginController.getDatabaseIdForPlayer(player.id));
        }

        if (!player.data.name) {
            return;
        }

        alt.log(`${player.data.name} has logged out.`);
        playerFuncs.save.onTick(player);
    }

    static async tryDiscordQuickToken(player: alt.Player, discord: string): Promise<void> {
        if (!discord) {
            player.needsQT = true;
            alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
            return;
        }

        // Just enough unique data.
        const hashToken: string = Ares.getUniquePlayerHash(player, discord);
        const account: Partial<Account> | null = await Database.fetchData<Account>(
            'quickToken',
            hashToken,
            Collections.Accounts,
        );

        if (!account) {
            player.needsQT = true;
            alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
            return;
        }

        if (!account.quickTokenExpiration || Date.now() > account.quickTokenExpiration) {
            player.needsQT = true;
            Database.updatePartialData(
                account._id,
                { quickToken: null, quickTokenExpiration: null },
                Collections.Accounts,
            );
            alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
            return;
        }

        LoginController.tryLogin(player, { id: discord }, account);
    }

    static async handleNoQuickToken(player: alt.Player): Promise<void> {
        player.needsQT = true;
        alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
    }

    static bindPlayerToID(player: alt.Player): void {
        if (!player || !player.valid || !player.data) {
            return;
        }

        UserRelation[player.id] = player.data._id.toString();
    }

    static getDatabaseIdForPlayer(id: number): string | null {
        return UserRelation[id];
    }
}

EventController.onPlayer(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, LoginController.bindPlayerToID);
alt.onClient(SYSTEM_EVENTS.QUICK_TOKEN_NONE, LoginController.handleNoQuickToken);
alt.onClient(SYSTEM_EVENTS.QUICK_TOKEN_EMIT, LoginController.tryDiscordQuickToken);
alt.on('playerDisconnect', LoginController.tryDisconnect);
