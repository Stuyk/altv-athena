import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Discord } from '../../shared/enums/views';
import { Permissions } from '../../shared/flags/permissions';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import VehicleFuncs from '../extensions/VehicleFuncs';
import { Account } from '../interface/Account';
import { Collections } from '../interface/DatabaseCollections';
import { DiscordUser } from '../interface/DiscordUser';
import Ares from '../utility/ares';
import { goToCharacterSelect } from '../views/characters';
import { EventController } from './athenaEvent';
import { OptionsController } from './options';

import '../views/login';
import './job';
import './marker';
import './textlabel';
import './tick';
import './voice';

const UserRelation: { [key: number]: string } = {};

export class LoginController {
    static async tryLogin(player: alt.Player, data: Partial<DiscordUser>, account: Partial<Account>): Promise<void> {
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
                Collections.Accounts
            );
            if (!accountData) {
                const newDocument: Partial<Account> = {
                    discord: player.discord.id,
                    ips: [player.ip],
                    hardware: [player.hwidHash, player.hwidExHash],
                    lastLogin: Date.now(),
                    permissionLevel: Permissions.None
                };

                account = await Database.insertData<Partial<Account>>(newDocument, Collections.Accounts, true);
            } else {
                account = accountData;
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

        VehicleFuncs.despawnAll(LoginController.getDatabaseIdForPlayer(player.id));

        if (!player.data.name) {
            return;
        }

        alt.log(`${player.data.name} has logged out.`);
        playerFuncs.save.onTick(player);
    }

    static async tryDiscordQuickToken(player: alt.Player, discord: string): Promise<void> {
        if (!discord) {
            return;
        }

        // Just enough unique data.
        const hashToken: string = Ares.getUniquePlayerHash(player, discord);
        const account: Partial<Account> | null = await Database.fetchData<Account>(
            'quickToken',
            hashToken,
            Collections.Accounts
        );

        if (!account) {
            player.needsQT = true;
            return;
        }

        if (!account.quickTokenExpiration || Date.now() > account.quickTokenExpiration) {
            player.needsQT = true;
            Database.updatePartialData(
                account._id,
                { quickToken: null, quickTokenExpiration: null },
                Collections.Accounts
            );
            return;
        }

        LoginController.tryLogin(player, { id: discord }, account);
    }

    static async handleNoQuickToken(player: alt.Player): Promise<void> {
        player.needsQT = true;
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
alt.on('Discord:Login', LoginController.tryLogin);
