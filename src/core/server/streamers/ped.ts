import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';

import { IPed } from '../../shared/interfaces/iPed';
import { Animation } from '../../shared/interfaces/animation';
import { StreamerService } from '../systems/streamer';
import { sha256Random } from '../utility/encryption';
import { Athena } from '../api/athena';

import { Task } from '../../shared/interfaces/taskTimeline';
import { TaskCallback } from '../../shared/interfaces/taskTimeline';

import { iPedAttachable } from '../../shared/interfaces/iPedAttachable';
import { Weapon } from '../../shared/information/weaponList';
import { IVehicle } from '../../shared/interfaces/iVehicle';
import { SeatIndexes } from '../../shared/enums/seatIndexes';
import IAttachable from '../../shared/interfaces/iAttachable';
import { ForceTypes } from '../../shared/enums/forceTypes';
import { IPedDamage } from '../../shared/interfaces/IPedDamage';
import { IAmbientSpeech } from '../../shared/interfaces/IAmbientSpeech';


const globalPeds: Array<IPed> = [];
const KEY = 'peds';


type aimCallback = (player: alt.Player) => void;
type damageCallback = (sourcePlayer: alt.Player, weaponHash: number, damage: number, bone: number | null) => {};
var deathCallbacks: { [uid: string]: Function } = {};
var aimCallbacks: { [uid: string]: aimCallback } = {};
var damageCallbacks: { [uid: string]: damageCallback } = {};

var syncData: {
    tasks: { [uid: string]: Array<Task | TaskCallback> };
    damages: { [uid: string]: Array<IPedDamage> };
    positions: { [uid: string]: alt.Vector3 };
    equipped: { [uid: string]: boolean };
} = undefined;

export enum ePedBoneId {
    SKEL_ROOT = 0x0,
    SKEL_Pelvis = 0x2e28,
    SKEL_L_Thigh = 0xe39f,
    SKEL_L_Calf = 0xf9bb,
    SKEL_L_Foot = 0x3779,
    SKEL_L_Toe0 = 0x83c,
    EO_L_Foot = 0x84c5,
    EO_L_Toe = 0x68bd,
    IK_L_Foot = 0xfedd,
    PH_L_Foot = 0xe175,
    MH_L_Knee = 0xb3fe,
    SKEL_R_Thigh = 0xca72,
    SKEL_R_Calf = 0x9000,
    SKEL_R_Foot = 0xcc4d,
    SKEL_R_Toe0 = 0x512d,
    EO_R_Foot = 0x1096,
    EO_R_Toe = 0x7163,
    IK_R_Foot = 0x8aae,
    PH_R_Foot = 0x60e6,
    MH_R_Knee = 0x3fcf,
    RB_L_ThighRoll = 0x5c57,
    RB_R_ThighRoll = 0x192a,
    SKEL_Spine_Root = 0xe0fd,
    SKEL_Spine0 = 0x5c01,
    SKEL_Spine1 = 0x60f0,
    SKEL_Spine2 = 0x60f1,
    SKEL_Spine3 = 0x60f2,
    SKEL_L_Clavicle = 0xfcd9,
    SKEL_L_UpperArm = 0xb1c5,
    SKEL_L_Forearm = 0xeeeb,
    SKEL_L_Hand = 0x49d9,
    SKEL_L_Finger00 = 0x67f2,
    SKEL_L_Finger01 = 0xff9,
    SKEL_L_Finger02 = 0xffa,
    SKEL_L_Finger10 = 0x67f3,
    SKEL_L_Finger11 = 0x1049,
    SKEL_L_Finger12 = 0x104a,
    SKEL_L_Finger20 = 0x67f4,
    SKEL_L_Finger21 = 0x1059,
    SKEL_L_Finger22 = 0x105a,
    SKEL_L_Finger30 = 0x67f5,
    SKEL_L_Finger31 = 0x1029,
    SKEL_L_Finger32 = 0x102a,
    SKEL_L_Finger40 = 0x67f6,
    SKEL_L_Finger41 = 0x1039,
    SKEL_L_Finger42 = 0x103a,
    PH_L_Hand = 0xeb95,
    IK_L_Hand = 0x8cbd,
    RB_L_ForeArmRoll = 0xee4f,
    RB_L_ArmRoll = 0x1470,
    MH_L_Elbow = 0x58b7,
    SKEL_R_Clavicle = 0x29d2,
    SKEL_R_UpperArm = 0x9d4d,
    SKEL_R_Forearm = 0x6e5c,
    SKEL_R_Hand = 0xdead,
    SKEL_R_Finger00 = 0xe5f2,
    SKEL_R_Finger01 = 0xfa10,
    SKEL_R_Finger02 = 0xfa11,
    SKEL_R_Finger10 = 0xe5f3,
    SKEL_R_Finger11 = 0xfa60,
    SKEL_R_Finger12 = 0xfa61,
    SKEL_R_Finger20 = 0xe5f4,
    SKEL_R_Finger21 = 0xfa70,
    SKEL_R_Finger22 = 0xfa71,
    SKEL_R_Finger30 = 0xe5f5,
    SKEL_R_Finger31 = 0xfa40,
    SKEL_R_Finger32 = 0xfa41,
    SKEL_R_Finger40 = 0xe5f6,
    SKEL_R_Finger41 = 0xfa50,
    SKEL_R_Finger42 = 0xfa51,
    PH_R_Hand = 0x6f06,
    IK_R_Hand = 0x188e,
    RB_R_ForeArmRoll = 0xab22,
    RB_R_ArmRoll = 0x90ff,
    MH_R_Elbow = 0xbb0,
    SKEL_Neck_1 = 0x9995,
    SKEL_Head = 0x796e,
    IK_Head = 0x322c,
    FACIAL_facialRoot = 0xfe2c,
    FB_L_Brow_Out_000 = 0xe3db,
    FB_L_Lid_Upper_000 = 0xb2b6,
    FB_L_Eye_000 = 0x62ac,
    FB_L_CheekBone_000 = 0x542e,
    FB_L_Lip_Corner_000 = 0x74ac,
    FB_R_Lid_Upper_000 = 0xaa10,
    FB_R_Eye_000 = 0x6b52,
    FB_R_CheekBone_000 = 0x4b88,
    FB_R_Brow_Out_000 = 0x54c,
    FB_R_Lip_Corner_000 = 0x2ba6,
    FB_Brow_Centre_000 = 0x9149,
    FB_UpperLipRoot_000 = 0x4ed2,
    FB_UpperLip_000 = 0xf18f,
    FB_L_Lip_Top_000 = 0x4f37,
    FB_R_Lip_Top_000 = 0x4537,
    FB_Jaw_000 = 0xb4a0,
    FB_LowerLipRoot_000 = 0x4324,
    FB_LowerLip_000 = 0x508f,
    FB_L_Lip_Bot_000 = 0xb93b,
    FB_R_Lip_Bot_000 = 0xc33b,
    FB_Tongue_000 = 0xb987,
    RB_Neck_1 = 0x8b93,
    SPR_L_Breast = 0xfc8e,
    SPR_R_Breast = 0x885f,
    IK_Root = 0xdd1c,
    SKEL_Neck_2 = 0x5fd4,
    SKEL_Pelvis1 = 0xd003,
    SKEL_PelvisRoot = 0x45fc,
    SKEL_SADDLE = 0x9524,
    MH_L_CalfBack = 0x1013,
    MH_L_ThighBack = 0x600d,
    SM_L_Skirt = 0xc419,
    MH_R_CalfBack = 0xb013,
    MH_R_ThighBack = 0x51a3,
    SM_R_Skirt = 0x7712,
    SM_M_BackSkirtRoll = 0xdbb,
    SM_L_BackSkirtRoll = 0x40b2,
    SM_R_BackSkirtRoll = 0xc141,
    SM_M_FrontSkirtRoll = 0xcdbb,
    SM_L_FrontSkirtRoll = 0x9b69,
    SM_R_FrontSkirtRoll = 0x86f1,
    SM_CockNBalls_ROOT = 0xc67d,
    SM_CockNBalls = 0x9d34,
    MH_L_Finger00 = 0x8c63,
    MH_L_FingerBulge00 = 0x5fb8,
    MH_L_Finger10 = 0x8c53,
    MH_L_FingerTop00 = 0xa244,
    MH_L_HandSide = 0xc78a,
    MH_Watch = 0x2738,
    MH_L_Sleeve = 0x933c,
    MH_R_Finger00 = 0x2c63,
    MH_R_FingerBulge00 = 0x69b8,
    MH_R_Finger10 = 0x2c53,
    MH_R_FingerTop00 = 0xef4b,
    MH_R_HandSide = 0x68fb,
    MH_R_Sleeve = 0x92dc,
    FACIAL_jaw = 0xb21,
    FACIAL_underChin = 0x8a95,
    FACIAL_L_underChin = 0x234e,
    FACIAL_chin = 0xb578,
    FACIAL_chinSkinBottom = 0x98bc,
    FACIAL_L_chinSkinBottom = 0x3e8f,
    FACIAL_R_chinSkinBottom = 0x9e8f,
    FACIAL_tongueA = 0x4a7c,
    FACIAL_tongueB = 0x4a7d,
    FACIAL_tongueC = 0x4a7e,
    FACIAL_tongueD = 0x4a7f,
    FACIAL_tongueE = 0x4a80,
    FACIAL_L_tongueE = 0x35f2,
    FACIAL_R_tongueE = 0x2ff2,
    FACIAL_L_tongueD = 0x35f1,
    FACIAL_R_tongueD = 0x2ff1,
    FACIAL_L_tongueC = 0x35f0,
    FACIAL_R_tongueC = 0x2ff0,
    FACIAL_L_tongueB = 0x35ef,
    FACIAL_R_tongueB = 0x2fef,
    FACIAL_L_tongueA = 0x35ee,
    FACIAL_R_tongueA = 0x2fee,
    FACIAL_chinSkinTop = 0x7226,
    FACIAL_L_chinSkinTop = 0x3eb3,
    FACIAL_chinSkinMid = 0x899a,
    FACIAL_L_chinSkinMid = 0x4427,
    FACIAL_L_chinSide = 0x4a5e,
    FACIAL_R_chinSkinMid = 0xf5af,
    FACIAL_R_chinSkinTop = 0xf03b,
    FACIAL_R_chinSide = 0xaa5e,
    FACIAL_R_underChin = 0x2bf4,
    FACIAL_L_lipLowerSDK = 0xb9e1,
    FACIAL_L_lipLowerAnalog = 0x244a,
    FACIAL_L_lipLowerThicknessV = 0xc749,
    FACIAL_L_lipLowerThicknessH = 0xc67b,
    FACIAL_lipLowerSDK = 0x7285,
    FACIAL_lipLowerAnalog = 0xd97b,
    FACIAL_lipLowerThicknessV = 0xc5bb,
    FACIAL_lipLowerThicknessH = 0xc5ed,
    FACIAL_R_lipLowerSDK = 0xa034,
    FACIAL_R_lipLowerAnalog = 0xc2d9,
    FACIAL_R_lipLowerThicknessV = 0xc6e9,
    FACIAL_R_lipLowerThicknessH = 0xc6db,
    FACIAL_nose = 0x20f1,
    FACIAL_L_nostril = 0x7322,
    FACIAL_L_nostrilThickness = 0xc15f,
    FACIAL_noseLower = 0xe05a,
    FACIAL_L_noseLowerThickness = 0x79d5,
    FACIAL_R_noseLowerThickness = 0x7975,
    FACIAL_noseTip = 0x6a60,
    FACIAL_R_nostril = 0x7922,
    FACIAL_R_nostrilThickness = 0x36ff,
    FACIAL_noseUpper = 0xa04f,
    FACIAL_L_noseUpper = 0x1fb8,
    FACIAL_noseBridge = 0x9ba3,
    FACIAL_L_nasolabialFurrow = 0x5aca,
    FACIAL_L_nasolabialBulge = 0xcd78,
    FACIAL_L_cheekLower = 0x6907,
    FACIAL_L_cheekLowerBulge1 = 0xe3fb,
    FACIAL_L_cheekLowerBulge2 = 0xe3fc,
    FACIAL_L_cheekInner = 0xe7ab,
    FACIAL_L_cheekOuter = 0x8161,
    FACIAL_L_eyesackLower = 0x771b,
    FACIAL_L_eyeball = 0x1744,
    FACIAL_L_eyelidLower = 0x998c,
    FACIAL_L_eyelidLowerOuterSDK = 0xfe4c,
    FACIAL_L_eyelidLowerOuterAnalog = 0xb9aa,
    FACIAL_L_eyelashLowerOuter = 0xd7f6,
    FACIAL_L_eyelidLowerInnerSDK = 0xf151,
    FACIAL_L_eyelidLowerInnerAnalog = 0x8242,
    FACIAL_L_eyelashLowerInner = 0x4ccf,
    FACIAL_L_eyelidUpper = 0x97c1,
    FACIAL_L_eyelidUpperOuterSDK = 0xaf15,
    FACIAL_L_eyelidUpperOuterAnalog = 0x67fa,
    FACIAL_L_eyelashUpperOuter = 0x27b7,
    FACIAL_L_eyelidUpperInnerSDK = 0xd341,
    FACIAL_L_eyelidUpperInnerAnalog = 0xf092,
    FACIAL_L_eyelashUpperInner = 0x9b1f,
    FACIAL_L_eyesackUpperOuterBulge = 0xa559,
    FACIAL_L_eyesackUpperInnerBulge = 0x2f2a,
    FACIAL_L_eyesackUpperOuterFurrow = 0xc597,
    FACIAL_L_eyesackUpperInnerFurrow = 0x52a7,
    FACIAL_forehead = 0x9218,
    FACIAL_L_foreheadInner = 0x843,
    FACIAL_L_foreheadInnerBulge = 0x767c,
    FACIAL_L_foreheadOuter = 0x8dcb,
    FACIAL_skull = 0x4221,
    FACIAL_foreheadUpper = 0xf7d6,
    FACIAL_L_foreheadUpperInner = 0xcf13,
    FACIAL_L_foreheadUpperOuter = 0x509b,
    FACIAL_R_foreheadUpperInner = 0xcef3,
    FACIAL_R_foreheadUpperOuter = 0x507b,
    FACIAL_L_temple = 0xaf79,
    FACIAL_L_ear = 0x19dd,
    FACIAL_L_earLower = 0x6031,
    FACIAL_L_masseter = 0x2810,
    FACIAL_L_jawRecess = 0x9c7a,
    FACIAL_L_cheekOuterSkin = 0x14a5,
    FACIAL_R_cheekLower = 0xf367,
    FACIAL_R_cheekLowerBulge1 = 0x599b,
    FACIAL_R_cheekLowerBulge2 = 0x599c,
    FACIAL_R_masseter = 0x810,
    FACIAL_R_jawRecess = 0x93d4,
    FACIAL_R_ear = 0x1137,
    FACIAL_R_earLower = 0x8031,
    FACIAL_R_eyesackLower = 0x777b,
    FACIAL_R_nasolabialBulge = 0xd61e,
    FACIAL_R_cheekOuter = 0xd32,
    FACIAL_R_cheekInner = 0x737c,
    FACIAL_R_noseUpper = 0x1cd6,
    FACIAL_R_foreheadInner = 0xe43,
    FACIAL_R_foreheadInnerBulge = 0x769c,
    FACIAL_R_foreheadOuter = 0x8fcb,
    FACIAL_R_cheekOuterSkin = 0xb334,
    FACIAL_R_eyesackUpperInnerFurrow = 0x9fae,
    FACIAL_R_eyesackUpperOuterFurrow = 0x140f,
    FACIAL_R_eyesackUpperInnerBulge = 0xa359,
    FACIAL_R_eyesackUpperOuterBulge = 0x1af9,
    FACIAL_R_nasolabialFurrow = 0x2caa,
    FACIAL_R_temple = 0xaf19,
    FACIAL_R_eyeball = 0x1944,
    FACIAL_R_eyelidUpper = 0x7e14,
    FACIAL_R_eyelidUpperOuterSDK = 0xb115,
    FACIAL_R_eyelidUpperOuterAnalog = 0xf25a,
    FACIAL_R_eyelashUpperOuter = 0xe0a,
    FACIAL_R_eyelidUpperInnerSDK = 0xd541,
    FACIAL_R_eyelidUpperInnerAnalog = 0x7c63,
    FACIAL_R_eyelashUpperInner = 0x8172,
    FACIAL_R_eyelidLower = 0x7fdf,
    FACIAL_R_eyelidLowerOuterSDK = 0x1bd,
    FACIAL_R_eyelidLowerOuterAnalog = 0x457b,
    FACIAL_R_eyelashLowerOuter = 0xbe49,
    FACIAL_R_eyelidLowerInnerSDK = 0xf351,
    FACIAL_R_eyelidLowerInnerAnalog = 0xe13,
    FACIAL_R_eyelashLowerInner = 0x3322,
    FACIAL_L_lipUpperSDK = 0x8f30,
    FACIAL_L_lipUpperAnalog = 0xb1cf,
    FACIAL_L_lipUpperThicknessH = 0x37ce,
    FACIAL_L_lipUpperThicknessV = 0x38bc,
    FACIAL_lipUpperSDK = 0x1774,
    FACIAL_lipUpperAnalog = 0xe064,
    FACIAL_lipUpperThicknessH = 0x7993,
    FACIAL_lipUpperThicknessV = 0x7981,
    FACIAL_L_lipCornerSDK = 0xb1c,
    FACIAL_L_lipCornerAnalog = 0xe568,
    FACIAL_L_lipCornerThicknessUpper = 0x7bc,
    FACIAL_L_lipCornerThicknessLower = 0xdd42,
    FACIAL_R_lipUpperSDK = 0x7583,
    FACIAL_R_lipUpperAnalog = 0x51cf,
    FACIAL_R_lipUpperThicknessH = 0x382e,
    FACIAL_R_lipUpperThicknessV = 0x385c,
    FACIAL_R_lipCornerSDK = 0xb3c,
    FACIAL_R_lipCornerAnalog = 0xee0e,
    FACIAL_R_lipCornerThicknessUpper = 0x54c3,
    FACIAL_R_lipCornerThicknessLower = 0x2bba,
    MH_MulletRoot = 0x3e73,
    MH_MulletScaler = 0xa1c2,
    MH_Hair_Scale = 0xc664,
    MH_Hair_Crown = 0x1675,
    SM_Torch = 0x8d6,
    FX_Light = 0x8959,
    FX_Light_Scale = 0x5038,
    FX_Light_Switch = 0xe18e,
    BagRoot = 0xad09,
    BagPivotROOT = 0xb836,
    BagPivot = 0x4d11,
    BagBody = 0xab6d,
    BagBone_R = 0x937,
    BagBone_L = 0x991,
    SM_LifeSaver_Front = 0x9420,
    SM_R_Pouches_ROOT = 0x2962,
    SM_R_Pouches = 0x4141,
    SM_L_Pouches_ROOT = 0x2a02,
    SM_L_Pouches = 0x4b41,
    SM_Suit_Back_Flapper = 0xda2d,
    SPR_CopRadio = 0x8245,
    SM_LifeSaver_Back = 0x2127,
    MH_BlushSlider = 0xa0ce,
    SKEL_Tail_01 = 0x347,
    SKEL_Tail_02 = 0x348,
    MH_L_Concertina_B = 0xc988,
    MH_L_Concertina_A = 0xc987,
    MH_R_Concertina_B = 0xc8e8,
    MH_R_Concertina_A = 0xc8e7,
    MH_L_ShoulderBladeRoot = 0x8711,
    MH_L_ShoulderBlade = 0x4eaf,
    MH_R_ShoulderBladeRoot = 0x3a0a,
    MH_R_ShoulderBlade = 0x54af,
    FB_R_Ear_000 = 0x6cdf,
    SPR_R_Ear = 0x63b6,
    FB_L_Ear_000 = 0x6439,
    SPR_L_Ear = 0x5b10,
    FB_TongueA_000 = 0x4206,
    FB_TongueB_000 = 0x4207,
    FB_TongueC_000 = 0x4208,
    SKEL_L_Toe1 = 0x1d6b,
    SKEL_R_Toe1 = 0xb23f,
    SKEL_Tail_03 = 0x349,
    SKEL_Tail_04 = 0x34a,
    SKEL_Tail_05 = 0x34b,
    SPR_Gonads_ROOT = 0xbfde,
    SPR_Gonads = 0x1c00,
    FB_L_Brow_Out_001 = 0xe3db,
    FB_L_Lid_Upper_001 = 0xb2b6,
    FB_L_Eye_001 = 0x62ac,
    FB_L_CheekBone_001 = 0x542e,
    FB_L_Lip_Corner_001 = 0x74ac,
    FB_R_Lid_Upper_001 = 0xaa10,
    FB_R_Eye_001 = 0x6b52,
    FB_R_CheekBone_001 = 0x4b88,
    FB_R_Brow_Out_001 = 0x54c,
    FB_R_Lip_Corner_001 = 0x2ba6,
    FB_Brow_Centre_001 = 0x9149,
    FB_UpperLipRoot_001 = 0x4ed2,
    FB_UpperLip_001 = 0xf18f,
    FB_L_Lip_Top_001 = 0x4f37,
    FB_R_Lip_Top_001 = 0x4537,
    FB_Jaw_001 = 0xb4a0,
    FB_LowerLipRoot_001 = 0x4324,
    FB_LowerLip_001 = 0x508f,
    FB_L_Lip_Bot_001 = 0xb93b,
    FB_R_Lip_Bot_001 = 0xc33b,
    FB_Tongue_001 = 0xb987,
}


interface TaskGotoCoordAnyMeansOptionals {
    speed?: number;
    walkingStyle?: number;
}

class Callbacks {
    static setDeathCallback(uid: string, callback: Function) {
        deathCallbacks[uid] = callback;
    }

    static deleteDeathCallback(uid: string) {
        delete deathCallbacks[uid];
    }

    static setAimCallback(uid: string, callback: aimCallback) {
        aimCallbacks[uid] = callback;
    }

    static deleteAimCallback(uid: string) {
        delete aimCallbacks[uid];
    }

    static setDamageCallback(uid: string, callback: damageCallback) {
        damageCallbacks[uid] = callback;
    }

    static deleteDamageCallback(uid: string) {
        delete damageCallbacks[uid];
    }
}

class Tasks {
    static async taskGotoCoordByAnyMeans(
        ped: IPed,
        pos: alt.Vector3,
        optionals?: TaskGotoCoordAnyMeansOptionals,
    ): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const callback = Athena.utility.hash.sha256Random('peds:TaskGotoCoordAnyMeans:' + ped.uid + ':');

            alt.onceClient(callback, (player) => {
                resolve(true);
            });

            if (optionals) {
                alt.emitAllClients(SYSTEM_EVENTS.PED_EMIT_TASK_TIMELINE, ped.uid, [
                    {
                        nativeName: 'taskGoToCoordAnyMeans',
                        params: [
                            pos.x,
                            pos.y,
                            pos.z,
                            optionals.speed ?? 1,
                            0,
                            false,
                            optionals.walkingStyle ?? 786603,
                            0,
                        ],
                    },
                ]);
            } else {
                alt.emitAllClients(SYSTEM_EVENTS.PED_EMIT_TASK_TIMELINE, ped.uid, [
                    {
                        nativeName: 'taskGoToCoordAnyMeans',
                        params: [pos.x, pos.y, pos.z, 1, 0, false, 786603, 0],
                    },
                ]);
            }
        });
    }

    /**
     *
     * @param ped
     * @param pos
     * @param duration ms
     */
    static async taskTurnPedToFaceCoord(ped: IPed, pos: alt.Vector3, duration = 800) {
        return new Promise((resolve, reject) => {
            const callback = Athena.utility.hash.sha256Random('peds:taskTurnPedToFaceCoord:' + ped.uid + ':');

            alt.onceClient(callback, (player) => {
                resolve(true);
            });

            alt.emitAllClients(
                SYSTEM_EVENTS.PED_EMIT_TASK_TIMELINE,
                ped.uid,
                [
                    {
                        nativeName: 'taskTurnPedToFaceCoord',
                        params: [pos.x, pos.y, pos.z, duration],
                        timeToWaitInMs: 0,
                    },
                ],
                callback,
            );
        });
    }

    /**
     * Force the pedestrian to perform an uncancellable task timeline.
     * @param {Array<Task | TaskCallback>} tasks
     */
    static async taskTimeline(
        ped: IPed,
        tasks: Array<Task>,
        callback?: TaskCallback | null,
        vehicleID?: string | null,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const callbackName = Athena.utility.hash.sha256Random(`OmegaPed:taskTimeline:${Date.now()}:`);
            alt.onceClient(callbackName, (player) => {
                resolve();
            });
            alt.emitAllClients(SYSTEM_EVENTS.PED_EMIT_TASK_TIMELINE, ped.uid, tasks, callbackName ?? null);
        });
    }
}


export class PedController {
        /**
     * Initialize the PedController Streamer Service
     * @static
     * @memberof PedController
     */
    
    static globalPeds: Array<IPed> = [];
    private static speechCooldown = 3000; //3mp
    private static pedSpeechTimes: { [uid: string]: number } = {};
    private static waitingEmits: Array<{ eventName: string; args: any[] }> = [];
    private static attachedObjects: Array<iPedAttachable> = [];
    private static notAttachedObjects: Array<iPedAttachable> = [];


    static init() {
        StreamerService.registerCallback(KEY, PedController.update);
    }

    /**
     * Refresh all global pedestrians.
     * @static
     * @memberof PedController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalPeds);
    }

    /**
     * Create a global static ped for the server.
     * @static
     * @param {IPed} pedData
     * @return {string} uid for the ped
     * @memberof PedController
     */
    static append(pedData: IPed): string {
        if (!pedData.uid) {
            pedData.uid = sha256Random(JSON.stringify(pedData));
        }

        globalPeds.push(pedData);
        PedController.refresh();
        return pedData.uid;
    }

    /**
     * Remove a global pedestrian
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof PedController
     */
    static remove(uid: string): boolean {
        const index = globalPeds.findIndex((ped) => ped.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalPeds.splice(index, 1);
        PedController.refresh();
        alt.emitAllClients(SYSTEM_EVENTS.REMOVE_GLOBAL_PED, uid);
        return true;
    }

    /**
     * Remove a pedestrian from a player.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof PedController
     */
    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for ped removal. PedController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_PED, uid);
    }

    /**
     * Add a single ped that only a single player can see
     * @static
     * @param {alt.Player} player
     * @param {IPed} pedData
     * @return {string}
     * @memberof PedController
     */
    static addToPlayer(player: alt.Player, pedData: IPed): string {
        if (!pedData.uid) {
            pedData.uid = sha256Random(JSON.stringify(pedData));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_PED, pedData);
       // Logger.log(`PED local spawn: ID: ${pedData.uid} PlayerSocial: ${player.socialID}`);
        return pedData.uid;
    }

    static update(player: alt.Player, peds: Array<IPed>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_PEDS, peds);
    }

    // static playAnimation(uid: string, animation: Animation[]) {
    //     alt.emitAllClients(SYSTEM_EVENTS.PLAY_ANIMATION_FOR_PED, uid, animation);
    // }

    static playAnimation(ped: IPed, animation: Animation): Promise<void> {
        return new Promise((resolve, reject) => {
            const id = Athena.utility.hash.sha256Random(`Peds:playAnimation:${Date.now()}:`);
            alt.onceClient(id, () => {
                resolve();
            });
            alt.emitAllClients(null, SYSTEM_EVENTS.PLAY_ANIMATION_FOR_PED, ped.uid, animation, id);
        });
    }



    /**
     * Sends the given text to the players' chat as if it has been said by the ped and plays the given ambient speech for the pedestrian
     * @param ped
     * @param chatPlayers
     * @param text
     * @param ambientSpeech
     * @param override Overrides the cooldown for the ped
     */
     static speakWithAmbient(
        ped: IPed,
        chatPlayers: Array<alt.Player>,
        text: string,
        ambientSpeech: IAmbientSpeech,
        override?: boolean,
    ): void {
        if (override || this.checkSpeechCooldown(ped)) {
            this.speak(ped, chatPlayers, text, true);
            this.playAmbientSpeech(ped, ambientSpeech, true);
            if (!override) this.pedSpeechTimes[ped.uid] = Date.now();
        }
    }

    /**
     * Sends the given text to the players' chat as if it has been said by the ped
     * @param ped
     * @param chatPlayers
     * @param text
     * @param override Overrides the cooldown for the ped
     */
    static speak(ped: IPed, chatPlayers: Array<alt.Player>, text: string, override?: boolean) {
        if (override || this.checkSpeechCooldown(ped)) {
            chatPlayers.forEach((player) => {
                this.speakToSpecificPlayer(ped, player, text);
                if (!override) this.pedSpeechTimes[ped.uid] = Date.now();
            });
        }
    }

    /**
     * Sends one message directy to the given player as if it has been said by the ped
     * @param ped
     * @param player
     * @param text
     * @param override Overrides the cooldown for the ped
     */
    static speakToSpecificPlayer(ped: IPed, player: alt.Player, text: string, override?: boolean): void {
        if (override || this.checkSpeechCooldown(ped)) {
            Athena.player.emit.message(player, `${ped.customName} mondja: ${text}`);
            if (!override) this.pedSpeechTimes[ped.uid] = Date.now();
        }
    }

    /**
     * Plays an ambient speech spoke by the pedestrian
     * @param ped
     * @param param1
     * @param override Overrides the cooldown for the ped
     */
    static playAmbientSpeech(ped: IPed, { speechName, speechParam }: IAmbientSpeech, override?: boolean): void {
        if (override || this.checkSpeechCooldown(ped)) {
            alt.emitAllClients(SYSTEM_EVENTS.PLAY_PED_AMBIENT_SPEECH, ped.uid, speechName, speechParam);
            if (!override) this.pedSpeechTimes[ped.uid] = Date.now();
        }
    }

    /**
     * Returns an integer value of entity's current health.
     * - Ped [100 to 200]
     */
     static async getPedHealth(player: alt.Player, ped: IPed): Promise<number | undefined> {
        return new Promise((resolve, reject) => {
            alt.emitClient(player, SYSTEM_EVENTS.GET_PED_HEALTH, ped.uid);
            alt.onClient('peds:pedHealthToServer', pedHealthToServer);

            function pedHealthToServer(player: alt.Player, uid: string, health: number | undefined) {
                if (uid == ped.uid) {
                    alt.offClient('peds:pedHealthToServer', pedHealthToServer);
                    resolve(health);
                }
            }
        });
    }

    static stopAnimation(ped: IPed) {
        alt.emitAllClients(SYSTEM_EVENTS.PED_STOP_ANIM, ped.uid);
    }

    static setWeapon(ped: IPed, weapon: Weapon, foreceEquip = false) {
        ped.weapon = weapon;
        alt.emitAllClients(SYSTEM_EVENTS.GIVE_WEAPON_TO_PED, ped.uid, ped.weapon.hash, foreceEquip);
    }

    static equipWeapon(ped: IPed) {
        alt.emitAllClients(SYSTEM_EVENTS.GIVE_WEAPON_TO_PED, ped.uid, ped.weapon.hash, true);
    }

    static giveWeaponifPedDoesntHaveOne(ped: IPed, weapon: Weapon, number, foreceEquip = false) {
        if (!ped.weapon) {
            alt.emitAllClients(SYSTEM_EVENTS.GIVE_WEAPON_TO_PED, ped.uid, weapon.hash, foreceEquip);
        }
    }

    static holsterWeapon(ped: IPed) {
        alt.emitAllClients(SYSTEM_EVENTS.HOLSTER_WEAPON, ped.uid);
    }

    /**
     *
     * @param {IPed} ped
     * @param {alt.Entity} entity
     * @param {number} duration ms
     */
    static aimAtEntity(ped: IPed, entity: alt.Entity, duration: number) {
        this.equipWeapon(ped);
        alt.emitAllClients(SYSTEM_EVENTS.PED_AIM_AT_ENTITY, ped.uid, entity.id, duration);
    }

    static clearTasks(ped: IPed) {
        alt.emitAllClients(SYSTEM_EVENTS.CLEAR_PED_TASKS, ped.uid);
    }

    /**
     *
     * @param ped The attacker ped
     * @param entity The entity to attack
     * @param overrideOtherTasks Whether this is set to true it will cancel all other tasks from executing and starts the attack immediately
     * @returns {Promise<void>}
     */
    static async attackEntity(ped: IPed, entity: alt.Entity, overrideOtherTasks = true): Promise<void> {
        return new Promise((resolve, reject) => {
            this.equipWeapon(ped);
            const callbackName = Athena.utility.hash.sha256Random(`peds:shootAtEntity:${ped}:${entity}`);
            alt.onceClient(callbackName, () => {
                resolve();
            });
            alt.emitAllClients(
                SYSTEM_EVENTS.PED_SHOOT_ENTITY,
                ped.uid,
                entity.id,
                overrideOtherTasks,
                callbackName,
            );
        });
    }

    /**
     * Sets the peds armor in percent
     * @param {IPed} ped
     * @param {number} amount [0-100]
     */
    static setPedArmor(ped: IPed, amount: number) {
        alt.emitAllClients(SYSTEM_EVENTS.SET_PED_ARMOR, ped.uid, amount);
    }

    /**
     * Sets the peds armor in percent
     * @param {IPed} ped
     * @param {number} amount [0-100]
     */
    static addArmorToPed(ped: IPed, amount: number) {
        alt.emitAllClients(SYSTEM_EVENTS.ADD_PED_ARMOR, ped.uid, amount);
    }

    static setPedIntoVehicle(ped: IPed, vehicle: IVehicle, seatIndex: SeatIndexes | number) {
        alt.emitAllClients(SYSTEM_EVENTS.SET_PED_TO_VEHICLE, ped.uid, vehicle.id, seatIndex);
    }

    static getPlayersInSortOfDistance(ped: IPed, radius: number) {
        return alt.Player.all
            .filter((el) => el.pos.distanceTo(ped.pos) <= radius)
            .sort((a, b) => {
                return a.pos.distanceTo(ped.pos) - b.pos.distanceTo(ped.pos);
            });
    }

    static async isPedMale(ped: IPed): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const callbackName = Athena.utility.hash.sha256Random('peds:IsPedMale-');
            alt.onceClient(callbackName, (player, isMale: boolean) => {
                resolve(isMale);
            });
            alt.emitAllClients(SYSTEM_EVENTS.IS_PED_MALE, ped.uid, callbackName);
        });
    }

    /**
     *
     * @param {IPed} ped
     * @param {IAttachable} attachable
     * @param {number} removeAfterMs A megadott ms-ek után despawn-ol az object. Ha 0 alatti az érték, nem dispawn-ol.
     */
    static attachObject(ped: IPed, attachable: IAttachable, removeAfterMs: number = -1) {
        if (!attachable.uid) {
            attachable.uid = Athena.utility.hash.sha256Random('Ped:Attachment');
        }

        alt.emitAllClients(SYSTEM_EVENTS.PED_ATTACH, ped.uid, attachable);

        if (removeAfterMs >= 0) {
            setTimeout(() => {
                alt.emitAllClients(SYSTEM_EVENTS.PED_DETACH, ped.uid, attachable);
            }, removeAfterMs);
        }
    }

    static teleportObjectToCoord(attachable: IAttachable, coord: alt.Vector3) {}

    static detach(ped: IPed, attachable: IAttachable) {
        alt.emitAllClients(SYSTEM_EVENTS.PED_DETACH, ped.uid, attachable.uid);
    }

    static detachAllObjects(ped: IPed) {
        alt.emitAllClients(SYSTEM_EVENTS.PED_DETACH_ALL_ATTACHMENTS, ped.uid);
    }

    static detachObjectDynamic(ped: IPed, attachable: IAttachable) {
        alt.emitAllClients(SYSTEM_EVENTS.PED_DETACH_DYNAMIC, ped.uid, attachable.uid);
    }

    static detachAllObjectsDynamic(ped: IPed) {
        alt.emitAllClients(SYSTEM_EVENTS.PED_DETACH_DYNAMIC_ALL, ped.uid);
    }

    static removeObject(attachableUID: string) {
        alt.emitAllClients(SYSTEM_EVENTS.REMOVE_OBJECT, attachableUID);
    }

    static setObjectPosition(attachableUID: string, position: alt.Vector3) {
        alt.emitAllClients(SYSTEM_EVENTS.SET_PED_ATTACHMENT_POSITION, position);
    }

    static async applyForceToAttachment(
        attachableUID: string,
        forceType: ForceTypes,
        forcePos: alt.Vector3,
    ): Promise<alt.Vector3> {
        return new Promise((resolve, reject) => {
            const callbackName = Athena.utility.hash.sha256Random('peds:ApplyForceToObject');

            alt.onceClient(callbackName, (player, res) => {
                resolve(res);
            });

            alt.emitAllClients(
                SYSTEM_EVENTS.APPLY_FORCE_TO_ATTACHMENT,
                attachableUID,
                forceType,
                forcePos,
                callbackName,
            );
        });
    }

    private static checkSpeechCooldown(ped: IPed) {
        if (Date.now() - this.pedSpeechTimes[ped.uid] >= this.speechCooldown) {
            return true;
        }

        return false;
    }

    static async isPlayerAimingAtPed(player: alt.Player, uid: string): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const callbackName = Athena.utility.hash.sha256Random('peds:isPlayerAimingAtPedCallback:');
            alt.onceClient(callbackName, callback);
            function callback(player: alt.Player, gotuid: string, ans: boolean) {
                if (gotuid == uid) {
                    resolve(ans);
                }
            }
            alt.emitClient(player, SYSTEM_EVENTS.IS_PLAYER_AIMINIG_AT_PED_TO_CLIENT, uid, callbackName);
        });
    }

    /**
     * Gives back true if the ped is alive
     * If the ped doesn't exist returns undefined
     * If the ped is dead returns false
     * @param uid
     * @returns
     */
    static isPedAlive(uid: string) {
        const index = globalPeds.findIndex((element) => element.uid === uid);

        if (index <= -1) {
            return undefined;
        }

        return !globalPeds[index].isDead;
    }

    static setRotation(ped: IPed, rot: number) {
        alt.emitAllClients(SYSTEM_EVENTS.PED_SET_ROT, ped.uid, rot);
    }

    static async getAllPedSyncDataFromRandomPlayer(): Promise<{
        tasks: { [uid: string]: Array<Task | TaskCallback> };
        damages: { [uid: string]: Array<IPedDamage> };
        positions: { [uid: string]: alt.Vector3 };
        equipped: { [uid: string]: boolean };
    }> {
        return new Promise(async (resolve, reject) => {
            var globalData = undefined;

            async function getData(player: alt.Player): Promise<{
                tasks: { [uid: string]: Array<Task | TaskCallback> };
                damages: { [uid: string]: Array<IPedDamage> };
                positions: { [uid: string]: alt.Vector3 };
                equipped: { [uid: string]: boolean };
            }> {
                return new Promise((resolve, reject) => {
                    const callbackName = Athena.utility.hash.sha256Random('peds:getcurrentPedTasksFromRandomPlayer');

                    alt.onceClient(callbackName, (player, tasks, damages, position, equipped) => {
                        syncData = {
                            tasks: tasks,
                            damages: damages,
                            positions: position,
                            equipped: equipped,
                        };

                        resolve(syncData);
                    });

                    alt.emitClient(player, SYSTEM_EVENTS.GET_ALL_PED_DATA, callbackName);
                });
            }

            const fullySpawnedPlayers = alt.Player.all.filter((el) => el.hasFullySpawned);

            if (fullySpawnedPlayers.length < 1) resolve(undefined);

            for (const player of fullySpawnedPlayers) {
                const data = await getData(player);
                if (data.positions) {
                    globalData = data;
                    break;
                }
            }

            resolve(globalData);
        });
    }

    static Tasks = Tasks;

    static Callbacks = Callbacks;
}

PedController.init();
