import * as alt from 'alt-client';
import * as native from 'natives';
import { HUD_COMPONENT } from '../../shared/enums/HudComponents';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { VEHICLE_STATE } from '../../shared/enums/Vehicle';
import IClientInteraction from '../../shared/interfaces/IClientInteraction';
import IHudComponent from '../../shared/interfaces/IHudComponent';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { World } from '../systems/world';

const PAGE_NAME = 'Hud';
const RegisteredComponents: { [key: string]: IHudComponent } = {};

let interval;
let isDisabled = false;
let interactions: Array<IClientInteraction> = [];
let customInteractions: Array<IClientInteraction> = [];
let hasRegistered = false;

export class HudView implements ViewModel {
    static async open() {
        if (!hasRegistered) {
            WebViewController.registerOverlay(PAGE_NAME, HudView.setVisible);
            hasRegistered = true;
        }

        const view = await WebViewController.get();
        WebViewController.openPages([PAGE_NAME]);
        view.on(`${PAGE_NAME}:Ready`, HudView.ready);
    }

    static async setVisible(value: boolean) {
        isDisabled = !value;

        if (!isDisabled) {
            native.displayRadar(true);
            HudView.open();
            return;
        }

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, HudView.ready);
        WebViewController.closePages([PAGE_NAME]);
        native.displayRadar(false);
    }

    static addCustomInteraction(_interaction: IClientInteraction) {
        const index = customInteractions.findIndex((x) => x.uid === _interaction.uid);
        if (index >= 0) {
            customInteractions[index] = {
                uid: _interaction.uid,
                ..._interaction,
            };
        } else {
            customInteractions.push({
                uid: _interaction.uid,
                ..._interaction,
            });
        }
    }

    static removeCustomInteraction(uid: string) {
        const index = customInteractions.findIndex((x) => x.uid === uid);
        if (index <= -1) {
            return;
        }

        customInteractions.splice(index, 1);
    }

    static async setInteractions(_interactions: Array<IClientInteraction>) {
        interactions = _interactions;
    }

    static async ready() {
        if (interval) {
            alt.clearInterval(interval);
        }

        // Standard Walking Components
        HudView.registerComponent(HUD_COMPONENT.HEALTH, HudView.defaultHealthComponent, 50);
        HudView.registerComponent(HUD_COMPONENT.ARMOUR, HudView.defaultArmourComponent, 50);
        HudView.registerComponent(HUD_COMPONENT.CASH, HudView.defaultCashComponent, 1000);
        HudView.registerComponent(HUD_COMPONENT.BANK, HudView.defaultBankComponent, 1000);
        HudView.registerComponent(HUD_COMPONENT.TIME, HudView.defaultTimeComponent, 5000);
        HudView.registerComponent(HUD_COMPONENT.WATER, HudView.defaultWaterComponent, 1000);
        HudView.registerComponent(HUD_COMPONENT.FOOD, HudView.defaultFoodComponent, 1000);
        HudView.registerComponent(HUD_COMPONENT.INTERACTIONS, HudView.defaultInteractionsComponent, 500);

        // Vehicle Components
        HudView.registerComponent(HUD_COMPONENT.IS_IN_VEHICLE, HudView.defaultIsInVehicleComponent, 1000);
        HudView.registerComponent(HUD_COMPONENT.SPEED, HudView.defaultSpeedComponent, 100);
        HudView.registerComponent(HUD_COMPONENT.GEAR, HudView.defaultGearComponent, 100);
        HudView.registerComponent(HUD_COMPONENT.ENGINE, HudView.defaultEngineComponent, 100);
        HudView.registerComponent(HUD_COMPONENT.LOCK, HudView.defaultLockComponent, 100);
        HudView.registerComponent(HUD_COMPONENT.METRIC, HudView.defaultMetricComponent, 2500);
        HudView.registerComponent(HUD_COMPONENT.FUEL, HudView.defaultFuelComponent, 5000);

        interval = alt.setInterval(HudView.renderComponents, 0);
    }

    static renderComponents() {
        alt.beginScaleformMovieMethodMinimap('SETUP_HEALTH_ARMOUR');
        native.scaleformMovieMethodAddParamInt(3);
        native.endScaleformMovieMethod();

        if (isDisabled) {
            return;
        }

        Object.keys(RegisteredComponents).forEach((key) => {
            const component = RegisteredComponents[key];

            if (Date.now() <= component.lastUpdate) {
                return;
            }

            RegisteredComponents[key].lastUpdate = Date.now() + RegisteredComponents[key].msBetweenUpdates;
            RegisteredComponents[key].callback(key);
        });
    }

    static async passComponentInfo(propName: string, value: any, isJSON = false) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetProp`, propName, value, isJSON);
    }

    /**
     * Register a component for the HUD.
     * You should pass the data inside the callback with:
     * 'HudView.passComponentInfo()'
     * @static
     * @param {number} [msBetweenUpdates=1000]
     * @param {(propName: string) => void, msBetweenUpdates: number = 1000} callback
     * @memberof HudView
     */
    static registerComponent(uid: string, callback: (propName: string) => void, msBetweenUpdates: number = 1000) {
        RegisteredComponents[uid] = {
            callback,
            msBetweenUpdates,
            lastUpdate: Date.now(),
        };
    }

    /**
     * Remove a component to render on the HUD.
     * It simply stops it from pushing data the CEF but does not stop it from drawing.
     * @static
     * @param {string} uid
     * @memberof HudView
     */
    static unregisterComponent(uid: string) {
        isDisabled = true;

        if (RegisteredComponents[uid]) {
            delete RegisteredComponents[uid];
        }

        isDisabled = false;
    }

    static defaultTimeComponent() {
        HudView.passComponentInfo('time', World.getTimeAsString());
    }

    static defaultFuelComponent(propName: string) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        let fuel = 100;

        if (alt.Player.local.vehicle.hasSyncedMeta(VEHICLE_STATE.FUEL)) {
            fuel = alt.Player.local.vehicle.getSyncedMeta(VEHICLE_STATE.FUEL);
        }

        HudView.passComponentInfo(propName, parseInt(fuel.toFixed(0)));
    }

    static defaultSpeedComponent(propName: string) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const isMetric = native.getProfileSetting(227);
        const currentSpeed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
        const speedCalc = (currentSpeed * (isMetric ? 3.6 : 2.236936)).toFixed(0);
        HudView.passComponentInfo(propName, parseInt(speedCalc));
    }

    static defaultMetricComponent(propName: string) {
        HudView.passComponentInfo(propName, native.getProfileSetting(227) === 1);
    }

    static defaultIsInVehicleComponent(propName: string) {
        HudView.passComponentInfo(propName, alt.Player.local.vehicle ? true : false);
    }

    static defaultWaterComponent(propName: string) {
        const water = alt.Player.local.meta.water;
        HudView.passComponentInfo(propName, water !== undefined && water !== null ? parseInt(water.toFixed(0)) : 100);
    }

    static defaultFoodComponent(propName: string) {
        const food = alt.Player.local.meta.food;
        HudView.passComponentInfo(propName, food !== undefined && food !== null ? parseInt(food.toFixed(0)) : 100);
    }

    static defaultCashComponent(propName: string) {
        const value = alt.Player.local.meta.cash ? alt.Player.local.meta.cash : 0;
        const fixedValue = parseFloat(value.toFixed(0));
        HudView.passComponentInfo(propName, fixedValue);
    }

    static defaultBankComponent(propName: string) {
        const value = alt.Player.local.meta.bank ? alt.Player.local.meta.bank : 0;
        const fixedValue = parseFloat(value.toFixed(0));
        HudView.passComponentInfo(propName, fixedValue);
    }

    static defaultGearComponent(propName: string) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        HudView.passComponentInfo(propName, alt.Player.local.vehicle.gear);
    }

    static defaultEngineComponent(propName: string) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const isEngineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);
        HudView.passComponentInfo(propName, isEngineOn);
    }

    static defaultLockComponent(propName: string) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const lockStatus = native.getVehicleDoorLockStatus(alt.Player.local.vehicle.scriptID) === 2;
        HudView.passComponentInfo(propName, lockStatus);
    }

    static defaultHealthComponent(propName: string) {
        HudView.passComponentInfo(propName, alt.Player.local.health - 1);
    }

    static defaultArmourComponent(propName: string) {
        HudView.passComponentInfo(propName, alt.Player.local.armour);
    }

    static defaultInteractionsComponent(propName) {
        HudView.passComponentInfo(propName, JSON.stringify(interactions.concat(customInteractions)), true);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, HudView.open);
alt.onServer(SYSTEM_EVENTS.INTERACTION_TEXT_CREATE, HudView.addCustomInteraction);
alt.onServer(SYSTEM_EVENTS.INTERACTION_TEXT_REMOVE, HudView.removeCustomInteraction);
