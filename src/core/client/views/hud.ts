import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { VEHICLE_STATE } from '../../shared/enums/Vehicle';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { World } from '../systems/world';

const PAGE_NAME = 'Hud';
const RegisteredComponents: { [key: string]: { callback: Function; msBetweenUpdates: number; lastUpdate?: number } } =
    {};

let interval;
let isDisabled = false;
let interactions: Array<{ keyPress: string; description: string }> = [];
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

    static async setInteractions(_interactions: Array<{ keyPress: string; description: string }>) {
        interactions = _interactions;
    }

    static async ready() {
        console.log('HUD Mounted');

        if (interval) {
            alt.clearInterval(interval);
        }

        // Standard Walking Components
        HudView.registerComponent('health', HudView.defaultHealthComponent, 50);
        HudView.registerComponent('armour', HudView.defaultArmourComponent, 50);
        HudView.registerComponent('cash', HudView.defaultCashComponent, 1000);
        HudView.registerComponent('bank', HudView.defaultBankComponent, 1000);
        HudView.registerComponent('time', HudView.defaultTimeComponent, 5000);
        HudView.registerComponent('water', HudView.defaultWaterComponent, 1000);
        HudView.registerComponent('food', HudView.defaultFoodComponent, 1000);
        HudView.registerComponent('interactions', HudView.defaultInteractionsComponent, 500);

        // Vehicle Components
        HudView.registerComponent('isInVehicle', HudView.defaultIsInVehicleComponent, 1000);
        HudView.registerComponent('speed', HudView.defaultSpeedComponent, 100);
        HudView.registerComponent('gear', HudView.defaultGearComponent, 100);
        HudView.registerComponent('engine', HudView.defaultEngineComponent, 100);
        HudView.registerComponent('lock', HudView.defaultLockComponent, 100);
        HudView.registerComponent('metric', HudView.defaultMetricComponent, 2500);
        HudView.registerComponent('fuel', HudView.defaultFuelComponent, 5000);

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
            RegisteredComponents[key].callback();
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
     * @param {() => void} callback
     * @memberof HudView
     */
    static registerComponent(uid: string, callback: () => void, msBetweenUpdates: number = 1000) {
        RegisteredComponents[uid] = {
            callback,
            msBetweenUpdates,
            lastUpdate: Date.now(),
        };
    }

    static defaultTimeComponent() {
        HudView.passComponentInfo('time', World.getTimeAsString());
    }

    static defaultFuelComponent() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        let fuel = 100;

        if (alt.Player.local.vehicle.hasSyncedMeta(VEHICLE_STATE.FUEL)) {
            fuel = alt.Player.local.vehicle.getSyncedMeta(VEHICLE_STATE.FUEL);
        }

        HudView.passComponentInfo('fuel', parseInt(fuel.toFixed(0)));
    }

    static defaultSpeedComponent() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const isMetric = native.getProfileSetting(227);
        const currentSpeed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
        const speedCalc = (currentSpeed * (isMetric ? 3.6 : 2.236936)).toFixed(0);
        HudView.passComponentInfo('speed', parseInt(speedCalc));
    }

    static defaultMetricComponent() {
        HudView.passComponentInfo('isMetric', native.getProfileSetting(227) === 1);
    }

    static defaultIsInVehicleComponent() {
        HudView.passComponentInfo('isInVehicle', alt.Player.local.vehicle ? true : false);
    }

    static defaultWaterComponent() {
        const water = alt.Player.local.meta.water;
        HudView.passComponentInfo('water', water !== undefined && water !== null ? parseInt(water.toFixed(0)) : 100);
    }

    static defaultFoodComponent() {
        const food = alt.Player.local.meta.food;
        HudView.passComponentInfo('food', food !== undefined && food !== null ? parseInt(food.toFixed(0)) : 100);
    }

    static defaultCashComponent() {
        const value = alt.Player.local.meta.cash ? alt.Player.local.meta.cash : 0;
        const fixedValue = parseFloat(value.toFixed(0));
        HudView.passComponentInfo('cash', fixedValue);
    }

    static defaultBankComponent() {
        const value = alt.Player.local.meta.bank ? alt.Player.local.meta.bank : 0;
        const fixedValue = parseFloat(value.toFixed(0));
        HudView.passComponentInfo('bank', fixedValue);
    }

    static defaultGearComponent() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        HudView.passComponentInfo('gear', alt.Player.local.vehicle.gear);
    }

    static defaultEngineComponent() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const isEngineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);
        HudView.passComponentInfo('engine', isEngineOn);
    }

    static defaultLockComponent() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const lockStatus = native.getVehicleDoorLockStatus(alt.Player.local.vehicle.scriptID) === 2;
        HudView.passComponentInfo('lock', lockStatus);
    }

    static defaultHealthComponent() {
        HudView.passComponentInfo('health', alt.Player.local.health - 1);
    }

    static defaultArmourComponent() {
        HudView.passComponentInfo('armour', alt.Player.local.armour);
    }

    static defaultInteractionsComponent() {
        HudView.passComponentInfo('interactions', JSON.stringify(interactions), true);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, HudView.open);
