export const AthenaTypeDef = `
/// <reference types="@altv/types-shared" />
/// <reference types="types-client" />
/// <reference types="types-server" />
declare module "src/core/client/camera/gameplay" {
    export function disable(): void;
    export function enable(): void;
}
declare module "src/core/client/camera/pedEdit" {
    import * as alt from 'alt-client';
    export function create(_scriptID: number, offset?: alt.IVector3, _isLocalPlayer?: boolean): Promise<void>;
    export function calculateCamOffset(offset: alt.IVector3): alt.IVector3;
    export function setCameraOffset(offset: alt.IVector3): void;
    export function exists(): boolean;
    export function destroy(): Promise<void>;
    export function disableControls(status: boolean): void;
    export function setCamParams(_zpos?: number, _fov?: number, _easeTime?: number): void;
    export function runQueue(): Promise<void>;
    export function update(id: number): void;
    export function handleControls(): void;
}
declare module "src/core/shared/enums/switchOutTypes" {
    export enum SWITCHOUT_TYPES {
        THREE_STEPS = 1,
        ONE_STEP = 2
    }
}
declare module "src/core/client/camera/switch" {
    import { SWITCHOUT_TYPES } from "src/core/shared/enums/switchOutTypes";
    export function switchToMultiSecondpart(timeInMs: number, switchType?: SWITCHOUT_TYPES): Promise<boolean>;
}
declare module "src/core/client/camera/index" {
    export * as cinematic from "src/core/client/camera/cinematic";
    export * as gameplay from "src/core/client/camera/gameplay";
    export * as pedEdit from "src/core/client/camera/pedEdit";
    export * as switch from "src/core/client/camera/switch";
}
declare module "src/core/shared/interfaces/wheelMenu" {
    export interface IWheelOption {
        name: string;
        uid?: string;
        color?: string;
        icon?: string;
        doNotClose?: boolean;
        emitServer?: string;
        emitClient?: string;
        data?: Array<any>;
        image?: string;
        bgImage?: string;
    }
    export interface IWheelOptionExt extends IWheelOption {
        callback?: (...args: any[]) => void;
    }
}
declare module "src/core/shared/flags/animationFlags" {
    export enum ANIMATION_FLAGS {
        NORMAL = 0,
        REPEAT = 1,
        STOP_LAST_FRAME = 2,
        UPPERBODY_ONLY = 16,
        ENABLE_PLAYER_CONTROL = 32,
        CANCELABLE = 120
    }
}
declare module "src/core/shared/interfaces/animation" {
    import * as alt from 'alt-shared';
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    export interface Animation {
        dict: string;
        name: string;
        flags: ANIMATION_FLAGS;
        duration: number;
    }
    export interface JobAnimation extends Animation {
        delay?: number;
        atObjectiveStart?: boolean;
        rotation?: alt.IVector3;
    }
}
declare module "src/core/shared/interfaces/iPed" {
    import * as alt from 'alt-shared';
    import { Animation } from "src/core/shared/interfaces/animation";
    export interface IPed {
        pos: alt.IVector3;
        model: string;
        heading?: number;
        maxDistance?: number;
        uid?: string;
        animations?: Animation[];
        randomizeAppearance?: boolean;
        local?: number;
        isBeingCreated?: boolean;
        dimension?: number;
    }
}
declare module "src/core/client/menus/npc" {
    import { IWheelOptionExt } from "src/core/shared/interfaces/wheelMenu";
    import { IPed } from "src/core/shared/interfaces/iPed";
    export type NpcMenuInjection = (scriptID: number, ped: IPed, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;
    export function addInjection(callback: NpcMenuInjection): void;
    export function open(scriptID: number): void;
}
declare module "src/core/shared/enums/system" {
    export enum SYSTEM_EVENTS {
        APPEND_BLIP = "append:Blip",
        APPEND_MARKER = "append:Marker",
        APPEND_TEXTLABELS = "append:TextLabel",
        APPEND_OBJECT = "append:Object",
        APPEND_PED = "append:Ped",
        APPEND_WORLD_NOTIFICATION = "append:WorldNotification",
        APPEND_POLYGON = "append:Polygon",
        ACCEPT_DECLINE_EVENT_SET = "accept:Decline:Event:Set",
        BOOTUP_ENABLE_ENTRY = "enable:Entry",
        BEGIN_CONNECTION = "connection:Begin",
        COMMANDS_LOADED = "commands:Loaded",
        DEBUG_COLSHAPE_VERTICES = "debug:Colshape:Vertices",
        DISCORD_OPEN = "discord:Open",
        DISCORD_CLOSE = "discord:Close",
        DISCORD_FAIL = "discord:Fail",
        DISCORD_LOGIN = "discord:Login",
        DISCORD_FINISH_AUTH = "discord:FinishAuth",
        ENTITYSET_ACTIVATE = "entityset:Activate",
        ENTITYSET_DEACTIVATE = "entityset:Deactivate",
        ENTITYSET_IS_ACTIVE = "entityset:IsActive",
        SET_GAME_TIME = "player:freeze:time",
        HOLOGRAM_APPEND = "hologram:Append",
        INTERACTION = "player:Interact",
        INTERACTION_FUEL = "fuel:Action",
        INTERACTION_JOB_ACTION = "job:Action",
        INTERACTION_TEXT_CREATE = "interaction:Text:Create",
        INTERACTION_TEXT_REMOVE = "interaction:Text:Remove",
        INTERACTION_TEMPORARY = "interaction:Temporary",
        INTERACTION_PICKUP_ITEM = "interaction:Pickup:Item",
        ITEM_CONSUME = "item:Consume",
        IPL_LOAD = "ipl:Load",
        IPL_UNLOAD = "ipl:Unload",
        MOVE_OBJECT = "object:move:around",
        NOCLIP_UPDATE = "noclip:Update",
        NOCLIP_RESET = "noclip:Reset",
        PLAYER_CUFF = "player:Cuff",
        PLAYER_UNCUFF = "player:Uncuff",
        PLAYER_EMIT_ALARM_START = "alarm:Start",
        PLAYER_EMIT_ALARM_STOP = "alarm:Stop",
        PLAYER_EMIT_ALARM_STOP_ALL = "alarm:StopAll",
        PLAYER_EMIT_ANIMATION = "animation:Play",
        PLAYER_EMIT_AMMUNITION_UPDATE = "player:emit:ammunition:update",
        PLAYER_EMIT_SCENARIO = "scenario:Play",
        PLAYER_EMIT_AUDIO_STREAM = "audio:Stream",
        PLAYER_EMIT_CREDITS = "credits:Create",
        PLAYER_EMIT_CREDITS_CLEAR = "credits:Clear",
        PLAYER_EMIT_ERROR_SCREEN = "errorScreen:Create",
        PLAYER_EMIT_ERROR_SCREEN_CLEAR = "errorScreen:Clear",
        PLAYER_EMIT_SOUND_2D = "sound:2D",
        PLAYER_EMIT_SOUND_3D = "sound:3D",
        PLAYER_EMIT_SOUND_STOP = "sound:Stop",
        PLAYER_EMIT_SOUND_3D_POSITIONAL = "sound:3D:positional",
        PLAYER_EMIT_FRONTEND_SOUND = "sound:Frontend",
        PLAYER_EMIT_NOTIFICATION = "notification:Show",
        PLAYER_EMIT_SPINNER = "spinner:Show",
        PLAYER_EMIT_SPINNER_CLEAR = "spinner:Clear",
        PLAYER_EMIT_SHARD = "shard:Create",
        PLAYER_EMIT_SHARD_CLEAR = "shard:Clear",
        PLAYER_EMIT_TASK_MOVE = "task:Move",
        PLAYER_EMIT_TASK_TIMELINE = "task:Timeline",
        PLAYER_EMIT_INVENTORY_NOTIFICATION = "inventory:Notification",
        PLAYER_EMIT_INVENTORY_SYNC = "inventory:Sync",
        PLAYER_EMIT_TEMP_OBJECT_LERP = "temp:Object:Lerp",
        PLAYER_EMIT_WHEEL_MENU = "wheelMenu:Dynamic",
        PLAYER_EMIT_MISSION_TEXT = "missionText:Create",
        PLAYER_SET_FREEZE = "freeze:Set",
        PLAYER_SET_DEATH = "death:Toggle",
        PLAYER_SET_INTERACTION = "interaction:Set",
        PLAYER_TICK = "player:Tick",
        PLAYER_TOOLBAR_INVOKE = "player:Toolbar:Invoke",
        PLAYER_TOOLBAR_ENABLE = "player:Toolbar:Enable",
        PLAYER_TOOLBAR_SET = "player:Toolbar",
        PLAYER_ITEM_CHANGE = "player:ItemChange",
        PLAY_PARTICLE_EFFECT = "ptfx:Play",
        PLAY_ANIMATION_FOR_PED = "animation:PlayForPed",
        PROGRESSBAR_CREATE = "progressbar:Create",
        PROGRESSBAR_REMOVE = "progressbar:Remove",
        POLYGON_ENTER = "polygon:Enter",
        POLYGON_LEAVE = "polygon:Leave",
        POPULATE_BLIPS = "blips:Populate",
        POPULATE_DOORS = "doors:Populate",
        POPULATE_MARKERS = "markers:Populate",
        POPULATE_COMMANDS = "commands:Populate",
        POPULATE_ITEMS = "items:Populate",
        POPULATE_INTERACTIONS = "interactions:Populate",
        POPULATE_TEXTLABELS = "labels:Populate",
        POPULATE_OBJECTS = "objects:Populate",
        POPULATE_PEDS = "peds:Populate",
        POPULATE_WORLD_NOTIFICATIONS = "worldNotifications:Populate",
        POPULATE_ITEM_DROPS = "item:drops:Populate",
        POPULATE_POLYGONS = "polygons:Populate",
        QUICK_TOKEN_UPDATE = "quicktoken:update",
        QUICK_TOKEN_FETCH = "quicktoken:fetch",
        REMOVE_GLOBAL_OBJECT = "remove:Global:Object",
        REMOVE_OBJECT = "remove:Object",
        REMOVE_GLOBAL_PED = "remove:Global:Object",
        REMOVE_PED = "remove:Object",
        REMOVE_MARKER = "remove:Marker",
        REMOVE_BLIP = "remove:Blip",
        REMOVE_TEXTLABEL = "remove:Textlabel",
        REMOVE_WORLD_NOTIFICATION = "remove:WorldNotification",
        REMOVE_POLYGON = "remove:Polygon",
        SET_ACTION_MENU = "actions:Set",
        SET_VIEW_URL = "actions:SetViewURL",
        SCREEN_TIMECYCLE_EFFECT_CLEAR = "screen:timecycle:effect:clear",
        SCREEN_TIMECYCLE_EFFECT = "screen:timecycle:effect",
        SCREEN_FADE_TO_BLACK = "screen:fade:to:black",
        SCREEN_FADE_FROM_BLACK = "screen:fade:from:black",
        SHOW_SCREEN_PLAYER_ID = "screen:player:id",
        SCREENSHOT_POPULATE_DATA = "screenshot:Populate:Data",
        SCREENSHOT_CREATE = "screenshot:Create",
        SET_PLAYER_DECORATIONS = "character:Ped:Decoration",
        SYNC_APPEARANCE = "character:Appearance",
        SYNC_EQUIPMENT = "character:Equipment",
        TICKS_START = "ticks:Start",
        UPDATE_DOORS = "update:Doors",
        UPDATE_TEXT_LABEL = "update:TextLabel",
        UPDATE_OBJECT = "update:Object",
        UPDATE_OBJECT_MODEL = "update:Object:Model",
        VEHICLE_ENGINE = "vehicle:Engine",
        VEHICLES_VIEW_SPAWN = "vehicles:Spawn",
        VEHICLES_VIEW_DESPAWN = "vehicles:Despawn",
        WORLD_UPDATE_TIME = "time:Update",
        WORLD_UPDATE_WEATHER = "weather:Update",
        VOICE_ADD = "voice:Add",
        VOICE_JOINED = "voice:Joined",
        WEBVIEW_INFO = "webview:Info",
        WEATHER_CHANGE_TO = "weather:change:to"
    }
}
declare module "src/core/shared/interfaces/iObject" {
    import * as alt from 'alt-shared';
    export interface IObject {
        uid?: string;
        subType?: string;
        pos: alt.IVector3;
        model: string;
        rot?: alt.IVector3;
        maxDistance?: number;
        dimension?: number;
        noCollision?: boolean;
    }
}
declare module "src/core/client/streamers/object" {
    import * as alt from 'alt-client';
    import { IObject } from "src/core/shared/interfaces/iObject";
    export type CreatedObject = IObject & {
        createdObject?: alt.Object;
    };
    export function addObject(newObject: IObject): void;
    export function removeObject(uid: string): void;
    export function getFromScriptId(scriptId: number): CreatedObject | undefined;
}
declare module "src/core/client/menus/object" {
    import { IWheelOptionExt } from "src/core/shared/interfaces/wheelMenu";
    import { CreatedObject } from "src/core/client/streamers/object";
    export type ObjectMenuInjection = (existingObject: CreatedObject, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;
    export function addInjection(callback: ObjectMenuInjection): void;
    export function open(object: CreatedObject): void;
}
declare module "src/core/client/menus/player" {
    import * as alt from 'alt-client';
    import { IWheelOptionExt } from "src/core/shared/interfaces/wheelMenu";
    export type PlayerMenuInjection = (target: alt.Player, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;
    export function addInjection(callback: PlayerMenuInjection): void;
    export function open(target: alt.Player): void;
}
declare module "src/core/shared/enums/vehicle" {
    export const VEHICLE_LOCK_STATE: {
        NO_LOCK: number;
        UNLOCKED: number;
        LOCKED: number;
        LOCKOUT_PLAYER: number;
        KIDNAP_MODE: number;
    };
    export const VEHICLE_EVENTS: {
        ACTION: string;
        INVOKE: string;
        SET_INTO: string;
        SET_LOCK: string;
        SET_DOOR: string;
        SET_ENGINE: string;
        SET_SEATBELT: string;
        PUSH: string;
        STOP_PUSH: string;
    };
}
declare module "src/core/client/menus/vehicle" {
    import * as alt from 'alt-client';
    import { IWheelOptionExt } from "src/core/shared/interfaces/wheelMenu";
    export type VehicleMenuInjection = (target: alt.Vehicle, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;
    export function addInjection(callback: VehicleMenuInjection): void;
    export function openInVehicleMenu(vehicle: alt.Vehicle): void;
    export function open(vehicle: alt.Vehicle): void;
}
declare module "src/core/client/menus/index" {
    export * as npc from "src/core/client/menus/npc";
    export * as object from "src/core/client/menus/object";
    export * as player from "src/core/client/menus/player";
    export * as vehicle from "src/core/client/menus/vehicle";
}
declare module "src/core/shared/interfaces/messageCommand" {
    export type CommandCallback<T> = (player: T, ...args: any[]) => void;
    export interface MessageCommand<T> {
        name: string;
        description: string;
        permissions: Array<string>;
        isCharacterPermission?: boolean;
        callback: CommandCallback<T>;
    }
    export interface DetailedCommand extends Omit<MessageCommand<null>, 'callback'> {
        params: Array<string>;
    }
}
declare module "src/core/client/rmlui/commands/index" {
    import { MessageCommand } from "src/core/shared/interfaces/messageCommand";
    interface CommandInput {
        placeholder: string;
        commands: Array<Omit<MessageCommand<any>, 'callback'>>;
    }
    export function create(inputInfo: CommandInput, skipMenuCheck?: boolean): Promise<string | undefined>;
    export function cancel(): Promise<void>;
    export function isOpen(): boolean;
}
declare module "src/core/client/rmlui/input/index" {
    export interface InputBoxInfo {
        placeholder: string;
        blur?: boolean;
        darken?: boolean;
        hideHud?: boolean;
    }
    export function create(inputInfo: InputBoxInfo, skipMenuCheck?: boolean): Promise<string | undefined>;
    export function cancel(): Promise<void>;
}
declare module "src/core/shared/utility/color" {
    import * as alt from 'alt-shared';
    export function rgbaToHexAlpha(color: alt.RGBA): string;
}
declare module "src/core/client/rmlui/menu/menuInterfaces" {
    import * as alt from 'alt-client';
    interface MenuOptionBase<T = Function> {
        title: string;
        description: string;
        callback: T | Function;
        onlyUpdateOnEnter?: boolean;
    }
    export interface Selection extends MenuOptionBase<(value: string) => void> {
        type: 'Selection';
        options: Array<string>;
        value: number;
        onlyUpdateOnEnter?: boolean;
    }
    export interface Toggle extends MenuOptionBase<(value: boolean) => void> {
        type: 'Toggle';
        value: boolean;
    }
    export interface Range extends MenuOptionBase<(value: number) => void> {
        type: 'Range';
        value: number;
        min: number;
        max: number;
        increment: number;
        onlyUpdateOnEnter?: boolean;
    }
    export interface Invoke extends MenuOptionBase<() => void> {
        type: 'Invoke';
    }
    export interface MenuInfo {
        header: {
            title: string;
            color: alt.RGBA | string;
        };
        options: Array<Selection | Range | Toggle | Invoke>;
    }
}
declare module "src/core/client/rmlui/menu/index" {
    import { Invoke, Toggle, Selection, Range, MenuInfo } from "src/core/client/rmlui/menu/menuInterfaces";
    export function create(info: MenuInfo): void;
    export function close(): Promise<void>;
    export function createOption<T = Selection | Range | Toggle | Invoke>(menuTemplate: T): T;
}
declare module "src/core/client/rmlui/menu3d/menu3DInterfaces" {
    export interface OptionFor3DMenu {
        name: string;
        callback: () => void;
    }
}
declare module "src/core/client/rmlui/menu3d/index" {
    import * as alt from 'alt-client';
    import { OptionFor3DMenu } from "src/core/client/rmlui/menu3d/menu3DInterfaces";
    export function create(pos: alt.IVector3, options: Array<OptionFor3DMenu>, maxDistance?: number): void;
    export function close(): Promise<void>;
}
declare module "src/core/shared/interfaces/progressBar" {
    import * as alt from 'alt-shared';
    export interface ProgressBar {
        uid?: string;
        position: {
            x: number;
            y: number;
            z: number;
        };
        color: alt.RGBA;
        milliseconds: number;
        distance: number;
        text?: string;
        percentageEnabled?: boolean;
        startTime?: number;
        finalTime?: number;
    }
}
declare module "src/core/client/rmlui/progressbar/index" { }
declare module "src/core/client/rmlui/question/index" {
    export interface QuestionInfo {
        buttons?: {
            accept: string;
            decline: string;
        };
        placeholder: string;
        blur?: boolean;
        darken?: boolean;
        hideHud?: boolean;
    }
    export function create(info: QuestionInfo): Promise<boolean>;
    export function cancel(): Promise<void>;
}
declare module "src/core/client/rmlui/sprites/index" {
    import * as alt from 'alt-client';
    export interface SpriteInfo {
        uid: string;
        path: string;
        width: number;
        height: number;
        position: alt.IVector3;
        callOnceOnTouch?: (uid: string) => void;
    }
    export function create(sprite: SpriteInfo): void;
    export function remove(uid: string): void;
    export function update(uid: string, sprite: Partial<SpriteInfo>): void;
}
declare module "src/core/client/rmlui/staticText/staticTextInterfaces" {
    import * as alt from 'alt-client';
    export interface StaticTextInfo {
        uid: string;
        text: string;
        position: alt.IVector3;
        distance: number;
    }
}
declare module "src/core/client/rmlui/staticText/index" {
    import { StaticTextInfo } from "src/core/client/rmlui/staticText/staticTextInterfaces";
    export function upsert(drawable: StaticTextInfo): void;
    export function remove(uid: string): void;
}
declare module "src/core/client/rmlui/index" {
    export * as commands from "src/core/client/rmlui/commands/index";
    export * as input from "src/core/client/rmlui/input/index";
    export * as menu from "src/core/client/rmlui/menu/index";
    export * as menu3d from "src/core/client/rmlui/menu3d/index";
    export * as progressbar from "src/core/client/rmlui/progressbar/index";
    export * as question from "src/core/client/rmlui/question/index";
    export * as sprites from "src/core/client/rmlui/sprites/index";
    export * as staticText from "src/core/client/rmlui/staticText/index";
}
declare module "src/core/shared/enums/creditAlign" {
    export enum CREDIT_ALIGN {
        LEFT = "left",
        RIGHT = "right",
        CENTER = "center"
    }
}
declare module "src/core/shared/interfaces/iCredit" {
    import { CREDIT_ALIGN } from "src/core/shared/enums/creditAlign";
    export default interface ICredit {
        role: string;
        name: string;
        duration: number;
        align?: string | CREDIT_ALIGN;
    }
}
declare module "src/core/client/screen/scaleform" {
    export class Scaleform {
        private id;
        constructor(hash: number);
        hasLoaded(): boolean;
        passFunction(functionName: string, ...args: Array<any>): number;
        destroy(): void;
        render(x: number, y: number, width: number, height: number): void;
    }
    export function requestScaleForm(scaleformName: string): Promise<Scaleform>;
}
declare module "src/core/client/screen/credits" {
    import ICredit from "src/core/shared/interfaces/iCredit";
    export function clear(): void;
    export function create(credit: ICredit): Promise<void>;
}
declare module "src/core/shared/interfaces/iErrorScreen" {
    export default interface IErrorScreen {
        title: string;
        text: string;
        text2?: string;
        duration: number;
    }
}
declare module "src/core/client/screen/errorScreen" {
    import IErrorScreen from "src/core/shared/interfaces/iErrorScreen";
    export function clear(): void;
    export function create(screen: IErrorScreen): void;
}
declare module "src/core/client/screen/marker" {
    import * as alt from 'alt-client';
    export function draw(type: number, pos: alt.IVector3, scale: alt.IVector3, color: alt.RGBA, bobUpAndDown?: boolean, faceCamera?: boolean, rotate?: boolean): void;
    export function drawSimple(type: number, pos: alt.IVector3, rot: alt.IVector3, scale: alt.IVector3, color: alt.RGBA, faceCam: boolean): void;
}
declare module "src/core/client/screen/minimap" {
    import * as alt from 'alt-client';
    export function getWidth(asPercent?: boolean): number;
    export function getHeight(asPercent?: boolean): number;
    export function getTopLeft(asPercent?: boolean): alt.IVector2;
    export function getTopRight(asPercent?: boolean): alt.IVector2;
    export function getBottomLeft(asPercent?: boolean): alt.IVector2;
    export function getBottomRight(asPercent?: boolean): alt.IVector2;
    export function getSafeZoneSize(): number;
    export function getScreenAspectRatio(): number;
    export function getScreenResolution(): alt.IVector2;
    export function convertToPercentage(value: number, isXAxis?: boolean): number;
}
declare module "src/core/client/screen/missionText" {
    export function drawMissionText(text: string, duration?: number | undefined): void;
}
declare module "src/core/client/screen/notification" {
    export function create(text: string): void;
}
declare module "src/core/shared/interfaces/particle" {
    import * as alt from 'alt-shared';
    export interface Particle {
        pos: alt.IVector3;
        dict: string;
        name: string;
        duration: number;
        scale: number;
        delay?: number;
    }
}
declare module "src/core/client/screen/particle" {
    import { Particle } from "src/core/shared/interfaces/particle";
    export function handlePlayParticle(data: Particle): Promise<void>;
}
declare module "src/core/client/screen/progressBar" {
    import { ProgressBar } from "src/core/shared/interfaces/progressBar";
    export function create(progressBar: ProgressBar): void;
    export function remove(uid: string): void;
    export function clear(): void;
}
declare module "src/core/shared/enums/screenEffects" {
    export enum SCREEN_EFFECTS {
        SWITCH_HUD_IN = "SwitchHudIn",
        SWITCH_HUD_OUT = "SwitchHudOut",
        FOCUS_IN = "FocusIn",
        FOCUS_OUT = "FocusOut",
        MINIGAME_END_NEUTRAL = "MinigameEndNeutral",
        MINIGAME_END_TREVOR = "MinigameEndTrevor",
        MINIGAME_END_FRANKLIN = "MinigameEndFranklin",
        MINIGAME_END_MICHAEL = "MinigameEndMichael",
        MINIGAME_TRANSITION_OUT = "MinigameTransitionOut",
        MINIGAME_TRANSITION_IN = "MinigameTransitionIn",
        SWITCH_SHORT_NEUTRAL_IN = "SwitchShortNeutralIn",
        SWITCH_SHORT_FRANKLIN_IN = "SwitchShortFranklinIn",
        SWITCH_SHORT_TREVOR_IN = "SwitchShortTrevorIn",
        SWITCH_SHORT_MICHAEL_IN = "SwitchShortMichaelIn",
        SWITCH_OPEN_MICHAEL_IN = "SwitchOpenMichaelIn",
        SWITCH_OPEN_FRANKLIN_IN = "SwitchOpenFranklinIn",
        SWITCH_OPEN_TREVOR_IN = "SwitchOpenTrevorIn",
        SWITCH_HUD_MICHAEL_OUT = "SwitchHudMichaelOut",
        SWITCH_HUD_FRANKLIN_OUT = "SwitchHudFranklinOut",
        SWITCH_HUD_TREVOR_OUT = "SwitchHudTrevorOut",
        SWITCH_SHORT_FRANKLIN_MID = "SwitchShortFranklinMid",
        SWITCH_SHORT_MICHAEL_MID = "SwitchShortMichaelMid",
        SWITCH_SHORT_TREVOR_MID = "SwitchShortTrevorMid",
        CAM_PUSH_IN_NEUTRAL = "CamPushInNeutral",
        CAM_PUSH_IN_FRANKLIN = "CamPushInFranklin",
        CAM_PUSH_IN_MICHAEL = "CamPushInMichael",
        CAM_PUSH_IN_TREVOR = "CamPushInTrevor",
        SWITCH_SCENE_FRANKLIN = "SwitchSceneFranklin",
        SWITCH_SCENE_TREVOR = "SwitchSceneTrevor",
        SWITCH_SCENE_MICHAEL = "SwitchSceneMichael",
        SWITCH_SCENE_NEUTRAL = "SwitchSceneNeutral",
        MP_CELEB_WIN = "MpCelebWin",
        MP_CELEB_WIN_OUT = "MpCelebWinOut",
        MP_CELEB_LOSE = "MpCelebLose",
        MP_CELEB_LOSE_OUT = "MpCelebLoseOut",
        DEATH_FAIL_NEUTRAL_IN = "DeathFailNeutralIn",
        DEATH_FAIL_MP_DARK = "DeathFailMpDark",
        DEATH_FAIL_MP_IN = "DeathFailMpIn",
        DEATH_FAIL_OUT = "DeathFailOut",
        MP_CELEB_PRELOAD_FADE = "MpCelebPreloadFade",
        PEYOTE_END_OUT = "PeyoteEndOut",
        PEYOTE_END_IN = "PeyoteEndIn",
        PEYOTE_IN = "PeyoteIn",
        PEYOTE_OUT = "PeyoteOut",
        MP_RACE_CRASH = "MpRaceCrash",
        SUCCESS_FRANKLIN = "SuccessFranklin",
        SUCCESS_TREVOR = "SuccessTrevor",
        SUCCESS_MICHAEL = "SuccessMichael",
        DRUGS_MICHAEL_ALIENS_FIGHT_IN = "DrugsMichaelAliensFightIn",
        DRUGS_MICHAEL_ALIENS_FIGHT = "DrugsMichaelAliensFight",
        DRUGS_MICHAEL_ALIENS_FIGHT_OUT = "DrugsMichaelAliensFightOut",
        DRUGS_TREVOR_CLOWNS_FIGHT_IN = "DrugsTrevorClownsFightIn",
        DRUGS_TREVOR_CLOWNS_FIGHT = "DrugsTrevorClownsFight",
        DRUGS_TREVOR_CLOWNS_FIGHT_OUT = "DrugsTrevorClownsFightOut",
        HEIST_CELEB_PASS = "HeistCelebPass",
        HEIST_CELEB_PASS_BW = "HeistCelebPassBw",
        HEIST_CELEB_END = "HeistCelebEnd",
        HEIST_CELEBTOAST = "HeistCelebToast",
        MENU_MG_HEIST_IN = "MenuMgHeistIn",
        MENU_MG_TOURNAMENT_IN = "MenuMgTournamentIn",
        MENU_MG_SELECTION_IN = "MenuMgSelectionIn",
        CHOP_VISION = "ChopVision",
        DMT_FLIGHT_INTRO = "DmtFlightIntro",
        DMT_FLIGHT = "DmtFlight",
        DRUGS_DRIVING_IN = "DrugsDrivingIn",
        DRUGS_DRIVING_OUT = "DrugsDrivingOut",
        SWITCH_OPEN_NEUTRAL_FIB5 = "SwitchOpenNeutralFib5",
        HEIST_LOCATE = "HeistLocate",
        MP_JOB_LOAD = "MpJobLoad",
        RACE_TURBO = "RaceTurbo",
        MP_INTRO_LOGO = "MpIntroLogo",
        HEIST_TRIP_SKIP_FADE = "HeistTripSkipFade",
        MENU_MG_HEIST_OUT = "MenuMgHeistOut",
        MP_CORONA_SWITCH = "MpCoronaSwitch",
        MENU_MG_SELECTION_TINT = "MenuMgSelectionTint",
        SUCCESS_NEUTRAL = "SuccessNeutral",
        EXPLOSION_JOSH3 = "ExplosionJosh3",
        SNIPER_OVERLAY = "SniperOverlay",
        RAMPAGE_OUT = "RampageOut",
        RAMPAGE = "Rampage",
        DONT_TAZE_ME_BRO = "DontTazemeBro"
    }
}
declare module "src/core/client/screen/screenEffect" {
    import { SCREEN_EFFECTS } from "src/core/shared/enums/screenEffects";
    export function isEffectActive(screenEffect: SCREEN_EFFECTS): boolean;
    export function startEffect(screenEffect: SCREEN_EFFECTS, duration?: number, looped?: boolean): void;
    export function stopEffect(screenEffect: SCREEN_EFFECTS): void;
    export function stopAllEffects(): void;
}
declare module "src/core/client/screen/screenFade" {
    export function fromBlack(timeInMs: number): Promise<void>;
    export function toBlack(timeInMs: number): Promise<void>;
}
declare module "src/core/client/screen/text" {
    import * as alt from 'alt-client';
    export function drawText2D(text: string, pos: alt.IVector2, scale: number, color: alt.RGBA, alignment?: number, padding?: number): void;
    export function drawRectangle(pos: alt.IVector3, size: alt.IVector2, color: alt.RGBA): void;
    export function drawRectangle2D(pos: alt.IVector2, size: alt.IVector2, color: alt.RGBA): void;
    export function drawText3D(text: string, pos: alt.IVector3, scale: number, color: alt.RGBA): void;
    export function addTemporaryText(identifier: any, msg: any, x: any, y: any, scale: any, r: any, g: any, b: any, a: any, ms: any): void;
}
declare module "src/core/client/screen/screenText" {
    import * as alt from 'alt-client';
    export interface TextProperties {
        paddingLeft?: number;
        paddingRight?: number;
        paddingTop?: number;
        paddingBottom?: number;
        offsetX?: number;
        offsetY?: number;
    }
    export function addLongString(text: string): void;
    export function getWidth(text: string, font: number, scale: number): number;
    export function getHeight(scale: number, font: number): number;
    export function drawTextWithBackground(text: string, x: number, y: number, scale: number, font: number, background: alt.RGBA, foreground: alt.RGBA, props: TextProperties): void;
}
declare module "src/core/shared/interfaces/iShard" {
    export default interface IShard {
        duration: number;
        title: string;
        text?: string;
    }
}
declare module "src/core/client/screen/shard" {
    import IShard from "src/core/shared/interfaces/iShard";
    export function clear(): void;
    export function create(shard: IShard): Promise<void>;
}
declare module "src/core/shared/enums/spinnerType" {
    export enum SPINNER_TYPE {
        CLOCKWISE_WHITE_0 = 0,
        CLOCKWISE_WHITE_1 = 1,
        CLOCKWISE_WHITE_2 = 2,
        CLOCKWISE_WHITE_3 = 3,
        CLOCKWISE_YELLOW = 4,
        COUNTER_CLOCKWISE_WHITE = 5
    }
}
declare module "src/core/shared/interfaces/iSpinner" {
    import { SPINNER_TYPE } from "src/core/shared/enums/spinnerType";
    export default interface ISpinner {
        duration: number;
        text: string;
        type?: number | SPINNER_TYPE;
    }
}
declare module "src/core/client/screen/spinner" {
    import ISpinner from "src/core/shared/interfaces/iSpinner";
    export function clear(): void;
    export function create(data: ISpinner): void;
}
declare module "src/core/client/screen/texture" {
    import * as alt from 'alt-client';
    export function drawTexture2D(dictionary: string, name: string, position: alt.IVector2, scale?: number, opacity?: number): void;
    export function drawTexture(dictionary: string, name: string, position: alt.Vector3, scale?: number): void;
}
declare module "src/core/shared/enums/timecycleTypes" {
    export type RecommendedTimecycleTypes = 'spectator1' | 'spectator2' | 'spectator3' | 'spectator4' | 'spectator5' | 'spectator6' | 'spectator7' | 'spectator8' | 'spectator9' | 'spectator10' | 'drug_flying_base' | 'drug_flying_01' | 'drug_flying_02' | 'drug_flying_03' | 'DRUG_gas_huffin' | 'Drug_deadman' | 'Drug_deadman_blend' | 'Drug_2_drive' | 'drug_drive_blend01' | 'drug_drive_blend02' | 'drug_wobbly' | 'dont_tazeme_bro' | 'dont_tazeme_bro_b' | 'introblue' | 'trevorspliff' | 'trevorspliff_blend' | 'trevorspliff_blend02' | 'michealspliff' | 'michealspliff_blend' | 'michealspliff_blend02' | 'stoned' | 'stoned_monkeys' | 'stoned_aliens' | 'Drunk' | 'glasses_black' | 'glasses_brown' | 'glasses_red' | 'glasses_blue' | 'glasses_green' | 'glasses_yellow' | 'glasses_purple' | 'glasses_orange' | 'glasses_Darkblue' | 'glasses_VISOR' | 'nightvision' | 'CAMERA_secuirity' | 'scanline_cam' | 'scanline_cam_cheap' | 'nervousRON_fog' | 'jewel_gas' | 'underwater_deep_clear' | 'cinema' | 'superDARK' | 'phone_cam1' | 'phone_cam2' | 'phone_cam3' | 'phone_cam4' | 'phone_cam5' | 'phone_cam6' | 'phone_cam7' | 'phone_cam8' | 'phone_cam9' | 'phone_cam10' | 'phone_cam11' | 'phone_cam12' | 'phone_cam13' | 'NG_filmic01' | 'NG_filmic02' | 'NG_filmic03' | 'NG_filmic04' | 'NG_filmic05' | 'NG_filmic06' | 'NG_filmic07' | 'NG_filmic08' | 'NG_filmic09' | 'NG_filmic10' | 'NG_filmic11' | 'NG_filmic12' | 'NG_filmic13' | 'NG_filmic14' | 'NG_filmic15' | 'NG_filmic16' | 'NG_filmic17' | 'NG_filmic18' | 'NG_filmic19' | 'NG_filmic20' | 'damage' | 'dying' | 'Barry1_Stoned' | 'REDMIST';
}
declare module "src/core/client/screen/timecycle" {
    import { RecommendedTimecycleTypes } from "src/core/shared/enums/timecycleTypes";
    export function setTimeCycleEffect(timeCycleName: RecommendedTimecycleTypes | string, timeInMs: number): void;
    export function clearTimeCycleEffect(): void;
}
declare module "src/core/client/screen/index" {
    export * as credits from "src/core/client/screen/credits";
    export * as errorScreen from "src/core/client/screen/errorScreen";
    export * as marker from "src/core/client/screen/marker";
    export * as minimap from "src/core/client/screen/minimap";
    export * as missionText from "src/core/client/screen/missionText";
    export * as notification from "src/core/client/screen/notification";
    export * as particle from "src/core/client/screen/particle";
    export * as progressBar from "src/core/client/screen/progressBar";
    export * as scaleform from "src/core/client/screen/scaleform";
    export * as screenEffect from "src/core/client/screen/screenEffect";
    export * as screenFade from "src/core/client/screen/screenFade";
    export * as screenText from "src/core/client/screen/screenText";
    export * as shard from "src/core/client/screen/shard";
    export * as spinner from "src/core/client/screen/spinner";
    export * as text from "src/core/client/screen/text";
    export * as texture from "src/core/client/screen/texture";
    export * as timecycle from "src/core/client/screen/timecycle";
}
declare module "src/core/shared/enums/blipColor" {
    export enum BLIP_COLOR {
        WHITE_1 = 0,
        RED = 1,
        GREEN = 2,
        BLUE = 3,
        WHITE_2 = 4,
        YELLOW = 5,
        LIGHT_RED = 6,
        VIOLET = 7,
        PINK = 8,
        LIGHT_ORANGE = 9,
        LIGHT_BROWN = 10,
        LIGHT_GREEN = 11,
        LIGHT_BLUE = 12,
        LIGHT_PURPLE = 13,
        DARK_PURPLE = 14,
        CYAN = 15,
        LIGHT_YELLOW = 16,
        ORANGE = 17,
        LIGHT_BLUE_2 = 18,
        DARK_PINK = 19,
        DARK_YELLOW = 20,
        DARK_ORANGE = 21,
        LIGHT_GRAY = 22,
        LIGHT_PINK = 23,
        LEMON_GREEN = 24,
        FOREST_GREEN = 25,
        ELECTRIC_BLUE = 26,
        BRIGHT_PURPLE = 27,
        DARK_YELLOW_2 = 28,
        DARK_BLUE = 29,
        DARK_CYAN = 30,
        LIGHT_BROWN_2 = 31,
        LIGHT_BLUE_3 = 32,
        LIGHT_YELLOW_2 = 33,
        LIGHT_PINK_2 = 34,
        LIGHT_RED_2 = 35,
        BEIGE = 36,
        WHITE_3 = 37,
        BLUE_2 = 38,
        LIGHT_GRAY_2 = 39,
        DARK_GRAY = 40,
        PINK_RED = 41,
        BLUE_3 = 42,
        LIGHT_GREEN_2 = 43,
        LIGHT_ORANGE_2 = 44,
        WHITE_4 = 45,
        GOLD = 46,
        ORANGE_2 = 47,
        BRILLIANT_ROSE = 48,
        RED_2 = 49,
        MEDIUM_PURPLE = 50,
        SALMON = 51,
        DARK_GREEN = 52,
        BLIZZARD_BLUE = 53,
        ORACLE_BLUE = 54,
        SILVER = 55,
        BROWN = 56,
        BLUE_4 = 57,
        EAST_BAY = 58,
        RED_3 = 59,
        YELLOW_ORANGE = 60,
        MULBERRY_PINK = 61,
        ALTO_GRAY = 62,
        JELLY_BEAN_BLUE = 63,
        DARK_ORANGE_2 = 64,
        MAMBA = 65,
        YELLOW_ORANGE_2 = 66,
        BLUE_5 = 67,
        BLUE_6 = 68,
        GREEN_2 = 69,
        YELLOW_ORANGE_3 = 70,
        YELLOW_ORANGE_4 = 71,
        TRANSPARENT_BLACK = 72,
        YELLOW_ORANGE_5 = 73,
        BLUE_7 = 74,
        RED_4 = 75,
        DEEP_RED = 76,
        BLUE_8 = 77,
        ORACLE_BLUE_2 = 78,
        TRANSPARENT_RED = 79,
        TRANSPARENT_BLUE = 80,
        ORANGE_3 = 81,
        LIGHT_GREEN_3 = 82,
        PURPLE = 83,
        BLUE_9 = 84,
        TRANSPARENT_BLACK_2 = 85
    }
}
declare module "src/core/shared/interfaces/blip" {
    import * as alt from 'alt-shared';
    import { BLIP_COLOR } from "src/core/shared/enums/blipColor";
    export interface Blip {
        pos: alt.IVector3;
        shortRange: boolean;
        sprite: number;
        color: BLIP_COLOR | number;
        text: string;
        scale: number;
        category?: number;
        identifier?: string;
        uid?: string;
    }
}
declare module "src/core/client/streamers/blip" {
    import * as alt from 'alt-client';
    import { Blip } from "src/core/shared/interfaces/blip";
    export function append(blipData: Blip): alt.PointBlip;
    export function remove(uid: string): void;
}
declare module "src/core/shared/interfaces/door" {
    import * as alt from 'alt-shared';
    export interface Door {
        uid: string;
        description?: string;
        pos: alt.IVector3;
        model: number;
        isUnlocked: boolean;
    }
}
declare module "src/core/client/streamers/doors" { }
declare module "src/core/shared/interfaces/item" {
    import * as alt from 'alt-shared';
    export type WeaponInfo = {
        hash: number;
        ammo: number;
        components?: Array<string | number>;
    };
    export type ItemDrop = {
        _id: unknown;
        pos: alt.IVector3;
        expiration: number;
        model?: string;
        name: string;
    } & StoredItem;
    export type ClothingInfo = {
        sex: number;
        components: Array<ClothingComponent>;
    };
    export interface ClothingComponent {
        id: number;
        drawable: number;
        texture: number;
        palette?: number;
        dlc: number;
        isProp?: boolean;
    }
    export interface DefaultItemBehavior {
        canDrop?: boolean;
        canStack?: boolean;
        canTrade?: boolean;
        isClothing?: boolean;
        isToolbar?: boolean;
        isWeapon?: boolean;
        isEquippable?: boolean;
        destroyOnDrop?: boolean;
        isCustomIcon?: boolean;
    }
    export interface CustomContextAction {
        name: string;
        eventToCall: string | Array<string>;
    }
    export interface SharedItem<CustomData = {}> {
        dbName: string;
        data: CustomData;
        version?: number;
    }
    export type StoredItemEx<T> = StoredItem<T>;
    export interface StoredItem<CustomData = {}> extends SharedItem<CustomData> {
        quantity: number;
        slot: number;
        isEquipped?: boolean;
        totalWeight?: number;
        icon?: string;
        disableCrafting?: boolean;
    }
    export type BaseItemEx<T> = BaseItem<DefaultItemBehavior, T>;
    export interface BaseItem<Behavior = DefaultItemBehavior, CustomData = {}> extends SharedItem<CustomData> {
        _id?: unknown;
        name: string;
        icon: string;
        maxStack?: number;
        weight?: number;
        behavior?: Behavior;
        consumableEventToCall?: string | Array<string>;
        customEventsToCall?: Array<CustomContextAction>;
        model?: string;
        msTimeout?: number;
    }
    export type Item<Behavior = DefaultItemBehavior, CustomData = {}> = BaseItem<Behavior, CustomData> & StoredItem<CustomData>;
    export type ItemEx<T> = BaseItem<DefaultItemBehavior, T> & StoredItem<T>;
}
declare module "src/core/client/streamers/item" {
    import * as alt from 'alt-client';
    import { ItemDrop } from "src/core/shared/interfaces/item";
    export type CreatedDrop = ItemDrop & {
        createdObject?: alt.Object;
    };
    export function getClosest(): Array<ItemDrop>;
    export function setDefaultDropModel(model: string): void;
    export function setDefaultMaxDistance(distance?: number): void;
    export function getDropped(id: number): CreatedDrop | undefined;
}
declare module "src/core/shared/enums/markerTypes" {
    export enum MARKER_TYPE {
        UPSIDE_DOWN_CONE = 0,
        CYLINDER = 1,
        CHEVRON_UP = 2,
        THIN_CHEVRON_UP = 3,
        CHECKERED_FLAG = 4,
        CHECKERED_FLAG_CIRCLE = 5,
        VERTICLE_CIRCLE = 6,
        PLANE_MODEL = 7,
        LOST_MC = 8,
        LOST_MC_SOLID = 9,
        NUMBER_0 = 10,
        NUMBER_1 = 11,
        NUMBER_2 = 12,
        NUMBER_3 = 13,
        NUMBER_4 = 14,
        NUMBER_5 = 15,
        NUMBER_6 = 16,
        NUMBER_7 = 17,
        NUMBER_8 = 18,
        NUMBER_9 = 19,
        CHEVRON_UP_SINGLE = 20,
        CHEVRON_UP_DOUBLE = 21,
        CHEVRON_UP_TRIPLE = 22,
        FLAT_CIRCLE = 23,
        REPLAY = 24,
        FLAT_CIRCLE_SKINNY = 25,
        FLAT_CIRCLE_SKINNY_DIRECTIONAL = 26,
        FLAT_CIRCLE_SKINNY_SPLIT = 27,
        SPHERE = 28,
        DOLLAR_SIGN = 29,
        HORIZONTAL_BARS = 30,
        WOLF_HEAD = 31,
        QUESTION = 32,
        PLANE = 33,
        HELICOPTER = 34,
        BOAT = 35,
        CAR = 36,
        MOTORCYCLE = 37,
        BIKE = 38,
        TRUCK = 39,
        PARACHUTE = 40,
        JETPACK = 41,
        SAW_BLADE = 42,
        FLAT_VERTICAL_GRADIENT = 43
    }
}
declare module "src/core/shared/interfaces/marker" {
    import * as alt from 'alt-shared';
    import { MARKER_TYPE } from "src/core/shared/enums/markerTypes";
    export interface Marker {
        pos: alt.IVector3;
        type: MARKER_TYPE | number;
        color: alt.RGBA;
        scale?: alt.IVector3;
        maxDistance?: number;
        uid?: string;
        dimension?: number;
        bobUpAndDown?: boolean;
        faceCamera?: boolean;
        rotate?: boolean;
    }
}
declare module "src/core/client/streamers/marker" { }
declare module "src/core/client/systems/animations" {
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    export function loadAnimation(dict: string, count?: number): Promise<boolean>;
    export function playAnimation(dict: string, name: string, flags?: ANIMATION_FLAGS, duration?: number): Promise<void>;
    export function playPedAnimation(scriptID: number, dict: string, name: string, flags?: ANIMATION_FLAGS, duration?: number): Promise<void>;
}
declare module "src/core/client/streamers/ped" {
    import { IPed } from "src/core/shared/interfaces/iPed";
    export function get(scriptId: number): IPed | undefined;
    export function append(pedData: IPed): void;
    export function remove(uid: string): void;
}
declare module "src/core/shared/interfaces/textLabel" {
    import * as alt from 'alt-shared';
    export interface TextLabel {
        pos: alt.IVector3;
        text: string;
        maxDistance?: number;
        uid?: string;
        dimension?: number;
        isServerWide?: boolean;
    }
}
declare module "src/core/client/streamers/textlabel" { }
declare module "src/core/shared/enums/worldNotificationTypes" {
    export enum WORLD_NOTIFICATION_TYPE {
        ARROW_TOP = 1,
        ARROW_LEFT = 2,
        ARROW_BOTTOM = 3,
        ARROW_RIGHT = 4
    }
}
declare module "src/core/shared/interfaces/iWorldNotification" {
    import { WORLD_NOTIFICATION_TYPE } from "src/core/shared/enums/worldNotificationTypes";
    import * as alt from 'alt-shared';
    export interface IWorldNotification {
        pos: alt.IVector3;
        text: string;
        type: WORLD_NOTIFICATION_TYPE | number;
        background?: number;
        maxDistance?: number;
        uid?: string;
        dimension?: number;
    }
}
declare module "src/core/client/streamers/worldNotifications" { }
declare module "src/core/client/streamers/index" {
    export * as blip from "src/core/client/streamers/blip";
    export * as doors from "src/core/client/streamers/doors";
    export * as item from "src/core/client/streamers/item";
    export * as marker from "src/core/client/streamers/marker";
    export * as object from "src/core/client/streamers/object";
    export * as ped from "src/core/client/streamers/ped";
    export * as textLabel from "src/core/client/streamers/textlabel";
    export * as worldNotifications from "src/core/client/streamers/worldNotifications";
}
declare module "src/core/shared/interfaces/adminControl" {
    export const AdminControlEvents: {
        toServer: {
            invoke: string;
        };
        toClient: {
            controls: string;
        };
    };
    export interface AdminControl {
        name: string;
        component: string;
        uid: string;
        keywords: Array<string>;
        permissions: Array<string>;
    }
}
declare module "src/core/client/systems/adminControl" {
    import { AdminControl } from "src/core/shared/interfaces/adminControl";
    let AdminControls: Array<AdminControl>;
    export function invoke(uid: string, ...args: any[]): void;
    export function getControls(): typeof AdminControls;
    export function onControlUpdate(callback: (controls: typeof AdminControls) => void): void;
}
declare module "src/core/shared/interfaces/interaction" {
    import * as alt from 'alt-server';
    export interface Interaction {
        uid?: string;
        description?: string;
        position: alt.IVector3;
        range?: number;
        dimension?: number;
        callback?: (player: alt.Player, ...args: any[]) => void;
        triggerCallbackOnEnter?: boolean;
        onLeaveCallback?: (player: alt.Player, ...args: any[]) => void;
        data?: Array<any>;
        isVehicleOnly?: boolean;
        isPlayerOnly?: boolean;
        height?: number;
        debug?: boolean;
    }
}
declare module "src/core/shared/enums/keyBinds" {
    export const KEY_BINDS: {
        INTERACT: number;
        INTERACT_ALT: number;
        INTERACT_CYCLE: number;
        VEHICLE_FUNCS: number;
        VEHICLE_OPTIONS: number;
        PLAYER_INTERACT: number;
        INVENTORY: number;
        ANIMATION: number;
        CHAT: number;
        VEHICLE_LOCK: number;
        VEHICLE_ENGINE: number;
        DEBUG_KEY: number;
    };
}
declare module "src/core/client/systems/entitySelector" {
    import * as alt from 'alt-client';
    import { Interaction } from "src/core/shared/interfaces/interaction";
    export type ValidEntityTypes = 'object' | 'pos' | 'npc' | 'player' | 'vehicle' | 'interaction';
    export type TargetInfo = {
        id: number;
        pos: alt.IVector3;
        type: ValidEntityTypes;
        dist: number;
        height: number;
    };
    export function getSelection(): TargetInfo | undefined;
    export function getSelectables(): Array<TargetInfo>;
    export function setInteraction(interaction: Interaction | undefined): void;
    export function setMarkerOff(): void;
    export function setMarkerColor(customColor: alt.RGBA): void;
    export function setMarkerSize(markerSize: alt.Vector3): void;
}
declare module "src/core/client/events/onTicksStart" {
    export const onTicksStart: {
        add(callback: Function): void;
    };
}
declare module "src/core/client/interface/hotkeys" {
    export interface KeyBindRestrictions {
        isOnFoot?: boolean;
        isVehicle?: boolean;
        isVehiclePassenger?: boolean;
        isVehicleDriver?: boolean;
        isAiming?: boolean;
        isSwimming?: boolean;
        vehicleModels?: Array<number>;
        weaponModels?: Array<number>;
    }
    export interface KeyInfo extends BaseKeyInfo {
        keyDown?: Function;
        delayedKeyDown?: {
            callback: Function;
            msToTrigger?: number;
        };
        keyUp?: Function;
        whilePressed?: Function;
        disabled?: boolean;
    }
    export interface BaseKeyInfo {
        key: number;
        description: string;
        identifier: string;
        delayedKeyDown?: {
            msToTrigger?: number;
        };
        keyUp?: Function;
        whilePressed?: Function;
        modifier?: 'shift' | 'ctrl' | 'alt';
        allowInAnyMenu?: true;
        allowIfDead?: true;
        allowInSpecificPage?: string;
        spamPreventionInMs?: number;
        restrictions?: KeyBindRestrictions;
        doNotAllowRebind?: boolean;
    }
}
declare module "src/core/client/systems/hotkeyRegistry" {
    import { KeyInfo } from "src/core/client/interface/hotkeys";
    export type KeyInfoDefault = KeyInfo & {
        default: number;
    };
    export function add(keyBind: KeyInfo): void;
    export function checkValidation(keyOrIdentifier: string | number): boolean;
    export function disable(keyOrIdentifier: string | number): void;
    export function enable(keyOrIdentifier: string | number): void;
    export function rebind(keyOrIdentifier: string | number, keyCode: number): void;
    export function hotkeys(): Array<KeyInfoDefault>;
    export function hotkey(keyOrIdentifier: string | number): KeyInfo | undefined;
}
declare module "src/core/client/systems/interaction" {
    export function invoke(): void;
    export function isInteractionAvailable(): boolean;
}
declare module "src/core/shared/enums/messenger" {
    export const MESSENGER_EVENTS: {
        TO_CLIENT: {
            MESSAGE: string;
            COMMANDS: string;
        };
        TO_SERVER: {
            MESSAGE: string;
        };
    };
}
declare module "src/core/client/systems/messenger" {
    import * as alt from 'alt-client';
    import { MessageCommand } from "src/core/shared/interfaces/messageCommand";
    export type MessageInfo = {
        timestamp: number;
        msg: string;
    };
    export type MessageCallback = (msg: string) => void;
    export type HistoryCallback = (msgs: Array<MessageInfo>) => void;
    export function registerMessageCallback(callback: MessageCallback): void;
    export function registerHistoryCallback(callback: HistoryCallback): void;
    export function emit(msg: string): void;
    export function getHistory(): Array<{
        timestamp: number;
        msg: string;
    }>;
    export function send(msg: string): void;
    export function setCommands(_commands: Array<Omit<MessageCommand<alt.Player>, 'callback'>>): void;
    export function getCommands(): Array<Omit<MessageCommand<alt.Player>, 'callback'>>;
}
declare module "src/core/shared/enums/playerConfigKeys" {
    export type PlayerConfigKeys = 'inventory-size' | 'inventory-weight-enabled' | 'inventory-max-weight';
}
declare module "src/core/client/systems/playerConfig" {
    import { PlayerConfigKeys } from "src/core/shared/enums/playerConfigKeys";
    export type ConfigCallback = (value: any) => void;
    export function get<ReturnType, CustomKeys>(key: PlayerConfigKeys | CustomKeys): ReturnType | undefined;
    export function addCallback<CustomKeys>(key: PlayerConfigKeys | CustomKeys, callback: ConfigCallback): void;
}
declare module "src/core/shared/utility/vector" {
    import * as alt from 'alt-shared';
    export function distance(vector1: alt.IVector3, vector2: alt.IVector3): number;
    export function distance2d(vector1: alt.IVector2, vector2: alt.IVector2): number;
    export function getClosestVector(pos: alt.IVector3, arrayOfPositions: alt.IVector3[]): alt.IVector3;
    export function getClosestVectorByPos<T>(pos: alt.IVector3, arrayOfPositions: T[], posVariable?: string): T;
    export function getClosestTypes<T extends {
        pos: alt.IVector3;
        valid: boolean;
    }>(pos: alt.IVector3, elements: Array<T>, maxDistance: number, mustHaveProperties?: Array<string>, positionName?: string): Array<T>;
    export function lerp(a: number, b: number, t: number): number;
    export function vectorLerp(start: alt.IVector3, end: alt.IVector3, l: number, clamp: boolean): alt.IVector3;
    export function getForwardVector(rot: alt.IVector3): alt.IVector3;
    export function getVectorInFrontOfPlayer(entity: {
        rot: alt.IVector3;
        pos: alt.IVector3;
    }, distance: number): alt.Vector3;
    export function isBetweenVectors(pos: alt.IVector3, vector1: alt.IVector3, vector2: alt.IVector3): boolean;
    export function getClosestEntity<T>(playerPosition: alt.IVector3, rot: alt.IVector3, entities: Array<{
        pos: alt.IVector3;
        valid?: boolean;
    }>, dist: number, checkBackwards?: boolean): T | null;
    function fwdX(x: number, z: number): number;
    function fwdY(x: number, z: number): number;
    function fwdZ(x: number): number;
    export function getClosestOfType<T = {
        pos: alt.IVector3;
    }>(pos: alt.IVector3, elements: readonly (T & {
        pos: alt.IVector3;
    })[], lastDistance?: number): T | undefined;
    const _default: {
        distance: typeof distance;
        distance2d: typeof distance2d;
        fwdX: typeof fwdX;
        fwdY: typeof fwdY;
        fwdZ: typeof fwdZ;
        getClosestEntity: typeof getClosestEntity;
        getClosestOfType: typeof getClosestOfType;
        getClosestTypes: typeof getClosestTypes;
        getClosestVector: typeof getClosestVector;
        getClosestVectorByPos: typeof getClosestVectorByPos;
        getForwardVector: typeof getForwardVector;
        getVectorInFrontOfPlayer: typeof getVectorInFrontOfPlayer;
        isBetweenVectors: typeof isBetweenVectors;
        lerp: typeof lerp;
        vectorLerp: typeof vectorLerp;
    };
    export default _default;
}
declare module "src/core/client/models/viewModel" {
    export default class ViewModel {
        static open: Function;
        static close: Function;
        static ready: Function;
    }
}
declare module "src/core/shared/enums/webViewEvents" {
    export const WebViewEventNames: {
        ON_SERVER: string;
        ON_EMIT: string;
        EMIT_SERVER: string;
        EMIT_CLIENT: string;
        EMIT_READY: string;
        SET_PAGES: string;
        CLOSE_PAGE: string;
        CLOSE_PAGES: string;
        PLAY_SOUND: string;
        PLAY_SOUND_FRONTEND: string;
    };
}
declare module "src/core/client/views/audio" {
    export class AudioView {
        static init(): void;
        static play3DAudio(soundName: string, pan: number, volume: number, soundInstantID?: string): void;
        static stop3DAudio(soundInstantID?: string): void;
    }
}
declare module "src/core/client/systems/sound" {
    import * as alt from 'alt-client';
    export function frontend(audioName: string, ref: string): void;
    export function handlePlayAudioPositional(pos: alt.Vector3, soundName: string, soundInstantID?: string): void;
    export function play3d(entity: alt.Entity, soundName: string, soundInstantID?: string): void;
    export function play2d(soundName: string, volume?: number, soundInstantID?: string): void;
    export function stopAudio(soundInstantID?: string): void;
}
declare module "src/core/shared/enums/views" {
    export enum View_Events_Inventory {
        Process = "inventory:Process",
        Use = "inventory:Use",
        Split = "inventory:Split",
        Pickup = "inventory:Pickup"
    }
    export enum View_Events_Input_Menu {
        SetMenu = "inputmenu:Set"
    }
    export enum VIEW_EVENTS_JOB_TRIGGER {
        OPEN = "jobTrigger:Open",
        CANCEL = "jobTrigger:Cancel",
        ACCEPT = "jobTrigger:Accept"
    }
    export enum VIEW_EVENTS_WHEEL_MENU {
        ADD_OPTIONS = "wheelMenu:AddOptions",
        READY = "wheelMenu:Ready",
        CLOSE = "wheelMenu:Close",
        EXECUTE = "wheelMenu:Execute"
    }
}
declare module "src/core/client/views/wheelMenu" {
    import { IWheelOptionExt } from "src/core/shared/interfaces/wheelMenu";
    export function open(label: string, options: Array<IWheelOptionExt>, setMouseToCenter?: boolean): Promise<void>;
    export function update(label: string, options: Array<IWheelOptionExt>, setMouseToCenter?: boolean): void;
}
declare module "src/core/client/systems/index" {
    export * as adminControl from "src/core/client/systems/adminControl";
    export * as animations from "src/core/client/systems/animations";
    export * as entitySelector from "src/core/client/systems/entitySelector";
    export * as hotkeys from "src/core/client/systems/hotkeyRegistry";
    export * as interaction from "src/core/client/systems/interaction";
    export * as messenger from "src/core/client/systems/messenger";
    export * as playerConfig from "src/core/client/systems/playerConfig";
    export * as sound from "src/core/client/systems/sound";
    export * as wheelMenu from "src/core/client/views/wheelMenu";
}
declare module "src/core/client/utility/directionToVector" {
    import * as alt from 'alt-client';
    export class DirectionVector {
        private position;
        private rotation;
        constructor(position: any, rotation: any);
        eulerToQuaternion(rotation: alt.IVector3): {
            x: number;
            y: number;
            z: number;
            w: number;
        };
        forwardVector(): alt.IVector3;
        forward(distance: number): alt.IVector3;
        rightVector(): {
            x: number;
            y: number;
            z: number;
        };
        right(distance: number): {
            x: number;
            y: number;
            z: number;
        };
        upVector(): {
            x: number;
            y: number;
            z: number;
        };
        up(distance: any): {
            x: number;
            y: number;
            z: number;
        };
    }
}
declare module "src/core/client/utility/math" {
    import * as alt from 'alt-client';
    export function getCrossProduct(v1: alt.Vector3, v2: alt.Vector3): alt.Vector3;
    export function getNormalizedVector(vector: alt.Vector3): alt.Vector3;
    export function degToRad(degrees: number): number;
    export function rotationToDirection(rotation: alt.IVector3): alt.Vector3;
    export function getDirectionFromRotation(rotation: alt.IVector3): alt.IVector3;
    export function getPointsInCircle(points: number, radius: number, center: alt.IVector2): Array<alt.IVector2>;
    export function getAverage(data: Array<number>): number;
}
declare module "src/core/client/utility/model" {
    export function load(model: number | string): Promise<boolean>;
}
declare module "src/core/client/utility/pauseMenu" {
    export function disable(): void;
    export function enable(): void;
}
declare module "src/core/shared/utility/random" {
    import * as alt from 'alt-shared';
    export function randomNumberBetween(min: number, max: number): number;
    export function randomNumberBetweenInclusive(min: number, max: number): number;
    export function getRandomRGB(alpha?: number): alt.RGBA;
    export function getRandomRGBA(): alt.RGBA;
    export function shuffle<T>(array: Array<T>): Array<T>;
    export function getRandomElement<T>(elements: Array<T>): T;
}
declare module "src/core/client/utility/scene" {
    import * as alt from 'alt-client';
    export function load(pos: alt.IVector3): Promise<boolean>;
}
declare module "src/core/client/utility/scenarios" {
    export function playScenario(name: string, duration: number): Promise<void>;
}
declare module "src/core/shared/enums/vehicleTypeFlags" {
    export const enum VEHICLE_CLASS {
        BOAT = "boat",
        COMMERCIAL = "commercial",
        COMPACT = "compact",
        COUPE = "coupe",
        CYCLE = "cycle",
        EMERGENCY = "emergency",
        HELICOPTER = "helicopter",
        INDUSTRIAL = "industrial",
        MILITARY = "military",
        MOTORCYCLE = "motorcycle",
        MUSCLE = "muscle",
        OFF_ROAD = "off_road",
        OPEN_WHEEL = "open_wheel",
        PLANE = "plane",
        RAIL = "rail",
        SEDAN = "sedan",
        SERVICE = "service",
        SPORT = "sport",
        SPORT_CLASSIC = "sport_classic",
        SUPER = "super",
        SUV = "suv",
        UTILITY = "utility",
        VAN = "van"
    }
    export const enum VEHICLE_TYPE {
        AMPHIBIOUS_AUTOMOBILE = "amphibious_automobile",
        AMPHIBIOUS_QUADBIKE = "amphibious_quadbike",
        BICYCLE = "bicycle",
        BIKE = "bike",
        BLIMP = "blimp",
        BOAT = "boat",
        CAR = "car",
        HELI = "heli",
        PLANE = "plane",
        QUADBIKE = "quadbike",
        SUBMARINE = "submarine",
        SUBMARINECAR = "submarinecar",
        TRAILER = "trailer",
        TRAIN = "train"
    }
    export function isVehicleType(type: string, vehicleType: VEHICLE_TYPE): boolean;
    export enum FUEL_TYPE {
        NONE = "none",
        GAS = "gas",
        DIESEL = "diesel",
        ELECTRIC = "electric",
        JET_FUEL = "jetfuel"
    }
}
declare module "src/core/shared/interfaces/vehicleInfo" {
    import { FUEL_TYPE, VEHICLE_CLASS, VEHICLE_TYPE } from "src/core/shared/enums/vehicleTypeFlags";
    export interface VehicleInfo {
        displayName: string;
        name: string;
        manufacturerDisplayName: string;
        manufacturer: string;
        type: VEHICLE_TYPE;
        class: VEHICLE_CLASS;
        sell: boolean;
        price: number;
        storage: number | null;
        fuelType: FUEL_TYPE;
        hash: number;
        signedHash?: number;
        hexHash?: string;
        fuelTankSize?: number;
        seats?: number;
    }
}
declare module "src/core/shared/information/vehicles" {
    import { VehicleInfo } from "src/core/shared/interfaces/vehicleInfo";
    export const VehicleData: Array<VehicleInfo>;
}
declare module "src/core/shared/utility/hashLookup/vehicle" {
    import { VehicleInfo } from "src/core/shared/interfaces/vehicleInfo";
    export function hash(hash: number): VehicleInfo;
    export function signedHash(hash: number): VehicleInfo;
    export function hexHash(hash: string): VehicleInfo;
    const _default_1: {
        hash: typeof hash;
        signedHash: typeof signedHash;
        hexHash: typeof hexHash;
    };
    export default _default_1;
}
declare module "src/core/shared/enums/pedInformationFlags" {
    export enum PED_TYPE {
        ANIMAL = "animal",
        ARMY = "army",
        CIVFEMALE = "civfemale",
        CIVMALE = "civmale",
        COP = "cop",
        FIREMAN = "fireman",
        MEDIC = "medic",
        PLAYER_0 = "player_0",
        PLAYER_1 = "player_1",
        PLAYER_2 = "player_2",
        SWAT = "swat"
    }
}
declare module "src/core/shared/interfaces/iPedInfo" {
    import { PED_TYPE } from "src/core/shared/enums/pedInformationFlags";
    export interface PedInfo {
        name: string;
        hash: number;
        signedHash: number;
        hexHash: string;
        pedType: PED_TYPE;
    }
}
declare module "src/core/shared/information/peds" {
    import { PedInfo } from "src/core/shared/interfaces/iPedInfo";
    export const pedData: Array<PedInfo>;
}
declare module "src/core/shared/utility/hashLookup/ped" {
    import { PedInfo } from "src/core/shared/interfaces/iPedInfo";
    function hash(hash: number): PedInfo;
    export function signedHash(hash: number): PedInfo;
    export function hexHash(hash: string): PedInfo;
    const _default_2: {
        hash: typeof hash;
        signedHash: typeof signedHash;
        hexHash: typeof hexHash;
    };
    export default _default_2;
}
declare module "src/core/shared/interfaces/ipropInfo" {
    export interface PropInfo {
        name: string;
        hash: number;
        signedHash: number;
        hexHash: string;
    }
}
declare module "src/core/shared/information/props" {
    import { PropInfo } from "src/core/shared/interfaces/ipropInfo";
    export const propData: Array<PropInfo>;
}
declare module "src/core/shared/utility/hashLookup/prop" {
    import { PropInfo } from "src/core/shared/interfaces/ipropInfo";
    function hash(hash: number): PropInfo;
    export function signedHash(hash: number): PropInfo;
    export function hexHash(hash: string): PropInfo;
    const _default_3: {
        hash: typeof hash;
        signedHash: typeof signedHash;
        hexHash: typeof hexHash;
    };
    export default _default_3;
}
declare module "src/core/shared/utility/hashLookup/index" {
    export { default as vehicle } from "src/core/shared/utility/hashLookup/vehicle";
    export { default as ped } from "src/core/shared/utility/hashLookup/ped";
    export { default as prop } from "src/core/shared/utility/hashLookup/prop";
}
declare module "src/core/client/utility/index" {
    export { DirectionVector } from "src/core/client/utility/directionToVector";
    export * as math from "src/core/client/utility/math";
    export * as model from "src/core/client/utility/model";
    export * as pauseMenu from "src/core/client/utility/pauseMenu";
    export * as random from "src/core/shared/utility/random";
    export * as scene from "src/core/client/utility/scene";
    export * as scenarios from "src/core/client/utility/scenarios";
    export * as vector from "src/core/shared/utility/vector";
    export * as hashLookup from "src/core/shared/utility/hashLookup/index";
}
declare module "src/core/client/webview/page" {
    import { BaseKeyInfo } from "src/core/client/interface/hotkeys";
    type AnyCallback = ((...args: any[]) => void) | ((...args: any[]) => Promise<void>) | Function;
    export interface IPage {
        name: string;
        callbacks: {
            onReady: AnyCallback;
            onClose: AnyCallback;
        };
        options?: {
            disableEscapeKey?: boolean;
            onOpen?: {
                focus?: boolean;
                showCursor?: boolean;
                hideHud?: boolean;
                hideOverlays?: boolean;
                disableControls?: 'all' | 'camera' | 'none';
                disablePauseMenu?: boolean;
                blurBackground?: boolean;
                setIsMenuOpenToTrue?: boolean;
            };
            onClose?: {
                unfocus?: boolean;
                hideCursor?: boolean;
                showHud?: boolean;
                showOverlays?: boolean;
                enableControls?: boolean;
                enablePauseMenu?: boolean;
                unblurBackground?: boolean;
                setIsMenuOpenToFalse?: boolean;
            };
        };
        keybind?: BaseKeyInfo & {
            useSameKeyToClose?: boolean;
        };
    }
    export class Page {
        private info;
        constructor(page: IPage);
        open(): Promise<boolean>;
        close(isManuallyTriggered?: boolean): void;
    }
}
declare module "src/core/shared/interfaces/webview" {
    export interface OverlayPageType {
        name: string;
        isHidden?: boolean;
        callback: (isVisible: boolean) => void;
    }
}
declare module "src/core/client/webview/index" {
    export { Page } from "src/core/client/webview/page";
    import * as alt from 'alt-client';
    export type AnyCallback = ((...args: any[]) => void) | ((...args: any[]) => Promise<void>) | Function;
    export function create(url: string): void;
    export function setOverlaysVisible(value: boolean, doNotUpdate?: boolean): Promise<void>;
    export function registerPersistentPage(pageName: string): void;
    export function registerOverlay(pageName: string, callback?: (isVisible: boolean) => void): void;
    export function setOverlayVisible(pageName: string, state: boolean): void;
    export function get(): Promise<alt.WebView>;
    export function dispose(): void;
    export function openPages(pageOrPages: Array<string> | string, hideOverlays?: boolean, closeOnEscapeCallback?: () => void): Promise<void>;
    export function focus(): Promise<void>;
    export function unfocus(): Promise<void>;
    export function showCursor(state: boolean): Promise<void>;
    export function closeOverlays(pageNames: Array<string>): Promise<void>;
    export function closePages(pageNames: Array<string>, showOverlays?: boolean): Promise<void>;
    export function ready(pageName: string, callback: AnyCallback): void;
    export function on<EventNames = string>(eventName: EventNames, callback: AnyCallback): void;
    export function emit<EventNames = string>(eventName: EventNames, ...args: any[]): Promise<void>;
    export function isPageOpen(pageName: string): boolean;
    export function isDoneUpdating(): boolean;
    export function disableEscapeKeyForPage(pageName: string): void;
    export function isAnyMenuOpen(excludeDead?: boolean): boolean;
}
declare module "src/core/client/world/position" {
    import * as alt from 'alt-client';
    const DefaultData: {
        minStart: number;
        iterations: number;
        increment: number;
    };
    export function getGroundZ(pos: alt.IVector3, options?: typeof DefaultData): alt.IVector3;
    export function isEntityBlockingPosition(pos: alt.IVector3, range?: number, maxDistance?: number): boolean;
}
declare module "src/core/client/world/weather" {
    export function isChanging(): boolean;
    export function freeze(): void;
    export function unfreeze(): void;
    export function changeTo(nextWeather: string, timeInSeconds: number): Promise<void>;
}
declare module "src/core/client/world/index" {
    export * as position from "src/core/client/world/position";
    export * as weather from "src/core/client/world/weather";
}
declare module "src/core/client/api/index" {
    export * as camera from "src/core/client/camera/index";
    export * as menu from "src/core/client/menus/index";
    export * as rmlui from "src/core/client/rmlui/index";
    export * as screen from "src/core/client/screen/index";
    export * as streamers from "src/core/client/streamers/index";
    export * as systems from "src/core/client/systems/index";
    export * as utility from "src/core/client/utility/index";
    export * as webview from "src/core/client/webview/index";
    export * as world from "src/core/client/world/index";
}
declare module "src/core/client/camera/cinematic" {
    import * as alt from 'alt-client';
    export interface iCameraNode {
        pos: alt.IVector3;
        rot?: alt.IVector3;
        offset?: alt.IVector3;
        fov: number;
        easeTime?: number;
        entityToTrack?: number;
        positionToTrack?: alt.IVector3;
        entityToAttachTo?: number;
        vehicleBone?: number;
        pedBone?: number;
        isLastNode?: boolean;
    }
    export function destroy(): Promise<void>;
    export function overrideNodes(_nodes: Array<iCameraNode>): Promise<void>;
    export function addNode(node: iCameraNode): Promise<void>;
    export function next(removeFromArray?: boolean): Promise<boolean>;
    export function play(): Promise<void>;
}
declare module "src/core/client/commands/rmlui" { }
declare module "src/core/shared/configurations/shared" {
    export const SHARED_CONFIG: {
        FOOD_FATIGUE: number;
        WATER_FATIGUE: number;
        MAX_PICKUP_RANGE: number;
        MAX_INTERACTION_RANGE: number;
        MAX_VEHICLE_INTERACTION_RANGE: number;
        VOICE_ON: boolean;
        USE_24H_TIME_FORMAT: boolean;
        DISABLE_IDLE_CAM: boolean;
        ENABLE_KNOTS_FOR_BOATS_AND_AIRCRAFT: boolean;
    };
}
declare module "src/core/client/events/connectionComplete" { }
declare module "src/core/client/events/disconnect" { }
declare module "src/core/client/events/meta" { }
declare module "src/core/client/events/onInventoryUpdate" {
    import { Item } from "src/core/shared/interfaces/item";
    type InventoryUpdateCallback = (inventory: Array<Item>, toolbar: Array<Item>, totalWeight: number) => void;
    export const onInventoryUpdate: {
        add(callback: InventoryUpdateCallback): void;
    };
}
declare module "src/core/shared/interfaces/appearance" {
    export interface Appearance {
        sex: number;
        faceFather: number;
        faceMother: number;
        skinFather: number;
        skinMother: number;
        faceMix: number;
        skinMix: number;
        structure: number[];
        hair: number;
        hairDlc: number;
        hairColor1: number;
        hairColor2: number;
        hairOverlay: {
            overlay: string;
            collection: string;
        };
        facialHair: number;
        facialHairColor1: number;
        facialHairOpacity: number;
        eyebrows: number;
        eyebrowsOpacity: number;
        eyebrowsColor1: number;
        chestHair: number;
        chestHairOpacity: number;
        chestHairColor1: number;
        eyes: number;
        opacityOverlays: AppearanceInfo[];
        colorOverlays: ColorInfo[];
    }
    export interface ColorInfo {
        id: number;
        value: number;
        color1: number;
        color2: number;
        opacity: number;
    }
    export interface AppearanceInfo {
        value: number;
        opacity: number;
        id: number;
        collection: string;
        overlay: string;
    }
}
declare module "src/core/client/extensions/meta" {
    import { Appearance } from "src/core/shared/interfaces/appearance";
    export interface Meta {
        permissionLevel: number;
        isDead: boolean;
        gridSpace: number;
        voice: boolean;
        bank: number;
        cash: number;
        bankNumber: number;
        food: number;
        water: number;
        appearance: Appearance;
    }
}
declare module "src/core/client/extensions/player" {
    import { Meta } from "src/core/client/extensions/meta";
    module 'alt-client' {
        interface Player {
            meta: Partial<Meta>;
            isMenuOpen: boolean;
            isWheelMenuOpen: boolean;
            isActionMenuOpen: boolean;
            isLeaderboardOpen: boolean;
            isNoClipOn: boolean;
        }
    }
}
declare module "src/core/client/menus/animationMenus/commonAnims" {
    const _default_4: (callback: (...args: any[]) => void) => {
        name: string;
        callback: (...args: any[]) => void;
        data: (string | number)[];
    }[];
    export default _default_4;
}
declare module "src/core/client/menus/animationMenus/danceAnims" {
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    const _default_5: (callback: (...args: any[]) => void) => {
        name: string;
        callback: (...args: any[]) => void;
        data: (string | ANIMATION_FLAGS)[];
    }[];
    export default _default_5;
}
declare module "src/core/client/menus/animationMenus/emoteAnims" {
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    const _default_6: (callback: (...args: any[]) => void) => {
        name: string;
        callback: (...args: any[]) => void;
        data: (string | ANIMATION_FLAGS)[];
    }[];
    export default _default_6;
}
declare module "src/core/client/menus/animationMenus/funAnims" {
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    const _default_7: (callback: (...args: any[]) => void) => {
        name: string;
        callback: (...args: any[]) => void;
        data: (string | ANIMATION_FLAGS)[];
    }[];
    export default _default_7;
}
declare module "src/core/client/menus/animationMenus/idleAnims" {
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    const _default_8: (callback: (...args: any[]) => void) => {
        name: string;
        callback: (...args: any[]) => void;
        data: (string | ANIMATION_FLAGS)[];
    }[];
    export default _default_8;
}
declare module "src/core/client/menus/animationMenus/leanAnims" {
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    const _default_9: (callback: (...args: any[]) => void) => ({
        name: string;
        callback: (...args: any[]) => void;
        data: (string | ANIMATION_FLAGS)[];
    } | {
        name: string;
        callback: () => void;
        data?: undefined;
    })[];
    export default _default_9;
}
declare module "src/core/client/menus/animationMenus/waitAnims" {
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    const _default_10: (callback: (...args: any[]) => void) => {
        name: string;
        callback: (...args: any[]) => void;
        data: (string | ANIMATION_FLAGS)[];
    }[];
    export default _default_10;
}
declare module "src/core/client/menus/animation" { }
declare module "src/core/client/rmlui/fonts/index" { }
declare module "src/core/client/screen/mouse" {
    import * as alt from 'alt-client';
    export function getScaledCursorPosition(): alt.IVector2;
}
declare module "src/core/shared/enums/playerSynced" {
    export enum PLAYER_SYNCED_META {
        POSITION = "player-position",
        PING = "player-ping",
        NAME = "player-name",
        DIMENSION = "player-dimension",
        WAYPOINT = "player-waypoint",
        DATABASE_ID = "player-character-id",
        ATTACHABLES = "player-attachable-list",
        ACCOUNT_ID = "player-account-id",
        IDENTIFICATION_ID = "player-identification-id"
    }
    export enum PLAYER_LOCAL_META {
        INVENTORY = "player-inventory",
        TOOLBAR = "player-toolbar",
        TOTAL_WEIGHT = "player-total-weight",
        INVENTORY_SIZE = "player-inventory-size"
    }
}
declare module "src/core/shared/enums/boneIds" {
    export enum PedBone {
        FACIAL_facialRoot = 102,
        FB_Brow_Centre_000 = 113,
        FB_Jaw_000 = 118,
        FB_L_Brow_Out_000 = 103,
        FB_L_CheekBone_000 = 106,
        FB_L_Eye_000 = 105,
        FB_L_Lid_Upper_000 = 104,
        FB_L_Lip_Bot_000 = 121,
        FB_L_Lip_Corner_000 = 107,
        FB_L_Lip_Top_000 = 116,
        FB_LowerLip_000 = 120,
        FB_LowerLipRoot_000 = 119,
        FB_R_Brow_Out_000 = 111,
        FB_R_CheekBone_000 = 110,
        FB_R_Eye_000 = 109,
        FB_R_Lid_Upper_000 = 108,
        FB_R_Lip_Bot_000 = 122,
        FB_R_Lip_Corner_000 = 112,
        FB_R_Lip_Top_000 = 117,
        FB_Tongue_000 = 123,
        FB_UpperLipRoot_000 = 114,
        IK_Head = 99,
        IK_L_Foot = 6,
        IK_L_Hand = 62,
        IK_R_Foot = 18,
        IK_R_Hand = 91,
        IK_Root = 127,
        MH_L_Elbow = 67,
        MH_L_Knee = 11,
        MH_R_Elbow = 96,
        MH_R_Knee = 23,
        PH_L_Foot = 7,
        PH_L_Hand = 61,
        PH_R_Foot = 19,
        PH_R_Hand = 90,
        RB_L_ArmRoll = 66,
        RB_L_ForeArmRoll = 65,
        RB_L_ThighRoll = 26,
        RB_Neck_1 = 124,
        RB_R_ArmRoll = 95,
        RB_R_ForeArmRoll = 94,
        RB_R_ThighRoll = 27,
        SKEL_Head = 98,
        SKEL_L_Calf = 3,
        SKEL_L_Clavicle = 39,
        SKEL_L_Finger00 = 43,
        SKEL_L_Finger01 = 44,
        SKEL_L_Finger02 = 45,
        SKEL_L_Finger10 = 48,
        SKEL_L_Finger11 = 49,
        SKEL_L_Finger12 = 50,
        SKEL_L_Finger20 = 52,
        SKEL_L_Finger21 = 53,
        SKEL_L_Finger22 = 54,
        SKEL_L_Finger30 = 55,
        SKEL_L_Finger31 = 56,
        SKEL_L_Finger32 = 57,
        SKEL_L_Finger40 = 58,
        SKEL_L_Finger41 = 59,
        SKEL_L_Finger42 = 60,
        SKEL_L_Foot = 4,
        SKEL_L_Forearm = 41,
        SKEL_L_Hand = 42,
        SKEL_L_Thigh = 2,
        SKEL_L_Toe0 = 5,
        SKEL_L_UpperArm = 40,
        SKEL_Neck_1 = 97,
        SKEL_Pelvis = 1,
        SKEL_R_Calf = 15,
        SKEL_R_Clavicle = 68,
        SKEL_R_Finger00 = 72,
        SKEL_R_Finger01 = 73,
        SKEL_R_Finger02 = 74,
        SKEL_R_Finger11 = 78,
        SKEL_R_Finger12 = 79,
        SKEL_R_Finger20 = 81,
        SKEL_R_Finger21 = 82,
        SKEL_R_Finger22 = 83,
        SKEL_R_Finger30 = 84,
        SKEL_R_Finger31 = 85,
        SKEL_R_Finger32 = 86,
        SKEL_R_Finger40 = 87,
        SKEL_R_Finger41 = 88,
        SKEL_R_Finger42 = 89,
        SKEL_R_Foot = 16,
        SKEL_R_Forearm = 70,
        SKEL_R_Hand = 71,
        SKEL_R_Thigh = 14,
        SKEL_R_Toe0 = 17,
        SKEL_R_UpperArm = 69,
        SKEL_ROOT = 0,
        SKEL_Spine_Root = 34,
        SKEL_Spine0 = 35,
        SKEL_Spine1 = 36,
        SKEL_Spine2 = 37,
        SKEL_Spine3 = 38
    }
}
declare module "src/core/shared/interfaces/iAttachable" {
    import { PedBone } from "src/core/shared/enums/boneIds";
    import * as alt from 'alt-shared';
    export default interface IAttachable {
        uid?: string;
        model: string;
        pos: alt.IVector3;
        rot: alt.IVector3;
        bone: PedBone;
        entityID?: number;
    }
    export interface JobAttachable extends IAttachable {
        duration?: number;
        atObjectiveStart?: boolean;
    }
}
declare module "src/core/client/streamers/attachable" { }
declare module "src/core/client/systems/defaults/ammo" { }
declare module "src/core/client/systems/defaults/displayId" { }
declare module "src/core/client/systems/defaults/time" { }
declare module "src/core/client/systems/defaults/toolbar" {
    export const ToolbarSystem: {
        disable(): void;
    };
}
declare module "src/core/shared/interfaces/acceptDeclineEvent" {
    export interface AcceptDeclineEvent<T = Object> {
        question: string;
        onClientEvents: {
            accept: string;
            decline: string;
        };
        data?: T;
    }
}
declare module "src/core/client/systems/acceptDeclineEvent" { }
declare module "src/core/client/systems/arrest" { }
declare module "src/core/shared/enums/athenaEvents" {
    export enum ATHENA_EVENTS_PLAYER_CLIENT {
        WAYPOINT = "athena:PlayerWaypoint"
    }
}
declare module "src/core/client/systems/athenaEvents" {
    export function updateWaypoint(): Promise<void>;
}
declare module "src/core/client/systems/character" {
    import { Appearance } from "src/core/shared/interfaces/appearance";
    import { Item } from "src/core/shared/interfaces/item";
    export const CharacterSystem: {
        applyAppearance(ped: number, appearance: Appearance): void;
        applyEquipment(ped: number, components: Array<Item>, isMale?: boolean): void;
        applyHairOverlay(decorations: Array<{
            collection: string;
            overlay: string;
        }>): void;
    };
}
declare module "src/core/client/systems/debug" {
    export const DebugController: {
        registerKeybinds(): void;
        handleDebugMessages(): void;
    };
}
declare module "src/core/shared/flags/pedflags" {
    export const enum PED_CONFIG_FLAG {
        CAN_PUNCH = 18,
        CAN_FLY_THROUGH_WINDSHIELD = 32,
        DIES_BY_RAGDOLL = 33,
        PUT_ON_MOTORCYCLE_HELMET = 35,
        NO_COLLISION = 52,
        IS_SHOOTING = 58,
        IS_ON_GROUND = 60,
        NO_COLLIDE = 62,
        IS_DEAD = 71,
        IS_SNIPER_SCOPE_ACTIVE = 72,
        IS_SUPER_DEAD = 73,
        IS_IN_AIR = 76,
        IS_AIMING = 78,
        IS_DRUNK = 100,
        IS_NOT_RAGDOLL_AND_IS_NOT_ANIMATED = 104,
        NO_PLAYER_MELEE = 122,
        NO_MESSAGE_466 = 125,
        PLAY_INJURED_LIMP = 166,
        PLAY_INJURED_LIMP_2 = 170,
        DISABLE_SEAT_SHUFFLE = 184,
        INJURED_DOWN = 187,
        SHRINK = 223,
        MELEE_COMBAT = 224,
        DISABLE_STOPPING_VEHICLE_ENGINE = 241,
        IS_ON_STAIRS = 253,
        HAS_ONE_LEG_ON_GROUND = 276,
        NO_WRITHE = 281,
        FREEZE = 292,
        IS_STILL = 301,
        NO_PED_MELEE = 314,
        IS_SWITCHING_WEAPON = 331,
        ALPHA = 410,
        DISABLE_PROP_KNOCKOFF = 423,
        DISABLE_STARTING_VEHICLE_ENGINE = 429,
        FLAMING_FOOTPRINTS = 421
    }
}
declare module "src/core/client/systems/vehicle" {
    import * as alt from 'alt-client';
    export const VehicleController: {
        registerKeybinds(): void;
        emitEngine(): void;
        emitLock(): void;
        enterVehicle(): void;
        setIntoVehicle(vehicle: alt.Vehicle, seat: number): Promise<void>;
        enableSeatBelt(value: boolean): void;
        removeSeatBelt(vehicle: alt.Vehicle): void;
        handleVehicleDisables(): void;
        toggleEngine(status: boolean): void;
    };
}
declare module "src/core/client/systems/disable" { }
declare module "src/core/client/systems/interiors" { }
declare module "src/core/shared/interfaces/eventCall" {
    export interface EventCall {
        eventName: string;
        isServer: boolean;
        callAtStart?: boolean;
    }
}
declare module "src/core/shared/interfaces/job" {
    import * as alt from 'alt-shared';
    import { Blip } from "src/core/shared/interfaces/blip";
    import { EventCall } from "src/core/shared/interfaces/eventCall";
    import { Marker } from "src/core/shared/interfaces/marker";
    import { TextLabel } from "src/core/shared/interfaces/textLabel";
    import { JobAnimation } from "src/core/shared/interfaces/animation";
    import { Particle } from "src/core/shared/interfaces/particle";
    import { JobAttachable } from "src/core/shared/interfaces/iAttachable";
    export enum ObjectiveCriteria {
        NO_VEHICLE = 1,
        NO_WEAPON = 2,
        NO_DYING = 4,
        IN_VEHICLE = 8,
        IN_JOB_VEHICLE = 16,
        FAIL_ON_JOB_VEHICLE_DESTROY = 32,
        JOB_VEHICLE_NEARBY = 64,
        VEHICLE_ENGINE_OFF = 128
    }
    export enum ObjectiveType {
        WAYPOINT = 1,
        CAPTURE_POINT = 2,
        PRESS_INTERACT_TO_COMPLETE = 4
    }
    export enum ObjectiveEvents {
        JOB_SYNC = "job:Sync",
        JOB_VERIFY = "job:Verify",
        JOB_UPDATE = "job:Update"
    }
    export interface Objective {
        uid?: string;
        criteria: ObjectiveCriteria;
        type: ObjectiveType;
        pos: alt.IVector3;
        range: number;
        description: string;
        captureProgress?: number;
        captureMaximum?: number;
        nextCaptureTime?: number;
        marker?: Marker;
        textLabel?: TextLabel;
        blip?: Blip;
        animation?: JobAnimation;
        attachable?: JobAttachable;
        eventCall?: EventCall;
        particle?: Particle;
        onlyCallbackCheck?: boolean;
        data?: {
            [key: string]: any;
        };
        callbackOnStart?: (player: any) => void;
        callbackOnCheck?: (player: any) => Promise<boolean>;
        callbackOnFinish?: (player: any) => void;
    }
    const _default_11: {
        ObjectiveCriteria: typeof ObjectiveCriteria;
        ObjectiveType: typeof ObjectiveType;
        ObjectiveEvents: typeof ObjectiveEvents;
    };
    export default _default_11;
}
declare module "src/core/shared/utility/flags" {
    type Flags = Permissions;
    export function isFlagEnabled(flags: Flags | number, flagToCheck: Flags | number): boolean;
}
declare module "src/core/client/systems/job" { }
declare module "src/core/client/systems/jwt" { }
declare module "src/core/shared/locale/languages/keys" {
    export const LOCALE_KEYS: {
        COMMAND_ADMIN_CHAT: string;
        COMMAND_ACCEPT_DEATH: string;
        COMMAND_ACTION_MENU: string;
        COMMAND_ADD_VEHICLE: string;
        COMMAND_ADD_WHITELIST: string;
        COMMAND_OOC: string;
        COMMAND_BROADCAST: string;
        COMMAND_COORDS: string;
        COMMAND_DO: string;
        COMMAND_DUMMY_ITEM: string;
        COMMAND_GET_ITEM: string;
        COMMAND_LOW: string;
        COMMAND_MOD_CHAT: string;
        COMMAND_ME: string;
        COMMAND_NO_CLIP: string;
        COMMAND_QUIT_JOB: string;
        COMMAND_REMOVE_ALL_WEAPONS: string;
        COMMAND_REMOVE_WHITELIST: string;
        COMMAND_REVIVE: string;
        COMMAND_SEATBELT: string;
        COMMAND_SET_ARMOUR: string;
        COMMAND_SET_CASH: string;
        COMMAND_SET_FOOD: string;
        COMMAND_SET_HEALTH: string;
        COMMAND_SET_WATER: string;
        COMMAND_SPAWN_VEHICLE: string;
        COMMAND_TELEPORTER: string;
        COMMAND_TELEPORT_WAYPOINT: string;
        COMMAND_TOGGLE_ENGINE: string;
        COMMAND_TOGGLE_VEH_LOCK: string;
        COMMAND_TOGGLE_VEH_DOOR: string;
        COMMAND_GIVE_VEH_KEY: string;
        COMMAND_UPDATE_WEATHER: string;
        COMMAND_VEHICLE: string;
        COMMAND_WHISPER: string;
        COMMAND_WANTED: string;
        COMMAND_WEAPON: string;
        COMMAND_CLEAR_INVENTORY: string;
        COMMAND_CLEAR_TOOLBAR: string;
        COMMAND_CLEAR_EQUIPMENT: string;
        COMMAND_NOT_PERMITTED_CHARACTER: string;
        COMMAND_NOT_PERMITTED_ADMIN: string;
        COMMAND_NOT_VALID: string;
        COMMAND_SET_WEATHER: string;
        COMMAND_CLEAR_WEATHER: string;
        COMMAND_SET_TIME: string;
        COMMAND_CLEAR_TIME: string;
        COMMAND_REFILL_VEHICLE: string;
        COMMAND_REPAIR_VEHICLE: string;
        COMMAND_TEMP_VEHICLE: string;
        COMMAND_SET_VEHICLE_HANDLING: string;
        COMMAND_SET_VEHICLE_LIVERY: string;
        COMMAND_SESSION_VEHICLE: string;
        COMMAND_TOGGLE_VEH_NEON_LIGHTS: string;
        COMMAND_SET_VEH_NEON_LIGHTS: string;
        COMMAND_FULL_TUNE_VEHICLE: string;
        COMMAND_ADD_VEHICLE_KEY: string;
        COMMAND_SET_VEH_DIRT_LEVEL: string;
        CANNOT_CHAT_WHILE_DEAD: string;
        CANNOT_FIND_PLAYER: string;
        CANNOT_PERFORM_WHILE_DEAD: string;
        CANNOT_FIND_PERSONAL_VEHICLES: string;
        CANNOT_FIND_THAT_PERSONAL_VEHICLE: string;
        CLOTHING_ITEM_IN_INVENTORY: string;
        DISCORD_ID_NOT_LONG_ENOUGH: string;
        DISCORD_ALREADY_WHITELISTED: string;
        DISCORD_NOT_WHITELISTED: string;
        DISCORD_ADDED_WHITELIST: string;
        DISCORD_REMOVED_WHITELIST: string;
        DISCORD_ID_ALREADY_LOGGED_IN: string;
        DISCORD_COULD_NOT_COMMUNICATE_WITH_AUTH_SERVICE: string;
        DISCORD_COULD_NOT_DECRYPT_DATA_FROM_AUTH_SERVICE: string;
        FUEL_EXIT_VEHICLE_FIRST: string;
        FUEL_UPDATE_VEHICLE_FIRST: string;
        FUEL_VEHICLE_NOT_CLOSE: string;
        FUEL_ALREADY_FULL: string;
        FUEL_TOO_FAR_FROM_PUMP: string;
        FUEL_HAS_UNLIMITED: string;
        FUEL_CANNOT_AFFORD: string;
        FUEL_PAYMENT: string;
        FUEL_PAID: string;
        INTERIOR_INTERACT: string;
        INTERIOR_TOO_FAR_FROM_ENTRANCE: string;
        INTERIOR_TOO_FAR_FROM_EXIT: string;
        INTERIOR_NOT_ENOUGH_CURRENCY: string;
        INTERIOR_DOOR_LOCKED: string;
        INTERIOR_PURCHASED: string;
        INTERIOR_SOLD: string;
        INTERIOR_NO_STORAGE: string;
        INVALID_VEHICLE_MODEL: string;
        INTERACTION_TOO_FAR_AWAY: string;
        INTERACTION_INVALID_OBJECT: string;
        INTERACTION_INTERACT_WITH_OBJECT: string;
        INTERACTION_INTERACT_VEHICLE: string;
        INTERACTION_VIEW_OPTIONS: string;
        ITEM_ARGUMENTS_MISSING: string;
        ITEM_DOES_NOT_EXIST: string;
        ITEM_NOT_EQUIPPED: string;
        ITEM_WAS_ADDED_INVENTORY: string;
        ITEM_WAS_ADDED_EQUIPMENT: string;
        ITEM_WAS_ADDED_TOOLBAR: string;
        ITEM_WAS_DESTROYED_ON_DROP: string;
        LABEL_ON: string;
        LABEL_OFF: string;
        LABEL_BROADCAST: string;
        LABEL_ENGINE: string;
        LABEL_HOSPITAL: string;
        LABEL_BANNED: string;
        PLAYER_ARMOUR_SET_TO: string;
        PLAYER_HEALTH_SET_TO: string;
        PLAYER_IS_TOO_FAR: string;
        PLAYER_IS_TOO_CLOSE: string;
        PLAYER_IS_NOT_DEAD: string;
        PLAYER_SEATBELT_ON: string;
        PLAYER_SEATBELT_OFF: string;
        PLAYER_RECEIVED_BLANK: string;
        JOB_ALREADY_WORKING: string;
        JOB_NOT_WORKING: string;
        JOB_QUIT: string;
        USE_FUEL_PUMP: string;
        USE_ATM: string;
        USE_VENDING_MACHINE: string;
        USE_CLOTHING_STORE: string;
        WEAPON_NO_HASH: string;
        VEHICLE_NO_FUEL: string;
        VEHICLE_LOCK_SET_TO: string;
        VEHICLE_TOGGLE_LOCK: string;
        VEHICLE_IS_LOCKED: string;
        VEHICLE_ENTER_VEHICLE: string;
        VEHICLE_TOGGLE_ENGINE: string;
        VEHICLE_TOO_FAR: string;
        VEHICLE_NO_VEHICLES_IN_GARAGE: string;
        VEHICLE_NO_PARKING_SPOTS: string;
        VEHICLE_ALREADY_SPAWNED: string;
        VEHICLE_COUNT_EXCEEDED: string;
        VEHICLE_LOCKED: string;
        VEHICLE_UNLOCKED: string;
        VEHICLE_FUEL: string;
        VEHICLE_NO_KEYS: string;
        VEHICLE_NO_STORAGE: string;
        VEHICLE_NO_TRUNK_ACCESS: string;
        VEHICLE_NOT_UNLOCKED: string;
        VEHICLE_NO_OPEN_SEAT: string;
        VEHICLE_REFUEL_INCOMPLETE: string;
        VEHICLE_NO_LONGER_NEAR_VEHICLE: string;
        VEHICLE_NOT_RIGHT_SIDE_UP: string;
        VEHICLE_IS_ALREADY_BEING_PUSHED: string;
        VEHICLE_STORAGE_VIEW_NAME: string;
        VEHICLE_KEY_NAME: string;
        VEHICLE_KEY_DESCRIPTION: string;
        VEHICLE_MODEL_INVALID: string;
        VEHICLE_CREATED: string;
        VEHICLE_REFILLED: string;
        VEHICLE_REPAIRED: string;
        VEHICLE_HAS_NO_MOD_KIT: string;
        VEHICLE_NOT_OWN_BY_YOU: string;
        VEHICLE_KEY_GIVEN_TO: string;
        FACTION_PLAYER_IS_ALREADY_IN_FACTION: string;
        FACTION_CANNOT_CHANGE_OWNERSHIP: string;
        FACTION_STORAGE_NOT_ACCESSIBLE: string;
        FACTION_STORAGE_NO_ACCESS: string;
        FACTION_ONLY_OWNER_IS_ALLOWED: string;
        FACTION_UNABLE_TO_DISBAND: string;
        FACTION_NAME_DOESNT_MATCH: string;
        FACTION_NOT_THE_OWNER: string;
        FACTION_COULD_NOT_FIND: string;
        FACTION_DISABNDED: string;
        FACTION_BANK_COULD_NOT_WITHDRAW: string;
        FACTION_BANK_COULD_NOT_DEPOSIT: string;
        FACTION_BANK_WITHDREW: string;
        FACTION_PLAYER_QUITTED: string;
        FACTION_COULDNT_QUIT: string;
        WORLD_TIME_IS: string;
        STORAGE_NOT_AVAILABLE: string;
        STORAGE_IN_USE: string;
        INVENTORY_IS_FULL: string;
        NOCLIP_SPEED_INFO: string;
        NOCLIP_SPEED: string;
        WEBVIEW_CHARACTERS: string;
        WEBVIEW_CREATOR: string;
        WEBVIEW_JOB: string;
        WEBVIEW_INVENTORY: string;
        WEBVIEW_LOGIN: string;
        WEBVIEW_FACTION: string;
        WEBVIEW_STORAGE: string;
    };
}
declare module "src/core/shared/interfaces/localeFormat" {
    export interface LocaleFormat {
        [key: string]: {
            [key: string]: any;
        };
    }
}
declare module "src/core/shared/locale/languages/en" {
    const _default_12: {
        [x: string]: string | {
            LABEL_DECLINE: string;
            LABEL_ACCEPT: string;
            LABEL_SPLIT_TEXT?: undefined;
            ITEM_SLOTS?: undefined;
            LABEL_SPLIT?: undefined;
            LABEL_CANCEL?: undefined;
            LABEL_DROP_ITEM?: undefined;
            LABEL_WEIGHT?: undefined;
        } | {
            LABEL_SPLIT_TEXT: string;
            LABEL_DECLINE?: undefined;
            LABEL_ACCEPT?: undefined;
            ITEM_SLOTS?: undefined;
            LABEL_SPLIT?: undefined;
            LABEL_CANCEL?: undefined;
            LABEL_DROP_ITEM?: undefined;
            LABEL_WEIGHT?: undefined;
        } | {
            ITEM_SLOTS: string[];
            LABEL_SPLIT: string;
            LABEL_CANCEL: string;
            LABEL_DROP_ITEM: string;
            LABEL_WEIGHT: string;
            LABEL_SPLIT_TEXT: string;
            LABEL_DECLINE?: undefined;
            LABEL_ACCEPT?: undefined;
        };
    };
    export default _default_12;
}
declare module "src/core/shared/locale/languages/de" {
    const _default_13: {
        [x: string]: string | {
            LABEL_DECLINE: string;
            LABEL_ACCEPT: string;
            LABEL_SPLIT_TEXT?: undefined;
            ITEM_SLOTS?: undefined;
            LABEL_SPLIT?: undefined;
            LABEL_CANCEL?: undefined;
            LABEL_DROP_ITEM?: undefined;
            LABEL_WEIGHT?: undefined;
        } | {
            LABEL_SPLIT_TEXT: string;
            LABEL_DECLINE?: undefined;
            LABEL_ACCEPT?: undefined;
            ITEM_SLOTS?: undefined;
            LABEL_SPLIT?: undefined;
            LABEL_CANCEL?: undefined;
            LABEL_DROP_ITEM?: undefined;
            LABEL_WEIGHT?: undefined;
        } | {
            ITEM_SLOTS: string[];
            LABEL_SPLIT: string;
            LABEL_CANCEL: string;
            LABEL_DROP_ITEM: string;
            LABEL_WEIGHT: string;
            LABEL_SPLIT_TEXT: string;
            LABEL_DECLINE?: undefined;
            LABEL_ACCEPT?: undefined;
        };
    };
    export default _default_13;
}
declare module "src/core/shared/locale/locale" {
    export const placeholder = "_%_";
    export class LocaleController {
        static setLanguage(iso639?: string): void;
        static get(key: string, ...args: any[]): string;
        static getWebviewLocale(key: string): Object;
    }
}
declare module "src/core/client/systems/noclip" { }
declare module "src/core/client/systems/notification" {
    export type NotificationCallback = ((message: string, ...args: any[]) => void) | Function;
    export function disableDefault(): void;
    export function addCallback(callback: NotificationCallback): void;
}
declare module "src/core/shared/interfaces/taskTimeline" {
    export interface Task {
        nativeName: string;
        params: any[];
        timeToWaitInMs: number;
    }
    export interface TaskCallback {
        callbackName: string;
    }
}
declare module "src/core/client/systems/tasks" { }
declare module "src/core/client/systems/tick" { }
declare module "src/core/client/utility/entitySets" { }
declare module "src/core/client/utility/ipl" { }
declare module "src/core/client/utility/lerp" { }
declare module "src/core/client/utility/polygonShape" { }
declare module "src/core/shared/utility/buffer" {
    export class AthenaBuffer {
        static toBuffer(data: string, size?: number): Array<string>;
        static fromBuffer(data: Array<string>): string;
    }
}
declare module "src/core/client/utility/screenshot" { }
declare module "src/core/shared/interfaces/actions" {
    export interface Action {
        eventName: string;
        isServer?: boolean;
        data?: any;
    }
    export interface ActionMenu {
        [key: string]: Action | ActionMenu;
    }
}
declare module "src/core/client/views/actions" { }
declare module "src/core/shared/interfaces/jobTrigger" {
    export interface JobTrigger<T = {}> {
        image: string;
        header: string;
        summary: string;
        maxAmount?: number;
        event?: string;
        cancelEvent?: string;
        acceptCallback?: (player: T, amount?: number) => void;
        cancelCallback?: (player: T) => void;
    }
}
declare module "src/core/client/views/job" { }
declare module "src/core/client/startup" {
    import '../plugins/athena/client/imports';
    import "src/core/client/camera/cinematic";
    import "src/core/client/camera/gameplay";
    import "src/core/client/camera/pedEdit";
    import "src/core/client/camera/switch";
    import "src/core/client/commands/rmlui";
    import "src/core/client/events/connectionComplete";
    import "src/core/client/events/disconnect";
    import "src/core/client/events/meta";
    import "src/core/client/events/onInventoryUpdate";
    import "src/core/client/events/onTicksStart";
    import "src/core/client/extensions/meta";
    import "src/core/client/extensions/player";
    import "src/core/client/menus/animation";
    import "src/core/client/menus/player";
    import "src/core/client/menus/object";
    import "src/core/client/menus/vehicle";
    import "src/core/client/rmlui/fonts/index";
    import "src/core/client/rmlui/input/index";
    import "src/core/client/rmlui/menu/index";
    import "src/core/client/rmlui/menu3d/index";
    import "src/core/client/rmlui/progressbar/index";
    import "src/core/client/rmlui/question/index";
    import "src/core/client/rmlui/sprites/index";
    import "src/core/client/rmlui/staticText/index";
    import "src/core/client/screen/credits";
    import "src/core/client/screen/errorScreen";
    import "src/core/client/screen/missionText";
    import "src/core/client/screen/marker";
    import "src/core/client/screen/minimap";
    import "src/core/client/screen/missionText";
    import "src/core/client/screen/mouse";
    import "src/core/client/screen/notification";
    import "src/core/client/screen/particle";
    import "src/core/client/screen/progressBar";
    import "src/core/client/screen/scaleform";
    import "src/core/client/screen/screenEffect";
    import "src/core/client/screen/screenFade";
    import "src/core/client/screen/shard";
    import "src/core/client/screen/spinner";
    import "src/core/client/screen/text";
    import "src/core/client/screen/texture";
    import "src/core/client/screen/timecycle";
    import "src/core/client/streamers/attachable";
    import "src/core/client/streamers/blip";
    import "src/core/client/streamers/doors";
    import "src/core/client/streamers/item";
    import "src/core/client/streamers/marker";
    import "src/core/client/streamers/object";
    import "src/core/client/streamers/ped";
    import "src/core/client/streamers/textlabel";
    import "src/core/client/streamers/worldNotifications";
    import "src/core/client/systems/defaults/ammo";
    import "src/core/client/systems/defaults/displayId";
    import "src/core/client/systems/defaults/time";
    import "src/core/client/systems/defaults/toolbar";
    import "src/core/client/systems/acceptDeclineEvent";
    import "src/core/client/systems/adminControl";
    import "src/core/client/systems/animations";
    import "src/core/client/systems/arrest";
    import "src/core/client/systems/athenaEvents";
    import "src/core/client/systems/character";
    import "src/core/client/systems/debug";
    import "src/core/client/systems/disable";
    import "src/core/client/systems/entitySelector";
    import "src/core/client/systems/hotkeyRegistry";
    import "src/core/client/systems/interaction";
    import "src/core/client/systems/interiors";
    import "src/core/client/systems/job";
    import "src/core/client/systems/jwt";
    import "src/core/client/systems/messenger";
    import "src/core/client/systems/noclip";
    import "src/core/client/systems/notification";
    import "src/core/client/systems/playerConfig";
    import "src/core/client/systems/sound";
    import "src/core/client/systems/tasks";
    import "src/core/client/systems/tick";
    import "src/core/client/systems/vehicle";
    import "src/core/client/utility/entitySets";
    import "src/core/client/utility/ipl";
    import "src/core/client/utility/lerp";
    import "src/core/client/utility/polygonShape";
    import "src/core/client/utility/screenshot";
    import "src/core/client/utility/scenarios";
    import "src/core/client/webview/index";
    import "src/core/client/webview/page";
    import "src/core/client/views/actions";
    import "src/core/client/views/audio";
    import "src/core/client/views/job";
    import "src/core/client/views/wheelMenu";
    import "src/core/client/world/weather";
}
declare module "src/core/client/systems/alarm" {
    export function loadAlarm(name: string, count?: number): Promise<boolean>;
    export function startAlarm(name: string): Promise<void>;
    export function stopAlarm(name: string): Promise<void>;
    export function stopAllAlarms(): Promise<void>;
}
declare module "src/core/client/utility/characterPed" {
    import * as alt from 'alt-client';
    import { Appearance } from "src/core/shared/interfaces/appearance";
    export const PedCharacter: {
        create(isMale: boolean, _pos: alt.IVector3, _rot?: alt.IVector3 | number): Promise<number>;
        apply(_appearance: Appearance, forceSameShoes?: boolean): Promise<void>;
        getApperance(): Appearance | null;
        get(): number;
        setHidden(value: boolean): void;
        destroy(): Promise<unknown>;
    };
}
declare module "src/core/client/utility/disableControls" {
    export function disableAllControls(value: boolean): void;
    export function disableAllAttacks(value: boolean): void;
    export function handleDisablingAttacks(): void;
}
declare module "src/core/client/utility/raycast" {
    import * as alt from 'alt-client';
    const Raycast: {
        performRaycast(start: alt.IVector3, end: alt.IVector3, flags: number, radius: number, useShapeTest?: boolean): [number, boolean, alt.IVector3, alt.IVector3, number];
        positionFromCamera(flags?: number, useShapeTest?: boolean, radius?: number): alt.IVector3 | null;
        simpleRaycast(flags?: number, maxDistance?: number, useShapeTest?: boolean, radius?: number): {
            didComplete: boolean;
            didHit?: boolean;
            position?: alt.IVector3;
            entityHit?: number;
        };
        simpleRaycastPlayersView(flags?: number, maxDistance?: number, useShapeTest?: boolean, radius?: number): {
            didComplete: boolean;
            didHit?: boolean;
            position?: alt.IVector3;
            entityHit?: number;
        };
        positionFromPlayer(flags?: number, useShapeTest?: boolean, radius?: number): alt.IVector3 | null;
        isFacingWater(): null | alt.IVector3;
    };
    export default Raycast;
}
declare module "src/core/client/views/input" { }
declare module "src/core/plugins/athena-debug/shared/events" {
    export const ATHENA_DEBUG_EVENTS: {
        ClientToServer: {
            FORWARD: string;
        };
        toClient: {
            exec: string;
        };
    };
}
declare module "src/core/plugins/athena-debug/client/index" { }
declare module "src/core/server/config/playerConfig" {
    import * as alt from 'alt-server';
    import { PlayerConfigKeys } from "src/core/shared/enums/playerConfigKeys";
    export function set<CustomKeys>(player: alt.Player, key: PlayerConfigKeys | CustomKeys, value: any): void;
    const _default_14: {
        set: typeof set;
    };
    export default _default_14;
}
declare module "src/core/server/config/index" {
    export { default as player } from "src/core/server/config/playerConfig";
}
declare module "src/core/shared/interfaces/iStream" {
    import * as alt from 'alt-shared';
    export interface IStreamConfig {
        TimeBetweenUpdates: number;
    }
    export interface IStream {
        id?: number;
    }
    export interface IStreamMessage {
        id: number;
        route: string;
        data: any;
    }
    export interface IStreamPopulate<T> {
        key: string;
        array: Array<T>;
    }
    export interface IStreamUpdate {
        pos: alt.IVector3;
        dimension?: number;
    }
}
declare module "src/core/server/athena/stream/config" {
    import { IStreamConfig } from "src/core/shared/interfaces/iStream";
    const StreamConfiguration: IStreamConfig;
    export default StreamConfiguration;
}
declare module "src/core/server/athena/main" {
    export const DEFAULT_CONFIG: {
        CHARACTER_SELECT_POS: {
            x: number;
            y: number;
            z: number;
        };
        CHARACTER_SELECT_ROT: number;
        CHARACTER_CREATOR_POS: {
            x: number;
            y: number;
            z: number;
        };
        CHARACTER_CREATOR_ROT: number;
        PLAYER_NEW_SPAWN_POS: {
            x: number;
            y: number;
            z: number;
        };
        PLAYER_CASH: number;
        PLAYER_BANK: number;
        MAX_INTERACTION_DISTANCE: number;
        TIME_BETWEEN_VEHICLE_SAVES: number;
        DESPAWN_VEHICLES_ON_LOGOUT: boolean;
        VEHICLE_SPAWN_TIMEOUT: number;
        VEHICLE_MAX_DISTANCE_TO_ENTER: number;
        VEHICLE_DISPLAY_LOCK_STATUS: boolean;
        VEHICLE_DISPLAY_LOCK_INTERACTION_INFO: boolean;
        VEHICLE_DESPAWN_TIMEOUT: number;
        STREAM_CONFIG: import("src/core/shared/interfaces/iStream").IStreamConfig;
        LOGIN_REDIRECT_URL: any;
    };
}
declare module "src/core/server/systems/streamer" {
    import * as alt from 'alt-server';
    export function registerCallback<T>(key: string, callback: (player: alt.Player, streamedData: Array<T>) => void, range?: number): Promise<void>;
    export function updateData<T>(key: string, array: Array<T>): Promise<void>;
}
declare module "src/core/shared/information/doors" {
    import { Door } from "src/core/shared/interfaces/door";
    export const Doors: Array<Door>;
}
declare module "src/core/server/database/collections" {
    export enum Collections {
        Accounts = "accounts",
        Characters = "characters",
        Interiors = "interiors",
        Options = "options",
        Vehicles = "vehicles",
        Storage = "storage",
        Factions = "factions",
        Items = "items",
        Doors = "doorstates",
        Drops = "itemdrops"
    }
}
declare module "src/core/server/controllers/doors" {
    import "src/core/server/systems/streamer";
    import { Door } from "src/core/shared/interfaces/door";
    export function append(door: Door): string;
    export function remove(uid: string): boolean;
    export function update(uid: string, isUnlocked: boolean): Promise<boolean>;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'update', callback: typeof update): any;
}
declare module "src/core/server/controllers/itemDrops" {
    import { ItemDrop } from "src/core/shared/interfaces/item";
    import "src/core/server/systems/streamer";
    export function append(itemDrop: ItemDrop): string;
    export function remove(id: string): boolean;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
}
declare module "src/core/server/utility/hash" {
    export function hashPassword(plainTextPassword: string): string;
    export function testPassword(plainTextPassword: string, pbkdf2Hash: string): boolean;
    export function sha256(data: string): string;
    export function sha256Random(data: string): string;
    const _default_15: {
        sha256: typeof sha256;
        sha256Random: typeof sha256Random;
        testPassword: typeof testPassword;
        hashPassword: typeof hashPassword;
    };
    export default _default_15;
}
declare module "src/core/server/controllers/marker" {
    import * as alt from 'alt-server';
    import "src/core/server/systems/streamer";
    import { Marker } from "src/core/shared/interfaces/marker";
    export function append(marker: Marker): string;
    export function remove(uid: string): boolean;
    export function removeFromPlayer(player: alt.Player, uid: string): any;
    export function addToPlayer(player: alt.Player, marker: Marker): string;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'addToPlayer', callback: typeof addToPlayer): any;
    export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer): any;
}
declare module "src/core/server/controllers/object" {
    import * as alt from 'alt-server';
    import "src/core/server/systems/streamer";
    import { IObject } from "src/core/shared/interfaces/iObject";
    export function append(objectData: IObject): string;
    export function remove(uid: string): boolean;
    export function removeFromPlayer(player: alt.Player, uid: string): any;
    export function addToPlayer(player: alt.Player, objectData: IObject): string;
    export function updatePosition(uid: string, pos: alt.IVector3, player?: alt.Player): boolean;
    export function updateModel(uid: string, model: string, player?: alt.Player): boolean;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'addToPlayer', callback: typeof addToPlayer): any;
    export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer): any;
    export function override(functionName: 'updatePosition', callback: typeof updatePosition): any;
    export function override(functionName: 'updateModel', callback: typeof updateModel): any;
}
declare module "src/core/server/controllers/staticPed" {
    import * as alt from 'alt-server';
    import "src/core/server/systems/streamer";
    import { IPed } from "src/core/shared/interfaces/iPed";
    import { Animation } from "src/core/shared/interfaces/animation";
    export function append(pedData: IPed): string;
    export function remove(uid: string): boolean;
    export function removeFromPlayer(player: alt.Player, uid: string): any;
    export function addToPlayer(player: alt.Player, pedData: IPed): string;
    export function playAnimation(uid: string, animation: Animation[]): void;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'addToPlayer', callback: typeof addToPlayer): any;
    export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer): any;
}
declare module "src/core/server/controllers/textlabel" {
    import * as alt from 'alt-server';
    import "src/core/server/systems/streamer";
    import { TextLabel } from "src/core/shared/interfaces/textLabel";
    export function append(label: TextLabel): string;
    export function update(uid: string, label: Partial<TextLabel>, player?: alt.Player): boolean;
    export function remove(uid: string): boolean;
    export function removeFromPlayer(player: alt.Player, uid: string): any;
    export function addToPlayer(player: alt.Player, textLabel: TextLabel): string;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'addToPlayer', callback: typeof addToPlayer): any;
    export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer): any;
    export function override(functionName: 'update', callback: typeof update): any;
}
declare module "src/core/server/controllers/worldNotifications" {
    import * as alt from 'alt-server';
    import "src/core/server/systems/streamer";
    import { IWorldNotification } from "src/core/shared/interfaces/iWorldNotification";
    export function append(notification: IWorldNotification): string;
    export function remove(uid: string): boolean;
    export function removeFromPlayer(player: alt.Player, uid: string): any;
    export function addToPlayer(player: alt.Player, notification: IWorldNotification): string;
    export function update(player: alt.Player, notifications: Array<IWorldNotification>): any;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'addToPlayer', callback: typeof addToPlayer): any;
    export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer): any;
    export function override(functionName: 'update', callback: typeof update): any;
}
declare module "src/core/server/interface/iAccount" {
    import { PERMISSIONS } from '../../shared/flags/permissionFlags';
    export interface Account {
        _id: any;
        id?: number;
        discord?: string;
        email?: string;
        ips: Array<string>;
        hardware: Array<string>;
        lastLogin: number;
        permissionLevel: PERMISSIONS;
        permissions: Array<string>;
        banned: boolean;
        reason: string;
    }
}
declare module "src/core/server/controllers/admin" {
    import * as alt from 'alt-server';
    export function banPlayer(player: alt.Player, reason: string): Promise<boolean>;
    export function unbanPlayerByDiscord(discord: string): Promise<boolean>;
    export function override(functionName: 'banPlayer', callback: typeof banPlayer): any;
    export function override(functionName: 'unbanPlayerByDiscord', callback: typeof unbanPlayerByDiscord): any;
}
declare module "src/core/server/controllers/blip" {
    import * as alt from 'alt-server';
    import "src/core/server/systems/streamer";
    import { Blip } from "src/core/shared/interfaces/blip";
    export function append(blip: Blip): string;
    export function remove(uid: string): boolean;
    export function removeFromPlayer(player: alt.Player, uid: string): any;
    export function addToPlayer(player: alt.Player, blipData: Blip): any;
    export function populateGlobalBlips(player: alt.Player): any;
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'addToPlayer', callback: typeof addToPlayer): any;
    export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer): any;
    export function override(functionName: 'populateGlobalBlips', callback: typeof populateGlobalBlips): any;
}
declare module "src/core/server/extensions/extColshape" {
    import * as alt from 'alt-server';
    import { Interaction } from "src/core/shared/interfaces/interaction";
    export class InteractionShape extends alt.ColshapeCylinder {
        interaction: Interaction;
        constructor(interaction: Required<Interaction>);
    }
    export class GarageSpaceShape extends alt.ColshapeSphere {
        private rotation;
        private isOpen;
        isGarage: boolean;
        constructor(position: alt.IVector3, rotation: alt.IVector3, radius: number);
        setSpaceStatus(value: boolean): void;
        getPositionAndRotation(): {
            position: alt.Vector3;
            rotation: alt.IVector3;
        };
        getSpaceStatus(): boolean;
    }
    export class PolygonShape extends alt.ColshapePolygon {
        uid: string;
        vertices: Array<alt.IVector2>;
        isPlayerOnly: boolean;
        isVehicleOnly: boolean;
        isPolygonShape: boolean;
        isDebug: boolean;
        private enterCallbacks;
        private leaveCallbacks;
        constructor(minZ: number, maxZ: number, vertices: alt.IVector2[] | alt.IVector3[], isPlayerOnly: boolean, isVehicleOnly: boolean, debug?: boolean);
        addEnterCallback(callback: (shape: PolygonShape, entity: alt.Vehicle | alt.Player | alt.Entity) => void): void;
        addLeaveCallback(callback: (shape: PolygonShape, entity: alt.Vehicle | alt.Player | alt.Entity) => void): void;
        invokeEnterCallbacks(entity: alt.Entity): void;
        invokeLeaveCallbacks(entity: alt.Entity): void;
    }
}
declare module "src/core/shared/utility/deepCopy" {
    export function deepCloneObject<T>(data: object): T;
    export function deepCloneArray<T>(data: Array<object | T>): Array<T>;
}
declare module "src/core/server/controllers/interaction" {
    import * as alt from 'alt-server';
    import { InteractionShape } from "src/core/server/extensions/extColshape";
    import { Interaction } from "src/core/shared/interfaces/interaction";
    const InternalFunctions: {
        add(shape: InteractionShape): void;
        remove(uid: string): void;
        enter(colshape: InteractionShape, entity: alt.Entity): any;
        leave(colshape: InteractionShape, entity: alt.Entity): any;
        trigger(player: alt.Player): void;
    };
    export function append(interaction: Interaction): string;
    export function remove(uid: string): void;
    export function get(uid: string): InteractionShape | undefined;
    export function getBindings(): {
        [player_id: string]: InteractionShape;
    };
    export function override(functionName: 'append', callback: typeof append): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'getBindings', callback: typeof getBindings): any;
    export function overrideInternal(functionName: 'trigger', callback: typeof InternalFunctions.trigger): any;
    export function overrideInternal(functionName: 'leave', callback: typeof InternalFunctions.leave): any;
    export function overrideInternal(functionName: 'enter', callback: typeof InternalFunctions.enter): any;
}
declare module "src/core/server/controllers/index" {
    export * as doors from "src/core/server/controllers/doors";
    export * as itemDrops from "src/core/server/controllers/itemDrops";
    export * as marker from "src/core/server/controllers/marker";
    export * as object from "src/core/server/controllers/object";
    export * as staticPed from "src/core/server/controllers/staticPed";
    export * as textLabel from "src/core/server/controllers/textlabel";
    export * as worldNotification from "src/core/server/controllers/worldNotifications";
    export * as admin from "src/core/server/controllers/admin";
    export * as blip from "src/core/server/controllers/blip";
    export * as interaction from "src/core/server/controllers/interaction";
}
declare module "src/core/shared/information/atms" {
    const _default_16: {
        x: number;
        y: number;
        z: number;
    }[];
    export default _default_16;
}
declare module "src/core/shared/information/vendingMachines" {
    const _default_17: {
        x: number;
        y: number;
        z: number;
        isBlip: boolean;
    }[];
    export default _default_17;
}
declare module "src/core/server/api/consts/constData" {
    export { default as atms } from "src/core/shared/information/atms";
    export { VehicleData as vehicles } from "src/core/shared/information/vehicles";
    export { default as vendingMachines } from "src/core/shared/information/vendingMachines";
}
declare module "src/core/server/interface/iConfig" {
    export interface IConfig {
        DISCORD_BOT?: string;
        DISCORD_SERVER_ID?: string;
        WHITELIST_ROLE?: string;
        ARES_ENDPOINT?: string;
        MONGO_URL?: string;
        MONGO_USERNAME?: string;
        MONGO_PASSWORD?: string;
        MONGO_COLLECTIONS?: string;
        MONGO_DATABASE_NAME?: string;
        WEBSERVER_IP?: string;
        VUE_DEBUG?: string | boolean;
        USE_ALTV_RECONNECT?: boolean;
        USE_DEV_MODE?: boolean;
    }
}
declare module "src/core/server/database/connection" {
    import { IConfig } from "src/core/server/interface/iConfig";
    export function getURL(config: IConfig): string;
    export function getCollections(): string[];
    export function getName(config: IConfig): string;
    export function throwConnectionError(): void;
    const _default_18: {
        getCollections: typeof getCollections;
        getName: typeof getName;
        getURL: typeof getURL;
        throwConnectionError: typeof throwConnectionError;
    };
    export default _default_18;
}
declare module "src/core/server/database/index" {
    export { Collections as collections } from "src/core/server/database/collections";
    export { default as connection } from "src/core/server/database/connection";
}
declare module "src/core/shared/utility/knownKeys" {
    export type KnownKeys<T> = {
        [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
    };
    export type OmitFromKnownKeys<T, K extends keyof T> = KnownKeys<T> extends infer U ? keyof U extends keyof T ? Pick<T, Exclude<keyof U, K>> & Pick<T, Exclude<keyof T, keyof KnownKeys<T>>> : never : never;
    export type RemoveIndex<T> = {
        [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
    };
}
declare module "src/core/server/document/accountData" {
    import * as alt from 'alt-server';
    import { KnownKeys } from "src/core/shared/utility/knownKeys";
    import { Account } from "src/core/server/interface/iAccount";
    export type KeyChangeCallback = (player: alt.Player, newValue: any, oldValue: any) => void;
    export function bind(player: alt.Player, document: Account): any;
    export function unbind(id: number): any;
    export function get<T = Account>(player: alt.Player): T | undefined;
    export function getField<T = {}, ReturnType = any>(player: alt.Player, fieldName: keyof KnownKeys<Account & T>): ReturnType | undefined;
    export function set<T = {}, Keys = keyof KnownKeys<Account & T>>(player: alt.Player, fieldName: Keys, value: any): any;
    export function setBulk<T = {}, Keys = Partial<Account & T>>(player: alt.Player, fields: Keys): any;
    export function onChange<T = {}>(fieldName: keyof KnownKeys<Account & T>, callback: KeyChangeCallback): any;
    export function override(functionName: 'bind', callback: typeof bind): any;
    export function override(functionName: 'unbind', callback: typeof unbind): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'getField', callback: typeof getField): any;
    export function override(functionName: 'set', callback: typeof set): any;
    export function override(functionName: 'setBulk', callback: typeof setBulk): any;
    export function override(functionName: 'onChange', callback: typeof onChange): any;
}
declare module "src/core/shared/interfaces/characterInfo" {
    export interface CharacterInfo {
        gender?: string;
        age?: any;
    }
}
declare module "src/core/shared/interfaces/character" {
    import * as alt from 'alt-shared';
    import { Appearance } from "src/core/shared/interfaces/appearance";
    import { CharacterInfo } from "src/core/shared/interfaces/characterInfo";
    import { ClothingComponent, StoredItem } from "src/core/shared/interfaces/item";
    export interface Character {
        [key: string]: any;
        _id?: any;
        character_id?: number;
        account_id: any;
        dimension: number;
        pos: Partial<alt.IVector3>;
        name: string;
        cash: number;
        bank: number;
        health: number;
        armour: number;
        food: number;
        water: number;
        isDead: boolean;
        hours: number;
        wanted: number;
        appearance: Partial<Appearance> | Appearance;
        info: Partial<CharacterInfo>;
        interior: number | undefined;
        permissions: Array<string>;
        inventory: Array<StoredItem>;
        toolbar: Array<StoredItem>;
        uniform?: Array<ClothingComponent>;
        skin?: string | number;
        groups?: {
            [key: string]: Array<string>;
        };
    }
    export const CharacterDefaults: Partial<Character>;
}
declare module "src/core/server/document/character" {
    import * as alt from 'alt-server';
    import { Character } from "src/core/shared/interfaces/character";
    import { KnownKeys } from "src/core/shared/utility/knownKeys";
    export type KeyChangeCallback = (player: alt.Player, newValue: any, oldValue: any) => void;
    export function bind(player: alt.Player, document: Character): any;
    export function unbind(id: number): any;
    export function get<T = Character>(player: alt.Player): T | undefined;
    export function getField<T = {}, ReturnType = any>(player: alt.Player, fieldName: keyof KnownKeys<Character & T>): ReturnType | undefined;
    export function set<T = {}, Keys = keyof KnownKeys<Character & T>>(player: alt.Player, fieldName: Keys, value: any, skipCallbacks?: boolean): any;
    export function setBulk<T = {}, Keys = Partial<Character & T>>(player: alt.Player, fields: Keys): any;
    export function onChange<T = {}>(fieldName: keyof KnownKeys<Character & T>, callback: KeyChangeCallback): any;
    export function override(functionName: 'bind', callback: typeof bind): any;
    export function override(functionName: 'unbind', callback: typeof unbind): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'getField', callback: typeof getField): any;
    export function override(functionName: 'set', callback: typeof set): any;
    export function override(functionName: 'setBulk', callback: typeof setBulk): any;
    export function override(functionName: 'onChange', callback: typeof onChange): any;
}
declare module "src/core/shared/interfaces/vehicleBase" {
    import * as alt from 'alt-shared';
    export interface BaseVehicle {
        _id?: unknown;
        id?: number;
        owner: string | null;
        model: string;
        pos: alt.IVector3;
        rot: alt.IVector3;
        dimension: number;
        plate: string;
        keys: Array<string>;
        permissions: Array<string>;
        fuel: number;
        garageInfo?: number;
        doNotDespawn?: boolean;
        lastUsed?: number;
        groups: {
            [key: string]: Array<string>;
        };
    }
}
declare module "src/core/shared/interfaces/vehicleState" {
    import { WindowTint } from 'alt-server';
    import { IVehicleNeon } from 'alt-server';
    import * as alt from 'alt-shared';
    export interface VehicleState {
        activeRadioStation: number;
        bodyAdditionalHealth: number;
        bodyHealth: number;
        customPrimaryColor: alt.RGBA;
        customSecondaryColor: alt.RGBA;
        customTires: boolean;
        darkness: number;
        dashboardColor: number;
        dirtLevel: number;
        engineHealth: number;
        engineOn: boolean;
        headlightColor: number;
        interiorColor: number;
        lightsMultiplier: number;
        livery: number;
        lockState: alt.VehicleLockState;
        manualEngineControl: boolean;
        neon: IVehicleNeon;
        neonColor: alt.RGBA;
        numberPlateIndex: number;
        numberPlateText: string;
        pearlColor: number;
        petrolTankHealth: number;
        primaryColor: number;
        roofLivery: number;
        roofState: boolean;
        secondaryColor: number;
        sirenActive: boolean;
        tireSmokeColor: alt.RGBA;
        wheelColor: number;
        windowTint: WindowTint;
        driftModeEnabled: boolean;
        isMissionTrain: boolean;
        trainTrackId: number;
        trainConfigIndex: number;
        trainDistanceFromEngine: number;
        isTrainEngine: boolean;
        isTrainCaboose: boolean;
        trainPassengerCarriages: boolean;
        trainDirection: boolean;
        trainRenderDerailed: boolean;
        trainForceDoorsOpen: boolean;
        trainCruiseSpeed: number;
        trainCarriageConfigIndex: number;
        trainUnk1: boolean;
        trainUnk2: boolean;
        trainUnk3: boolean;
        boatAnchorActive: boolean;
        lightState: number;
        rocketRefuelSpeed: number;
        counterMeasureCount: number;
        scriptMaxSpeed: number;
        hybridExtraActive: boolean;
        hybridExtraState: number;
    }
}
declare module "src/core/shared/interfaces/vehicleMod" {
    export default interface IVehicleMod {
        id: number;
        value: number;
    }
}
declare module "src/core/shared/interfaces/vehicleTuning" {
    import IVehicleMod from "src/core/shared/interfaces/vehicleMod";
    export interface IVehicleTuning {
        modkit: number;
        mods: Array<IVehicleMod>;
    }
    export default IVehicleTuning;
}
declare module "src/core/shared/interfaces/vehicleOwned" {
    import { BaseVehicle } from "src/core/shared/interfaces/vehicleBase";
    import { VehicleState } from "src/core/shared/interfaces/vehicleState";
    import VehicleTuning from "src/core/shared/interfaces/vehicleTuning";
    export type PartDamage = {
        bulletHoles?: number;
        damageLevel: string;
    };
    export interface VehicleDamage {
        parts?: {
            [part: string]: PartDamage;
        };
        bumpers?: {
            [part: string]: PartDamage;
        };
        windows?: {
            [part: string]: PartDamage;
        };
        wheels?: Array<PartDamage>;
        lights?: Array<PartDamage>;
    }
    export interface OwnedVehicle extends BaseVehicle {
        tuning?: Partial<VehicleTuning> | VehicleTuning | undefined;
        state?: Partial<VehicleState> | VehicleState;
        damage?: VehicleDamage;
    }
}
declare module "src/core/server/document/vehicle" {
    import * as alt from 'alt-server';
    import { KnownKeys } from "src/core/shared/utility/knownKeys";
    import { OwnedVehicle } from "src/core/shared/interfaces/vehicleOwned";
    export type KeyChangeCallback = (vehicle: alt.Vehicle, newValue: any, oldValue: any) => void;
    export function unbind(id: number): any;
    export function bind(vehicle: alt.Vehicle, document: OwnedVehicle): any;
    export function get<T = OwnedVehicle>(vehicle: alt.Vehicle): T | undefined;
    export function getField<T = {}, ReturnType = any>(vehicle: alt.Vehicle, fieldName: keyof KnownKeys<OwnedVehicle & T>): ReturnType | undefined;
    export function set<T = {}, Keys = keyof KnownKeys<OwnedVehicle & T>>(vehicle: alt.Vehicle, fieldName: Keys, value: any, skipCallbacks?: boolean): any;
    export function setBulk<T = {}, Keys = Partial<OwnedVehicle & T>>(vehicle: alt.Vehicle, fields: Keys): any;
    export function onChange<T = {}>(fieldName: keyof KnownKeys<OwnedVehicle & T>, callback: KeyChangeCallback): any;
    export function exists(_id: string): boolean;
    export function override(functionName: 'exists', callback: typeof exists): any;
    export function override(functionName: 'bind', callback: typeof bind): any;
    export function override(functionName: 'unbind', callback: typeof unbind): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'getField', callback: typeof getField): any;
    export function override(functionName: 'set', callback: typeof set): any;
    export function override(functionName: 'setBulk', callback: typeof setBulk): any;
    export function override(functionName: 'onChange', callback: typeof onChange): any;
}
declare module "src/core/server/document/index" {
    export * as account from "src/core/server/document/accountData";
    export * as character from "src/core/server/document/character";
    export * as vehicle from "src/core/server/document/vehicle";
}
declare module "src/core/server/vehicle/events" {
    import { OwnedVehicle } from "src/core/shared/interfaces/vehicleOwned";
    import * as alt from 'alt-server';
    export type AthenaVehicleEvents = 'engine-started' | 'engine-stopped' | 'door-opened' | 'door-closed' | 'doors-locked' | 'doors-lock-changed' | 'doors-unlocked' | 'vehicle-destroyed' | 'vehicle-repaired' | 'vehicle-spawned' | 'vehicle-repaired';
    export function trigger<CustomEvents = AthenaVehicleEvents>(eventName: CustomEvents, vehicle: alt.Vehicle, ...args: any[]): void;
    export function on(eventName: 'vehicle-spawned', callback: (vehicle: alt.Vehicle) => void): any;
    export function on(eventName: 'doors-unlocked', callback: (vehicle: alt.Vehicle, player: alt.Player) => void): any;
    export function on(eventName: 'doors-locked', callback: (vehicle: alt.Vehicle, player: alt.Player) => void): any;
    export function on(eventName: 'doors-lock-changed', callback: (vehicle: alt.Vehicle, player: alt.Player) => void): any;
    export function on(eventName: 'door-closed', callback: (vehicle: alt.Vehicle, door: number, player: alt.Player) => void): any;
    export function on(eventName: 'door-opened', callback: (vehicle: alt.Vehicle, door: number, player: alt.Player) => void): any;
    export function on(eventName: 'engine-stopped', callback: (vehicle: alt.Vehicle, player: alt.Player) => void): any;
    export function on(eventName: 'engine-started', callback: (vehicle: alt.Vehicle, player: alt.Player) => void): any;
    export function on(eventName: 'vehicle-repaired', callback: (vehicle: alt.Vehicle) => void): any;
    export function on(eventName: 'vehicle-destroyed', callback: (vehicle: alt.Vehicle, document: OwnedVehicle | undefined) => void): any;
}
declare module "src/core/server/events/index" {
    export * as vehicle from "src/core/server/vehicle/events";
}
declare module "src/core/server/api/consts/constExtensions" {
    export { InteractionShape, PolygonShape } from "src/core/server/extensions/extColshape";
}
declare module "src/core/server/getters/player" {
    import * as alt from 'alt-server';
    import { Character } from "src/core/shared/interfaces/character";
    import { Account } from "src/core/server/interface/iAccount";
    import { OwnedVehicle } from "src/core/shared/interfaces/vehicleOwned";
    export function byAccount(id: string): alt.Player | undefined;
    export function byName(name: string): alt.Player | undefined;
    export function byPartialName(partialName: string): alt.Player | undefined;
    export function byDatabaseID(id: string): alt.Player | undefined;
    export function byID(id: number): alt.Player | undefined;
    export function inFrontOf(player: alt.Player, startDistance?: number): Promise<alt.Player | undefined>;
    export function isNearPosition(player: alt.Player, pos: alt.IVector3, dist?: number): boolean;
    export function waypoint(player: alt.Player): alt.IVector3 | undefined;
    export function closestToPlayer(player: alt.Player): alt.Player | undefined;
    export function closestToVehicle(vehicle: alt.Vehicle): alt.Player | undefined;
    export function closestOwnedVehicle(player: alt.Player): alt.Vehicle | undefined;
    export function ownedVehicleDocuments(player: alt.Player): Promise<Array<OwnedVehicle>>;
    export function characters(playerOrAccount: alt.Player | Account | string): Promise<Array<Character>>;
    export function isDead(player: alt.Player): boolean;
    export function isValid(player: alt.Player): boolean;
}
declare module "src/core/server/getters/vehicle" {
    import * as alt from 'alt-server';
    export function byID(id: number): alt.Vehicle | undefined;
    export function byIncrementalDatabaseID(id: number | string): alt.Vehicle | undefined;
    export function byDatabaseID(id: string): alt.Vehicle | undefined;
    export function isValidModel(model: number): boolean;
    export function inFrontOf(entity: alt.Entity, startDistance?: number): Promise<alt.Vehicle | undefined>;
    export function isNearPosition(vehicle: alt.Vehicle, pos: alt.IVector3, dist?: number): boolean;
    export function passengers(vehicle: alt.Vehicle): alt.Player[];
    export function driver(vehicle: alt.Vehicle): alt.Player | undefined;
    export function closestToPlayer(player: alt.Player): alt.Player | undefined;
    export function closestToVehicle(player: alt.Player): alt.Vehicle | undefined;
}
declare module "src/core/server/getters/players" {
    import * as alt from 'alt-server';
    export function online(): alt.Player[];
    export function onlineWithWeapons(): alt.Player[];
    export function inRangeWithDistance(pos: alt.IVector3, range: number): Array<{
        player: alt.Player;
        dist: number;
    }>;
    export function inRange(pos: alt.IVector3, range: number): alt.Player[];
    export function withName(name: string): alt.Player[];
    export function driving(): alt.Player[];
    export function walking(): alt.Player[];
    export function drivingSpecificModel(model: string | number): alt.Player[];
    export function inVehicle(vehicle: alt.Vehicle): alt.Player[];
}
declare module "src/core/server/getters/vehicles" {
    import * as alt from 'alt-server';
    export function inRange(pos: alt.IVector3, range: number): alt.Vehicle[];
}
declare module "src/core/server/getters/world" {
    import * as alt from 'alt-server';
    export function positionIsClear(pos: alt.IVector3, lookFor: 'vehicle' | 'player' | 'all'): Promise<boolean>;
    export function isInOceanWater(entity: alt.Entity): boolean;
}
declare module "src/core/server/getters/index" {
    export * as player from "src/core/server/getters/player";
    export * as players from "src/core/server/getters/players";
    export * as vehicle from "src/core/server/getters/vehicle";
    export * as vehicles from "src/core/server/getters/vehicles";
    export * as world from "src/core/server/getters/world";
}
declare module "src/core/server/player/appearance" {
    import * as alt from 'alt-server';
    export type Decorator = {
        overlay: string;
        collection: string;
    };
    export type HairStyle = {
        hair: number;
        dlc?: string | number;
        color1: number;
        color2: number;
        decorator: Decorator;
    };
    export type BaseStyle = {
        style: number;
        opacity: number;
        color: number;
    };
    export function setHairStyle(player: alt.Player, style: HairStyle): any;
    export function setFacialHair(player: alt.Player, choice: BaseStyle): any;
    export function setEyebrows(player: alt.Player, choice: BaseStyle): any;
    export function setModel(player: alt.Player, isFeminine: boolean): any;
    export function setEyeColor(player: alt.Player, color: number): any;
    export function updateTattoos(player: alt.Player, decorators?: Array<Decorator>): any;
    export function override(functionName: 'setHairStyle', callback: typeof setHairStyle): any;
    export function override(functionName: 'setFacialHair', callback: typeof setFacialHair): any;
    export function override(functionName: 'setEyebrows', callback: typeof setEyebrows): any;
    export function override(functionName: 'setModel', callback: typeof setModel): any;
    export function override(functionName: 'setEyeColor', callback: typeof setEyeColor): any;
    export function override(functionName: 'updateTattoos', callback: typeof updateTattoos): any;
}
declare module "src/core/shared/enums/currency" {
    export enum CurrencyTypes {
        BANK = "bank",
        CASH = "cash"
    }
}
declare module "src/core/server/player/currency" {
    import * as alt from 'alt-server';
    export type DefaultCurrency = 'bank' | 'cash';
    export function add<CustomCurrency>(player: alt.Player, type: DefaultCurrency | CustomCurrency, amount: number): boolean;
    export function sub<CustomCurrency>(player: alt.Player, type: DefaultCurrency | CustomCurrency, amount: number): boolean;
    export function set<CustomCurrency>(player: alt.Player, type: DefaultCurrency | CustomCurrency, amount: number): boolean;
    export function subAllCurrencies(player: alt.Player, amount: number): boolean;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'set', callback: typeof set): any;
    export function override(functionName: 'sub', callback: typeof sub): any;
    export function override(functionName: 'subAllCurrencies', callback: typeof subAllCurrencies): any;
}
declare module "src/core/shared/utility/weather" {
    const WEATHER_TYPE: {
        readonly ExtraSunny: 0;
        readonly Clear: 1;
        readonly Clouds: 2;
        readonly Smog: 3;
        readonly Foggy: 4;
        readonly Overcast: 5;
        readonly Rain: 6;
        readonly Thunder: 7;
        readonly Clearing: 8;
        readonly Neutral: 9;
        readonly Snow: 10;
        readonly Blizzard: 11;
        readonly Snowlight: 12;
        readonly Xmas: 13;
        readonly Halloween: 14;
    };
    export type WEATHER_KEY = keyof typeof WEATHER_TYPE;
    export function getWeatherFromString(weatherName: WEATHER_KEY): number;
}
declare module "src/core/server/player/emit" {
    import * as alt from 'alt-server';
    import { ANIMATION_FLAGS } from "src/core/shared/flags/animationFlags";
    import IAttachable from "src/core/shared/interfaces/iAttachable";
    import ICredit from "src/core/shared/interfaces/iCredit";
    import IErrorScreen from "src/core/shared/interfaces/iErrorScreen";
    import IShard from "src/core/shared/interfaces/iShard";
    import ISpinner from "src/core/shared/interfaces/iSpinner";
    import { Particle } from "src/core/shared/interfaces/particle";
    import { ProgressBar } from "src/core/shared/interfaces/progressBar";
    import { Task, TaskCallback } from "src/core/shared/interfaces/taskTimeline";
    import { IWheelOption } from "src/core/shared/interfaces/wheelMenu";
    import { AcceptDeclineEvent } from "src/core/shared/interfaces/acceptDeclineEvent";
    import { RecommendedTimecycleTypes } from "src/core/shared/enums/timecycleTypes";
    import { WEATHER_KEY } from "src/core/shared/utility/weather";
    export function startAlarm(player: alt.Player, name: string): void;
    export function stopAlarm(player: alt.Player, name: string): any;
    export function stopAllAlarms(player: alt.Player): any;
    export function animation(player: alt.Player, dictionary: string, name: string, flags: ANIMATION_FLAGS, duration?: number): void;
    export function clearAnimation(player: alt.Player): any;
    export function scenario(player: alt.Player, name: string, duration: number): void;
    export function meta(player: alt.Player, key: string, value: any): void;
    export function notification(player: alt.Player, message: string): void;
    export function particle(player: alt.Player, particle: Particle, emitToNearbyPlayers?: boolean): void;
    export function createMissionText(player: alt.Player, text: string, duration?: number): any;
    export function createProgressBar(player: alt.Player, progressbar: ProgressBar): string;
    export function removeProgressBar(player: alt.Player, uid: string): any;
    export function sound2D(player: alt.Player, audioName: string, volume?: number, soundInstantID?: string): any;
    export function sound3D(player: alt.Player, audioName: string, target: alt.Entity, soundInstantID?: string): void;
    export function soundStop(player: alt.Player, soundInstantID?: string): void;
    export function soundFrontend(player: alt.Player, audioName: string, ref: string): void;
    export function taskTimeline(player: alt.Player, tasks: Array<Task | TaskCallback>): any;
    export function createSpinner(player: alt.Player, spinner: ISpinner): any;
    export function clearSpinner(player: alt.Player): any;
    export function createErrorScreen(player: alt.Player, screen: IErrorScreen): any;
    export function clearErrorScreen(player: alt.Player): any;
    export function createShard(player: alt.Player, shard: IShard): any;
    export function clearShard(player: alt.Player): any;
    export function createCredits(player: alt.Player, credits: ICredit): any;
    export function clearCredits(player: alt.Player): any;
    export function objectAttach(player: alt.Player, attachable: IAttachable, removeAfterMilliseconds?: number): string | null;
    export function objectRemove(player: alt.Player, uid: string): any;
    export function tempObjectLerp(player: alt.Player, model: string, start: alt.IVector3, end: alt.IVector3, speed: number): any;
    export function wheelMenu(player: alt.Player, label: string, wheelItems: Array<IWheelOption>): any;
    export function message(player: alt.Player, msg: string): any;
    export function acceptDeclineEvent(player: alt.Player, eventInfo: AcceptDeclineEvent): any;
    export function fadeScreenToBlack(player: alt.Player, timeInMs: number): void;
    export function fadeScreenFromBlack(player: alt.Player, timeInMs: number): void;
    export function setTimeCycleEffect(player: alt.Player, name: RecommendedTimecycleTypes, amountInMs: number): any;
    export function setTimeCycleEffect(player: alt.Player, name: string, amountInMs: number): any;
    export function clearTimeCycleEffect(player: alt.Player): void;
    export function setWeather(player: alt.Player, weather: WEATHER_KEY, timeInSeconds: number): void;
    export function override(functionName: 'acceptDeclineEvent', callback: typeof acceptDeclineEvent): any;
    export function override(functionName: 'animation', callback: typeof animation): any;
    export function override(functionName: 'clearAnimation', callback: typeof clearAnimation): any;
    export function override(functionName: 'clearCredits', callback: typeof clearCredits): any;
    export function override(functionName: 'clearTimeCycleEffect', callback: typeof clearTimeCycleEffect): any;
    export function override(functionName: 'createErrorScreen', callback: typeof createErrorScreen): any;
    export function override(functionName: 'createMissionText', callback: typeof createMissionText): any;
    export function override(functionName: 'createProgressBar', callback: typeof createProgressBar): any;
    export function override(functionName: 'createShard', callback: typeof createShard): any;
    export function override(functionName: 'createSpinner', callback: typeof createSpinner): any;
    export function override(functionName: 'fadeScreenFromBlack', callback: typeof fadeScreenFromBlack): any;
    export function override(functionName: 'fadeScreenToBlack', callback: typeof fadeScreenToBlack): any;
    export function override(functionName: 'message', callback: typeof message): any;
    export function override(functionName: 'meta', callback: typeof meta): any;
    export function override(functionName: 'notification', callback: typeof notification): any;
    export function override(functionName: 'objectAttach', callback: typeof objectAttach): any;
    export function override(functionName: 'objectRemove', callback: typeof objectRemove): any;
    export function override(functionName: 'particle', callback: typeof particle): any;
    export function override(functionName: 'removeProgressBar', callback: typeof removeProgressBar): any;
    export function override(functionName: 'scenario', callback: typeof scenario): any;
    export function override(functionName: 'setTimeCycleEffect', callback: typeof setTimeCycleEffect): any;
    export function override(functionName: 'sound2D', callback: typeof sound2D): any;
    export function override(functionName: 'sound3D', callback: typeof sound3D): any;
    export function override(functionName: 'soundFrontend', callback: typeof soundFrontend): any;
    export function override(functionName: 'soundStop', callback: typeof soundStop): any;
    export function override(functionName: 'startAlarm', callback: typeof startAlarm): any;
    export function override(functionName: 'stopAlarm', callback: typeof stopAlarm): any;
    export function override(functionName: 'stopAllAlarms', callback: typeof stopAllAlarms): any;
    export function override(functionName: 'taskTimeline', callback: typeof taskTimeline): any;
    export function override(functionName: 'tempObjectLerp', callback: typeof tempObjectLerp): any;
    export function override(functionName: 'wheelMenu', callback: typeof wheelMenu): any;
}
declare module "src/core/plugins/core-inventory/shared/interfaces" {
    export type InventoryType = 'inventory' | 'toolbar' | 'custom';
    export interface DualSlotInfo {
        startType: InventoryType;
        startIndex: number;
        endType: InventoryType;
        endIndex: number;
    }
}
declare module "src/core/server/player/events" {
    import { InventoryType } from "src/core/plugins/core-inventory/shared/interfaces";
    import { Character } from "src/core/shared/interfaces/character";
    import { StoredItem } from "src/core/shared/interfaces/item";
    import * as alt from 'alt-server';
    export type AthenaPlayerEvents = 'drop-item' | 'increased-play-time' | 'item-equipped' | 'item-unequipped' | 'pickup-item' | 'player-account-created' | 'player-character-created' | 'player-armour-set' | 'player-died' | 'player-disconnected' | 'player-entered-vehicle-as-driver' | 'player-health-set' | 'player-left-vehicle-seat' | 'player-pos-set' | 'player-skin-cleared' | 'player-skin-set' | 'player-uniform-cleared' | 'player-uniform-set' | 'player-weapon-unequipped' | 'respawned' | 'selected-character' | 'set-account-data' | 'spawned';
    export function trigger<CustomEvents = AthenaPlayerEvents>(eventName: CustomEvents, player: alt.Player, ...args: any[]): void;
    export function on(eventName: 'item-equipped', callback: (player: alt.Player, slot: number, type: InventoryType) => void): any;
    export function on(eventName: 'item-unequipped', callback: (player: alt.Player, slot: number, type: InventoryType) => void): any;
    export function on(eventName: 'player-died', callback: (player: alt.Player) => void): any;
    export function on(eventName: 'player-uniform-set', callback: (player: alt.Player) => void): any;
    export function on(eventName: 'player-uniform-cleared', callback: (player: alt.Player) => void): any;
    export function on(eventName: 'player-skin-set', callback: (player: alt.Player) => void): any;
    export function on(eventName: 'player-skin-cleared', callback: (player: alt.Player) => void): any;
    export function on(eventName: 'player-health-set', callback: (player: alt.Player, oldValue: number) => void): any;
    export function on(eventName: 'player-armour-set', callback: (player: alt.Player, oldValue: number) => void): any;
    export function on(eventName: 'player-pos-set', callback: (player: alt.Player, oldValue: alt.IVector3) => void): any;
    export function on(eventName: 'increased-play-time', callback: (player: alt.Player, newHours: number) => void): any;
    export function on(eventName: 'drop-item', callback: (player: alt.Player, storedItem: StoredItem) => void): any;
    export function on(eventName: 'pickup-item', callback: (player: alt.Player, _id: string) => void): any;
    export function on(eventName: 'selected-character', callback: (player: alt.Player) => void): any;
    export function on(eventName: 'respawned', callback: (player: alt.Player) => void): any;
    export function on(eventName: 'player-left-vehicle-seat', callback: (player: alt.Player, vehicle: alt.Vehicle, seat: number) => void): any;
    export function on(eventName: 'player-entered-vehicle-as-driver', callback: (player: alt.Player, vehicle: alt.Vehicle) => void): any;
    export function on<T>(eventName: 'player-disconnected', callback: (player: alt.Player, id: number, document: Character | T) => void): any;
    export function on<T>(eventName: 'player-weapon-unequipped', callback: (player: alt.Player, slot: number, type: InventoryType) => void): any;
    export function on<T>(eventName: 'player-account-created', callback: (player: alt.Player) => void): any;
    export function on<T>(eventName: 'player-character-created', callback: (player: alt.Player) => void): any;
}
declare module "src/core/server/player/inventory" {
    import * as alt from 'alt-server';
    import { StoredItem } from "src/core/shared/interfaces/item";
    export function add(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean>;
    export function sub(player: alt.Player, item: Omit<StoredItem, 'slot' | 'data'>): Promise<boolean>;
    export function remove(player: alt.Player, slot: number): Promise<boolean>;
    export function has(player: alt.Player, dbName: string, quantity: number, version?: any): any;
    export function getItemData<CustomData = {}>(player: alt.Player, slot: number): CustomData | undefined;
    export function getAt<CustomData = {}>(player: alt.Player, slot: number): StoredItem | undefined;
    export function modifyItemData<CustomData = {}>(player: alt.Player, slot: number, customData: CustomData): Promise<boolean>;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'getAt', callback: typeof getAt): any;
    export function override(functionName: 'has', callback: typeof has): any;
    export function override(functionName: 'sub', callback: typeof sub): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'modifyItemData', callback: typeof modifyItemData): any;
    export function override(functionName: 'getItemData', callback: typeof getItemData): any;
}
declare module "src/core/server/systems/permissionGroup" {
    export interface PermissionGroup {
        groups?: {
            [key: string]: Array<string>;
        };
    }
    export function addGroupPerm<T>(document: T & PermissionGroup, groupName: string, value: Array<string> | string): T & PermissionGroup;
    export function removeGroupPerm<T>(document: T & PermissionGroup, groupName: string, value: Array<string> | string): T & PermissionGroup;
    export function removeGroup<T>(document: T & PermissionGroup, groupName: string): T & PermissionGroup;
    export function hasGroup(document: PermissionGroup, groupName: string): boolean;
    export function hasGroupPerm(document: PermissionGroup, groupName: string, permission: string): boolean;
    export function hasAtLeastOneGroupPerm(document: PermissionGroup, groupName: string, permissions: Array<string>): boolean;
    export function hasCommonPermission(documents: Array<PermissionGroup>, groupName: string, permission: string): boolean;
}
declare module "src/core/server/player/permissions" {
    import * as alt from 'alt-server';
    import { PermissionGroup } from "src/core/server/systems/permissionGroup";
    export function addPermission(player: alt.Player, permission: string): Promise<boolean>;
    export function removePermission(player: alt.Player, permission: string): Promise<boolean>;
    export function hasPermission(player: alt.Player, permission: string): boolean;
    export function hasAccountPermission(player: alt.Player, permission: string): boolean;
    export function hasGroupPermission(player: alt.Player, groupName: string, permission: string): boolean;
    export function hasCommonGroupPermission(player: alt.Player, document: PermissionGroup, groupName: string, permission: string): boolean;
    export function addGroupPerm(player: alt.Player, groupName: string, permission: string): Promise<boolean>;
}
declare module "src/core/server/player/safe" {
    import * as alt from 'alt-server';
    export function setPosition(player: alt.Player, x: number, y: number, z: number, doNotInvokeEventCall?: boolean): void;
    export function addHealth(player: alt.Player, value: number, exactValue?: boolean, doNotInvokeEventCall?: boolean): any;
    export function subHealth(player: alt.Player, value: number, exactValue?: boolean, doNotInvokeEventCall?: boolean): any;
    export function addArmour(player: alt.Player, value: number, exactValue?: boolean, doNotInvokeEventCall?: boolean): void;
    export function subArmour(player: alt.Player, value: number, exactValue?: boolean, doNotInvokeEventCall?: boolean): void;
    export function setDimension(player: alt.Player, value: number): any;
    export function override(functionName: 'setPosition', callback: typeof setPosition): any;
    export function override(functionName: 'addHealth', callback: typeof addHealth): any;
    export function override(functionName: 'subHealth', callback: typeof subHealth): any;
    export function override(functionName: 'addArmour', callback: typeof addArmour): any;
    export function override(functionName: 'subArmour', callback: typeof subArmour): any;
    export function override(functionName: 'setDimension', callback: typeof setDimension): any;
}
declare module "src/core/server/player/setter" {
    import * as alt from 'alt-server';
    import { ActionMenu } from "src/core/shared/interfaces/actions";
    import { Account } from "src/core/server/interface/iAccount";
    export function account(player: alt.Player, accountData: Account): Promise<void>;
    export function actionMenu(player: alt.Player, actionMenu: ActionMenu): any;
    export function respawned(player: alt.Player, position: alt.IVector3): void;
    export function override(functionName: 'account', callback: typeof account): any;
    export function override(functionName: 'actionMenu', callback: typeof actionMenu): any;
    export function override(functionName: 'respawned', callback: typeof respawned): any;
}
declare module "src/core/server/player/sync" {
    import * as alt from 'alt-server';
    import { Character } from "src/core/shared/interfaces/character";
    export function currencyData(player: alt.Player): void;
    export function appearance(player: alt.Player, document?: Character): any;
    export function syncedMeta(player: alt.Player): void;
    export function playTime(player: alt.Player): void;
    export function override(functionName: 'currencyData', callback: typeof currencyData): any;
    export function override(functionName: 'appearance', callback: typeof appearance): any;
    export function override(functionName: 'syncedMeta', callback: typeof syncedMeta): any;
    export function override(functionName: 'playTime', callback: typeof playTime): any;
}
declare module "src/core/server/player/toolbar" {
    import * as alt from 'alt-server';
    import { StoredItem } from "src/core/shared/interfaces/item";
    export function add(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean>;
    export function sub(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean>;
    export function remove(player: alt.Player, slot: number): Promise<boolean>;
    export function has(player: alt.Player, dbName: string, quantity: number, version?: any): any;
    export function getItemData<CustomData = {}>(player: alt.Player, slot: number): CustomData | undefined;
    export function modifyItemData<CustomData = {}>(player: alt.Player, slot: number, customData: CustomData): Promise<boolean>;
    export function getAt<CustomData = {}>(player: alt.Player, slot: number): StoredItem | undefined;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'has', callback: typeof has): any;
    export function override(functionName: 'getAt', callback: typeof getAt): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'sub', callback: typeof sub): any;
    export function override(functionName: 'modifyItemData', callback: typeof modifyItemData): any;
    export function override(functionName: 'getItemData', callback: typeof getItemData): any;
}
declare module "src/core/server/player/weapons" {
    import * as alt from 'alt-server';
    import { StoredItem } from "src/core/shared/interfaces/item";
    export function get(player: alt.Player): {
        inventory: Array<StoredItem>;
        toolbar: Array<StoredItem>;
    };
    export function clear(player: alt.Player): Promise<boolean>;
}
declare module "src/core/server/player/index" {
    export * as appearance from "src/core/server/player/appearance";
    export * as currency from "src/core/server/player/currency";
    export * as emit from "src/core/server/player/emit";
    export * as events from "src/core/server/player/events";
    export * as inventory from "src/core/server/player/inventory";
    export * as permission from "src/core/server/player/permissions";
    export * as safe from "src/core/server/player/safe";
    export * as set from "src/core/server/player/setter";
    export * as sync from "src/core/server/player/sync";
    export * as toolbar from "src/core/server/player/toolbar";
    export * as weapons from "src/core/server/player/weapons";
}
declare module "src/core/server/systems/account" {
    import * as alt from 'alt-server';
    import { Account } from "src/core/server/interface/iAccount";
    export function getAccount(key: string, value: any): Promise<Account | undefined>;
    export function create(player: alt.Player, dataToAppend: {
        [key: string]: any;
    }): Promise<Account>;
    export function override(functionName: 'create', callback: typeof create): any;
    export function override(functionName: 'getAccount', callback: typeof getAccount): any;
}
declare module "src/core/server/systems/adminControl" {
    import * as alt from 'alt-server';
    import { AdminControl } from "src/core/shared/interfaces/adminControl";
    type PlayerCallback = (player: alt.Player, ...args: any[]) => void;
    export function addControl(control: AdminControl, callback: PlayerCallback): boolean;
    export function getControls(player: alt.Player): any;
    export function updateControls(player: alt.Player): void;
}
declare module "src/core/server/systems/character" {
    import * as alt from 'alt-server';
    import { Character } from "src/core/shared/interfaces/character";
    import { Appearance } from "src/core/shared/interfaces/appearance";
    import { CharacterInfo } from "src/core/shared/interfaces/characterInfo";
    export function setCreatorCallback(callback: (player: alt.Player, ...args: any[]) => void): any;
    export function invokeCreator(player: alt.Player, ...args: any[]): any;
    export function create(player: alt.Player, appearance: Appearance, info: CharacterInfo, name: string): Promise<boolean>;
    export function select(player: alt.Player, character: Character): any;
    export function isNameTaken(name: string): Promise<boolean>;
    export function getCharacters(account_id: string): Promise<Array<Character>>;
    export function override(functionName: 'create', callback: typeof create): any;
    export function override(functionName: 'setCreatorCallback', callback: typeof setCreatorCallback): any;
    export function override(functionName: 'invokeCreator', callback: typeof invokeCreator): any;
    export function override(functionName: 'select', callback: typeof select): any;
    export function override(functionName: 'isNameTaken', callback: typeof isNameTaken): any;
    export function override(functionName: 'getCharacters', callback: typeof getCharacters): any;
}
declare module "src/core/shared/information/weaponList" {
    export interface Weapon {
        hash: number;
        name: string;
        desc?: string;
        type?: string;
        price?: number;
        clip?: number;
        stats?: {
            damage?: number;
            rate?: number;
            accuracy?: number;
            range?: number;
        };
        overall?: number;
        icon?: string;
        model: string;
    }
    export function getWeaponByName(name: string): Weapon | null;
    export function getWeaponList(): Array<Weapon>;
    export function getWeaponMap(): {
        [name: string]: Weapon;
    };
}
declare module "src/core/server/systems/defaults/ammo" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/clothingCrafting" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/death" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/displayId" {
    export function disable(): void;
    export function setLocation(x: number, y: number): void;
}
declare module "src/core/server/systems/defaults/hospitalBlips" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/inventorySync" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/time" {
    import * as alt from 'alt-server';
    export function updatePlayer(player: alt.Player): void;
    export function disable(): void;
    export function getHour(): number;
    export function getMinute(): number;
}
declare module "src/core/server/systems/defaults/toolbar" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/vehiclesDespawnOnLeave" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/vehiclesSpawnOnJoin" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/weaponItems" {
    export function disable(): void;
}
declare module "src/core/server/systems/defaults/weather" {
    import * as alt from 'alt-server';
    import { WEATHER_KEY } from "src/core/shared/utility/weather";
    export function updatePlayer(player: alt.Player): void;
    export function disable(): void;
    export function setWeatherCycle(newWeatherCycle: Array<WEATHER_KEY>): void;
    export function getCurrentWeather(asString: false): number;
    export function getCurrentWeather(asString: true): string;
}
declare module "src/core/server/systems/defaults/index" {
    export * as ammo from "src/core/server/systems/defaults/ammo";
    export * as clothingCrafting from "src/core/server/systems/defaults/clothingCrafting";
    export * as death from "src/core/server/systems/defaults/death";
    export * as displayId from "src/core/server/systems/defaults/displayId";
    export * as hospitalBlips from "src/core/server/systems/defaults/hospitalBlips";
    export * as inventorySync from "src/core/server/systems/defaults/inventorySync";
    export * as time from "src/core/server/systems/defaults/time";
    export * as toolbar from "src/core/server/systems/defaults/toolbar";
    export * as vehiclesDespawnOnLeave from "src/core/server/systems/defaults/vehiclesDespawnOnLeave";
    export * as vehiclesSpawnOnJoin from "src/core/server/systems/defaults/vehiclesSpawnOnJoin";
    export * as weaponItems from "src/core/server/systems/defaults/weaponItems";
    export * as weather from "src/core/server/systems/defaults/weather";
}
declare module "src/core/server/systems/global" {
    export interface IGlobal {
        _id?: unknown;
    }
    export function isReady(): Promise<boolean>;
    export function setKey<T>(key: string, value: T): Promise<void>;
    export function getKey<T>(key: string): Promise<T>;
    export function get<IGlobal>(): Promise<IGlobal>;
    export function increase(key: string, increaseByValue?: number, startValue?: number): Promise<boolean>;
    export function decrease(key: string, decreaseByValue?: number, startValue?: number): Promise<boolean>;
}
declare module "src/core/server/systems/identifier" {
    import * as alt from 'alt-server';
    export type IdentifierStrategy = 'account_id' | 'character_id' | 'server_id';
    export function setIdentificationStrategy(_strategy: IdentifierStrategy): any;
    export function setPlayerIdentifier(player: alt.Player): any;
    export function getPlayer(id: number | string): alt.Player;
    export function getIdByStrategy(player: alt.Player): number;
    export function override(functionName: 'setIdentificationStrategy', callback: typeof setIdentificationStrategy): any;
    export function override(functionName: 'setPlayerIdentifier', callback: typeof setPlayerIdentifier): any;
    export function override(functionName: 'getPlayer', callback: typeof getPlayer): any;
    export function override(functionName: 'getIdByStrategy', callback: typeof getIdByStrategy): any;
}
declare module "src/core/shared/utility/undefinedCheck" {
    export function isNullOrUndefined(value: any): boolean;
}
declare module "src/core/server/systems/inventory/clothing" {
    import * as alt from 'alt-server';
    import { ClothingComponent, ClothingInfo, StoredItem } from "src/core/shared/interfaces/item";
    import { Character } from "src/core/shared/interfaces/character";
    let femaleClothes: {
        0: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        11: number;
    };
    let maleClothes: {
        0: number;
        3: number;
        5: number;
        4: number;
        6: number;
        7: number;
        8: number;
        9: number;
        11: number;
    };
    export function setUniform(player: alt.Player, components: Array<ClothingComponent>): Promise<boolean>;
    export function clearUniform(player: alt.Player): Promise<void>;
    export function setSkin(player: alt.Player, model: string | number): any;
    export function clearSkin(player: alt.Player): any;
    export function outfitFromDlc(sex: 0 | 1, componentList: Array<ClothingComponent>): StoredItem<ClothingInfo>;
    export function outfitFromPlayer(player: alt.Player, components: Array<{
        id: number;
        isProp?: boolean;
    }>, setEquipToTrue?: boolean): StoredItem | undefined;
    export function update(player: alt.Player, document?: Character): any;
    export function setDefaults(sex: 0 | 1, clothes: typeof maleClothes | typeof femaleClothes): any;
    export function override(functionName: 'clearSkin', callback: typeof clearSkin): any;
    export function override(functionName: 'clearUniform', callback: typeof clearUniform): any;
    export function override(functionName: 'outfitFromDlc', callback: typeof outfitFromDlc): any;
    export function override(functionName: 'outfitFromPlayer', callback: typeof outfitFromPlayer): any;
    export function override(functionName: 'setDefaults', callback: typeof setDefaults): any;
    export function override(functionName: 'setSkin', callback: typeof setSkin): any;
    export function override(functionName: 'setUniform', callback: typeof setUniform): any;
    export function override(functionName: 'update', callback: typeof update): any;
}
declare module "src/core/shared/enums/globalSynced" {
    export enum GLOBAL_SYNCED {
        INVENTORY_WEIGHT_ENABLED = "inventory-weight-enabled"
    }
}
declare module "src/core/server/systems/inventory/config" {
    let DEFAULT_CONFIG: {
        inventory: {
            size: number;
        };
        toolbar: {
            size: number;
        };
        custom: {
            size: number;
        };
        weight: {
            enabled: boolean;
            player: number;
        };
    };
    export function set(config: typeof DEFAULT_CONFIG): void;
    export function get(): typeof DEFAULT_CONFIG;
    export function disableWeight(): void;
}
declare module "src/core/server/systems/inventory/crafting" {
    import { StoredItem } from "src/core/shared/interfaces/item";
    export type dbName = string;
    export type ItemCombo = [dbName, dbName];
    export type Quantities = [number, number];
    export interface CraftRecipe {
        uid: string;
        combo: ItemCombo;
        quantities: Quantities;
        result?: {
            dbName: string;
            quantity: number;
            version?: number | undefined;
            data?: Object | ((item1: StoredItem, item2: StoredItem) => Object);
        };
        dataMigration?: ItemCombo;
        sound?: string;
    }
    export function addRecipe(recipe: CraftRecipe): boolean;
    export function findRecipe(combo: ItemCombo): CraftRecipe | undefined;
    export function combineItems(dataSet: Array<StoredItem>, slot1: number, slot2: number, type: 'inventory' | 'toolbar' | 'custom'): {
        dataSet: Array<StoredItem>;
        sound?: string;
    } | undefined;
    export function override(functionName: 'addRecipe', callback: typeof addRecipe): any;
    export function override(functionName: 'combineItems', callback: typeof combineItems): any;
    export function override(functionName: 'findRecipe', callback: typeof findRecipe): any;
}
declare module "src/core/server/systems/inventory/drops" {
    import * as alt from 'alt-server';
    import { ItemDrop, StoredItem } from "src/core/shared/interfaces/item";
    export function add(item: StoredItem, pos: alt.IVector3, player?: alt.Player): Promise<string>;
    export function get(id: string): ItemDrop | undefined;
    export function sub(id: string): Promise<StoredItem | undefined>;
    export function isItemAvailable(_id: string): any;
    export function markForTaken(_id: string, value: boolean): void;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'sub', callback: typeof sub): any;
    export function override(functionName: 'isItemAvailable', callback: typeof isItemAvailable): any;
    export function override(functionName: 'markForTaken', callback: typeof markForTaken): any;
}
declare module "src/core/server/systems/inventory/effects" {
    import * as alt from 'alt-server';
    export type InventoryType = 'inventory' | 'toolbar';
    export type EffectCallback = (player: alt.Player, slot: number, type: 'inventory' | 'toolbar') => void;
    export function add(effectNameFromItem: string, callback: EffectCallback): any;
    export function remove(effectName: string): boolean;
    export function invoke(player: alt.Player, slot: number, type: InventoryType, eventToCall?: string | string[]): boolean;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'invoke', callback: typeof invoke): any;
}
declare module "src/core/server/systems/inventory/factory" {
    import { BaseItem, StoredItem, Item, DefaultItemBehavior } from "src/core/shared/interfaces/item";
    export function isDoneLoadingAsync(): Promise<void>;
    export function getBaseItemAsync<CustomData = {}, CustomBehavior = {}>(dbName: string, version?: number): Promise<BaseItem<DefaultItemBehavior & CustomBehavior, CustomData>>;
    export function upsertAsync(baseItem: BaseItem): any;
    export function fromStoredItemAsync<CustomData = {}, CustomBehavior = {}>(item: StoredItem<CustomData>): Promise<Item<CustomBehavior & DefaultItemBehavior, CustomData> | undefined>;
    export function toStoredItemAsync<CustomData = {}>(item: Item<DefaultItemBehavior, CustomData>): Promise<StoredItem<CustomData>>;
    export function fromBaseToStoredAsync<CustomData = {}>(baseItem: BaseItem<DefaultItemBehavior, CustomData>, quantity: number): Promise<StoredItem<CustomData>>;
    export function getBaseItem<CustomData = {}, CustomBehavior = {}>(dbName: string, version?: number): BaseItem<DefaultItemBehavior & CustomBehavior, CustomData>;
    export function fromStoredItem<CustomData = {}, CustomBehavior = DefaultItemBehavior>(item: StoredItem<CustomData>): Item<CustomBehavior & DefaultItemBehavior, CustomData> | undefined;
    export function toStoredItem<CustomData = {}>(item: Item<DefaultItemBehavior, CustomData>): StoredItem<CustomData>;
    export function fromBaseToStored<CustomData = {}>(baseItem: BaseItem<DefaultItemBehavior, CustomData>, quantity: number): any;
    export function override(functionName: 'getBaseItemAsync', callback: typeof getBaseItemAsync): any;
    export function override(functionName: 'upsertAsync', callback: typeof upsertAsync): any;
    export function override(functionName: 'fromStoredItemAsync', callback: typeof fromStoredItemAsync): any;
    export function override(functionName: 'fromBaseToStoredAsync', callback: typeof fromBaseToStoredAsync): any;
    export function override(functionName: 'getBaseItem', callback: typeof getBaseItem): any;
    export function override(functionName: 'fromStoredItem', callback: typeof fromStoredItem): any;
    export function override(functionName: 'toStoredItem', callback: typeof toStoredItem): any;
    export function override(functionName: 'fromBaseToStored', callback: typeof fromBaseToStored): any;
}
declare module "src/core/server/systems/inventory/manager" {
    import * as alt from 'alt-server';
    import { BaseItem, StoredItem, Item, DefaultItemBehavior } from "src/core/shared/interfaces/item";
    export interface ItemQuantityChange {
        item: Item | StoredItem;
        remaining: number;
    }
    export type InventoryType = 'inventory' | 'toolbar' | 'custom';
    export type ComplexSwap = {
        slot: number;
        data: Array<StoredItem>;
        size: InventoryType | number;
        type: InventoryType;
    };
    export type ComplexSwapReturn = {
        from: Array<StoredItem>;
        to: Array<StoredItem>;
    };
    export function calculateItemWeight(baseItem: BaseItem, storedItem: StoredItem): StoredItem;
    export function modifyItemQuantity(item: Item | StoredItem, amount: number, isRemoving?: boolean): ItemQuantityChange;
    export function removeZeroQuantityItems(items: Array<StoredItem | Item>): Array<StoredItem | Item>;
    export function addQuantity(item: Item | StoredItem, amount: number): ItemQuantityChange | undefined;
    export function subQuantity(item: Item | StoredItem, amount: number): ItemQuantityChange | undefined;
    export function hasItem(dataSet: Array<StoredItem>, dbName: string, quantity: number, version?: number): boolean;
    export function upsertData<DataType = {}>(item: Item<DefaultItemBehavior, DataType> | StoredItem<DataType>, data: DataType): any;
    export function setData<DataType = {}>(item: Item<DefaultItemBehavior, DataType> | StoredItem<DataType>, data: DataType): any;
    export function clearData(item: Item | StoredItem): any;
    export function convertFromStored(data: Array<StoredItem<{}>>): Array<Item<DefaultItemBehavior, {}>>;
    export function add<CustomData = {}>(item: Omit<StoredItem<CustomData>, 'slot'>, data: Array<StoredItem>, size?: InventoryType | number): Array<StoredItem> | undefined;
    export function sub<CustomData = {}>(item: Omit<StoredItem<CustomData>, 'slot' | 'data'>, data: Array<StoredItem>): Array<StoredItem> | undefined;
    export function splitAt(slot: number, data: Array<StoredItem>, splitCount: number, dataSize?: InventoryType | number): Array<StoredItem> | undefined;
    export function combineAt(fromSlot: number, toSlot: number, data: Array<StoredItem>): Array<StoredItem> | undefined;
    export function combineAtComplex(from: ComplexSwap, to: ComplexSwap): ComplexSwapReturn | undefined;
    export function swap(fromSlot: number, toSlot: number, data: Array<StoredItem>, dataSize?: InventoryType | number): Array<StoredItem> | undefined;
    export function swapBetween(from: ComplexSwap, to: ComplexSwap): ComplexSwapReturn | undefined;
    export function useItem(player: alt.Player, slot: number, type?: 'inventory' | 'toolbar', eventToCall?: string | string[]): any;
    export function toggleItem(player: alt.Player, slot: number, type: InventoryType): Promise<boolean>;
    export function compare(firstItem: StoredItem, secondItem: StoredItem): boolean;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'addQuantity', callback: typeof addQuantity): any;
    export function override(functionName: 'calculateItemWeight', callback: typeof calculateItemWeight): any;
    export function override(functionName: 'clearData', callback: typeof clearData): any;
    export function override(functionName: 'combineAt', callback: typeof combineAt): any;
    export function override(functionName: 'combineAtComplex', callback: typeof combineAtComplex): any;
    export function override(functionName: 'compare', callback: typeof compare): any;
    export function override(functionName: 'convertFromStored', callback: typeof convertFromStored): any;
    export function override(functionName: 'hasItem', callback: typeof hasItem): any;
    export function override(functionName: 'modifyItemQuantity', callback: typeof modifyItemQuantity): any;
    export function override(functionName: 'removeZeroQuantityItems', callback: typeof removeZeroQuantityItems): any;
    export function override(functionName: 'setData', callback: typeof setData): any;
    export function override(functionName: 'splitAt', callback: typeof splitAt): any;
    export function override(functionName: 'sub', callback: typeof sub): any;
    export function override(functionName: 'subQuantity', callback: typeof subQuantity): any;
    export function override(functionName: 'swap', callback: typeof swap): any;
    export function override(functionName: 'swapBetween', callback: typeof swapBetween): any;
    export function override(functionName: 'toggleItem', callback: typeof toggleItem): any;
    export function override(functionName: 'upsertData', callback: typeof upsertData): any;
    export function override(functionName: 'useItem', callback: typeof useItem): any;
}
declare module "src/core/server/systems/inventory/slot" {
    import { InventoryType } from "src/core/plugins/core-inventory/shared/interfaces";
    import { StoredItem } from "src/core/shared/interfaces/item";
    export function findOpen(slotSize: InventoryType | number, data: Array<StoredItem>): number | undefined;
    export function getAt<CustomData = {}>(slot: number, data: Array<StoredItem>): StoredItem<CustomData> | undefined;
    export function removeAt(slot: number, data: Array<StoredItem>): Array<StoredItem> | undefined;
    export function override(functionName: 'findOpen', callback: typeof findOpen): any;
    export function override(functionName: 'removeAt', callback: typeof removeAt): any;
    export function override(functionName: 'getAt', callback: typeof getAt): any;
}
declare module "src/core/server/systems/inventory/weight" {
    import { Item, StoredItem } from "src/core/shared/interfaces/item";
    export function getDataWeight(data: Array<StoredItem | Item>): number;
    export function getTotalWeight(dataSets: Array<Array<StoredItem | Item>>): number;
    export function isWeightExceeded(dataSets: Array<Array<StoredItem | Item>>, amount?: number): boolean;
    export function override(functionName: 'getDataWeight', callback: typeof getDataWeight): any;
    export function override(functionName: 'getTotalWeight', callback: typeof getTotalWeight): any;
    export function override(functionName: 'isWeightExceeded', callback: typeof isWeightExceeded): any;
}
declare module "src/core/server/systems/inventory/weapons" {
    import * as alt from 'alt-server';
    import { StoredItem } from "src/core/shared/interfaces/item";
    export function get(dataSet: Array<StoredItem>): Array<StoredItem>;
    export function removeAll(dataSet: Array<StoredItem>): Array<StoredItem>;
    export function addComponent(player: alt.Player, type: 'inventory' | 'toolbar', slot: number, component: number | string): Promise<boolean>;
    export function update(player: alt.Player): any;
    export function override(functionName: 'update', callback: typeof update): any;
}
declare module "src/core/server/systems/inventory/index" {
    export * as clothing from "src/core/server/systems/inventory/clothing";
    export * as config from "src/core/server/systems/inventory/config";
    export * as crafting from "src/core/server/systems/inventory/crafting";
    export * as drops from "src/core/server/systems/inventory/drops";
    export * as effects from "src/core/server/systems/inventory/effects";
    export * as factory from "src/core/server/systems/inventory/factory";
    export * as manager from "src/core/server/systems/inventory/manager";
    export * as slot from "src/core/server/systems/inventory/slot";
    export * as weight from "src/core/server/systems/inventory/weight";
    export * as weapons from "src/core/server/systems/inventory/weapons";
}
declare module "src/core/server/systems/job/events" {
    import * as alt from 'alt-server';
    function invokeObjectiveCheck(player: alt.Player): any;
    export function override(functionName: 'invokeObjectiveCheck', callback: typeof invokeObjectiveCheck): any;
}
declare module "src/core/server/systems/job/system" {
    import * as alt from 'alt-server';
    import { Objective } from "src/core/shared/interfaces/job";
    export class Job {
        private id;
        private player;
        private objectives;
        private vehicles;
        private startTime;
        private completedCallback;
        private quitCallback;
        constructor();
        addPlayer(player: alt.Player): void;
        addObjective(objectiveData: Objective): void;
        addVehicle(player: alt.Player, model: string | number, pos: alt.IVector3, rot: alt.IVector3, color1?: alt.RGBA, color2?: alt.RGBA): alt.Vehicle;
        removeAllVehicles(): void;
        removeVehicle(uid: string): void;
        loadObjectives(objectiveData: Array<Objective>): void;
        quit(reason: string): void;
        goToNextObjective(): Promise<void>;
        getPlayer(): alt.Player;
        removeAttachable(): void;
        private syncObjective;
        getCurrentObjective(): Objective | null;
        getElapsedMilliseconds(): number;
        addNextObjective(objectiveData: Objective): void;
        setCompletedCallback(callback: () => Promise<void>): void;
        setQuitCallback(callback: (job: Job, reason: string) => void): void;
    }
}
declare module "src/core/server/systems/job/instance" {
    import * as alt from 'alt-server';
    import { Job } from "src/core/server/systems/job/system";
    export function get(player: number | alt.Player): Job | undefined;
    export function set(player: alt.Player, newJob: Job): any;
    export function clear(player: number | alt.Player): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'set', callback: typeof set): any;
    export function override(functionName: 'clear', callback: typeof clear): any;
}
declare module "src/core/server/systems/job/objective" {
    import { Objective, ObjectiveType } from "src/core/shared/interfaces/job";
    import { Job } from "src/core/server/systems/job/system";
    export interface DefaultCriteriaOptions {
        NO_VEHICLE?: boolean;
        NO_WEAPON?: boolean;
        NO_DYING?: boolean;
        IN_VEHICLE?: boolean;
        IN_JOB_VEHICLE?: boolean;
        FAIL_ON_JOB_VEHICLE_DESTROY?: boolean;
        JOB_VEHICLE_NEARBY?: boolean;
        VEHICLE_ENGINE_OFF?: boolean;
    }
    export function createAndAdd(job: Job, objective: Objective): Objective;
    export function buildCriteria(criteria: DefaultCriteriaOptions): number;
    export function getType(type: keyof typeof ObjectiveType): number;
    export function override(functionName: 'createAndAdd', callback: typeof createAndAdd): any;
    export function override(functionName: 'buildCriteria', callback: typeof buildCriteria): any;
    export function override(functionName: 'getType', callback: typeof getType): any;
}
declare module "src/core/server/systems/job/triggers" {
    import * as alt from 'alt-server';
    import { Objective } from "src/core/shared/interfaces/job";
    export function tryEventCall(player: alt.Player, objective: Objective): any;
    export function tryAnimation(player: alt.Player, objective: Objective): any;
    export function tryAttach(player: alt.Player, objective: Objective): any;
    export function override(functionName: 'tryEventCall', callback: typeof tryEventCall): any;
    export function override(functionName: 'tryAnimation', callback: typeof tryAnimation): any;
    export function override(functionName: 'tryAttach', callback: typeof tryAttach): any;
}
declare module "src/core/server/systems/job/verify" {
    import * as alt from 'alt-server';
    import { Objective } from "src/core/shared/interfaces/job";
    import { Job } from "src/core/server/systems/job/system";
    export function objective(job: Job): Promise<boolean>;
    export function criteria(player: alt.Player, objective: Objective): boolean;
    export function type(player: alt.Player, objective: Objective): boolean;
    export function addCustomCheck(type: 'type' | 'criteria', callback: (player: alt.Player, objective: Objective) => boolean): any;
    export function override(functionName: 'addCustomCheck', callback: typeof addCustomCheck): any;
    export function override(functionName: 'type', callback: typeof type): any;
    export function override(functionName: 'criteria', callback: typeof criteria): any;
    export function override(functionName: 'objective', callback: typeof objective): any;
}
declare module "src/core/server/systems/job/utility" {
    import { Objective } from "src/core/shared/interfaces/job";
    export function cloneObjective(objectiveData: Objective): Objective;
    export function override(functionName: 'cloneObjective', callback: typeof cloneObjective): any;
}
declare module "src/core/server/systems/job/index" {
    export * as event from "src/core/server/systems/job/events";
    export * as instance from "src/core/server/systems/job/instance";
    export * as objective from "src/core/server/systems/job/objective";
    export * as triggers from "src/core/server/systems/job/triggers";
    export * as verify from "src/core/server/systems/job/verify";
    export * as utility from "src/core/server/systems/job/utility";
    export { Job as builder } from "src/core/server/systems/job/system";
}
declare module "src/core/server/systems/jobTrigger" {
    import * as alt from 'alt-server';
    import { JobTrigger } from "src/core/shared/interfaces/jobTrigger";
    export function create(player: alt.Player, data: JobTrigger): any;
    export function override(functionName: 'create', callback: typeof create): any;
}
declare module "src/core/server/systems/jwt" {
    import * as alt from 'alt-server';
    import { Account } from "src/core/server/interface/iAccount";
    export function create(account: Account): Promise<undefined | string>;
    export function verify(data: string): Promise<string | undefined>;
    export function fetch(player: alt.Player): Promise<string | null>;
    export function override(functionName: 'create', callback: typeof create): any;
    export function override(functionName: 'verify', callback: typeof verify): any;
    export function override(functionName: 'fetch', callback: typeof fetch): any;
}
declare module "src/core/server/systems/loginFlow" {
    import * as alt from 'alt-server';
    export interface FlowInfo {
        name: string;
        weight: number;
        callback: (player: alt.Player) => void;
    }
    export function add(name: string, weight: number, callback: (player: alt.Player) => void): boolean;
    export function remove(name: string): boolean;
    export function getWeightedFlow(): Array<FlowInfo>;
    export function getFlow(player: alt.Player): {
        index: number;
        flow: Array<FlowInfo>;
    };
    export function register(player: alt.Player): any;
    export function unregister(player: alt.Player): any;
    export function next(player: alt.Player): any;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'getWeightedFlow', callback: typeof getWeightedFlow): any;
    export function override(functionName: 'getFlow', callback: typeof getFlow): any;
    export function override(functionName: 'register', callback: typeof register): any;
    export function override(functionName: 'unregister', callback: typeof unregister): any;
    export function override(functionName: 'next', callback: typeof next): any;
}
declare module "src/core/shared/utility/getParamNames" {
    export function getParamNames(func: Function): Array<string>;
}
declare module "src/core/server/systems/messenger/commands" {
    import * as alt from 'alt-server';
    import { CommandCallback, DetailedCommand } from "src/core/shared/interfaces/messageCommand";
    export function execute(player: alt.Player, commandName: string, args: Array<any>): any;
    export function get(commandName: string): any;
    export function register(name: string, desc: string, perms: Array<string>, callback: CommandCallback<alt.Player>, isCharacterPermission?: boolean): any;
    export function populateCommands(player: alt.Player): any;
    export function getCommands(player: alt.Player): Array<DetailedCommand>;
    const _default_19: {
        execute: typeof execute;
        get: typeof get;
        getCommands: typeof getCommands;
        populateCommands: typeof populateCommands;
        register: typeof register;
    };
    export default _default_19;
    export function override(functionName: 'execute', callback: typeof execute): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'getCommands', callback: typeof getCommands): any;
    export function override(functionName: 'populateCommands', callback: typeof populateCommands): any;
    export function override(functionName: 'register', callback: typeof register): any;
}
declare module "src/core/server/systems/messenger/messaging" {
    import * as alt from 'alt-server';
    export type MessageCallback = (player: alt.Player, msg: string) => void;
    function cleanMessage(msg: string): string;
    export function send(player: alt.Player, msg: string): any;
    export function sendToPlayers(players: Array<alt.Player>, msg: string): any;
    export function addCallback(callback: MessageCallback): any;
    export function emit(player: alt.Player, msg: string): any;
    const _default_20: {
        addCallback: typeof addCallback;
        cleanMessage: typeof cleanMessage;
        emit: typeof emit;
        send: typeof send;
        sendToPlayers: typeof sendToPlayers;
    };
    export default _default_20;
    export function override(functionName: 'addCallback', callback: typeof addCallback): any;
    export function override(functionName: 'cleanMessage', callback: typeof cleanMessage): any;
    export function override(functionName: 'emit', callback: typeof emit): any;
    export function override(functionName: 'send', callback: typeof send): any;
    export function override(functionName: 'sendToPlayers', callback: typeof sendToPlayers): any;
}
declare module "src/core/server/systems/messenger/index" {
    export * as commands from "src/core/server/systems/messenger/commands";
    export * as messaging from "src/core/server/systems/messenger/messaging";
}
declare module "src/core/server/systems/notification/index" {
    import * as alt from 'alt-server';
    export function toAll(message: string, ...args: any[]): void;
    export function toPlayer(player: alt.Player, message: string, ...args: any[]): void;
}
declare module "src/core/server/systems/permission" {
    import * as alt from 'alt-server';
    import { Account } from "src/core/server/interface/iAccount";
    import { Character } from "src/core/shared/interfaces/character";
    export type DefaultPerms = 'admin' | 'moderator';
    export type SupportedDocuments = 'account' | 'character';
    export function add<CustomPerms = ''>(type: 'character' | 'account', player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean>;
    export function remove<CustomPerms = ''>(type: 'character' | 'account', player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean>;
    export function clear(type: 'character' | 'account', player: alt.Player): Promise<void>;
    export function has<CustomPerms = ''>(type: 'character' | 'account', player: alt.Player, perm: DefaultPerms | CustomPerms): boolean;
    export function hasOne<CustomPerms = ''>(type: 'character' | 'account', player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean;
    export function hasAll<CustomPerms = ''>(type: 'character' | 'account', player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean;
    export function getAll<CustomPerms = ''>(type: 'character' | 'account', perm: DefaultPerms | CustomPerms): Promise<Array<Account> | Array<Character>>;
    export function removeAll<CustomPerms = ''>(type: 'character' | 'account', perm: DefaultPerms | CustomPerms, ids: Array<string>): Promise<void>;
    export function getPermissions(entity: alt.Player, type: 'character' | 'account'): any;
    export function getPermissions(entity: alt.Vehicle, type: 'vehicle'): any;
    const _default_21: {
        add: typeof add;
        remove: typeof remove;
        clear: typeof clear;
        has: typeof has;
        hasOne: typeof hasOne;
        hasAll: typeof hasAll;
        getAll: typeof getAll;
        removeAll: typeof removeAll;
    };
    export default _default_21;
}
declare module "src/core/server/systems/plugins" {
    export function init(): void;
    export function registerPlugin(name: string, callback: Function): void;
    export function getPlugins(): Array<string>;
    export function addCallback(callback: Function): void;
}
declare module "src/core/server/systems/sound" {
    import * as alt from 'alt-server';
    export interface CustomSoundInfo {
        audioName: string;
        pos?: alt.IVector3;
        volume?: number;
        target?: alt.Entity;
    }
    export function playSound(player: alt.Player, soundInfo: CustomSoundInfo): any;
    export function playSoundInDimension(dimension: number, soundInfo: Omit<CustomSoundInfo, 'pos'>): any;
    export function playSoundInArea(soundInfo: Required<Omit<CustomSoundInfo, 'target' | 'volume'>>): any;
    export function override(functionName: 'playSound', callback: typeof playSound): any;
    export function override(functionName: 'playSoundInDimension', callback: typeof playSoundInDimension): any;
    export function override(functionName: 'playSoundInArea', callback: typeof playSoundInArea): any;
}
declare module "src/core/server/systems/storage" {
    import * as alt from 'alt-server';
    import { StoredItem } from "src/core/shared/interfaces/item";
    export interface StorageInstance<CustomData = {}> {
        _id?: unknown;
        lastUsed: number;
        items: Array<StoredItem<CustomData>>;
    }
    export function create(items: Array<StoredItem>): Promise<string>;
    export function set(id: string, items: Array<StoredItem>): Promise<boolean>;
    export function get<CustomData = {}>(id: string): Promise<Array<StoredItem<CustomData>>>;
    export function setAsOpen(id: string): boolean;
    export function isOpen(id: string): boolean;
    export function removeAsOpen(id: string): boolean;
    export function closeOnDisconnect(player: alt.Player, id: string): boolean;
}
declare module "src/core/server/systems/tick" {
    import * as alt from 'alt-server';
    export function onTick(player: alt.Player): Promise<void>;
    function handlePing(player: alt.Player): void;
    export function override(functionName: 'onTick', callback: typeof onTick): any;
    export function override(functionName: 'handlePing', callback: typeof handlePing): any;
}
declare module "src/core/server/systems/index" {
    export * as account from "src/core/server/systems/account";
    export * as adminControl from "src/core/server/systems/adminControl";
    export * as character from "src/core/server/systems/character";
    export * as defaults from "src/core/server/systems/defaults/index";
    export * as global from "src/core/server/systems/global";
    export * as identifier from "src/core/server/systems/identifier";
    export * as inventory from "src/core/server/systems/inventory/index";
    export * as job from "src/core/server/systems/job/index";
    export * as jobTrigger from "src/core/server/systems/jobTrigger";
    export * as jwt from "src/core/server/systems/jwt";
    export * as loginFlow from "src/core/server/systems/loginFlow";
    export * as messenger from "src/core/server/systems/messenger/index";
    export * as notification from "src/core/server/systems/notification/index";
    export * as permission from "src/core/server/systems/permission";
    export * as permissionGroup from "src/core/server/systems/permissionGroup";
    export * as plugins from "src/core/server/systems/plugins";
    export * as sound from "src/core/server/systems/sound";
    export * as storage from "src/core/server/systems/storage";
    export * as streamer from "src/core/server/systems/streamer";
    export * as tick from "src/core/server/systems/tick";
}
declare module "src/core/server/utility/closest" {
    import * as alt from 'alt-server';
    export function getClosestVehicle(pos: alt.IVector3): alt.Vehicle | undefined;
    export function getClosestPlayer(pos: alt.IVector3, ignoredIds?: Array<number>): alt.Player | undefined;
    const _default_22: {
        getClosestPlayer: typeof getClosestPlayer;
        getClosestVehicle: typeof getClosestVehicle;
    };
    export default _default_22;
}
declare module "src/core/server/utility/config" {
    import { IConfig } from "src/core/server/interface/iConfig";
    export function get(): Promise<IConfig | undefined>;
    export function isDevMode(): boolean;
    export function getViteServer(): string;
    export function getVueDebugMode(): boolean;
    export function getAthenaVersion(): string;
    const _default_23: {
        get: typeof get;
        isDevMode: typeof isDevMode;
        getViteServer: typeof getViteServer;
        getVueDebugMode: typeof getVueDebugMode;
        getAthenaVersion: typeof getAthenaVersion;
    };
    export default _default_23;
}
declare module "src/core/server/utility/math" {
    export function getMissingNumber(arr: Array<number>, startIndex?: number): number;
    const _default_24: {
        getMissingNumber: typeof getMissingNumber;
    };
    export default _default_24;
}
declare module "src/core/server/utility/restrict" {
    import * as alt from 'alt-server';
    export interface Restrictions {
        permissions: {
            account: Array<string>;
            character: Array<string>;
        };
        strategy: 'hasOne' | 'hasAll';
        notify?: string;
        kickOnBadPermission?: {
            kickMessage: string;
            consoleMessage: string;
        };
    }
    export function create<T = (player: alt.Player, ...args: any[]) => void>(handler: T, restrictions: Restrictions): T;
    export function override(functionName: 'create', callback: typeof create): any;
}
declare module "src/core/shared/utility/uid" {
    export const UID: {
        generate(): string;
    };
}
declare module "src/core/server/utility/index" {
    export { default as closest } from "src/core/server/utility/closest";
    export { default as config } from "src/core/server/utility/config";
    export { default as hash } from "src/core/server/utility/hash";
    export { default as math } from "src/core/server/utility/math";
    export * as random from "src/core/shared/utility/random";
    export * as restrict from "src/core/server/utility/restrict";
    export { default as vector } from "src/core/shared/utility/vector";
    export { UID as uid } from "src/core/shared/utility/uid";
    export * as hashLookup from "src/core/shared/utility/hashLookup/index";
}
declare module "src/core/server/vehicle/add" {
    import * as alt from 'alt-server';
    import { VehicleState } from "src/core/shared/interfaces/vehicleState";
    import IVehicleTuning from "src/core/shared/interfaces/vehicleTuning";
    export interface AddOptions {
        tuning?: Partial<IVehicleTuning> | IVehicleTuning | undefined;
        state?: Partial<VehicleState> | VehicleState;
        keys?: Array<string>;
        permissions?: Array<string>;
        doNotDespawn?: boolean;
    }
    export function toPlayer(player: alt.Player, model: string, pos: alt.IVector3, options?: Omit<AddOptions, 'doNotDespawn'>): Promise<boolean>;
    export function toDatabase(owner: string, model: string, pos: alt.IVector3, options?: AddOptions): Promise<boolean>;
    export function override(functionName: 'toDatabase', callback: typeof toDatabase): any;
    export function override(functionName: 'toPlayer', callback: typeof toPlayer): any;
}
declare module "src/core/server/vehicle/asPlayer" {
    import * as alt from 'alt-server';
    export function toggleLock(player: alt.Player, vehicle: alt.Vehicle): any;
    export function toggleEngine(player: alt.Player, vehicle: alt.Vehicle): any;
    export function toggleDoor(player: alt.Player, vehicle: alt.Vehicle, door: 0 | 1 | 2 | 3 | 4 | 5): any;
    export function override(functionName: 'toggleLock', callback: typeof toggleLock): any;
    export function override(functionName: 'toggleDoor', callback: typeof toggleDoor): any;
    export function override(functionName: 'toggleEngine', callback: typeof toggleEngine): any;
}
declare module "src/core/server/vehicle/controls" {
    import * as alt from 'alt-server';
    export function toggleLock(vehicle: alt.Vehicle): Promise<boolean>;
    export function toggleEngine(vehicle: alt.Vehicle): Promise<boolean>;
    export function toggleDoor(vehicle: alt.Vehicle, door: 0 | 1 | 2 | 3 | 4 | 5): Promise<boolean>;
    export function isLocked(vehicle: alt.Vehicle): boolean;
    export function update(vehicle: alt.Vehicle): any;
    export function updateLastUsed(vehicle: alt.Vehicle): Promise<void>;
    export function override(functionName: 'toggleLock', callback: typeof toggleLock): any;
    export function override(functionName: 'toggleDoor', callback: typeof toggleDoor): any;
    export function override(functionName: 'toggleEngine', callback: typeof toggleEngine): any;
    export function override(functionName: 'update', callback: typeof update): any;
    export function override(functionName: 'isLocked', callback: typeof isLocked): any;
}
declare module "src/core/server/vehicle/damage" {
    import * as alt from 'alt-server';
    import { VehicleDamage } from "src/core/shared/interfaces/vehicleOwned";
    export function get(vehicle: alt.Vehicle): VehicleDamage | undefined;
    export function apply(vehicle: alt.Vehicle, damage: VehicleDamage): void;
    export function repair(vehicle: alt.Vehicle): Promise<void>;
}
declare module "src/core/server/vehicle/despawn" {
    export function all(): Promise<void>;
    export function one(id: number): Promise<boolean>;
    export function list(ids: Array<number>): Promise<void>;
    export function override(functionName: 'all', callback: typeof all): any;
    export function override(functionName: 'one', callback: typeof one): any;
    export function override(functionName: 'list', callback: typeof list): any;
}
declare module "src/core/server/vehicle/get" {
    import * as alt from 'alt-server';
    export function temporaryVehicles(): Array<alt.Vehicle>;
    export function ownedVehicles(): Array<alt.Vehicle>;
    export function playerOwnedVehicles(player: alt.Player | string): alt.Vehicle[];
}
declare module "src/core/server/vehicle/ownership" {
    import * as alt from 'alt-server';
    export function isOwner(player: alt.Player, vehicle: alt.Vehicle, options?: {
        includePermissions?: boolean;
        includeKeys?: boolean;
        includeAdminOverride?: boolean;
        includeGroupPermissions?: boolean;
        preventWhileAttached?: boolean;
    }): boolean;
    export function hasPermission(player: alt.Player, vehicle: alt.Vehicle): boolean;
    export function hasGroupPermission(player: alt.Player, vehicle: alt.Vehicle): boolean;
    export function hasKeys(player: alt.Player, vehicle: alt.Vehicle): boolean;
    export function get(vehicle: alt.Vehicle): string | undefined;
    export function getAsPlayer(vehicle: alt.Vehicle): alt.Player | undefined;
    export function addCharacter(vehicle: alt.Vehicle, player: alt.Player): Promise<boolean>;
    export function addCharacter(vehicle: alt.Vehicle, id: string): Promise<boolean>;
    export function removeCharacter(vehicle: alt.Vehicle, _id: string): Promise<boolean>;
    export function transfer(vehicle: alt.Vehicle, _id: string): Promise<boolean>;
    export function override(functionName: 'isOwner', callback: typeof isOwner): any;
    export function override(functionName: 'hasPermission', callback: typeof hasPermission): any;
    export function override(functionName: 'hasKeys', callback: typeof hasKeys): any;
    export function override(functionName: 'get', callback: typeof get): any;
    export function override(functionName: 'getAsPlayer', callback: typeof getAsPlayer): any;
    export function override(functionName: 'addCharacter', callback: typeof addCharacter): any;
    export function override(functionName: 'removeCharacter', callback: typeof removeCharacter): any;
    export function override(functionName: 'transfer', callback: typeof transfer): any;
}
declare module "src/core/server/vehicle/permissions" {
    import * as alt from 'alt-server';
    import { PermissionGroup } from "src/core/server/systems/permissionGroup";
    export function hasGroupPermission(vehicle: alt.Vehicle, groupName: string, permission: string): boolean;
    export function hasCommonGroupPermission(vehicle: alt.Vehicle, document: PermissionGroup, groupName: string, permission: string): boolean;
    export function addGroupPerm(vehicle: alt.Vehicle, groupName: string, permission: string): Promise<boolean>;
}
declare module "src/core/server/vehicle/shared" {
    import { VehicleState } from "src/core/shared/interfaces/vehicleState";
    import * as alt from 'alt-shared';
    export const SEAT: {
        DRIVER: number;
        PASSENGER: number;
        BACK_LEFT: number;
        BACK_RIGHT: number;
    };
    export interface VehicleSpawnInfo {
        model: string | number;
        pos: alt.IVector3;
        rot: alt.IVector3;
        data?: Partial<VehicleState>;
    }
}
declare module "src/core/server/vehicle/spawn" {
    import * as alt from 'alt-server';
    import { OwnedVehicle } from "src/core/shared/interfaces/vehicleOwned";
    import { VehicleSpawnInfo } from "src/core/server/vehicle/shared";
    export function temporary(vehicleInfo: VehicleSpawnInfo, deleteOnLeave?: boolean): alt.Vehicle;
    export function temporaryOwned(player: alt.Player, vehicleInfo: VehicleSpawnInfo, deleteOnLeave?: boolean): alt.Vehicle;
    export function persistent(document: OwnedVehicle): alt.Vehicle | undefined;
    export function all(): any;
    export function override(functionName: 'all', callback: typeof all): any;
    export function override(functionName: 'temporary', callback: typeof temporary): any;
    export function override(functionName: 'temporaryOwned', callback: typeof temporaryOwned): any;
    export function override(functionName: 'persistent', callback: typeof persistent): any;
}
declare module "src/core/server/vehicle/tempVehicles" {
    import * as alt from 'alt-server';
    export function add(vehicle: alt.Vehicle, options: {
        owner?: number;
        deleteOnLeave?: boolean;
    }): any;
    export function remove(id: number): void;
    export function has(vehicle: alt.Vehicle | number): boolean;
    export function isOwner(player: alt.Player, vehicle: alt.Vehicle): boolean;
    export function shouldBeDestroyed(vehicle: alt.Vehicle): boolean;
    export function override(functionName: 'add', callback: typeof add): any;
    export function override(functionName: 'remove', callback: typeof remove): any;
    export function override(functionName: 'has', callback: typeof has): any;
    export function override(functionName: 'isOwner', callback: typeof isOwner): any;
    export function override(functionName: 'shouldBeDestroyed', callback: typeof shouldBeDestroyed): any;
}
declare module "src/core/server/vehicle/tuning" {
    import * as alt from 'alt-server';
    import VehicleTuning from "src/core/shared/interfaces/vehicleTuning";
    import { VehicleState } from "src/core/shared/interfaces/vehicleState";
    export function applyState(vehicle: alt.Vehicle, state: Partial<VehicleState> | VehicleState): any;
    export function applyTuning(vehicle: alt.Vehicle, tuning: VehicleTuning | Partial<VehicleTuning>): any;
    export function override(functionName: 'applyState', callback: typeof applyState): any;
    export function override(functionName: 'applyTuning', callback: typeof applyTuning): any;
}
declare module "src/core/server/vehicle/index" {
    export * as add from "src/core/server/vehicle/add";
    export * as asPlayer from "src/core/server/vehicle/asPlayer";
    export * as controls from "src/core/server/vehicle/controls";
    export * as damage from "src/core/server/vehicle/damage";
    export * as despawn from "src/core/server/vehicle/despawn";
    export * as events from "src/core/server/vehicle/events";
    export * as get from "src/core/server/vehicle/get";
    export * as ownership from "src/core/server/vehicle/ownership";
    export * as permissions from "src/core/server/vehicle/permissions";
    export * as shared from "src/core/server/vehicle/shared";
    export * as spawn from "src/core/server/vehicle/spawn";
    export * as tempVehicles from "src/core/server/vehicle/tempVehicles";
    export * as tuning from "src/core/server/vehicle/tuning";
}
declare module "src/core/server/webview/index" {
    import * as alt from 'alt-server';
    export function emit(player: alt.Player, eventName: string, ...args: any[]): void;
    export function closePages(player: alt.Player, pages?: Array<string>): void;
}
declare module "src/core/server/api/index" {
    export * as config from "src/core/server/config/index";
    export * as controllers from "src/core/server/controllers/index";
    export * as data from "src/core/server/api/consts/constData";
    export * as database from "src/core/server/database/index";
    export * as document from "src/core/server/document/index";
    export * as events from "src/core/server/events/index";
    export * as extensions from "src/core/server/api/consts/constExtensions";
    export * as getters from "src/core/server/getters/index";
    export * as player from "src/core/server/player/index";
    export * as systems from "src/core/server/systems/index";
    export * as utility from "src/core/server/utility/index";
    export * as vehicle from "src/core/server/vehicle/index";
    export * as webview from "src/core/server/webview/index";
    import * as config from "src/core/server/config/index";
    import * as controllers from "src/core/server/controllers/index";
    import * as data from "src/core/server/api/consts/constData";
    import * as database from "src/core/server/database/index";
    import * as document from "src/core/server/document/index";
    import * as events from "src/core/server/events/index";
    import * as extensions from "src/core/server/api/consts/constExtensions";
    import * as getters from "src/core/server/getters/index";
    import * as player from "src/core/server/player/index";
    import * as systems from "src/core/server/systems/index";
    import * as utility from "src/core/server/utility/index";
    import * as vehicle from "src/core/server/vehicle/index";
    import * as webview from "src/core/server/webview/index";
    const _default_25: {
        config: typeof config;
        controllers: typeof controllers;
        data: typeof data;
        database: typeof database;
        document: typeof document;
        events: typeof events;
        extensions: typeof extensions;
        getters: typeof getters;
        player: typeof player;
        systems: typeof systems;
        utility: typeof utility;
        vehicle: typeof vehicle;
        webview: typeof webview;
    };
    export default _default_25;
}
declare module "src/core/plugins/athena-debug/server/system/keys" {
    import * as alt from 'alt-server';
    interface LastStoredData {
        pos: alt.IVector3;
        rot: alt.IVector3;
    }
    export const DebugKeys: {
        init(): void;
        flagPosition(player: alt.Player): void;
        getLastPosition(): LastStoredData;
    };
}
declare module "src/core/plugins/athena-debug/server/system/rest" {
    export const RestService: {
        init(): void;
    };
}
declare module "src/core/plugins/athena-debug/server/index" { }
declare module "src/core/plugins/character-select/client/page" {
    import { Page } from "src/core/client/webview/page";
    export function open(onReady: Function, onClose: Function): void;
    export function close(): void;
    export function getPage(): Page;
}
declare module "src/core/plugins/character-select/shared/events" {
    export const CharSelectEvents: {
        toServer: {
            select: string;
            delete: string;
            prev: string;
            next: string;
            new: string;
        };
        toClient: {
            update: string;
            done: string;
        };
        toWebview: {
            updateName: string;
        };
    };
}
declare module "src/core/plugins/character-select/client/index" { }
declare module "src/core/plugins/character-select/server/index" { }
declare module "src/core/plugins/core-character-creator/shared/events" {
    export const CHARACTER_CREATOR_EVENTS: {
        SHOW: string;
        DONE: string;
        EXIT: string;
        VERIFY_NAME: string;
    };
    export const CHARACTER_CREATOR_WEBVIEW_EVENTS: {
        PAGE_NAME: string;
        READY: string;
        SET_DATA: string;
        EXIT: string;
        VERIFY_NAME: string;
        SYNC: string;
        READY_SETUP_COMPLETE: string;
        DONE: string;
        DISABLE_CONTROLS: string;
    };
}
declare module "src/core/plugins/core-character-creator/client/src/view" { }
declare module "src/core/plugins/core-character-creator/client/index" {
    import "src/core/plugins/core-character-creator/client/src/view";
}
declare module "src/core/plugins/core-character-creator/shared/config" {
    export const CHARACTER_CREATOR_CONFIG: {
        CHARACTER_CREATOR_POS: {
            x: number;
            y: number;
            z: number;
        };
        CHARACTER_CREATOR_ROT: number;
    };
}
declare module "src/core/plugins/core-character-creator/server/src/view" {
    export class CharacterCreatorView {
        static init(): void;
    }
}
declare module "src/core/plugins/core-character-creator/server/index" { }
declare module "src/core/plugins/core-character-creator/shared/locale" {
    export const CHARACTER_CREATOR_LOCALE: {
        titles: string[];
        LABEL_FIRST_NAME: string;
        LABEL_LAST_NAME: string;
        LABEL_BIRTHDAY: string;
        LABEL_GENDER: string;
        LABEL_DAY: string;
        LABEL_MONTH: string;
        LABEL_YEAR: string;
        LABEL_PREV: string;
        LABEL_NEXT: string;
        LABEL_SAVE: string;
        LABEL_FIELD_REQUIRED: string;
        LABEL_CANNOT_EXCEED: string;
        LABEL_CANNOT_BE_LESS: string;
        LABEL_CHARACTER: string;
        LABEL_NO_SPECIAL: string;
        LABEL_NAME_NOT_AVAILABLE: string;
        LABEL_CHARACTER_GENDER: string;
        LABEL_VERIFIED: string;
        characterName: string;
        characterBirth: string;
        characterGender: string;
        appearanceComponent: {
            LABEL_FRAME: string;
            DESC_FRAME: string;
            LABEL_MASCULINE: string;
            LABEL_FEMININE: string;
            LABEL_PRESETS: string;
            DESC_PRESETS: string;
            LABEL_FATHER: string;
            DESC_FATHER: string;
            LABEL_MOTHER: string;
            DESC_MOTHER: string;
            LABEL_FACEBLEND: string;
            DESC_FACEBLEND: string;
            LABEL_SKINBLEND: string;
            DESC_SKINBLEND: string;
            LABEL_EYECOLOUR: string;
            DESC_EYECOLOUR: string;
            LABEL_FACE: string;
            LABEL_SKIN: string;
        };
        hairComponent: {
            LABEL_HAIRSTYLE: string;
            DESC_HAIRSTYLE: string;
            LABEL_HAIRSTYLE_COLOUR: string;
            LABEL_HAIRSTYLE_HIGHLIGHTS: string;
            LABEL_EYEBROWS: string;
            DESC_EYEBROWS: string;
            LABEL_EYEBROWS_COLOUR: string;
            LABEL_FACIAL_HAIR: string;
            DESC_FACIAL_HAIR: string;
            LABEL_CHEST_HAIR: string;
            DESC_CHEST_HAIR: string;
            LABEL_OPACITY: string;
            LABEL_FACIAL_HAIR_COLOUR: string;
            LABEL_CHEST_HAIR_COLOUR: string;
            masculine: string[];
            feminine: string[];
            facial: string[];
            eyebrows: string[];
            chest: string[];
        };
        structureComponent: string[];
        makeupComponent: {
            LABEL_STYLE: string;
            LABEL_OPACITY: string;
            LABEL_COLOUR1: string;
            LABEL_COLOUR2: string;
            ids: {
                4: {
                    name: string;
                    description: string;
                    labels: string[];
                };
                5: {
                    name: string;
                    description: string;
                    labels: string[];
                };
                8: {
                    name: string;
                    description: string;
                    labels: string[];
                };
            };
        };
        overlaysComponent: {
            LABEL_STYLE: string;
            LABEL_OPACITY: string;
            ids: {
                0: {
                    name: string;
                    description: string;
                    labels: string[];
                };
                3: {
                    name: string;
                    description: string;
                    labels: string[];
                };
                6: {
                    name: string;
                    description: string;
                    labels: string[];
                };
                7: {
                    name: string;
                    description: string;
                    labels: string[];
                };
                9: {
                    name: string;
                    description: string;
                    labels: string[];
                };
                11: {
                    name: string;
                    description: string;
                    labels: string[];
                };
            };
        };
        faces: string[];
        color: {
            hair: string[];
            overlays: string[];
            eyes: string[];
        };
    };
}
declare module "src/core/plugins/core-character-creator/webview/utility/hairOverlays" {
    export const MaleHairOverlays: {
        0: {
            collection: string;
            overlay: string;
        };
        1: {
            collection: string;
            overlay: string;
        };
        2: {
            collection: string;
            overlay: string;
        };
        3: {
            collection: string;
            overlay: string;
        };
        4: {
            collection: string;
            overlay: string;
        };
        5: {
            collection: string;
            overlay: string;
        };
        6: {
            collection: string;
            overlay: string;
        };
        7: {
            collection: string;
            overlay: string;
        };
        8: {
            collection: string;
            overlay: string;
        };
        9: {
            collection: string;
            overlay: string;
        };
        10: {
            collection: string;
            overlay: string;
        };
        11: {
            collection: string;
            overlay: string;
        };
        12: {
            collection: string;
            overlay: string;
        };
        13: {
            collection: string;
            overlay: string;
        };
        14: {
            collection: string;
            overlay: string;
        };
        15: {
            collection: string;
            overlay: string;
        };
        16: {
            collection: string;
            overlay: string;
        };
        17: {
            collection: string;
            overlay: string;
        };
        18: {
            collection: string;
            overlay: string;
        };
        19: {
            collection: string;
            overlay: string;
        };
        20: {
            collection: string;
            overlay: string;
        };
        21: {
            collection: string;
            overlay: string;
        };
        22: {
            collection: string;
            overlay: string;
        };
        23: {
            collection: string;
            overlay: string;
        };
        24: {
            collection: string;
            overlay: string;
        };
        25: {
            collection: string;
            overlay: string;
        };
        26: {
            collection: string;
            overlay: string;
        };
        27: {
            collection: string;
            overlay: string;
        };
        28: {
            collection: string;
            overlay: string;
        };
        29: {
            collection: string;
            overlay: string;
        };
        30: {
            collection: string;
            overlay: string;
        };
        31: {
            collection: string;
            overlay: string;
        };
        32: {
            collection: string;
            overlay: string;
        };
        33: {
            collection: string;
            overlay: string;
        };
        34: {
            collection: string;
            overlay: string;
        };
        35: {
            collection: string;
            overlay: string;
        };
        36: {
            collection: string;
            overlay: string;
        };
        37: {
            collection: string;
            overlay: string;
        };
        38: {
            collection: string;
            overlay: string;
        };
        39: {
            collection: string;
            overlay: string;
        };
        40: {
            collection: string;
            overlay: string;
        };
        41: {
            collection: string;
            overlay: string;
        };
        42: {
            collection: string;
            overlay: string;
        };
        43: {
            collection: string;
            overlay: string;
        };
        44: {
            collection: string;
            overlay: string;
        };
        45: {
            collection: string;
            overlay: string;
        };
        46: {
            collection: string;
            overlay: string;
        };
        47: {
            collection: string;
            overlay: string;
        };
        48: {
            collection: string;
            overlay: string;
        };
        49: {
            collection: string;
            overlay: string;
        };
        50: {
            collection: string;
            overlay: string;
        };
        51: {
            collection: string;
            overlay: string;
        };
        52: {
            collection: string;
            overlay: string;
        };
        53: {
            collection: string;
            overlay: string;
        };
        54: {
            collection: string;
            overlay: string;
        };
        55: {
            collection: string;
            overlay: string;
        };
        56: {
            collection: string;
            overlay: string;
        };
        57: {
            collection: string;
            overlay: string;
        };
        58: {
            collection: string;
            overlay: string;
        };
        59: {
            collection: string;
            overlay: string;
        };
        60: {
            collection: string;
            overlay: string;
        };
        61: {
            collection: string;
            overlay: string;
        };
        62: {
            collection: string;
            overlay: string;
        };
        63: {
            collection: string;
            overlay: string;
        };
        64: {
            collection: string;
            overlay: string;
        };
        65: {
            collection: string;
            overlay: string;
        };
        66: {
            collection: string;
            overlay: string;
        };
        67: {
            collection: string;
            overlay: string;
        };
        68: {
            collection: string;
            overlay: string;
        };
        69: {
            collection: string;
            overlay: string;
        };
        70: {
            collection: string;
            overlay: string;
        };
        71: {
            collection: string;
            overlay: string;
        };
        72: {
            collection: string;
            overlay: string;
        };
        73: {
            collection: string;
            overlay: string;
        };
    };
    export const FemaleHairOverlays: {
        0: {
            collection: string;
            overlay: string;
        };
        1: {
            collection: string;
            overlay: string;
        };
        2: {
            collection: string;
            overlay: string;
        };
        3: {
            collection: string;
            overlay: string;
        };
        4: {
            collection: string;
            overlay: string;
        };
        5: {
            collection: string;
            overlay: string;
        };
        6: {
            collection: string;
            overlay: string;
        };
        7: {
            collection: string;
            overlay: string;
        };
        8: {
            collection: string;
            overlay: string;
        };
        9: {
            collection: string;
            overlay: string;
        };
        10: {
            collection: string;
            overlay: string;
        };
        11: {
            collection: string;
            overlay: string;
        };
        12: {
            collection: string;
            overlay: string;
        };
        13: {
            collection: string;
            overlay: string;
        };
        14: {
            collection: string;
            overlay: string;
        };
        15: {
            collection: string;
            overlay: string;
        };
        16: {
            collection: string;
            overlay: string;
        };
        17: {
            collection: string;
            overlay: string;
        };
        18: {
            collection: string;
            overlay: string;
        };
        19: {
            collection: string;
            overlay: string;
        };
        20: {
            collection: string;
            overlay: string;
        };
        21: {
            collection: string;
            overlay: string;
        };
        22: {
            collection: string;
            overlay: string;
        };
        23: {
            collection: string;
            overlay: string;
        };
        24: {
            collection: string;
            overlay: string;
        };
        25: {
            collection: string;
            overlay: string;
        };
        26: {
            collection: string;
            overlay: string;
        };
        27: {
            collection: string;
            overlay: string;
        };
        28: {
            collection: string;
            overlay: string;
        };
        29: {
            collection: string;
            overlay: string;
        };
        30: {
            collection: string;
            overlay: string;
        };
        31: {
            collection: string;
            overlay: string;
        };
        32: {
            collection: string;
            overlay: string;
        };
        33: {
            collection: string;
            overlay: string;
        };
        34: {
            collection: string;
            overlay: string;
        };
        35: {
            collection: string;
            overlay: string;
        };
        36: {
            collection: string;
            overlay: string;
        };
        37: {
            collection: string;
            overlay: string;
        };
        38: {
            collection: string;
            overlay: string;
        };
        39: {
            collection: string;
            overlay: string;
        };
        40: {
            collection: string;
            overlay: string;
        };
        41: {
            collection: string;
            overlay: string;
        };
        42: {
            collection: string;
            overlay: string;
        };
        43: {
            collection: string;
            overlay: string;
        };
        44: {
            collection: string;
            overlay: string;
        };
        45: {
            collection: string;
            overlay: string;
        };
        46: {
            collection: string;
            overlay: string;
        };
        47: {
            collection: string;
            overlay: string;
        };
        48: {
            collection: string;
            overlay: string;
        };
        49: {
            collection: string;
            overlay: string;
        };
        50: {
            collection: string;
            overlay: string;
        };
        51: {
            collection: string;
            overlay: string;
        };
        52: {
            collection: string;
            overlay: string;
        };
        53: {
            collection: string;
            overlay: string;
        };
        54: {
            collection: string;
            overlay: string;
        };
        55: {
            collection: string;
            overlay: string;
        };
        56: {
            collection: string;
            overlay: string;
        };
        57: {
            collection: string;
            overlay: string;
        };
        58: {
            collection: string;
            overlay: string;
        };
        59: {
            collection: string;
            overlay: string;
        };
        60: {
            collection: string;
            overlay: string;
        };
        61: {
            collection: string;
            overlay: string;
        };
        62: {
            collection: string;
            overlay: string;
        };
        63: {
            collection: string;
            overlay: string;
        };
        64: {
            collection: string;
            overlay: string;
        };
        65: {
            collection: string;
            overlay: string;
        };
        66: {
            collection: string;
            overlay: string;
        };
        67: {
            collection: string;
            overlay: string;
        };
        68: {
            collection: string;
            overlay: string;
        };
        69: {
            collection: string;
            overlay: string;
        };
        70: {
            collection: string;
            overlay: string;
        };
        71: {
            collection: string;
            overlay: string;
        };
        72: {
            collection: string;
            overlay: string;
        };
        73: {
            collection: string;
            overlay: string;
        };
        74: {
            collection: string;
            overlay: string;
        };
        75: {
            collection: string;
            overlay: string;
        };
        76: {
            collection: string;
            overlay: string;
        };
        77: {
            collection: string;
            overlay: string;
        };
    };
}
declare module "src/core/plugins/core-character-creator/webview/utility/makeupList" {
    const _default_26: ({
        min: number;
        max: number;
        increment: number;
        id: number;
        opacity: number;
        color1: number;
        color2: number;
        value: number;
    } | {
        min: number;
        max: number;
        increment: number;
        id: number;
        opacity: number;
        color1: number;
        value: number;
        color2?: undefined;
    })[];
    export default _default_26;
}
declare module "src/core/plugins/core-character-creator/webview/utility/overlaysList" {
    const _default_27: {
        min: number;
        max: number;
        increment: number;
        id: number;
        opacity: number;
        value: number;
    }[];
    export default _default_27;
}
declare module "src/core/plugins/core-character-creator/webview/utility/presets" {
    export const MalePresets: ({
        faceMother: number;
        faceFather: number;
        skinMother: number;
        skinFather: number;
        skinMix: number;
        faceMix: number;
        hair: number;
        hairColor1: number;
        hairColor2: number;
        sex?: undefined;
        facialHair?: undefined;
        facialHairColor1?: undefined;
        facialHairOpacity?: undefined;
        eyes?: undefined;
        eyebrows?: undefined;
        eyebrowsOpacity?: undefined;
        eyebrowsColor1?: undefined;
    } | {
        sex: number;
        faceFather: number;
        faceMother: number;
        skinFather: number;
        skinMother: number;
        faceMix: number;
        skinMix: number;
        hair: number;
        hairColor1: number;
        hairColor2: number;
        facialHair: number;
        facialHairColor1: number;
        facialHairOpacity: number;
        eyes: number;
        eyebrows?: undefined;
        eyebrowsOpacity?: undefined;
        eyebrowsColor1?: undefined;
    } | {
        sex: number;
        faceFather: number;
        faceMother: number;
        skinFather: number;
        skinMother: number;
        faceMix: number;
        skinMix: number;
        hair: number;
        hairColor1: number;
        hairColor2: number;
        facialHair: number;
        facialHairColor1: number;
        facialHairOpacity: number;
        eyebrows: number;
        eyebrowsOpacity: number;
        eyebrowsColor1: number;
        eyes: number;
    })[];
    export const FemalePresets: ({
        faceMother: number;
        faceFather: number;
        skinMother: number;
        skinFather: number;
        skinMix: number;
        faceMix: number;
        hair: number;
        hairColor1: number;
        hairColor2: number;
        sex?: undefined;
        eyes?: undefined;
    } | {
        sex: number;
        faceFather: number;
        faceMother: number;
        skinFather: number;
        skinMother: number;
        faceMix: number;
        skinMix: number;
        hair: number;
        hairColor1: number;
        hairColor2: number;
        eyes?: undefined;
    } | {
        sex: number;
        faceFather: number;
        faceMother: number;
        skinFather: number;
        skinMother: number;
        faceMix: number;
        skinMix: number;
        hair: number;
        hairColor1: number;
        hairColor2: number;
        eyes: number;
    })[];
}
declare module "src/core/plugins/core-chat/shared/events" {
    export const CHAT_WEBVIEW_EVENTS: {
        SET_MESSAGES: string;
        PASS_KEY_PRESS: string;
    };
}
declare module "src/core/plugins/core-chat/client/index" { }
declare module "src/core/plugins/core-chat/shared/config" {
    export const CHAT_CONFIG: {
        settings: {
            range: number;
            commands: {
                oocDistance: number;
                meDistance: number;
                doDistance: number;
                lowDistance: number;
                whisperDistance: number;
                oocColour: string;
                roleplayColour: string;
                lowColour: string;
                whisperColour: string;
            };
        };
        behavior: {
            scroll: boolean;
            messageIndexes: boolean;
            timestamps: boolean;
            display: number;
            length: number;
        };
        style: {
            'max-width': string;
            'font-size': string;
            'font-weight': number;
            opacity: number;
        };
    };
}
declare module "src/core/plugins/core-chat/server/src/chat" {
    export function init(): void;
}
declare module "src/core/plugins/core-chat/server/src/commands" { }
declare module "src/core/plugins/core-chat/server/index" {
    import "src/core/plugins/core-chat/server/src/commands";
}
declare module "src/core/plugins/core-chat/webview/utility/generateBytes" {
    export function generateBytes(length: number): string;
}
declare module "src/core/plugins/core-chat/webview/utility/padNumber" {
    export function padNumber(value: number): string;
}
declare module "src/core/shared/utility/consoleCommander" {
    export class ConsoleCommander {
        static init(alt: {
            on: (event: string, handler: Function) => any;
        }): void;
        static invokeCommand(cmdName: string, ...args: string[]): void;
        static registerConsoleCommand(cmdName: string, callback: (...args: string[]) => void): void;
        static getCommands(): string[];
    }
}
declare module "src/core/plugins/core-commands/client/src/consoleCommands" { }
declare module "src/core/plugins/core-commands/client/index" {
    import "src/core/plugins/core-commands/client/src/consoleCommands";
}
declare module "src/core/shared/utility/clothing" {
    import { ClothingComponent, DefaultItemBehavior, Item } from "src/core/shared/interfaces/item";
    export type ClothingInfo = {
        sex: number;
        components: Array<ClothingComponent>;
    };
    export function clothingItemToIconName(item: Item<DefaultItemBehavior, ClothingInfo>): string;
    export function clothingComponentToIconName(sex: number, components: Array<ClothingComponent>): string;
}
declare module "src/core/plugins/core-commands/server/commands/moderator/clothing" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/currency" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/door" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/interior" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/inventory" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/item" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/noclip" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/player" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/skins" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/teleport" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/test" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/vehicle" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/utility" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/weapons" { }
declare module "src/core/plugins/core-commands/server/commands/moderator/index" {
    import "src/core/plugins/core-commands/server/commands/moderator/clothing";
    import "src/core/plugins/core-commands/server/commands/moderator/currency";
    import "src/core/plugins/core-commands/server/commands/moderator/door";
    import "src/core/plugins/core-commands/server/commands/moderator/interior";
    import "src/core/plugins/core-commands/server/commands/moderator/inventory";
    import "src/core/plugins/core-commands/server/commands/moderator/item";
    import "src/core/plugins/core-commands/server/commands/moderator/noclip";
    import "src/core/plugins/core-commands/server/commands/moderator/player";
    import "src/core/plugins/core-commands/server/commands/moderator/skins";
    import "src/core/plugins/core-commands/server/commands/moderator/teleport";
    import "src/core/plugins/core-commands/server/commands/moderator/test";
    import "src/core/plugins/core-commands/server/commands/moderator/vehicle";
    import "src/core/plugins/core-commands/server/commands/moderator/utility";
    import "src/core/plugins/core-commands/server/commands/moderator/weapons";
}
declare module "src/core/plugins/core-commands/server/commands/player/job" { }
declare module "src/core/plugins/core-commands/server/commands/player/player" { }
declare module "src/core/plugins/core-commands/server/commands/player/vehicle" { }
declare module "src/core/plugins/core-commands/server/commands/player/index" {
    import "src/core/plugins/core-commands/server/commands/player/job";
    import "src/core/plugins/core-commands/server/commands/player/player";
    import "src/core/plugins/core-commands/server/commands/player/vehicle";
}
declare module "src/core/plugins/core-commands/server/commands/admin/permissions" { }
declare module "src/core/plugins/core-commands/server/commands/admin/index" {
    import "src/core/plugins/core-commands/server/commands/admin/permissions";
}
declare module "src/core/plugins/core-commands/server/index" {
    import "src/core/plugins/core-commands/server/commands/moderator/index";
    import "src/core/plugins/core-commands/server/commands/player/index";
    import "src/core/plugins/core-commands/server/commands/admin/index";
}
declare module "src/core/plugins/core-commands/shared/iRoleplayCmds" {
    export interface IRoleplayCmds {
        COMMAND_OOC_DISTANCE: number;
        COMMAND_ME_DISTANCE: number;
        COMMAND_DO_DISTANCE: number;
        COMMAND_LOW_DISTANCE: number;
        COMMAND_WHISPER_DISTANCE: number;
        CHAT_ROLEPLAY_OOC_COLOR: string;
        CHAT_ROLEPLAY_COLOR: string;
        CHAT_ROLEPLAY_LOW_COLOR: string;
        CHAT_ROLEPLAY_WHISPER_COLOR: string;
    }
}
declare module "src/core/plugins/core-commands/server/config/commandsConfig" {
    import { IRoleplayCmds } from "src/core/plugins/core-commands/shared/iRoleplayCmds";
    export const RoleplayCmdsConfig: IRoleplayCmds;
}
declare module "src/core/plugins/core-inventory/shared/events" {
    export const INVENTORY_EVENTS: {
        PAGE: string;
        TO_SERVER: {
            USE: string;
            DROP: string;
            SPLIT: string;
            SWAP: string;
            UNEQUIP: string;
            OPEN: string;
            CLOSE: string;
            COMBINE: string;
            GIVE: string;
        };
        TO_CLIENT: {
            OPEN: string;
            CLOSE: string;
        };
        FROM_WEBVIEW: {
            READY: string;
            GET_CLOSEST_PLAYERS: string;
        };
        FROM_CLIENT: {
            SET_CLOSEST_PLAYERS: string;
        };
        TO_WEBVIEW: {
            SET_CUSTOM: string;
            SET_INVENTORY: string;
            SET_SIZE: string;
            SET_WEIGHT_STATE: string;
            SET_MAX_WEIGHT: string;
        };
    };
}
declare module "src/core/plugins/core-inventory/shared/config" {
    export const INVENTORY_CONFIG: {
        PLUGIN_FOLDER_NAME: string;
        KEYBIND: number;
        WEBVIEW: {
            GRID: {
                SHOW_NUMBERS: boolean;
            };
            TOOLBAR: {
                SHOW_NUMBERS: boolean;
            };
            WEIGHT: {
                UNITS: string;
            };
        };
        MAX_GIVE_DISTANCE: number;
    };
}
declare module "src/core/plugins/core-inventory/client/index" { }
declare module "src/core/plugins/core-inventory/server/src/view" {
    import * as alt from 'alt-server';
    import { StoredItem } from "src/core/shared/interfaces/item";
    type PlayerCallback = (player: alt.Player) => void;
    type PlayerCloseCallback = (uid: string, items: Array<StoredItem>, player: alt.Player | undefined) => void;
    function addCallback(type: 'close', callback: PlayerCloseCallback): any;
    function addCallback(type: 'open', callback: PlayerCallback): any;
    export const InventoryView: {
        init(): void;
        callbacks: {
            add: typeof addCallback;
        };
        controls: {
            open(player: alt.Player): void;
            close(player: alt.Player): void;
        };
        storage: {
            open(player: alt.Player, uid: string, items: Array<StoredItem>, storageSize: number, forceOpenInventory?: boolean): Promise<void>;
            resync(player: alt.Player): void;
            isUsingSession(player: alt.Player, uid: string): boolean;
            isSessionInUse(uid: string): boolean;
        };
    };
}
declare module "src/core/plugins/core-inventory/server/index" { }
declare module "src/core/plugins/core-inventory/shared/equipment" {
    export const EquipmentSlots: Array<{
        name: string;
        slot: number;
        displayOrder: number;
    }>;
}
declare module "src/core/plugins/core-inventory/webview/utility/debounce" {
    export function debounceReady(): boolean;
}
declare module "src-webviews/src/utility/pathResolver" {
    export default function resolvePath(currentPath: string, pluginName?: string): string;
}
declare module "src/core/plugins/core-inventory/webview/utility/inventoryIcon" {
    import { Item } from "src/core/shared/interfaces/item";
    export function getImagePath(item: Item): string;
}
declare module "src/core/plugins/core-inventory/webview/utility/slotInfo" {
    export interface SlotInfo {
        slot: number;
        location: 'inventory' | 'toolbar' | 'custom';
        hasItem: boolean;
        quantity: number;
        name: string;
        weight: number;
        highlight?: boolean;
    }
}
declare module "src/core/plugins/discord-auth/shared/events" {
    export const DiscordAuthEvents: {
        toServer: {
            pushToken: string;
        };
        toClient: {
            requestToken: string;
        };
    };
}
declare module "src/core/plugins/discord-auth/client/index" { }
declare module "src/core/plugins/discord-auth/server/config" {
    export const DiscordAuthConfig: {
        APPLICATION_ID: string;
    };
}
declare module "src/core/plugins/discord-auth/server/index" { }
declare module "src/core/plugins/private-pause-menu/shared/events" {
    export type PauseMenuToWebview = 'pause-menu-set-config';
    export type PauseMenuToClient = 'pause-menu-invoke-event' | 'pause-menu-close';
    export const PauseMenuEvents: {
        ToServer: {
            InvokeEvent: string;
        };
        Default: {
            quit: string;
            map: string;
            options: string;
        };
    };
}
declare module "src/core/plugins/private-pause-menu/shared/config" {
    export type EventInfo = {
        eventName: string;
        text: string;
        isServer?: boolean;
    };
    export interface PauseConfigType {
        pauseImage: string;
        pauseText: string;
        options: Array<EventInfo>;
        lastOption: EventInfo;
    }
    const InternalConfig: PauseConfigType;
    function set(key: 'lastOption', value: EventInfo): any;
    function set(key: 'options', value: Array<EventInfo>): any;
    function set(key: 'pauseText', value: string): any;
    function set(key: 'pauseImage', value: string): any;
    export const PauseConfig: {
        set: typeof set;
        get<T = unknown>(key: keyof typeof InternalConfig): T;
    };
}
declare module "src/core/plugins/private-pause-menu/shared/eventHandler" {
    export const PauseMenuEventHandler: {
        callbacks: {
            add(eventName: string, callback: Function): void;
            get<T = Function>(eventName: string): T;
        };
    };
}
declare module "src/core/plugins/private-pause-menu/client/index" {
    import { EventInfo } from "src/core/plugins/private-pause-menu/shared/config";
    export const PrivatePauseMenu: {
        forceOpen(): void;
        options: {
            add(option: EventInfo, callback: Function): void;
            remove(eventName: string): void;
            set(options: Array<EventInfo & {
                callback: Function;
            }>): void;
            reset(): void;
        };
    };
}
declare module "src/core/plugins/private-pause-menu/server/index" { }
declare module "src/core/plugins/private-pm-keybind-menu/shared/events" {
    export type KeybindMenuEvents = 'update-keybind-list' | 'update-keybind' | 'keybind-close-menu';
}
declare module "src/core/plugins/private-pm-keybind-menu/shared/interfaces" {
    export interface HotkeyInfo {
        key: number;
        default: number;
        description: string;
        identifier: string;
        modifier?: string;
    }
}
declare module "src/core/plugins/private-pm-keybind-menu/client/index" { }
declare module "src/core/plugins/private-pm-keybind-menu/server/index" { }
declare module "src/core/plugins/sandbox/server/index" { }
declare module "src/core/server/imports/configs" {
    import "src/core/server/athena/main";
}
declare module "src/core/server/events/clientEvents" {
    import * as alt from 'alt-server';
    import { ATHENA_EVENTS_PLAYER_CLIENT } from "src/core/shared/enums/athenaEvents";
    export function trigger(eventName: ATHENA_EVENTS_PLAYER_CLIENT, player: alt.Player, ...args: any[]): void;
    export function on(eventName: ATHENA_EVENTS_PLAYER_CLIENT, callback: (player: alt.Player, ...args: any[]) => void): void;
}
declare module "src/core/server/events/onAppearance" { }
declare module "src/core/server/events/pickupItemEvent" { }
declare module "src/core/server/systems/dev" {
    import * as alt from 'alt-server';
    export class DevModeOverride {
        static setDevAccountCallback(cb: (player: alt.Player) => Promise<void>): void;
        static login(player: alt.Player): Promise<void>;
    }
}
declare module "src/core/server/events/playerConnect" { }
declare module "src/core/server/events/playerDeath" { }
declare module "src/core/server/events/waypointEvent" { }
declare module "src/core/server/imports/events" {
    import "src/core/server/events/clientEvents";
    import "src/core/server/events/onAppearance";
    import "src/core/server/events/pickupItemEvent";
    import "src/core/server/events/playerConnect";
    import "src/core/server/events/playerDeath";
    import "src/core/server/vehicle/events";
    import "src/core/server/events/waypointEvent";
}
declare module "src/core/server/interface/iDiscordUser" {
    export interface DiscordUser {
        id: string;
        username: string;
        avatar: string;
        email?: string;
        discriminator: string;
        public_flags: number;
        flags: number;
        locale: string;
        mfa_enabled: boolean;
    }
}
declare module "src/core/server/extensions/extPlayer" {
    import * as alt from 'alt-server';
    import { DiscordUser } from "src/core/server/interface/iDiscordUser";
    import IAttachable from "src/core/shared/interfaces/iAttachable";
    module 'alt-server' {
        interface Player {
            pendingLogin?: boolean;
            discordToken?: string;
            hasModel?: boolean;
            discord?: DiscordUser;
            nextPingTime: number;
            nextPlayTime: number;
            currentWaypoint: alt.IVector3 | null;
            attachables?: Array<IAttachable> | null;
        }
    }
}
declare module "src/core/server/imports/commands" { }
declare module "src/core/server/systems/defaults/vehiclesDespawnOnDestroy" {
    export function disable(): void;
    export function setTimeBeforeRemove(milliseconds: number): void;
}
declare module "src/core/server/imports/systems" {
    import "src/core/server/systems/account";
    import "src/core/server/systems/adminControl";
    import "src/core/server/systems/global";
    import "src/core/server/systems/identifier";
    import "src/core/server/systems/inventory/clothing";
    import "src/core/server/systems/inventory/config";
    import "src/core/server/systems/inventory/crafting";
    import "src/core/server/systems/inventory/drops";
    import "src/core/server/systems/inventory/effects";
    import "src/core/server/systems/inventory/factory";
    import "src/core/server/systems/inventory/manager";
    import "src/core/server/systems/inventory/slot";
    import "src/core/server/systems/inventory/weapons";
    import "src/core/server/systems/inventory/weight";
    import "src/core/server/systems/job/events";
    import "src/core/server/systems/job/instance";
    import "src/core/server/systems/job/system";
    import "src/core/server/systems/job/triggers";
    import "src/core/server/systems/job/verify";
    import "src/core/server/systems/jobTrigger";
    import "src/core/server/systems/messenger/messaging";
    import "src/core/server/systems/plugins";
    import "src/core/server/systems/streamer";
    import "src/core/server/systems/tick";
    import "src/core/server/systems/defaults/ammo";
    import "src/core/server/systems/defaults/clothingCrafting";
    import "src/core/server/systems/defaults/death";
    import "src/core/server/systems/defaults/displayId";
    import "src/core/server/systems/defaults/inventorySync";
    import "src/core/server/systems/defaults/time";
    import "src/core/server/systems/defaults/toolbar";
    import "src/core/server/systems/defaults/vehiclesDespawnOnDestroy";
    import "src/core/server/systems/defaults/vehiclesDespawnOnLeave";
    import "src/core/server/systems/defaults/vehiclesSpawnOnJoin";
    import "src/core/server/systems/defaults/weaponItems";
    import "src/core/server/systems/defaults/weather";
}
declare module "src/core/server/imports/controllers" {
    import "src/core/server/controllers/admin";
    import "src/core/server/controllers/blip";
    import "src/core/server/controllers/doors";
    import "src/core/server/controllers/interaction";
    import "src/core/server/controllers/marker";
    import "src/core/server/controllers/object";
    import "src/core/server/controllers/staticPed";
    import "src/core/server/controllers/textlabel";
    import "src/core/server/controllers/worldNotifications";
}
declare module "src/core/server/vehicle/internalEvents" { }
declare module "src/core/server/imports/vehicle" {
    import "src/core/server/vehicle/asPlayer";
    import "src/core/server/vehicle/controls";
    import "src/core/server/vehicle/events";
    import "src/core/server/vehicle/get";
    import "src/core/server/vehicle/internalEvents";
    import "src/core/server/vehicle/ownership";
    import "src/core/server/vehicle/spawn";
    import "src/core/server/vehicle/tempVehicles";
    import "src/core/server/vehicle/tuning";
}
declare module "src/core/server/imports/utilities" {
    import "src/core/server/utility/config";
}
declare module "src/core/server/boot" {
    import "src/core/server/imports/configs";
    import "src/core/server/systems/plugins";
    import "src/core/server/systems/streamer";
    import "src/core/server/api/index";
    import "src/core/server/imports/events";
    import "src/core/server/extensions/extPlayer";
    import "src/core/server/extensions/extColshape";
    import "src/core/server/imports/commands";
    import "src/core/server/imports/systems";
    import "src/core/server/imports/controllers";
    import "src/core/server/imports/vehicle";
    import "src/core/server/imports/utilities";
    import '../plugins/athena/server/imports';
}
declare module "src/core/server/utility/reconnect" {
    export function invoke(): Promise<void>;
    export function isWindows(): boolean;
    export function reconnect(): Promise<void>;
    const _default_28: {
        invoke: typeof invoke;
        isWindows: typeof isWindows;
        reconnect: typeof reconnect;
    };
    export default _default_28;
}
declare module "src/core/server/startup" { }
interface ControllerFuncs<append, remove, addToPlayer = void, removeFromPlayer = void, update = void> {
    append: append;
    remove: remove;
    addToPlayer?: addToPlayer;
    removeFromPlayer?: removeFromPlayer;
    update?: update;
}
declare module "src/core/server/interface/iCategoryData" {
    export interface CategoryData {
        abbrv?: string;
        name: 'inventory' | 'equipment' | 'toolbar' | 'ground';
        emptyCheck?: Function;
        getItem?: Function;
        removeItem?: Function;
        addItem?: Function;
    }
}
declare module "src/core/server/interface/iOptions" {
    export type DiscordID = string;
    export interface Options {
        _id?: any;
        whitelist?: Array<DiscordID>;
    }
    export const defaultOptions: {
        whitelist: any[];
    };
}
declare module "src/core/server/utility/screenshot" {
    import * as alt from 'alt-server';
    export class AthenaScreenshot {
        static takeScreenshot(player: alt.Player): Promise<string | null>;
        static buildData(player: alt.Player, data: string, index: number, lengthOfData: number): Promise<void>;
    }
}
declare module "src/core/shared/enums/VehicleHash" {
    export enum VEHICLE_HASH {
        ADDER = 3078201489,
        AIRBUS = 1283517198,
        AIRTUG = 1560980623,
        AKULA = 1181327175,
        AKUMA = 1672195559,
        ALKONOST = 3929093893,
        ALPHA = 767087018,
        ALPHAZ1 = 2771347558,
        AMBULANCE = 1171614426,
        ANNIHILATOR = 837858166,
        ANNIHILATOR2 = 295054921,
        APC = 562680400,
        ARDENT = 159274291,
        ARMYTANKER = 3087536137,
        ARMYTRAILER = 2818520053,
        ARMYTRAILER2 = 2657817814,
        ASBO = 1118611807,
        ASTRON = 629969764,
        ASEA = 2485144969,
        ASEA2 = 2487343317,
        ASTEROPE = 2391954683,
        AUTARCH = 3981782132,
        AVARUS = 2179174271,
        AVENGER = 2176659152,
        AVENGER2 = 408970549,
        AVISA = 2588363614,
        BAGGER = 2154536131,
        BALETRAILER = 3895125590,
        BALLER = 3486135912,
        BALLER2 = 142944341,
        BALLER3 = 1878062887,
        BALLER4 = 634118882,
        BALLER5 = 470404958,
        BALLER6 = 666166960,
        BALLER7 = 359875117,
        BANSHEE = 3253274834,
        BANSHEE2 = 633712403,
        BARRACKS = 3471458123,
        BARRACKS2 = 1074326203,
        BARRACKS3 = 630371791,
        BARRAGE = 4081974053,
        BATI = 4180675781,
        BATI2 = 3403504941,
        BENSON = 2053223216,
        BESRA = 1824333165,
        BESTIAGTS = 1274868363,
        BF400 = 86520421,
        BFINJECTION = 1126868326,
        BIFF = 850991848,
        BIFTA = 3945366167,
        BISON = 4278019151,
        BISON2 = 2072156101,
        BISON3 = 1739845664,
        BJXL = 850565707,
        BLADE = 3089165662,
        BLAZER = 2166734073,
        BLAZER2 = 4246935337,
        BLAZER3 = 3025077634,
        BLAZER4 = 3854198872,
        BLAZER5 = 2704629607,
        BLIMP = 4143991942,
        BLIMP2 = 3681241380,
        BLIMP3 = 3987008919,
        BLISTA = 3950024287,
        BLISTA2 = 1039032026,
        BLISTA3 = 3703315515,
        BMX = 1131912276,
        BOATTRAILER = 524108981,
        BOBCATXL = 1069929536,
        BODHI2 = 2859047862,
        BOMBUSHKA = 4262088844,
        BOXVILLE = 2307837162,
        BOXVILLE2 = 4061868990,
        BOXVILLE3 = 121658888,
        BOXVILLE4 = 444171386,
        BOXVILLE5 = 682434785,
        BRAWLER = 2815302597,
        BRICKADE = 3989239879,
        BRIOSO = 1549126457,
        BRIOSO2 = 1429622905,
        BRIOSO3 = 15214558,
        BRUISER = 668439077,
        BRUISER2 = 2600885406,
        BRUISER3 = 2252616474,
        BRUTUS = 2139203625,
        BRUTUS2 = 2403970600,
        BRUTUS3 = 2038858402,
        BTYPE = 117401876,
        BTYPE2 = 3463132580,
        BTYPE3 = 3692679425,
        BUCCANEER = 3612755468,
        BUCCANEER2 = 3281516360,
        BUFFALO = 3990165190,
        BUFFALO2 = 736902334,
        BUFFALO3 = 237764926,
        BUFFALO4 = 3675036420,
        BULLDOZER = 1886712733,
        BULLET = 2598821281,
        BURRITO = 2948279460,
        BURRITO2 = 3387490166,
        BURRITO3 = 2551651283,
        BURRITO4 = 893081117,
        BURRITO5 = 1132262048,
        BUS = 3581397346,
        BUZZARD = 788747387,
        BUZZARD2 = 745926877,
        CABLECAR = 3334677549,
        CADDY = 1147287684,
        CADDY2 = 3757070668,
        CADDY3 = 3525819835,
        CALICO = 3101054893,
        CAMPER = 1876516712,
        CARACARA = 1254014755,
        CARACARA2 = 2945871676,
        CARBONIZZARE = 2072687711,
        CARBONRS = 11251904,
        CARGOBOB = 4244420235,
        CARGOBOB2 = 1621617168,
        CARGOBOB3 = 1394036463,
        CARGOBOB4 = 2025593404,
        CARGOPLANE = 368211810,
        CASCO = 941800958,
        CAVALCADE = 2006918058,
        CAVALCADE2 = 3505073125,
        CERBERUS = 3493417227,
        CERBERUS2 = 679453769,
        CERBERUS3 = 1909700336,
        CHAMPION = 3379732821,
        CHEBUREK = 3306466016,
        CHEETAH = 2983812512,
        CHEETAH2 = 223240013,
        CHERNOBOG = 3602674979,
        CHIMERA = 6774487,
        CHINO = 349605904,
        CHINO2 = 2933279331,
        CINQUEMILA = 2767531027,
        CLIQUE = 2728360112,
        CLIFFHANGER = 390201602,
        CLUB = 2196012677,
        COACH = 2222034228,
        COG55 = 906642318,
        COG552 = 704435172,
        COGCABRIO = 330661258,
        COGNOSCENTI = 2264796000,
        COGNOSCENTI2 = 3690124666,
        COMET2 = 3249425686,
        COMET3 = 2272483501,
        COMET4 = 1561920505,
        COMET5 = 661493923,
        COMET6 = 2568944644,
        COMET7 = 1141395928,
        CONADA = 3817135397,
        CONTENDER = 683047626,
        COQUETTE = 108773431,
        COQUETTE2 = 1011753235,
        COQUETTE3 = 784565758,
        COQUETTE4 = 2566281822,
        CORSITA = 3540279623,
        CRUISER = 448402357,
        CRUSADER = 321739290,
        CUBAN800 = 3650256867,
        CUTTER = 3288047904,
        CYCLONE = 1392481335,
        CYPHER = 1755697647,
        DAEMON = 2006142190,
        DAEMON2 = 2890830793,
        DEATHBIKE = 4267640610,
        DEATHBIKE2 = 2482017624,
        DEATHBIKE3 = 2920466844,
        DEFILER = 822018448,
        DEITY = 1532171089,
        DELUXO = 1483171323,
        DEVESTE = 1591739866,
        DEVIANT = 1279262537,
        DIABLOUS = 4055125828,
        DIABLOUS2 = 1790834270,
        DILETTANTE = 3164157193,
        DILETTANTE2 = 1682114128,
        DINGHY = 1033245328,
        DINGHY2 = 276773164,
        DINGHY3 = 509498602,
        DINGHY4 = 867467158,
        DINGHY5 = 3314393930,
        DLOADER = 1770332643,
        DOCKTRAILER = 2154757102,
        DOCKTUG = 3410276810,
        DODO = 3393804037,
        DOMINATOR = 80636076,
        DOMINATOR2 = 3379262425,
        DOMINATOR3 = 3308022675,
        DOMINATOR4 = 3606777648,
        DOMINATOR5 = 2919906639,
        DOMINATOR6 = 3001042683,
        DOMINATOR7 = 426742808,
        DOMINATOR8 = 736672010,
        DOUBLE = 2623969160,
        DRAFTER = 686471183,
        DRAUGUR = 3526730918,
        DUBSTA = 1177543287,
        DUBSTA2 = 3900892662,
        DUBSTA3 = 3057713523,
        DUKES = 723973206,
        DUKES2 = 3968823444,
        DUKES3 = 2134119907,
        DUMP = 2164484578,
        DUNE = 2633113103,
        DUNE2 = 534258863,
        DUNE3 = 1897744184,
        DUNE4 = 3467805257,
        DUNE5 = 3982671785,
        DUSTER = 970356638,
        DYNASTY = 310284501,
        ELEGY = 196747873,
        ELEGY2 = 3728579874,
        ELLIE = 3027423925,
        EMERUS = 1323778901,
        EMPEROR = 3609690755,
        EMPEROR2 = 2411965148,
        EMPEROR3 = 3053254478,
        ENDURO = 1753414259,
        ENTITYXF = 3003014393,
        ENTITYXXR = 2174267100,
        ESSKEY = 2035069708,
        EUROS = 2038480341,
        EVERON = 2538945576,
        EXEMPLAR = 4289813342,
        F620 = 3703357000,
        FACTION = 2175389151,
        FACTION2 = 2504420315,
        FACTION3 = 2255212070,
        FAGALOA = 1617472902,
        FAGGIO = 2452219115,
        FAGGIO2 = 55628203,
        FAGGIO3 = 3005788552,
        FBI = 1127131465,
        FBI2 = 2647026068,
        FCR = 627535535,
        FCR2 = 3537231886,
        FELON = 3903372712,
        FELON2 = 4205676014,
        FELTZER2 = 2299640309,
        FELTZER3 = 2728226064,
        FIRETRUCK = 1938952078,
        FIXTER = 3458454463,
        FLASHGT = 3035832600,
        FLATBED = 1353720154,
        FORKLIFT = 1491375716,
        FORMULA = 340154634,
        FORMULA2 = 2334210311,
        FMJ = 1426219628,
        FQ2 = 3157435195,
        FREECRAWLER = 4240635011,
        FREIGHT = 1030400667,
        FREIGHTCAR = 184361638,
        FREIGHTCAR2 = 3186376089,
        FREIGHTCONT1 = 920453016,
        FREIGHTCONT2 = 240201337,
        FREIGHTGRAIN = 642617954,
        FREIGHTTRAILER = 3517691494,
        FROGGER = 744705981,
        FROGGER2 = 1949211328,
        FUGITIVE = 1909141499,
        FURIA = 960812448,
        FUROREGT = 3205927392,
        FUSILADE = 499169875,
        FUTO = 2016857647,
        FUTO2 = 2787736776,
        GARGOYLE = 741090084,
        GAUNTLET = 2494797253,
        GAUNTLET2 = 349315417,
        GAUNTLET3 = 722226637,
        GAUNTLET4 = 1934384720,
        GAUNTLET5 = 2172320429,
        GB200 = 1909189272,
        GBURRITO = 2549763894,
        GBURRITO2 = 296357396,
        GLENDALE = 75131841,
        GLENDALE2 = 3381377750,
        GP1 = 1234311532,
        GRAINTRAILER = 1019737494,
        GRANGER = 2519238556,
        GRANGER2 = 4033620423,
        GREENWOOD = 40817712,
        GRESLEY = 2751205197,
        GROWLER = 1304459735,
        GT500 = 2215179066,
        GUARDIAN = 2186977100,
        HABANERO = 884422927,
        HAKUCHOU = 1265391242,
        HAKUCHOU2 = 4039289119,
        HALFTRACK = 4262731174,
        HANDLER = 444583674,
        HAULER = 1518533038,
        HAULER2 = 387748548,
        HAVOK = 2310691317,
        HELLION = 3932816511,
        HERMES = 15219735,
        HEXER = 301427732,
        HOTKNIFE = 37348240,
        HOTRINGSABRE = 1115909093,
        HOWARD = 3287439187,
        HUNTER = 4252008158,
        HUNTLEY = 486987393,
        HUSTLER = 600450546,
        HYDRA = 970385471,
        IGNUS = 2850852987,
        IMORGON = 3162245632,
        IMPALER = 2198276962,
        IMPALER2 = 1009171724,
        IMPALER3 = 2370166601,
        IMPALER4 = 2550461639,
        IMPERATOR = 444994115,
        IMPERATOR2 = 1637620610,
        IMPERATOR3 = 3539435063,
        INFERNUS = 418536135,
        INFERNUS2 = 2889029532,
        INGOT = 3005245074,
        INNOVATION = 4135840458,
        INSURGENT = 2434067162,
        INSURGENT2 = 2071877360,
        INSURGENT3 = 2370534026,
        INTRUDER = 886934177,
        ISSI2 = 3117103977,
        ISSI3 = 931280609,
        ISSI4 = 628003514,
        ISSI5 = 1537277726,
        ISSI6 = 1239571361,
        ISSI7 = 1854776567,
        ITALIGTB = 2246633323,
        ITALIGTB2 = 3812247419,
        ITALIGTO = 3963499524,
        ITALIRSX = 3145241962,
        IWAGEN = 662793086,
        JACKAL = 3670438162,
        JB700 = 1051415893,
        JB7002 = 394110044,
        JESTER = 2997294755,
        JESTER2 = 3188613414,
        JESTER3 = 4080061290,
        JESTER4 = 2712905841,
        JET = 1058115860,
        JETMAX = 861409633,
        JOURNEY = 4174679674,
        JUBILEE = 461465043,
        JUGULAR = 4086055493,
        KALAHARI = 92612664,
        KAMACHO = 4173521127,
        KANJO = 409049982,
        KANJOSJ = 4230891418,
        KHAMELION = 544021352,
        KHANJARI = 2859440138,
        KOMODA = 3460613305,
        KOSATKA = 1336872304,
        KRIEGER = 3630826055,
        KURUMA = 2922118804,
        KURUMA2 = 410882957,
        LANDSTALKER = 1269098716,
        LANDSTALKER2 = 3456868130,
        LAZER = 3013282534,
        LE7B = 3062131285,
        LECTRO = 640818791,
        LGUARD = 469291905,
        LIMO2 = 4180339789,
        LM87 = 4284049613,
        LOCUST = 3353694737,
        LONGFIN = 1861786828,
        LURCHER = 2068293287,
        LUXOR = 621481054,
        LUXOR2 = 3080673438,
        LYNX = 482197771,
        MAMBA = 2634021974,
        MAMMATUS = 2548391185,
        MENACER = 2044532910,
        MANANA = 2170765704,
        MANANA2 = 1717532765,
        MANCHEZ = 2771538552,
        MANCHEZ2 = 1086534307,
        MARQUIS = 3251507587,
        MARSHALL = 1233534620,
        MASSACRO = 4152024626,
        MASSACRO2 = 3663206819,
        MAVERICK = 2634305738,
        MESA = 914654722,
        MESA2 = 3546958660,
        MESA3 = 2230595153,
        METROTRAIN = 868868440,
        MICHELLI = 1046206681,
        MICROLIGHT = 2531412055,
        MILJET = 165154707,
        MINITANK = 3040635986,
        MINIVAN = 3984502180,
        MINIVAN2 = 3168702960,
        MIXER = 3510150843,
        MIXER2 = 475220373,
        MOGUL = 3545667823,
        MOLOTOK = 1565978651,
        MONROE = 3861591579,
        MONSTER = 3449006043,
        MONSTER3 = 1721676810,
        MONSTER4 = 840387324,
        MONSTER5 = 3579220348,
        MOONBEAM = 525509695,
        MOONBEAM2 = 1896491931,
        MOWER = 1783355638,
        MULE = 904750859,
        MULE2 = 3244501995,
        MULE3 = 2242229361,
        MULE4 = 1945374990,
        MULE5 = 1343932732,
        NEBULA = 3412338231,
        NEMESIS = 3660088182,
        NEO = 2674840994,
        NEON = 2445973230,
        NERO = 1034187331,
        NERO2 = 1093792632,
        NIGHTBLADE = 2688780135,
        NIGHTSHADE = 2351681756,
        NIGHTSHARK = 433954513,
        NIMBUS = 2999939664,
        NINEF = 1032823388,
        NINEF2 = 2833484545,
        NOKOTA = 1036591958,
        NOVAK = 2465530446,
        OMNIS = 3517794615,
        OMNISEGT = 3789743831,
        OPENWHEEL1 = 1492612435,
        OPENWHEEL2 = 1181339704,
        OPPRESSOR = 884483972,
        OPPRESSOR2 = 2069146067,
        ORACLE = 1348744438,
        ORACLE2 = 3783366066,
        OSIRIS = 1987142870,
        OUTLAW = 408825843,
        PACKER = 569305213,
        PANTO = 3863274624,
        PARADISE = 1488164764,
        PARAGON = 3847255899,
        PARAGON2 = 1416466158,
        PARIAH = 867799010,
        PATRIOT = 3486509883,
        PATRIOT2 = 3874056184,
        PATRIOT3 = 3624880708,
        PATROLBOAT = 4018222598,
        PBUS = 2287941233,
        PBUS2 = 345756458,
        PCJ = 3385765638,
        PENETRATOR = 2536829930,
        PENUMBRA = 3917501776,
        PENUMBRA2 = 3663644634,
        PEYOTE = 1830407356,
        PEYOTE2 = 2490551588,
        PEYOTE3 = 1107404867,
        PFISTER811 = 2465164804,
        PHANTOM = 2157618379,
        PHANTOM2 = 2645431192,
        PHANTOM3 = 177270108,
        PHOENIX = 2199527893,
        PICADOR = 1507916787,
        PIGALLE = 1078682497,
        POLICE = 2046537925,
        POLICE2 = 2667966721,
        POLICE3 = 1912215274,
        POLICE4 = 2321795001,
        POLICEB = 4260343491,
        POLICEOLD1 = 2758042359,
        POLICEOLD2 = 2515846680,
        POLICET = 456714581,
        POLMAV = 353883353,
        PONY = 4175309224,
        PONY2 = 943752001,
        POSTLUDE = 4000288633,
        POUNDER = 2112052861,
        POUNDER2 = 1653666139,
        PRAIRIE = 2844316578,
        PRANGER = 741586030,
        PREDATOR = 3806844075,
        PREMIER = 2411098011,
        PREVION = 1416471345,
        PRIMO = 3144368207,
        PRIMO2 = 2254540506,
        PROPTRAILER = 356391690,
        PROTOTIPO = 2123327359,
        PYRO = 2908775872,
        RADI = 2643899483,
        RAIDEN = 2765724541,
        RAKETRAILER = 390902130,
        RANCHERXL = 1645267888,
        RANCHERXL2 = 1933662059,
        RALLYTRUCK = 2191146052,
        RAPIDGT = 2360515092,
        RAPIDGT2 = 1737773231,
        RAPIDGT3 = 2049897956,
        RAPTOR = 3620039993,
        RATBIKE = 1873600305,
        RATLOADER = 3627815886,
        RATLOADER2 = 3705788919,
        RCBANDITO = 4008920556,
        RE7B = 3062131285,
        REBLA = 83136452,
        REAPER = 234062309,
        REBEL = 3087195462,
        REBEL2 = 2249373259,
        REEVER = 1993851908,
        REGINA = 4280472072,
        REMUS = 1377217886,
        RENTALBUS = 3196165219,
        RETINUE = 1841130506,
        RETINUE2 = 2031587082,
        REVOLTER = 3884762073,
        RHAPSODY = 841808271,
        RHINEHART = 2439462158,
        RHINO = 782665360,
        RIATA = 2762269779,
        RIOT = 3089277354,
        RIOT2 = 2601952180,
        RIPLEY = 3448987385,
        ROCOTO = 2136773105,
        ROGUE = 3319621991,
        ROMERO = 627094268,
        RROCKET = 916547552,
        RT3000 = 3842363289,
        RUBBLE = 2589662668,
        RUFFIAN = 3401388520,
        RUINER = 4067225593,
        RUINER2 = 941494461,
        RUINER3 = 777714999,
        RUINER4 = 1706945532,
        RUMPO = 1162065741,
        RUMPO2 = 2518351607,
        RUMPO3 = 1475773103,
        RUSTON = 719660200,
        SABREGT = 2609945748,
        SABREGT2 = 223258115,
        S80 = 3970348707,
        SADLER = 3695398481,
        SADLER2 = 734217681,
        SANCHEZ = 788045382,
        SANCHEZ2 = 2841686334,
        SANCTUS = 1491277511,
        SANDKING = 3105951696,
        SANDKING2 = 989381445,
        SAVAGE = 4212341271,
        SAVESTRA = 903794909,
        SC1 = 1352136073,
        SCARAB = 3147997943,
        SCARAB2 = 1542143200,
        SCARAB3 = 3715219435,
        SCHAFTER2 = 3039514899,
        SCHAFTER3 = 2809443750,
        SCHAFTER4 = 1489967196,
        SCHAFTER5 = 3406724313,
        SCHAFTER6 = 1922255844,
        SCHLAGEN = 3787471536,
        SCHWARZER = 3548084598,
        SCORCHER = 4108429845,
        SCRAMJET = 3656405053,
        SCRAP = 2594165727,
        SEABREEZE = 3902291871,
        SEASHARK = 3264692260,
        SEASHARK2 = 3678636260,
        SEASHARK3 = 3983945033,
        SEASPARROW = 3568198617,
        SEASPARROW2 = 1229411063,
        SEASPARROW3 = 1593933419,
        SEMINOLE = 1221512915,
        SEMINOLE2 = 2484160806,
        SENTINEL = 1349725314,
        SENTINEL2 = 873639469,
        SENTINEL3 = 1104234922,
        SENTINEL4 = 2938086457,
        SERRANO = 1337041428,
        SEVEN70 = 2537130571,
        SHAMAL = 3080461301,
        SHEAVA = 819197656,
        SHERIFF = 2611638396,
        SHERIFF2 = 1922257928,
        SHINOBI = 1353120668,
        SHOTARO = 3889340782,
        SKYLIFT = 1044954915,
        SLAMTRUCK = 3249056020,
        SLAMVAN = 729783779,
        SLAMVAN2 = 833469436,
        SLAMVAN3 = 1119641113,
        SLAMVAN4 = 2233918197,
        SLAMVAN5 = 373261600,
        SLAMVAN6 = 1742022738,
        SM722 = 775514032,
        SOVEREIGN = 743478836,
        SPECTER = 1886268224,
        SPECTER2 = 1074745671,
        SPEEDER = 231083307,
        SPEEDER2 = 437538602,
        SPEEDO = 3484649228,
        SPEEDO2 = 728614474,
        SPEEDO4 = 219613597,
        SQUADDIE = 4192631813,
        SQUALO = 400514754,
        STAFFORD = 321186144,
        STALION = 1923400478,
        STALION2 = 3893323758,
        STANIER = 2817386317,
        STARLING = 2594093022,
        STINGER = 1545842587,
        STINGERGT = 2196019706,
        STOCKADE = 1747439474,
        STOCKADE3 = 4080511798,
        STRATUM = 1723137093,
        STREITER = 1741861769,
        STRETCH = 2333339779,
        STRIKEFORCE = 1692272545,
        STROMBERG = 886810209,
        STRYDER = 301304410,
        STUNT = 2172210288,
        SUBMERSIBLE = 771711535,
        SUBMERSIBLE2 = 3228633070,
        SUGOI = 987469656,
        SULTAN = 970598228,
        SULTAN2 = 872704284,
        SULTAN3 = 4003946083,
        SULTANRS = 3999278268,
        SUNTRAP = 4012021193,
        SUPERD = 1123216662,
        SUPERVOLITO = 710198397,
        SUPERVOLITO2 = 2623428164,
        SURANO = 384071873,
        SURFER = 699456151,
        SURFER2 = 2983726598,
        SURGE = 2400073108,
        SWIFT2 = 1075432268,
        SWIFT = 3955379698,
        SWINGER = 500482303,
        T20 = 1663218586,
        TACO = 1951180813,
        TAILGATER = 3286105550,
        TAILGATER2 = 3050505892,
        TAIPAN = 3160260734,
        TAMPA = 972671128,
        TAMPA2 = 3223586949,
        TAMPA3 = 3084515313,
        TANKER = 3564062519,
        TANKER2 = 1956216962,
        TANKERCAR = 586013744,
        TAXI = 3338918751,
        TECHNICAL = 2198148358,
        TECHNICAL2 = 1180875963,
        TECHNICAL3 = 1356124575,
        TEMPESTA = 272929391,
        TENF = 3400983137,
        TENF2 = 274946574,
        TERRORBYTE = 2306538597,
        TEZERACT = 1031562256,
        THRAX = 1044193113,
        THRUST = 1836027715,
        THRUSTER = 1489874736,
        TIGON = 2936769864,
        TIPTRUCK = 48339065,
        TIPTRUCK2 = 3347205726,
        TITAN = 1981688531,
        TOREADOR = 1455990255,
        TORERO = 1504306544,
        TORERO2 = 4129572538,
        TORNADO = 464687292,
        TORNADO2 = 1531094468,
        TORNADO3 = 1762279763,
        TORNADO4 = 2261744861,
        TORNADO5 = 2497353967,
        TORNADO6 = 2736567667,
        TORO = 1070967343,
        TORO2 = 908897389,
        TOROS = 3126015148,
        TOURBUS = 1941029835,
        TOWTRUCK = 2971866336,
        TOWTRUCK2 = 3852654278,
        TR2 = 2078290630,
        TR3 = 1784254509,
        TR4 = 2091594960,
        TRACTOR = 1641462412,
        TRACTOR2 = 2218488798,
        TRACTOR3 = 1445631933,
        TRAILERLARGE = 1502869817,
        TRAILERLOGS = 2016027501,
        TRAILERS = 3417488910,
        TRAILERS2 = 2715434129,
        TRAILERS3 = 2236089197,
        TRAILERS4 = 3194418602,
        TRAILERSMALL = 712162987,
        TRAILERSMALL2 = 2413121211,
        TRASH = 1917016601,
        TRASH2 = 3039269212,
        TRFLAT = 2942498482,
        TRIBIKE = 1127861609,
        TRIBIKE2 = 3061159916,
        TRIBIKE3 = 3894672200,
        TROPHYTRUCK = 101905590,
        TROPHYTRUCK2 = 3631668194,
        TROPIC = 290013743,
        TROPIC2 = 1448677353,
        TROPOS = 1887331236,
        TUG = 2194326579,
        TULIP = 1456744817,
        TULA = 1043222410,
        TURISMOR = 408192225,
        TURISMO2 = 3312836369,
        TVTRAILER = 2524324030,
        TYRANT = 3918533058,
        TYRUS = 2067820283,
        UTILITYTRUCK = 516990260,
        UTILITYTRUCK2 = 887537515,
        UTILITYTRUCK3 = 2132890591,
        VACCA = 338562499,
        VADER = 4154065143,
        VAGNER = 1939284556,
        VAGRANT = 740289177,
        VALKYRIE = 2694714877,
        VALKYRIE2 = 1543134283,
        VAMOS = 4245851645,
        VECTRE = 2754593701,
        VELUM = 2621610858,
        VELUM2 = 1077420264,
        VERLIERER2 = 1102544804,
        VERUS = 298565713,
        VESTRA = 1341619767,
        VETIR = 2014313426,
        VETO = 3437611258,
        VETO2 = 2802050217,
        VIGERO = 3469130167,
        VIGERO2 = 2536587772,
        VIGILANTE = 3052358707,
        VINDICATOR = 2941886209,
        VIRGO = 3796912450,
        VIRGO2 = 3395457658,
        VIRGO3 = 16646064,
        VISERIS = 3903371924,
        VISIONE = 3296789504,
        VOLATOL = 447548909,
        VOLATUS = 2449479409,
        VOLTIC = 2672523198,
        VOLTIC2 = 989294410,
        VOODOO = 2006667053,
        VOODOO2 = 523724515,
        VORTEX = 3685342204,
        VSTR = 1456336509,
        WARRENER = 1373123368,
        WARRENER2 = 579912970,
        WASHINGTON = 1777363799,
        WASTELANDER = 2382949506,
        WEEVIL = 1644055914,
        WEEVIL2 = 3300595976,
        WINDSOR = 1581459400,
        WINDSOR2 = 2364918497,
        WINKY = 4084658662,
        WOLFSBANE = 3676349299,
        XA21 = 917809321,
        XLS = 1203490606,
        XLS2 = 3862958888,
        YOSEMITE = 1871995513,
        YOSEMITE2 = 1693751655,
        YOSEMITE3 = 67753863,
        YOUGA = 65402552,
        YOUGA2 = 1026149675,
        YOUGA3 = 1802742206,
        YOUGA4 = 1486521356,
        ZENO = 655665811,
        ZENTORNO = 2891838741,
        ZHABA = 1284356689,
        ZION = 3172678083,
        ZION2 = 3101863448,
        ZION3 = 1862507111,
        ZOMBIEA = 3285698347,
        ZOMBIEB = 3724934023,
        ZORRUSSO = 3612858749,
        ZR350 = 2436313176,
        ZR380 = 540101442,
        ZR3802 = 3188846534,
        ZR3803 = 2816263004,
        ZTYPE = 758895617,
        Z190 = 838982985
    }
}
declare module "src/core/shared/enums/controls" {
    export enum CONTROLS {
        NEXT_CAMERA = 0,
        LOOK_LEFT_RIGHT = 1,
        LOOK_UP_DOWN = 2,
        LOOK_UP_ONLY = 3,
        LOOK_DOWN_ONLY = 4,
        LOOK_LEFT_ONLY = 5,
        LOOK_RIGHT_ONLY = 6,
        CINEMATIC_SLOW_MO = 7,
        FLY_UP_DOWN = 8,
        FLY_LEFT_RIGHT = 9,
        SCRIPTED_FLY_Z_UP = 10,
        SCRIPTED_FLY_Z_DOWN = 11,
        WEAPON_WHEEL_UP_DOWN = 12,
        WEAPON_WHEEL_LEFT_RIGHT = 13,
        WEAPON_WHEEL_NEXT = 14,
        WEAPON_WHEEL_PREV = 15,
        SELECT_NEXT_WEAPON = 16,
        SELECT_PREV_WEAPON = 17,
        SKIP_CUTSCENE = 18,
        CHARACTER_WHEEL = 19,
        MULTIPLAYER_INFO = 20,
        SPRINT = 21,
        JUMP = 22,
        ENTER = 23,
        ATTACK = 24,
        AIM = 25,
        LOOK_BEHIND = 26,
        PHONE = 27,
        SPECIAL_ABILITY = 28,
        SPECIAL_ABILITY_SECONDARY = 29,
        MOVE_LEFT_RIGHT = 30,
        MOVE_UP_DOWN = 31,
        MOVE_UP_ONLY = 32,
        MOVE_DOWN_ONLY = 33,
        MOVE_LEFT_ONLY = 34,
        MOVE_RIGHT_ONLY = 35,
        DUCK = 36,
        SELECT_WEAPON = 37,
        PICKUP = 38,
        SNIPER_ZOOM = 39,
        SNIPER_ZOOM_IN_ONLY = 40,
        SNIPER_ZOOM_OUT_ONLY = 41,
        SNIPER_ZOOM_IN_SECONDARY = 42,
        SNIPER_ZOOM_OUT_SECONDARY = 43,
        COVER = 44,
        RELOAD = 45,
        TALK = 46,
        DETONATE = 47,
        HUD_SPECIAL = 48,
        ARREST = 49,
        ACCURATE_AIM = 50,
        CONTEXT = 51,
        CONTEXT_SECONDARY = 52,
        WEAPON_SPECIAL = 53,
        WEAPON_SPECIAL2 = 54,
        DIVE = 55,
        DROP_WEAPON = 56,
        DROP_AMMO = 57,
        THROW_GRENADE = 58,
        VEHICLE_MOVE_LEFT_RIGHT = 59,
        VEHICLE_MOVE_UP_DOWN = 60,
        VEHICLE_MOVE_UP_ONLY = 61,
        VEHICLE_MOVE_DOWN_ONLY = 62,
        VEHICLE_MOVE_LEFT_ONLY = 63,
        VEHICLE_MOVE_RIGHT_ONLY = 64,
        VEHICLE_SPECIAL = 65,
        VEHICLE_GUN_LEFT_RIGHT = 66,
        VEHICLE_GUN_UP_DOWN = 67,
        VEHICLE_AIM = 68,
        VEHICLE_ATTACK = 69,
        VEHICLE_ATTACK2 = 70,
        VEHICLE_ACCELERATE = 71,
        VEHICLE_BRAKE = 72,
        VEHICLE_DUCK = 73,
        VEHICLE_HEADLIGHT = 74,
        VEHICLE_EXIT = 75,
        VEHICLE_HANDBRAKE = 76,
        VEHICLE_HOTWIRE_LEFT = 77,
        VEHICLE_HOTWIRE_RIGHT = 78,
        VEHICLE_LOOK_BEHIND = 79,
        VEHICLE_CIN_CAM = 80,
        VEHICLE_NEXT_RADIO = 81,
        VEHICLE_PREV_RADIO = 82,
        VEHICLE_NEXT_RADIO_TRACK = 83,
        VEHICLE_PREV_RADIO_TRACK = 84,
        VEHICLE_RADIO_WHEEL = 85,
        VEHICLE_HORN = 86,
        VEHICLE_FLY_THROTTLE_UP = 87,
        VEHICLE_FLY_THROTTLE_DOWN = 88,
        VEHICLE_FLY_YAW_LEFT = 89,
        VEHICLE_FLY_YAW_RIGHT = 90,
        VEHICLE_PASSENGER_AIM = 91,
        VEHICLE_PASSENGER_ATTACK = 92,
        VEHICLE_SPECIAL_ABILITY_FRANKLIN = 93,
        VEHICLE_STUNT_UP_DOWN = 94,
        VEHICLE_CINEMATIC_UP_DOWN = 95,
        VEHICLE_CINEMATIC_UP_ONLY = 96,
        VEHICLE_CINEMATIC_DOWN_ONLY = 97,
        VEHICLE_CINEMATIC_LEFT_RIGHT = 98,
        VEHICLE_SELECT_NEXT_WEAPON = 99,
        VEHICLE_SELECT_PREV_WEAPON = 100,
        VEHICLE_ROOF = 101,
        VEHICLE_JUMP = 102,
        VEHICLE_GRAPPLING_HOOK = 103,
        VEHICLE_SHUFFLE = 104,
        VEHICLE_DROP_PROJECTILE = 105,
        VEHICLE_MOUSE_CONTROL_OVERRIDE = 106,
        VEHICLE_FLY_ROLL_LEFT_RIGHT = 107,
        VEHICLE_FLY_ROLL_LEFT_ONLY = 108,
        VEHICLE_FLY_ROLL_RIGHT_ONLY = 109,
        VEHICLE_FLY_PITCH_UP_DOWN = 110,
        VEHICLE_FLY_PITCH_UP_ONLY = 111,
        VEHICLE_FLY_PITCH_DOWN_ONLY = 112,
        VEHICLE_FLY_UNDER_CARRIAGE = 113,
        VEHICLE_FLY_ATTACK = 114,
        VEHICLE_FLY_SELECT_NEXT_WEAPON = 115,
        VEHICLE_FLY_SELECT_PREV_WEAPON = 116,
        VEHICLE_FLY_SELECT_TARGET_LEFT = 117,
        VEHICLE_FLY_SELECT_TARGET_RIGHT = 118,
        VEHICLE_FLY_VERTICAL_FLIGHT_MODE = 119,
        VEHICLE_FLY_DUCK = 120,
        VEHICLE_FLY_ATTACK_CAMERA = 121,
        VEHICLE_FLY_MOUSE_CONTROL_OVERRIDE = 122,
        VEHICLE_SUB_TURN_LEFT_RIGHT = 123,
        VEHICLE_SUB_TURN_LEFT_ONLY = 124,
        VEHICLE_SUB_TURN_RIGHT_ONLY = 125,
        VEHICLE_SUB_PITCH_UP_DOWN = 126,
        VEHICLE_SUB_PITCH_UP_ONLY = 127,
        VEHICLE_SUB_PITCH_DOWN_ONLY = 128,
        VEHICLE_SUB_THROTTLE_UP = 129,
        VEHICLE_SUB_THROTTLE_DOWN = 130,
        VEHICLE_SUB_ASCEND = 131,
        VEHICLE_SUB_DESCEND = 132,
        VEHICLE_SUB_TURN_HARD_LEFT = 133,
        VEHICLE_SUB_TURN_HARD_RIGHT = 134,
        VEHICLE_SUBMOUSE_CONTROL_OVERRIDE = 135,
        VEHICLE_PUSHBIKE_PEDAL = 136,
        VEHICLE_PUSHBIKE_SPRINT = 137,
        VEHICLE_PUSHBIKE_FRONT_BRAKE = 138,
        VEHICLE_PUSHBIKE_REAR_BRAKE = 139,
        MELEE_ATTACK_LIGHT = 140,
        MELEE_ATTACK_HEAVY = 141,
        MELEE_ATTACK_ALTERNATE = 142,
        MELEE_BLOCK = 143,
        PARACHUTE_DEPLOY = 144,
        PARACHUTE_DETACH = 145,
        PARACHUTE_TURN_LEFT_RIGHT = 146,
        PARACHUTE_TURN_LEFT_ONLY = 147,
        PARACHUTE_TURN_RIGHT_ONLY = 148,
        PARACHUTE_PITCH_UP_DOWN = 149,
        PARACHUTE_PITCH_UP_ONLY = 150,
        PARACHUTE_PITCH_DOWN_ONLY = 151,
        PARACHUTE_BRAKE_LEFT = 152,
        PARACHUTE_BRAKE_RIGHT = 153,
        PARACHUTE_SMOKE = 154,
        PARACHUTE_PRECISION_LANDING = 155,
        MAP = 156,
        SELECT_WEAPON_UNARMED = 157,
        SELECT_WEAPON_MELEE = 158,
        SELECT_WEAPON_HANDGUN = 159,
        SELECT_WEAPON_SHOTGUN = 160,
        SELECT_WEAPON_SMG = 161,
        SELECT_WEAPON_AUTO_RIFLE = 162,
        SELECT_WEAPON_SNIPER = 163,
        SELECT_WEAPON_HEAVY = 164,
        SELECT_WEAPON_SPECIAL = 165,
        SELECT_CHARACTER_MICHAEL = 166,
        SELECT_CHARACTER_FRANKLIN = 167,
        SELECT_CHARACTER_TREVOR = 168,
        SELECT_CHARACTER_MULTIPLAYER = 169,
        SAVE_REPLAY_CLIP = 170,
        SPECIAL_ABILITY_PC = 171,
        PHONE_UP = 172,
        PHONE_DOWN = 173,
        PHONE_LEFT = 174,
        PHONE_RIGHT = 175,
        PHONE_SELECT = 176,
        PHONE_CANCEL = 177,
        PHONE_OPTION = 178,
        PHONE_EXTRA_OPTION = 179,
        PHONE_SCROLL_FORWARD = 180,
        PHONE_SCROLL_BACKWARD = 181,
        PHONE_CAMERA_FOCUS_LOCK = 182,
        PHONE_CAMERA_GRID = 183,
        PHONE_CAMERA_SELFIE = 184,
        PHONE_CAMERA_DOF = 185,
        PHONE_CAMERA_EXPRESSION = 186,
        FRONTEND_DOWN = 187,
        FRONTEND_UP = 188,
        FRONTEND_LEFT = 189,
        FRONTEND_RIGHT = 190,
        FRONTEND_RDOWN = 191,
        FRONTEND_RUP = 192,
        FRONTEND_RLEFT = 193,
        FRONTEND_RRIGHT = 194,
        FRONTEND_AXIS_X = 195,
        FRONTEND_AXIS_Y = 196,
        FRONTEND_RIGHT_AXIS_X = 197,
        FRONTEND_RIGHT_AXIS_Y = 198,
        FRONTEND_PAUSE = 199,
        FRONTEND_PAUSE_ALTERNATE = 200,
        FRONTEND_ACCEPT = 201,
        FRONTEND_CANCEL = 202,
        FRONTEND_X = 203,
        FRONTEND_Y = 204,
        FRONTEND_LB = 205,
        FRONTEND_RB = 206,
        FRONTEND_LT = 207,
        FRONTEND_RT = 208,
        FRONTEND_LS = 209,
        FRONTEND_RS = 210,
        FRONTEND_LEADERBOARD = 211,
        FRONTEND_SOCIAL_CLUB = 212,
        FRONTEND_SOCIAL_CLUB_SECONDARY = 213,
        FRONTEND_DELETE = 214,
        FRONTEND_ENDSCREEN_ACCEPT = 215,
        FRONTEND_ENDSCREEN_EXPAND = 216,
        FRONTEND_SELECT = 217,
        SCRIPT_LEFT_AXIS_X = 218,
        SCRIPT_LEFT_AXIS_Y = 219,
        SCRIPT_RIGHT_AXIS_X = 220,
        SCRIPT_RIGHT_AXIS_Y = 221,
        SCRIPT_RUP = 222,
        SCRIPT_RDOWN = 223,
        SCRIPT_RLEFT = 224,
        SCRIPT_RRIGHT = 225,
        SCRIPT_LB = 226,
        SCRIPT_RB = 227,
        SCRIPT_LT = 228,
        SCRIPT_RT = 229,
        SCRIPT_LS = 230,
        SCRIPT_RS = 231,
        SCRIPT_PAD_UP = 232,
        SCRIPT_PAD_DOWN = 233,
        SCRIPT_PAD_LEFT = 234,
        SCRIPT_PAD_RIGHT = 235,
        SCRIPT_SELECT = 236,
        CURSOR_ACCEPT = 237,
        CURSOR_CANCEL = 238,
        CURSOR_X = 239,
        CURSOR_Y = 240,
        CURSOR_SCROLL_UP = 241,
        CURSOR_SCROLL_DOWN = 242,
        ENTER_CHEAT_CODE = 243,
        INTERACTION_MENU = 244,
        MP_TEXT_CHAT_ALL = 245,
        MP_TEXT_CHAT_TEAM = 246,
        MP_TEXT_CHAT_FRIENDS = 247,
        MP_TEXT_CHAT_CREW = 248,
        PUSH_TO_TALK = 249,
        CREATOR_LS = 250,
        CREATOR_RS = 251,
        CREATOR_LT = 252,
        CREATOR_RT = 253,
        CREATOR_MENU_TOGGLE = 254,
        CREATOR_ACCEPT = 255,
        CREATOR_DELETE = 256,
        ATTACK_2 = 257,
        RAPPEL_JUMP = 258,
        RAPPEL_LONG_JUMP = 259,
        RAPPEL_SMASH_WINDOW = 260,
        PREV_WEAPON = 261,
        NEXT_WEAPON = 262,
        MELEE_ATTACK1 = 263,
        MELEE_ATTACK2 = 264,
        WHISTLE = 265,
        MOVE_LEFT = 266,
        MOVE_RIGHT = 267,
        MOVE_UP = 268,
        MOVE_DOWN = 269,
        LOOK_LEFT = 270,
        LOOK_RIGHT = 271,
        LOOK_UP = 272,
        LOOK_DOWN = 273,
        SNIPER_ZOOM_IN = 274,
        SNIPER_ZOOM_OUT = 275,
        SNIPER_ZOOM_IN_ALTERNATE = 276,
        SNIPER_ZOOM_OUT_ALTERNATE = 277,
        VEHICLE_MOVE_LEFT = 278,
        VEHICLE_MOVE_RIGHT = 279,
        VEHICLE_MOVE_UP = 280,
        VEHICLE_MOVE_DOWN = 281,
        VEHICLE_GUN_LEFT = 282,
        VEHICLE_GUN_RIGHT = 283,
        VEHICLE_GUN_UP = 284,
        VEHICLE_GUN_DOWN = 285,
        VEHICLE_LOOK_LEFT = 286,
        VEHICLE_LOOK_RIGHT = 287,
        REPLAY_START_STOP_RECORDING = 288,
        REPLAY_START_STOP_RECORDING_SECONDARY = 289,
        SCALED_LOOK_LEFT_RIGHT = 290,
        SCALED_LOOK_UP_DOWN = 291,
        SCALED_LOOK_UP_ONLY = 292,
        SCALED_LOOK_DOWN_ONLY = 293,
        SCALED_LOOK_LEFT_ONLY = 294,
        SCALED_LOOK_RIGHT_ONLY = 295,
        REPLAY_MARKER_DELETE = 296,
        REPLAY_CLIP_DELETE = 297,
        REPLAY_PAUSE = 298,
        REPLAY_REWIND = 299,
        REPLAY_FFWD = 300,
        REPLAY_NEWMARKER = 301,
        REPLAY_RECORD = 302,
        REPLAY_SCREENSHOT = 303,
        REPLAY_HIDEHUD = 304,
        REPLAY_STARTPOINT = 305,
        REPLAY_ENDPOINT = 306,
        REPLAY_ADVANCE = 307,
        REPLAY_BACK = 308,
        REPLAY_TOOLS = 309,
        REPLAY_RESTART = 310,
        REPLAY_SHOWHOTKEY = 311,
        REPLAY_CYCLE_MARKER_LEFT = 312,
        REPLAY_CYCLE_MARKER_RIGHT = 313,
        REPLAY_FOV_INCREASE = 314,
        REPLAY_FOV_DECREASE = 315,
        REPLAY_CAMERA_UP = 316,
        REPLAY_CAMERA_DOWN = 317,
        REPLAY_SAVE = 318,
        REPLAY_TOGGLETIME = 319,
        REPLAY_TOGGLETIPS = 320,
        REPLAY_PREVIEW = 321,
        REPLAY_TOGGLE_TIMELINE = 322,
        REPLAY_TIMELINE_PICKUP_CLIP = 323,
        REPLAY_TIMELINE_DUPLICATE_CLIP = 324,
        REPLAY_TIMELINE_PLACE_CLIP = 325,
        REPLAY_CTRL = 326,
        REPLAY_TIMELINE_SAVE = 327,
        REPLAY_PREVIEW_AUDIO = 328,
        VEHICLE_DRIVE_LOOK = 329,
        VEHICLE_DRIVE_LOOK2 = 330,
        VEHICLE_FLY_ATTACK2 = 331,
        RADIO_WHEEL_UP_DOWN = 332,
        RADIO_WHEEL_LEFT_RIGHT = 333,
        VEHICLE_SLOW_MO_UP_DOWN = 334,
        VEHICLE_SLOW_MO_UP_ONLY = 335,
        VEHICLE_SLOW_MO_DOWN_ONLY = 336,
        VEHICLE_HYDRAULICS_CONTROL_TOGGLE = 337,
        VEHICLE_HYDRAULICS_CONTROL_LEFT = 338,
        VEHICLE_HYDRAULICS_CONTROL_RIGHT = 339,
        VEHICLE_HYDRAULICS_CONTROL_UP = 340,
        VEHICLE_HYDRAULICSVCONTROL_DOWN = 341,
        VEHICLE_HYDRAULICS_CONTROL_LEFT_RIGHT = 342,
        VEHICLE_HYDRAULICS_CONTROL_UPDOWN = 343,
        SWITCH_VISOR = 344,
        VEHICLE_MELEE_HOLD = 345,
        VEHICLE_MELEE_LEFT = 346,
        VEHICLE_MELEE_RIGHT = 347,
        MAP_POINT_OF_INTEREST = 348,
        REPLAY_SNAPMATIC_PHOTO = 349,
        VEHICLE_CAR_JUMP = 350,
        VEHICLE_ROCKET_BOOST = 351,
        VEHICLE_PARACHUTE = 352,
        VEHICLE_BIKE_WINGS = 353,
        VEHICLE_FLY_BOMBBAY = 354,
        VEHICLE_FLY_COUNTER = 355,
        VEHICLE_FLY_TRANSFORM = 356,
        QUAD_LOCO_REVERSE = 357,
        RESPAWN_FASTER = 358,
        HUDMARKER_SELECT = 359
    }
}
declare module "src/core/shared/enums/effects" {
    const _default_29: {
        EFFECT_HEAL: string;
        EFFECT_FOOD: string;
        EFFECT_WATER: string;
    };
    export default _default_29;
}
declare module "src/core/shared/enums/hudComponents" {
    export enum HUD_COMPONENT {
        HEALTH = "health",
        ARMOUR = "armour",
        CASH = "cash",
        BANK = "bank",
        TIME = "time",
        WATER = "water",
        FOOD = "food",
        DEAD = "dead",
        IDENTIFIER = "identifier",
        MICROPHONE = "microphone",
        INTERACTIONS = "interactions",
        IS_IN_VEHICLE = "isInVehicle",
        SEATBELT = "seatbelt",
        SPEED = "speed",
        SPEED_UNIT = "unit",
        GEAR = "gear",
        ENGINE = "engine",
        LOCK = "lock",
        METRIC = "isMetric",
        FUEL = "fuel"
    }
}
declare module "src/core/shared/enums/notificationIcons" {
    export enum NOTIFICATION_ICON {
        Abigail = "CHAR_ABIGAIL",
        AllPlayersConf = "CHAR_ALL_PLAYERS_CONF",
        Amanda = "CHAR_AMANDA",
        Ammunation = "CHAR_AMMUNATION",
        Andreas = "CHAR_ANDREAS",
        Antonia = "CHAR_ANTONIA",
        Arthur = "CHAR_ARTHUR",
        Ashley = "CHAR_ASHLEY",
        BankBol = "CHAR_BANK_BOL",
        BankFleeca = "CHAR_BANK_FLEECA",
        BankMaze = "CHAR_BANK_MAZE",
        Barry = "CHAR_BARRY",
        Beverly = "CHAR_BEVERLY",
        Bikesite = "CHAR_BIKESITE",
        BlankEntry = "CHAR_BLANK_ENTRY",
        Blimp = "CHAR_BLIMP",
        Blocked = "CHAR_BLOCKED",
        Boatsite = "CHAR_BOATSITE",
        BrokenDownGirl = "CHAR_BROKEN_DOWN_GIRL",
        Bugstars = "CHAR_BUGSTARS",
        Call911 = "CHAR_CALL911",
        Carsite = "CHAR_CARSITE",
        Carsite2 = "CHAR_CARSITE2",
        Castro = "CHAR_CASTRO",
        ChatCall = "CHAR_CHAT_CALL",
        Chef = "CHAR_CHEF",
        Cheng = "CHAR_CHENG",
        Chengsr = "CHAR_CHENGSR",
        Chop = "CHAR_CHOP",
        Cris = "CHAR_CRIS",
        Dave = "CHAR_DAVE",
        Default = "CHAR_DEFAULT",
        Denise = "CHAR_DENISE",
        DetonateBomb = "CHAR_DETONATEBOMB",
        DetonatePhone = "CHAR_DETONATEPHONE",
        Devin = "CHAR_DEVIN",
        DialASub = "CHAR_DIAL_A_SUB",
        Dom = "CHAR_DOM",
        DomesticGirl = "CHAR_DOMESTIC_GIRL",
        Dreyfuss = "CHAR_DREYFUSS",
        DrFriedlander = "CHAR_DR_FRIEDLANDER",
        Epsilon = "CHAR_EPSILON",
        EstateAgent = "CHAR_ESTATE_AGENT",
        Facebook = "CHAR_FACEBOOK",
        FilmNoir = "CHAR_FILMNOIR",
        Floyd = "CHAR_FLOYD",
        Franklin = "CHAR_FRANKLIN",
        FrankTrevConf = "CHAR_FRANK_TREV_CONF",
        Gaymilitary = "CHAR_GAYMILITARY",
        Hao = "CHAR_HAO",
        HitcherGirl = "CHAR_HITCHER_GIRL",
        HumanDefault = "CHAR_HUMANDEFAULT",
        Hunter = "CHAR_HUNTER",
        Jimmy = "CHAR_JIMMY",
        JimmyBoston = "CHAR_JIMMY_BOSTON",
        Joe = "CHAR_JOE",
        Josef = "CHAR_JOSEF",
        Josh = "CHAR_JOSH",
        Lamar = "CHAR_LAMAR",
        Lazlow = "CHAR_LAZLOW",
        Lester = "CHAR_LESTER",
        LesterDeathwish = "CHAR_LESTER_DEATHWISH",
        LesFrankConf = "CHAR_LEST_FRANK_CONF",
        LesMikeConf = "CHAR_LEST_MIKE_CONF",
        Lifeinvader = "CHAR_LIFEINVADER",
        LsCustoms = "CHAR_LS_CUSTOMS",
        LsTouristBoard = "CHAR_LS_TOURIST_BOARD",
        Manuel = "CHAR_MANUEL",
        Marnie = "CHAR_MARNIE",
        Martin = "CHAR_MARTIN",
        MaryAnn = "CHAR_MARY_ANN",
        Maude = "CHAR_MAUDE",
        Mechanic = "CHAR_MECHANIC",
        Michael = "CHAR_MICHAEL",
        MikeFrankConf = "CHAR_MIKE_FRANK_CONF",
        MikeTrevConf = "CHAR_MIKE_TREV_CONF",
        Milsite = "CHAR_MILSITE",
        Minotaur = "CHAR_MINOTAUR",
        Molly = "CHAR_MOLLY",
        MpArmyContact = "CHAR_MP_ARMY_CONTACT",
        MpBikerBoss = "CHAR_MP_BIKER_BOSS",
        MpBikerMechanic = "CHAR_MP_BIKER_MECHANIC",
        MpBrucie = "CHAR_MP_BRUCIE",
        MpDetonatePhone = "CHAR_MP_DETONATEPHONE",
        MpFamBoss = "CHAR_MP_FAM_BOSS",
        MpFIBContact = "CHAR_MP_FIB_CONTACT",
        MpFmContact = "CHAR_MP_FM_CONTACT",
        MpGerald = "CHAR_MP_GERALD",
        MpJulio = "CHAR_MP_JULIO",
        MpMechanic = "CHAR_MP_MECHANIC",
        MpMerryweather = "CHAR_MP_MERRYWEATHER",
        MpMexBoss = "CHAR_MP_MEX_BOSS",
        MpMexDocks = "CHAR_MP_MEX_DOCKS",
        MpMexLt = "CHAR_MP_MEX_LT",
        MpMorsMutual = "CHAR_MP_MORS_MUTUAL",
        MpProfBoss = "CHAR_MP_PROF_BOSS",
        MpRayLavoy = "CHAR_MP_RAY_LAVOY",
        MpRoberto = "CHAR_MP_ROBERTO",
        MpSnitch = "CHAR_MP_SNITCH",
        MpStretch = "CHAR_MP_STRETCH",
        MpStripclubPr = "CHAR_MP_STRIPCLUB_PR",
        MrsThornhill = "CHAR_MRS_THORNHILL",
        Multiplayer = "CHAR_MULTIPLAYER",
        Nigel = "CHAR_NIGEL",
        Omega = "CHAR_OMEGA",
        Oneil = "CHAR_ONEIL",
        Ortega = "CHAR_ORTEGA",
        Oscar = "CHAR_OSCAR",
        Patricia = "CHAR_PATRICIA",
        PegasusDelivery = "CHAR_PEGASUS_DELIVERY",
        Planesite = "CHAR_PLANESITE",
        PropertyArmsTrafficking = "CHAR_PROPERTY_ARMS_TRAFFICKING",
        PropertyBarAirport = "CHAR_PROPERTY_BAR_AIRPORT",
        PropertyBarBayview = "CHAR_PROPERTY_BAR_BAYVIEW",
        PropertyBarCafeRojo = "CHAR_PROPERTY_BAR_CAFE_ROJO",
        PropertyBarCockotoos = "CHAR_PROPERTY_BAR_COCKOTOOS",
        PropertyBarEclipse = "CHAR_PROPERTY_BAR_ECLIPSE",
        PropertyBarFes = "CHAR_PROPERTY_BAR_FES",
        PropertyBarHenHouse = "CHAR_PROPERTY_BAR_HEN_HOUSE",
        PropertyBarHiMen = "CHAR_PROPERTY_BAR_HI_MEN",
        PropertyBarHookies = "CHAR_PROPERTY_BAR_HOOKIES",
        PropertyBarIrish = "CHAR_PROPERTY_BAR_IRISH",
        PropertyBarLesBianco = "CHAR_PROPERTY_BAR_LES_BIANCO",
        PropertyBarMirrorPark = "CHAR_PROPERTY_BAR_MIRROR_PARK",
        PropertyBarPitchers = "CHAR_PROPERTY_BAR_PITCHERS",
        PropertyBarSingletons = "CHAR_PROPERTY_BAR_SINGLETONS",
        PropertyBarTequilala = "CHAR_PROPERTY_BAR_TEQUILALA",
        PropertyBarUnbranded = "CHAR_PROPERTY_BAR_UNBRANDED",
        PropertyCarModShop = "CHAR_PROPERTY_CAR_MOD_SHOP",
        PropertyCarScrapYard = "CHAR_PROPERTY_CAR_SCRAP_YARD",
        PropertyCinemaDowntown = "CHAR_PROPERTY_CINEMA_DOWNTOWN",
        PropertyCinemaMorningwood = "CHAR_PROPERTY_CINEMA_MORNINGWOOD",
        PropertyCinemaVinewood = "CHAR_PROPERTY_CINEMA_VINEWOOD",
        PropertyGolfClub = "CHAR_PROPERTY_GOLF_CLUB",
        PropertyPlaneScrapYard = "CHAR_PROPERTY_PLANE_SCRAP_YARD",
        PropertySonarCollections = "CHAR_PROPERTY_SONAR_COLLECTIONS",
        PropertyTaxiLot = "CHAR_PROPERTY_TAXI_LOT",
        PropertyTowingImpound = "CHAR_PROPERTY_TOWING_IMPOUND",
        PropertyWeedShop = "CHAR_PROPERTY_WEED_SHOP",
        Ron = "CHAR_RON",
        Saeeda = "CHAR_SAEEDA",
        Sasquatch = "CHAR_SASQUATCH",
        Simeon = "CHAR_SIMEON",
        SocialClub = "CHAR_SOCIAL_CLUB",
        Solomon = "CHAR_SOLOMON",
        Steve = "CHAR_STEVE",
        SteveMikeConf = "CHAR_STEVE_MIKE_CONF",
        SteveTrevConf = "CHAR_STEVE_TREV_CONF",
        Stretch = "CHAR_STRETCH",
        StripperChastity = "CHAR_STRIPPER_CHASTITY",
        StripperCheetah = "CHAR_STRIPPER_CHEETAH",
        StripperFufu = "CHAR_STRIPPER_FUFU",
        StripperInfernus = "CHAR_STRIPPER_INFERNUS",
        StripperJuliet = "CHAR_STRIPPER_JULIET",
        StripperNikki = "CHAR_STRIPPER_NIKKI",
        StripperPeach = "CHAR_STRIPPER_PEACH",
        StripperSapphire = "CHAR_STRIPPER_SAPPHIRE",
        Tanisha = "CHAR_TANISHA",
        Taxi = "CHAR_TAXI",
        TaxiLiz = "CHAR_TAXI_LIZ",
        TennisCoach = "CHAR_TENNIS_COACH",
        TowTonya = "CHAR_TOW_TONYA",
        Tracey = "CHAR_TRACEY",
        Trevor = "CHAR_TREVOR",
        Wade = "CHAR_WADE",
        YouTube = "CHAR_YOUTUBE",
        CreatorPortraits = "CHAR_CREATOR_PORTRAITS"
    }
}
declare module "src/core/shared/enums/vehicleSyncedMeta" {
    export const VEHICLE_SYNCED_META: {
        DATABASE_ID: string;
    };
}
declare module "src/core/shared/information/eyebrows" {
    export const eyebrowNames: string[];
}
declare module "src/core/shared/information/facialHair" {
    export const facialHairNames: string[];
}
declare module "src/core/shared/information/hairColors" {
    export const hairColors: string[];
}
declare module "src/core/shared/information/keyboardMap" {
    const _default_30: string[];
    export default _default_30;
}
declare module "src/core/shared/information/makeup" {
    export const makeup: {
        name: string;
        id: number;
        labels: string[];
    }[];
}
declare module "src/core/shared/information/makeupColors" {
    export const makeupColors: string[];
}
declare module "src/core/shared/interfaces/vehicleHandling" {
    export default interface IVehicleHandling {
        acceleration: number;
        antiRollBarBiasFront: number;
        antiRollBarBiasRear: number;
        antiRollBarForce: number;
        brakeBiasFront: number;
        brakeBiasRear: number;
        brakeForce: number;
        camberStiffness: number;
        centreOfMassOffset: {
            x: number;
            y: number;
            z: number;
        };
        clutchChangeRateScaleDownShift: number;
        clutchChangeRateScaleUpShift: number;
        collisionDamageMult: number;
        deformationDamageMult: number;
        downforceModifier: number;
        driveBiasFront: number;
        driveInertia: number;
        driveMaxFlatVel: number;
        engineDamageMult: number;
        handBrakeForce: number;
        handlingFlags: number;
        initialDragCoeff: number;
        initialDriveForce: number;
        initialDriveGears: number;
        initialDriveMaxFlatVel: number;
        lowSpeedTractionLossMult: number;
        rollCentreHeightFront: number;
        rollCentreHeightRear: number;
        steeringLock: number;
        steeringLockRatio: number;
        suspensionBiasFront: number;
        suspensionBiasRear: number;
        suspensionCompDamp: number;
        suspensionForce: number;
        suspensionLowerLimit: number;
        suspensionRaise: number;
        suspensionReboundDamp: number;
        suspensionUpperLimit: number;
        tractionBiasFront: number;
        tractionBiasRear: number;
        tractionCurveLateral: number;
        tractionCurveLateralRatio: number;
        tractionCurveMax: number;
        tractionCurveMaxRatio: number;
        tractionCurveMin: number;
        tractionCurveMinRatio: number;
        tractionLossMult: number;
        tractionSpringDeltaMax: number;
        tractionSpringDeltaMaxRatio: number;
        weaponDamageMult: number;
    }
}
declare module "src/core/shared/utility/array" {
    export function findMissingElements<T>(a: Array<T>, b: Array<T>, propertyName: string): Array<T>;
}
declare module "src/core/shared/utility/classCheck" {
    export default function isFunction(funcOrClass: ClassDecorator | Function): boolean;
}
declare module "src/core/shared/utility/complete" {
    export type Complete<T> = {
        [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
    };
}
declare module "src/core/shared/utility/keyCodes" {
    export const KeyCodes: {
        '9': string;
        '12': string;
        '13': string;
        '16': string;
        '17': string;
        '18': string;
        '19': string;
        '20': string;
        '27': string;
        '32': string;
        '33': string;
        '34': string;
        '35': string;
        '36': string;
        '37': string;
        '38': string;
        '39': string;
        '40': string;
        '44': string;
        '45': string;
        '46': string;
        '48': string;
        '49': string;
        '50': string;
        '51': string;
        '52': string;
        '53': string;
        '54': string;
        '55': string;
        '56': string;
        '57': string;
        '65': string;
        '66': string;
        '67': string;
        '68': string;
        '69': string;
        '70': string;
        '71': string;
        '72': string;
        '73': string;
        '74': string;
        '75': string;
        '76': string;
        '77': string;
        '78': string;
        '79': string;
        '80': string;
        '81': string;
        '82': string;
        '83': string;
        '84': string;
        '85': string;
        '86': string;
        '87': string;
        '88': string;
        '89': string;
        '90': string;
        '93': string;
        '96': string;
        '97': string;
        '98': string;
        '99': string;
        '100': string;
        '101': string;
        '102': string;
        '103': string;
        '104': string;
        '105': string;
        '106': string;
        '107': string;
        '109': string;
        '110': string;
        '111': string;
        '112': string;
        '113': string;
        '114': string;
        '115': string;
        '116': string;
        '117': string;
        '118': string;
        '119': string;
        '120': string;
        '121': string;
        '122': string;
        '123': string;
        '124': string;
        '125': string;
        '126': string;
        '127': string;
        '128': string;
        '129': string;
        '130': string;
        '131': string;
        '132': string;
        '133': string;
        '134': string;
        '135': string;
        '144': string;
        '145': string;
        '186': string;
        '187': string;
        '188': string;
        '189': string;
        '190': string;
        '192': string;
        '194': string;
        '219': string;
        '220': string;
        '221': string;
        '222': string;
    };
}
declare module "src/core/shared/utility/requiredFields" {
    export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
}
declare module "src-webviews/vite.config" {
    const _default_31: import("vite").UserConfigExport;
    export default _default_31;
}
declare module "src-webviews/src/plugins/vue-plugin-imports" {
    export const VUE_PLUGIN_IMPORTS: any[];
}
declare module "src-webviews/src/main" {
    export class ComponentRegistration {
        static init(): void;
    }
}
declare module "src-webviews/src/exampleData/Icons" {
    const _default_32: string[];
    export default _default_32;
}
declare module "src-webviews/src/interfaces/IPageData" {
    import { DefineComponent } from 'vue';
    export default interface IPageData {
        name: string;
        component: DefineComponent;
    }
}
declare module "src-webviews/src/pages/components" {
    export const CORE_IMPORTS: {
        Actions: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        Audio: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        Designs: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        Icons: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        InputBox: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        Job: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        StateTest: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        WheelMenu: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
    };
}
declare module "src-webviews/src/pages/actions/interfaces/IAction" {
    export default interface IAction {
        eventName: string;
        args: Array<unknown>;
        isServer: boolean;
    }
}
declare module "src-webviews/src/pages/actions/utility/defaultData" {
    const _default_33: {
        Vehicle: {
            'Driver Seat': {
                eventName: string;
                args: any[];
                isServer: boolean;
            };
            Doors: {
                'Driver Door': {
                    eventName: string;
                    args: number[];
                };
                'MORE DOORS': {
                    'Driver Door': {
                        eventName: string;
                        args: number[];
                    };
                    'MORE MORE DOORS': {
                        'Driver Door': {
                            eventName: string;
                            args: number[];
                        };
                        'MORE MORE MORE DOORS': {
                            'Driver Door': {
                                eventName: string;
                                args: number[];
                            };
                            'MORE MORE MORE MORE DOORS': {
                                'Driver Door': {
                                    eventName: string;
                                    args: number[];
                                };
                            };
                        };
                    };
                };
            };
        };
        'Fuel Pump': {
            'Fill Closest Vehicle': {
                eventName: string;
                args: any[];
            };
        };
        House: {
            'Enter House': {
                eventName: string;
                args: any[];
            };
        };
    };
    export default _default_33;
}
declare module "src-webviews/src/pages/input/utility/testData" {
    const _default_34: ({
        id: string;
        desc: string;
        type: string;
        placeholder: string;
        error: string;
        regex: RegExp;
        choices?: undefined;
    } | {
        id: string;
        desc: string;
        type: string;
        placeholder: number;
        error: string;
        regex: RegExp;
        choices?: undefined;
    } | {
        id: string;
        desc: string;
        type: string;
        placeholder: string;
        error?: undefined;
        regex?: undefined;
        choices?: undefined;
    } | {
        id: string;
        desc: string;
        type: string;
        placeholder: string;
        error: string;
        choices: ({
            text: string;
            value: string;
            values?: undefined;
        } | {
            text: string;
            values: string;
            value?: undefined;
        })[];
        regex?: undefined;
    })[];
    export default _default_34;
}
declare module "src-webviews/src/plugins/imports" {
    export const PLUGIN_IMPORTS: {
        CharSelect: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        CharacterCreator: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        Chat: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        Inventory: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        PauseMenu: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        KeybindMenu: import("vue").ShallowRef<import("vue").DefineComponent<{}, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
    };
}
declare module "src-webviews/src/utility/drag" {
    export type OnFinishDrag = (startType: string, startIndex: number, endType: string, endIndex: number) => void;
    export type DragInfo = (type: string, index: number) => void;
    export type Draggable = {
        endDrag: OnFinishDrag;
        canBeDragged?: boolean;
        singleClick?: DragInfo;
        startDrag?: DragInfo;
    };
    function makeDraggable(ev: MouseEvent, draggable: Draggable): void;
    function removeEvents(): void;
    export { makeDraggable, removeEvents };
}
declare module "src-webviews/src/utility/webViewEvents" {
    export default class WebViewEvents {
        static emitClose(): void;
        static emitReady(pageName: string, ...args: any[]): void;
        static emitServer<EventNames = string>(eventName: EventNames, ...args: any[]): void;
        static emitClient<EventNames = string>(eventName: EventNames, ...args: any[]): void;
        static on<EventNames = string, Callback = (...args: any[]) => void>(eventName: EventNames, callback: Callback): any;
        static playSound(soundName: string, volume: number, soundInstantID?: string): void;
        static playSoundFrontend(audioName: string, ref: string): void;
    }
}

`;
