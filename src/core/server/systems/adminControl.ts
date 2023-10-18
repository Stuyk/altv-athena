import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { AdminControl, AdminControlEvents } from '@AthenaShared/interfaces/adminControl.js';

type PlayerCallback = (player: alt.Player, ...args: any[]) => void;

const AdminControls: Array<AdminControl & { callback: PlayerCallback }> = [];

/**
 * Creates a restricted admin control function.
 *
 * When a function is invoked it is automatically checked for proper permissions.
 *
 * @export
 * @param {AdminControl} control
 * @param {Function} callback
 */
export function addControl(control: AdminControl, callback: PlayerCallback): boolean {
    if (AdminControls.find((x) => x.uid === control.uid)) {
        return false;
    }

    const restrictedCallback = Athena.utility.restrict.create(callback, {
        strategy: 'hasOne',
        notify: `Permission Denied: ${control.name.toLowerCase()} `,
        permissions: { account: control.permissions, character: [] },
    });

    AdminControls.push({ ...control, callback: restrictedCallback });
    return true;
}

/**
 * Get all admin controls available for a player.
 *
 * @export
 * @param {alt.Player} player
 * @return {Array<AdminControl>}
 */
export function getControls(player: alt.Player) {
    const data = Athena.document.account.get(player);
    if (typeof data === 'undefined') {
        return [];
    }

    if (typeof data.permissions === 'undefined') {
        return [];
    }

    return JSON.parse(
        JSON.stringify(
            AdminControls.filter((control) => Athena.systems.permission.hasOne('account', player, control.permissions)),
        ),
    );
}

/**
 * Parses controls and pushes them down to the client. Updating their control list.
 *
 * @param {alt.Player} player
 * @return {*}
 */
export function updateControls(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    player.emit(AdminControlEvents.toClient.controls, getControls(player));
}

/**
 * Invokes the callback function attached to an admin control.
 *
 * @param {alt.Player} player
 * @param {string} uid
 * @param {...any[]} args
 * @return {}
 */
function handleInvoke(player: alt.Player, uid: string, ...args: any[]) {
    const index = AdminControls.findIndex((x) => x.uid === uid);
    if (index <= -1) {
        return;
    }

    if (typeof AdminControls[index].callback !== 'function') {
        return;
    }

    AdminControls[index].callback(player, ...args);
}

alt.onClient(AdminControlEvents.toServer.invoke, handleInvoke);
Athena.player.events.on('selected-character', updateControls);
