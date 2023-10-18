import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

export type Callback = (player: alt.Player, ...args: any[]) => void;

export interface ServerRpcEvent {
    /**
     * A general purpose name for the event.
     *
     * @type {string}
     * @memberof ServerRpcEvent
     */
    eventName: string;

    /**
     * Arguments to pass down to the client.
     *
     * @type {any[]}
     * @memberof ServerRpcEvent
     */
    args?: any[];

    /**
     * Kick, and log the user for not responding to an event.
     *
     * The value should be a message to send to the user.
     *
     * @type {string}
     * @memberof ServerRpcEvent
     */
    kickOnNoResponse?: string;

    /**
     * Timeout before the event is unregistered and removed.
     *
     * @type {number}
     * @memberof ServerRpcEvent
     */
    msTimeout: number;
}

/**
 * Invoke an RPC event, and get a result.
 *
 * If the timeout expires; the callback will pass undefined.
 *
 * #### Example
 * ```ts
 * Athena.systems.rpc.invoke(somePlayer, 'getLocalPos', (player: alt.Player, pos: alt.IVector3) => {
 *      alt.log('RPC Position was' + JSON.stringify(pos));
 * })
 * ```
 *
 * @export
 * @template T
 * @param {alt.Player} player
 * @param {ServerRpcEvent} event
 * @param {(...T) => void} callback
 * @return {*}
 */
export function invoke(player: alt.Player, event: ServerRpcEvent, callback: Callback) {
    // Construct instanced event name
    // Randomize it to help with collisions as well
    const instancedName = Athena.utility.hash.sha256Random(`rpc:${player.id}:${event.eventName}`);

    const callbackHandler = (player: alt.Player, ...args: any[]) => {
        alt.clearTimeout(timeout);
        callback(player, ...args);
    };

    const timeoutHandler = () => {
        alt.offClient(instancedName, callbackHandler);
        if (!event.kickOnNoResponse) {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        const mongoId = data && data._id ? data._id : 'Not Logged In';
        alt.log(`${event.eventName} was called, but no response. ID: ${player.id} | MongoDB: ${mongoId}`);
        player.kick(event.kickOnNoResponse);
    };

    // Clear old event if time is exceeded
    const timeout = alt.setTimeout(timeoutHandler, event.msTimeout);

    // Automatically unregisters itself once a client has pushed up the data
    alt.onceClient(instancedName, callbackHandler);

    // Call normal event name, and pass arguments down
    if (event.args) {
        player.emit(event.eventName, instancedName, ...event.args);
        return;
    }

    player.emit(event.eventName, instancedName);
}
