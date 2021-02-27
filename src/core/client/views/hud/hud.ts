import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from 'core/shared/enums/system';
import { View_Events_Chat } from 'core/shared/enums/views';
import { Command } from 'core/shared/interfaces/Command';
import { disableAllControls } from '../../utility/disableControls';
import { handleFreezePlayer } from '../../utility/freeze';
import { ActionsController } from './controllers/actionsController';
import './controllers/audioController';
import './controllers/chatController';
import './controllers/helpController';
import './controllers/leaderBoardController';

// const url = `http://127.0.0.1:5500/src/core/client/views/hud/html/index.html`;
const url = `http://resource/client/views/hud/html/index.html`;

let commandList: Array<any> = [];

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
            BaseHUD.view.on('commands:Update', BaseHUD.updateCommands);
            BaseHUD.view.on('actions:Navigate', ActionsController.navigate);
            BaseHUD.view.on('actions:Close', ActionsController.closed);
            BaseHUD.view.on('actions:LeftRight', ActionsController.leftRight);
            BaseHUD.view.on('actions:Trigger', ActionsController.trigger);

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
        if (!alt.Player.local.vehicle) {
            return;
        }

        BaseHUD.view.emit(HudEventNames.Speed, speed);
        BaseHUD.view.emit(HudEventNames.Fuel, alt.Player.local.vehicle.fuel);

        if (alt.Player.local.vehicle) {
            BaseHUD.view.emit(HudEventNames.Lock, alt.Player.local.vehicle.lockStatus);
            BaseHUD.view.emit(HudEventNames.Engine, alt.Player.local.vehicle.engineStatus);

            native.getVehicleLightsState;

            const [_, lightsOn, highBeams] = native.getVehicleLightsState(
                alt.Player.local.vehicle.scriptID,
                false,
                false
            );

            BaseHUD.view.emit(HudEventNames.Lights, lightsOn || highBeams ? true : false);
        }
    }

    static populateCommands(_commandList: Array<Partial<Command>>): void {
        commandList = _commandList;
        handleFreezePlayer(false);
        BaseHUD.updateCommands();
        alt.log(`[Athena] Registered Commands: ${commandList.length}`);
    }

    static updateCommands() {
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

        // Add a small delay to allow keybinds to go off.
        alt.setTimeout(() => {
            alt.Player.local.isChatOpen = false;
        }, 150);

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
