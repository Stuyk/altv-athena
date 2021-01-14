import * as alt from 'alt-client';
import * as native from 'natives';
import { commandList } from '../../../shared/commands/commandList';
import { Events_Misc } from '../../../shared/enums/events';
import { View_Events_Chat } from '../../../shared/enums/views';
import { distance2d } from '../../../shared/utility/vector';
import { disableAllControls } from '../../utility/disableControls';
import { handleFreezePlayer } from '../../utility/freeze';
import { sleep } from '../../utility/sleep';
import { switchInPlayer } from '../../utility/switch';

const url = `http://resource/client/views/hud/html/index.html`;
let view: alt.WebView;
let isOpen: boolean = false;

alt.on('hud:PlayAudio3D', handle3DAudio);
alt.onServer(Events_Misc.StartTicks, handleView);
alt.onServer(View_Events_Chat.Append, handleAppend);

async function handleView() {
    if (!view) {
        view = new alt.WebView(url, false);
        view.isVisible = false;
        view.on('chat:Send', handleNewMessage);
        view.on('chat:Inject', handleInject);
        view.on('mouse:Focus', handleFocus);

        alt.setTimeout(() => {
            if (native.isScreenFadedOut()) {
                native.doScreenFadeIn(2000);
            }
        }, 1000);
    }

    view.unfocus();
}

/**
 * Sends a chat message up from the WebView to the server chat.ts file.
 * @param {string} message
 */
function handleNewMessage(message: string): void {
    alt.toggleGameControls(true);
    disableAllControls(false);
    isOpen = false;
    alt.Player.local.isChatOpen = false;

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

async function handleInject() {
    const myCommands = commandList.filter(
        (cmd) => cmd.permission === 0 || (alt.Player.local.meta.permissionLevel & cmd.permission) !== 0
    );

    await switchInPlayer(1500);
    await sleep(1500);
    handleFreezePlayer(false);

    view.emit('chat:Inject', myCommands);
    view.isVisible = true;
}

function handleFocus(shouldFocus: boolean): void {
    if (alt.isConsoleOpen()) {
        return;
    }

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

function handle3DAudio(soundName: string, pan: number, volume: number): void {
    if (!view) {
        return;
    }

    view.emit('hud:Audio3D', soundName, pan, volume);
}

/**
 * Called from the keyup binds.
 * @export
 * @return {*}  {void}
 */
export function focusChat(): void {
    if (alt.isConsoleOpen()) {
        return;
    }

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
    alt.Player.local.isChatOpen = true;
    alt.toggleGameControls(false);
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

/**
 * Displays text in the upper-left corner of the screen.
 * @export
 * @param {(number | null)} key Set to null if you want to clear help text.
 * @param {(string | null)} shortPressDescription
 * @param {(string | null)} longPressDescription
 * @return {*}  {void}
 */
export function updateHelpText(
    key: number | null,
    shortPressDescription: string | null,
    longPressDescription: string | null
): void {
    if (!view) {
        return;
    }

    view.emit('hud:HelpText', key, shortPressDescription, longPressDescription);
}
