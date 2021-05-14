import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Chat } from '../../../shared/enums/views';
import { Command } from '../../../shared/interfaces/Command';
import { handleFrontendSound } from '../../systems/sound';
import { disableAllAttacks, disableAllControls } from '../../utility/disableControls';
import { handleFreezePlayer } from '../../utility/freeze';
import { ActionsController } from './controllers/actionsController';
import './controllers/audioController';
import './controllers/chatController';
import './controllers/helpController';
import './controllers/leaderBoardController';
import { PhoneController } from './controllers/phoneController';

// const url = `http://127.0.0.1:5500/src/core/client/views/hud/html/index.html`;
const url = `http://resource/client/views/hud/html/index.html`;

let commandList: Array<any> = [];
let interval: number;

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
            BaseHUD.view.on('phone:Event', PhoneController.routeFromPhone);
            BaseHUD.view.on('play:Sound', handleFrontendSound);

            PhoneController.initializeApps();

            alt.setTimeout(() => {
                if (native.isScreenFadedOut()) {
                    native.doScreenFadeIn(2000);
                }
            }, 1000);
        }

        BaseHUD.view.unfocus();
    }

    static setHudStatus(name: HudEventNames, value: any) {
        if (!BaseHUD.view) {
            return;
        }

        BaseHUD.view.emit(name, value);

        if (name !== HudEventNames.SetVehicle) {
            return;
        }

        if (!value) {
            return;
        }

        BaseHUD.setHudStatus(HudEventNames.Fuel, alt.Player.local.vehicle.fuel);
    }

    static updateSpeed(speed: string) {
        if (!BaseHUD.view) {
            return;
        }

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
        if (!BaseHUD.view) {
            return;
        }

        BaseHUD.view.emit('chat:PopulateCommands', commandList);
        BaseHUD.view.isVisible = true;
    }

    static processMetaChange(key: string, value: any, oldValue: any) {
        if (!BaseHUD.view) {
            return;
        }

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

    static setHudVisibility(value: boolean) {
        if (!BaseHUD.view) {
            return;
        }

        if (!value) {
            BaseHUD.view.isVisible = false;
            native.displayRadar(false);
            return;
        }

        BaseHUD.view.isVisible = true;
        native.displayRadar(true);
        return;
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

            if (!message) {
                return;
            }

            alt.emitServer(View_Events_Chat.Send, message);
        }, 100);
    }

    private static handleFocus(shouldFocus: boolean, focusName: string): void {
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
            interval = alt.setInterval(() => {
                native.disableControlAction(0, 1, true);
                native.disableControlAction(0, 2, true);
                native.disableControlAction(0, 3, true);
                native.disableControlAction(0, 4, true);
                native.disableControlAction(0, 5, true);
                native.disableControlAction(0, 6, true);
                native.disableControlAction(0, 24, true);
                native.disableControlAction(0, 25, true);
                native.disableControlAction(0, 68, true);
                native.disableControlAction(0, 69, true);
                native.disableControlAction(0, 70, true);
                native.disableControlAction(0, 91, true);
                native.disableControlAction(0, 92, true);
                native.disableControlAction(0, 114, true);
                native.disableControlAction(0, 142, true);
            }, 0);

            alt.Player.local[focusName] = true;
            disableAllAttacks(true);
            return;
        }

        if (interval) {
            alt.clearInterval(interval);
        }

        alt.Player.local[focusName] = false;
        BaseHUD.view.unfocus();
        disableAllAttacks(false);
    }
}

alt.on('enteredVehicle', () => BaseHUD.setHudStatus(HudEventNames.SetVehicle, true));
alt.on('leftVehicle', () => BaseHUD.setHudStatus(HudEventNames.SetVehicle, false));
alt.on(SYSTEM_EVENTS.META_CHANGED, BaseHUD.processMetaChange);
alt.onServer(SYSTEM_EVENTS.TICKS_START, BaseHUD.createView);
alt.onServer(SYSTEM_EVENTS.POPULATE_COMMANDS, BaseHUD.populateCommands);
