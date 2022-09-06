import * as alt from 'alt-server';
import { Athena } from '../api/athena';
import { AgendaOrder, AgendaSystem } from './agenda';

let callback: (player: alt.Player) => Promise<void>;

export class DevModeOverride {
    static setDevAccountCallback(cb: (player: alt.Player) => Promise<void>) {
        callback = cb;
    }

    /**
     * Overrides the default login and uses a single account for all users.
     * This acts a way to login to multiple accounts under multiple instances of GTA:V.
     *
     * Used as a way to setup general player info for dev mode.
     *
     * @param player - alt.Player - The player that is logging in.
     * @returns None
     */
    static async login(player: alt.Player) {
        if (!callback) {
            alt.logError(
                `DevModeOverride.setDevAccountCallback was not defined. A login system must have a dev callback.`,
            );
            return;
        }

        await callback(player);
        AgendaSystem.initPlayer(player);
        AgendaSystem.goToAgenda(player, AgendaOrder.CHARACTER_SELECT);
    }
}
