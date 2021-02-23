import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Chat } from '../../../shared/enums/views';
import { Command } from '../../../shared/interfaces/Command';
import { disableAllControls } from '../../utility/disableControls';
import { handleFreezePlayer } from '../../utility/freeze';
import './controllers/audioController';
import './controllers/chatController';
import './controllers/helpController';
import './controllers/leaderBoardController';

const url = `http://resource/client/views/hud/html/index.html`;

export enum HudEventNames {
    SetVehicle = 'hud:SetVehicle',
    Seatbelt = 'hud:Seatbelt',
    Fuel = 'hud:SetFuel',
    Interact = 'hud:SetInteract',
    Food = 'hud:SetFood',
    Water = 'hud:SetWater',
    Speed = 'hud:Speed',
    Lock = 'hud:SetLock',
    Engine = 'hud:SetEngine',
    Lights = 'hud:SetLights',
    Objective = 'hud:SetObjective'
}

export class BaseHUD {
    static isOpen: boolean = false;
    static view: alt.WebView;

    static createView() {
        if (!BaseHUD.view) {
            BaseHUD.view = new alt.WebView(url, false);
            BaseHUD.view.isVisible = false;
            BaseHUD.view.on('chat:Send', BaseHUD.handleNewMessage);
            BaseHUD.view.on('mouse:Focus', BaseHUD.handleFocus);

            alt.setTimeout(() => {
                if (native.isScreenFadedOut()) {
                    native.doScreenFadeIn(2000);
                }
            }, 1000);
        }

        BaseHUD.view.unfocus();
    }

    static setHudStatus(name: HudEventNames, value: any) {
        BaseHUD.view.emit(name, value);
    }

    static updateSpeed(speed: string) {
        BaseHUD.view.emit(HudEventNames.Speed, speed);

        if (alt.Player.local.vehicle) {
            BaseHUD.view.emit(HudEventNames.Lock, alt.Player.local.vehicle.lockStatus);
            BaseHUD.view.emit(HudEventNames.Engine, alt.Player.local.vehicle.engineStatus);

            const [lightsOn, highBeams] = native.getVehicleLightsState(alt.Player.local.vehicle.scriptID, false, false);
            BaseHUD.view.emit(HudEventNames.Lights, lightsOn);
        }
    }

    static populateCommands(commandList: Array<Partial<Command>>): void {
        handleFreezePlayer(false);

        alt.log(`[Athena] Registered Commands: ${commandList.length}`);
        BaseHUD.view.emit('chat:PopulateCommands', commandList);
        BaseHUD.view.isVisible = true;
    }

    static processMetaChange(key: string, value: any, oldValue: any) {
        if (key === 'food') {
            BaseHUD.view.emit(HudEventNames.Food, value);
        }

        if (key === 'water') {
            BaseHUD.view.emit(HudEventNames.Water, value);
        }
    }

    static pauseStreamPlayer() {
        BaseHUD.view.emit('hud:PauseStream');
    }

    static adjustStreamPlayer(identifier: string, volume: number, startTime: number) {
        BaseHUD.view.emit('hud:AudioStream', identifier, volume, startTime);
    }

    /**
     * Sends a chat message up from the WebView to the server chat.ts file.
     * @param {string} message
     */
    private static handleNewMessage(message: string): void {
        alt.toggleGameControls(true);
        disableAllControls(false);
        BaseHUD.isOpen = false;
        alt.Player.local.isChatOpen = false;

        // Handles Empty Messages
        if (!message) {
            return;
        }

        alt.emitServer(View_Events_Chat.Send, message);
    }

    private static handleFocus(shouldFocus: boolean): void {
        if (alt.isConsoleOpen()) {
            return;
        }

        try {
            alt.showCursor(shouldFocus);
        } catch (err) {
            return;
        }

        if (shouldFocus) {
            BaseHUD.view.focus();
            return;
        }

        BaseHUD.view.unfocus();
    }
}

alt.on('enteredVehicle', () => BaseHUD.setHudStatus(HudEventNames.SetVehicle, true));
alt.on('leftVehicle', () => BaseHUD.setHudStatus(HudEventNames.SetVehicle, false));
alt.on(SYSTEM_EVENTS.META_CHANGED, BaseHUD.processMetaChange);
alt.onServer(SYSTEM_EVENTS.TICKS_START, BaseHUD.createView);
alt.onServer(SYSTEM_EVENTS.POPULATE_COMMANDS, BaseHUD.populateCommands);
