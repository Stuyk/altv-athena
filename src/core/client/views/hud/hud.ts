import * as alt from 'alt-client';
import { commandList } from '../../../shared/commands/commandList';
import { Events_Misc } from '../../../shared/enums/events';
import { View_Events_Chat } from '../../../shared/enums/views';
import { distance2d } from '../../../shared/utility/vector';
import { disableAllControls } from '../../utility/disableControls';

const url = `http://resource/client/views/hud/html/index.html`;
let view: alt.WebView;
let isOpen: boolean = false;

alt.onServer(Events_Misc.StartTicks, handleView);
alt.onServer(View_Events_Chat.Append, handleAppend);

async function handleView() {
    if (!view) {
        view = new alt.WebView(url, false);
        view.on('chat:Send', handleNewMessage);
        view.on('chat:Inject', handleInject);
        view.on('mouse:Focus', handleFocus);
    }

    view.unfocus();
}

/**
 * Sends a chat message up from the WebView to the server chat.ts file.
 * @param {string} message
 */
function handleNewMessage(message: string): void {
    disableAllControls(false);
    isOpen = false;

    // Handles Empty Messages
    if (!message) {
        return;
    }

    alt.emitServer(View_Events_Chat.Send, message);
}

/**
 * Appends a chat message to the WebView.
 * @param {string} message
 * @return {*}
 */
function handleAppend(message: string): void {
    if (!view) {
        return;
    }

    view.emit('chat:Append', message);
}

function handleInject() {
    const myCommands = commandList.filter(
        (cmd) => cmd.permission === 0 || (alt.Player.local.meta.permissionLevel & cmd.permission) !== 0
    );

    view.emit('chat:Inject', myCommands);
}

function handleFocus(shouldFocus: boolean): void {
    try {
        alt.showCursor(shouldFocus);
    } catch (err) {
        return;
    }

    if (shouldFocus) {
        view.focus();
        return;
    }

    view.unfocus();
}

/**
 * Called from the keyup binds.
 * @export
 * @return {*}  {void}
 */
export function focusChat(): void {
    if (!view) {
        return;
    }

    if (isOpen) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    isOpen = true;
    view.emit('chat:Focus');
    disableAllControls(true);
}

export function focusLeaderBoard(): void {
    if (!view) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    const validPlayers = [...alt.Player.all]
        .filter((p) => p.getSyncedMeta('Ping'))
        .map((p) => {
            return {
                id: p.id,
                name: p.getSyncedMeta('Name'),
                ping: p.getSyncedMeta('Ping'),
                distance: distance2d(alt.Player.local.pos, p.getSyncedMeta('Position'))
            };
        })
        .sort((a, b) => a.distance - b.distance);

    view.emit('leaderboard:Toggle', validPlayers);
}
