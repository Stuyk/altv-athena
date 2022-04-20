import { getCursorPos, setInterval, clearInterval, logWarning, emit, logError, clearTimeout, setTimeout, everyTick, getGxtText, showCursor } from 'alt-client';
import game__default, { requestScaleformMovie, hasScaleformMovieLoaded, beginScaleformMovieMethod, scaleformMovieMethodAddParamBool, scaleformMovieMethodAddParamPlayerNameString, scaleformMovieMethodAddParamFloat, scaleformMovieMethodAddParamInt, endScaleformMovieMethod, endScaleformMovieMethodReturnValue, drawScaleformMovieFullscreen, setScaleformMovieAsNoLongerNeeded } from 'natives';

var BadgeStyle;
(function (BadgeStyle) {
    BadgeStyle[BadgeStyle["None"] = 0] = "None";
    BadgeStyle[BadgeStyle["BronzeMedal"] = 1] = "BronzeMedal";
    BadgeStyle[BadgeStyle["GoldMedal"] = 2] = "GoldMedal";
    BadgeStyle[BadgeStyle["SilverMedal"] = 3] = "SilverMedal";
    BadgeStyle[BadgeStyle["Alert"] = 4] = "Alert";
    BadgeStyle[BadgeStyle["Crown"] = 5] = "Crown";
    BadgeStyle[BadgeStyle["Ammo"] = 6] = "Ammo";
    BadgeStyle[BadgeStyle["Armour"] = 7] = "Armour";
    BadgeStyle[BadgeStyle["Barber"] = 8] = "Barber";
    BadgeStyle[BadgeStyle["Clothes"] = 9] = "Clothes";
    BadgeStyle[BadgeStyle["Franklin"] = 10] = "Franklin";
    BadgeStyle[BadgeStyle["Bike"] = 11] = "Bike";
    BadgeStyle[BadgeStyle["Car"] = 12] = "Car";
    BadgeStyle[BadgeStyle["Gun"] = 13] = "Gun";
    BadgeStyle[BadgeStyle["Heart"] = 14] = "Heart";
    BadgeStyle[BadgeStyle["Makeup"] = 15] = "Makeup";
    BadgeStyle[BadgeStyle["Mask"] = 16] = "Mask";
    BadgeStyle[BadgeStyle["Michael"] = 17] = "Michael";
    BadgeStyle[BadgeStyle["Star"] = 18] = "Star";
    BadgeStyle[BadgeStyle["Tattoo"] = 19] = "Tattoo";
    BadgeStyle[BadgeStyle["Trevor"] = 20] = "Trevor";
    BadgeStyle[BadgeStyle["Lock"] = 21] = "Lock";
    BadgeStyle[BadgeStyle["Tick"] = 22] = "Tick";
    BadgeStyle[BadgeStyle["Sale"] = 23] = "Sale";
    BadgeStyle[BadgeStyle["ArrowLeft"] = 24] = "ArrowLeft";
    BadgeStyle[BadgeStyle["ArrowRight"] = 25] = "ArrowRight";
    BadgeStyle[BadgeStyle["Audio1"] = 26] = "Audio1";
    BadgeStyle[BadgeStyle["Audio2"] = 27] = "Audio2";
    BadgeStyle[BadgeStyle["Audio3"] = 28] = "Audio3";
    BadgeStyle[BadgeStyle["AudioInactive"] = 29] = "AudioInactive";
    BadgeStyle[BadgeStyle["AudioMute"] = 30] = "AudioMute";
})(BadgeStyle || (BadgeStyle = {}));
var BadgeStyle$1 = BadgeStyle;

var Font;
(function (Font) {
    Font[Font["ChaletLondon"] = 0] = "ChaletLondon";
    Font[Font["HouseScript"] = 1] = "HouseScript";
    Font[Font["Monospace"] = 2] = "Monospace";
    Font[Font["CharletComprimeColonge"] = 4] = "CharletComprimeColonge";
    Font[Font["Pricedown"] = 7] = "Pricedown";
})(Font || (Font = {}));
var Font$1 = Font;

var Alignment;
(function (Alignment) {
    Alignment[Alignment["Left"] = 0] = "Left";
    Alignment[Alignment["Centered"] = 1] = "Centered";
    Alignment[Alignment["Right"] = 2] = "Right";
})(Alignment || (Alignment = {}));
var Alignment$1 = Alignment;

var Control;
(function (Control) {
    Control[Control["NextCamera"] = 0] = "NextCamera";
    Control[Control["LookLeftRight"] = 1] = "LookLeftRight";
    Control[Control["LookUpDown"] = 2] = "LookUpDown";
    Control[Control["LookUpOnly"] = 3] = "LookUpOnly";
    Control[Control["LookDownOnly"] = 4] = "LookDownOnly";
    Control[Control["LookLeftOnly"] = 5] = "LookLeftOnly";
    Control[Control["LookRightOnly"] = 6] = "LookRightOnly";
    Control[Control["CinematicSlowMo"] = 7] = "CinematicSlowMo";
    Control[Control["FlyUpDown"] = 8] = "FlyUpDown";
    Control[Control["FlyLeftRight"] = 9] = "FlyLeftRight";
    Control[Control["ScriptedFlyZUp"] = 10] = "ScriptedFlyZUp";
    Control[Control["ScriptedFlyZDown"] = 11] = "ScriptedFlyZDown";
    Control[Control["WeaponWheelUpDown"] = 12] = "WeaponWheelUpDown";
    Control[Control["WeaponWheelLeftRight"] = 13] = "WeaponWheelLeftRight";
    Control[Control["WeaponWheelNext"] = 14] = "WeaponWheelNext";
    Control[Control["WeaponWheelPrev"] = 15] = "WeaponWheelPrev";
    Control[Control["SelectNextWeapon"] = 16] = "SelectNextWeapon";
    Control[Control["SelectPrevWeapon"] = 17] = "SelectPrevWeapon";
    Control[Control["SkipCutscene"] = 18] = "SkipCutscene";
    Control[Control["CharacterWheel"] = 19] = "CharacterWheel";
    Control[Control["MultiplayerInfo"] = 20] = "MultiplayerInfo";
    Control[Control["Sprint"] = 21] = "Sprint";
    Control[Control["Jump"] = 22] = "Jump";
    Control[Control["Enter"] = 23] = "Enter";
    Control[Control["Attack"] = 24] = "Attack";
    Control[Control["Aim"] = 25] = "Aim";
    Control[Control["LookBehind"] = 26] = "LookBehind";
    Control[Control["Phone"] = 27] = "Phone";
    Control[Control["SpecialAbility"] = 28] = "SpecialAbility";
    Control[Control["SpecialAbilitySecondary"] = 29] = "SpecialAbilitySecondary";
    Control[Control["MoveLeftRight"] = 30] = "MoveLeftRight";
    Control[Control["MoveUpDown"] = 31] = "MoveUpDown";
    Control[Control["MoveUpOnly"] = 32] = "MoveUpOnly";
    Control[Control["MoveDownOnly"] = 33] = "MoveDownOnly";
    Control[Control["MoveLeftOnly"] = 34] = "MoveLeftOnly";
    Control[Control["MoveRightOnly"] = 35] = "MoveRightOnly";
    Control[Control["Duck"] = 36] = "Duck";
    Control[Control["SelectWeapon"] = 37] = "SelectWeapon";
    Control[Control["Pickup"] = 38] = "Pickup";
    Control[Control["SniperZoom"] = 39] = "SniperZoom";
    Control[Control["SniperZoomInOnly"] = 40] = "SniperZoomInOnly";
    Control[Control["SniperZoomOutOnly"] = 41] = "SniperZoomOutOnly";
    Control[Control["SniperZoomInSecondary"] = 42] = "SniperZoomInSecondary";
    Control[Control["SniperZoomOutSecondary"] = 43] = "SniperZoomOutSecondary";
    Control[Control["Cover"] = 44] = "Cover";
    Control[Control["Reload"] = 45] = "Reload";
    Control[Control["Talk"] = 46] = "Talk";
    Control[Control["Detonate"] = 47] = "Detonate";
    Control[Control["HUDSpecial"] = 48] = "HUDSpecial";
    Control[Control["Arrest"] = 49] = "Arrest";
    Control[Control["AccurateAim"] = 50] = "AccurateAim";
    Control[Control["Context"] = 51] = "Context";
    Control[Control["ContextSecondary"] = 52] = "ContextSecondary";
    Control[Control["WeaponSpecial"] = 53] = "WeaponSpecial";
    Control[Control["WeaponSpecial2"] = 54] = "WeaponSpecial2";
    Control[Control["Dive"] = 55] = "Dive";
    Control[Control["DropWeapon"] = 56] = "DropWeapon";
    Control[Control["DropAmmo"] = 57] = "DropAmmo";
    Control[Control["ThrowGrenade"] = 58] = "ThrowGrenade";
    Control[Control["VehicleMoveLeftRight"] = 59] = "VehicleMoveLeftRight";
    Control[Control["VehicleMoveUpDown"] = 60] = "VehicleMoveUpDown";
    Control[Control["VehicleMoveUpOnly"] = 61] = "VehicleMoveUpOnly";
    Control[Control["VehicleMoveDownOnly"] = 62] = "VehicleMoveDownOnly";
    Control[Control["VehicleMoveLeftOnly"] = 63] = "VehicleMoveLeftOnly";
    Control[Control["VehicleMoveRightOnly"] = 64] = "VehicleMoveRightOnly";
    Control[Control["VehicleSpecial"] = 65] = "VehicleSpecial";
    Control[Control["VehicleGunLeftRight"] = 66] = "VehicleGunLeftRight";
    Control[Control["VehicleGunUpDown"] = 67] = "VehicleGunUpDown";
    Control[Control["VehicleAim"] = 68] = "VehicleAim";
    Control[Control["VehicleAttack"] = 69] = "VehicleAttack";
    Control[Control["VehicleAttack2"] = 70] = "VehicleAttack2";
    Control[Control["VehicleAccelerate"] = 71] = "VehicleAccelerate";
    Control[Control["VehicleBrake"] = 72] = "VehicleBrake";
    Control[Control["VehicleDuck"] = 73] = "VehicleDuck";
    Control[Control["VehicleHeadlight"] = 74] = "VehicleHeadlight";
    Control[Control["VehicleExit"] = 75] = "VehicleExit";
    Control[Control["VehicleHandbrake"] = 76] = "VehicleHandbrake";
    Control[Control["VehicleHotwireLeft"] = 77] = "VehicleHotwireLeft";
    Control[Control["VehicleHotwireRight"] = 78] = "VehicleHotwireRight";
    Control[Control["VehicleLookBehind"] = 79] = "VehicleLookBehind";
    Control[Control["VehicleCinCam"] = 80] = "VehicleCinCam";
    Control[Control["VehicleNextRadio"] = 81] = "VehicleNextRadio";
    Control[Control["VehiclePrevRadio"] = 82] = "VehiclePrevRadio";
    Control[Control["VehicleNextRadioTrack"] = 83] = "VehicleNextRadioTrack";
    Control[Control["VehiclePrevRadioTrack"] = 84] = "VehiclePrevRadioTrack";
    Control[Control["VehicleRadioWheel"] = 85] = "VehicleRadioWheel";
    Control[Control["VehicleHorn"] = 86] = "VehicleHorn";
    Control[Control["VehicleFlyThrottleUp"] = 87] = "VehicleFlyThrottleUp";
    Control[Control["VehicleFlyThrottleDown"] = 88] = "VehicleFlyThrottleDown";
    Control[Control["VehicleFlyYawLeft"] = 89] = "VehicleFlyYawLeft";
    Control[Control["VehicleFlyYawRight"] = 90] = "VehicleFlyYawRight";
    Control[Control["VehiclePassengerAim"] = 91] = "VehiclePassengerAim";
    Control[Control["VehiclePassengerAttack"] = 92] = "VehiclePassengerAttack";
    Control[Control["VehicleSpecialAbilityFranklin"] = 93] = "VehicleSpecialAbilityFranklin";
    Control[Control["VehicleStuntUpDown"] = 94] = "VehicleStuntUpDown";
    Control[Control["VehicleCinematicUpDown"] = 95] = "VehicleCinematicUpDown";
    Control[Control["VehicleCinematicUpOnly"] = 96] = "VehicleCinematicUpOnly";
    Control[Control["VehicleCinematicDownOnly"] = 97] = "VehicleCinematicDownOnly";
    Control[Control["VehicleCinematicLeftRight"] = 98] = "VehicleCinematicLeftRight";
    Control[Control["VehicleSelectNextWeapon"] = 99] = "VehicleSelectNextWeapon";
    Control[Control["VehicleSelectPrevWeapon"] = 100] = "VehicleSelectPrevWeapon";
    Control[Control["VehicleRoof"] = 101] = "VehicleRoof";
    Control[Control["VehicleJump"] = 102] = "VehicleJump";
    Control[Control["VehicleGrapplingHook"] = 103] = "VehicleGrapplingHook";
    Control[Control["VehicleShuffle"] = 104] = "VehicleShuffle";
    Control[Control["VehicleDropProjectile"] = 105] = "VehicleDropProjectile";
    Control[Control["VehicleMouseControlOverride"] = 106] = "VehicleMouseControlOverride";
    Control[Control["VehicleFlyRollLeftRight"] = 107] = "VehicleFlyRollLeftRight";
    Control[Control["VehicleFlyRollLeftOnly"] = 108] = "VehicleFlyRollLeftOnly";
    Control[Control["VehicleFlyRollRightOnly"] = 109] = "VehicleFlyRollRightOnly";
    Control[Control["VehicleFlyPitchUpDown"] = 110] = "VehicleFlyPitchUpDown";
    Control[Control["VehicleFlyPitchUpOnly"] = 111] = "VehicleFlyPitchUpOnly";
    Control[Control["VehicleFlyPitchDownOnly"] = 112] = "VehicleFlyPitchDownOnly";
    Control[Control["VehicleFlyUnderCarriage"] = 113] = "VehicleFlyUnderCarriage";
    Control[Control["VehicleFlyAttack"] = 114] = "VehicleFlyAttack";
    Control[Control["VehicleFlySelectNextWeapon"] = 115] = "VehicleFlySelectNextWeapon";
    Control[Control["VehicleFlySelectPrevWeapon"] = 116] = "VehicleFlySelectPrevWeapon";
    Control[Control["VehicleFlySelectTargetLeft"] = 117] = "VehicleFlySelectTargetLeft";
    Control[Control["VehicleFlySelectTargetRight"] = 118] = "VehicleFlySelectTargetRight";
    Control[Control["VehicleFlyVerticalFlightMode"] = 119] = "VehicleFlyVerticalFlightMode";
    Control[Control["VehicleFlyDuck"] = 120] = "VehicleFlyDuck";
    Control[Control["VehicleFlyAttackCamera"] = 121] = "VehicleFlyAttackCamera";
    Control[Control["VehicleFlyMouseControlOverride"] = 122] = "VehicleFlyMouseControlOverride";
    Control[Control["VehicleSubTurnLeftRight"] = 123] = "VehicleSubTurnLeftRight";
    Control[Control["VehicleSubTurnLeftOnly"] = 124] = "VehicleSubTurnLeftOnly";
    Control[Control["VehicleSubTurnRightOnly"] = 125] = "VehicleSubTurnRightOnly";
    Control[Control["VehicleSubPitchUpDown"] = 126] = "VehicleSubPitchUpDown";
    Control[Control["VehicleSubPitchUpOnly"] = 127] = "VehicleSubPitchUpOnly";
    Control[Control["VehicleSubPitchDownOnly"] = 128] = "VehicleSubPitchDownOnly";
    Control[Control["VehicleSubThrottleUp"] = 129] = "VehicleSubThrottleUp";
    Control[Control["VehicleSubThrottleDown"] = 130] = "VehicleSubThrottleDown";
    Control[Control["VehicleSubAscend"] = 131] = "VehicleSubAscend";
    Control[Control["VehicleSubDescend"] = 132] = "VehicleSubDescend";
    Control[Control["VehicleSubTurnHardLeft"] = 133] = "VehicleSubTurnHardLeft";
    Control[Control["VehicleSubTurnHardRight"] = 134] = "VehicleSubTurnHardRight";
    Control[Control["VehicleSubMouseControlOverride"] = 135] = "VehicleSubMouseControlOverride";
    Control[Control["VehiclePushbikePedal"] = 136] = "VehiclePushbikePedal";
    Control[Control["VehiclePushbikeSprint"] = 137] = "VehiclePushbikeSprint";
    Control[Control["VehiclePushbikeFrontBrake"] = 138] = "VehiclePushbikeFrontBrake";
    Control[Control["VehiclePushbikeRearBrake"] = 139] = "VehiclePushbikeRearBrake";
    Control[Control["MeleeAttackLight"] = 140] = "MeleeAttackLight";
    Control[Control["MeleeAttackHeavy"] = 141] = "MeleeAttackHeavy";
    Control[Control["MeleeAttackAlternate"] = 142] = "MeleeAttackAlternate";
    Control[Control["MeleeBlock"] = 143] = "MeleeBlock";
    Control[Control["ParachuteDeploy"] = 144] = "ParachuteDeploy";
    Control[Control["ParachuteDetach"] = 145] = "ParachuteDetach";
    Control[Control["ParachuteTurnLeftRight"] = 146] = "ParachuteTurnLeftRight";
    Control[Control["ParachuteTurnLeftOnly"] = 147] = "ParachuteTurnLeftOnly";
    Control[Control["ParachuteTurnRightOnly"] = 148] = "ParachuteTurnRightOnly";
    Control[Control["ParachutePitchUpDown"] = 149] = "ParachutePitchUpDown";
    Control[Control["ParachutePitchUpOnly"] = 150] = "ParachutePitchUpOnly";
    Control[Control["ParachutePitchDownOnly"] = 151] = "ParachutePitchDownOnly";
    Control[Control["ParachuteBrakeLeft"] = 152] = "ParachuteBrakeLeft";
    Control[Control["ParachuteBrakeRight"] = 153] = "ParachuteBrakeRight";
    Control[Control["ParachuteSmoke"] = 154] = "ParachuteSmoke";
    Control[Control["ParachutePrecisionLanding"] = 155] = "ParachutePrecisionLanding";
    Control[Control["Map"] = 156] = "Map";
    Control[Control["SelectWeaponUnarmed"] = 157] = "SelectWeaponUnarmed";
    Control[Control["SelectWeaponMelee"] = 158] = "SelectWeaponMelee";
    Control[Control["SelectWeaponHandgun"] = 159] = "SelectWeaponHandgun";
    Control[Control["SelectWeaponShotgun"] = 160] = "SelectWeaponShotgun";
    Control[Control["SelectWeaponSmg"] = 161] = "SelectWeaponSmg";
    Control[Control["SelectWeaponAutoRifle"] = 162] = "SelectWeaponAutoRifle";
    Control[Control["SelectWeaponSniper"] = 163] = "SelectWeaponSniper";
    Control[Control["SelectWeaponHeavy"] = 164] = "SelectWeaponHeavy";
    Control[Control["SelectWeaponSpecial"] = 165] = "SelectWeaponSpecial";
    Control[Control["SelectCharacterMichael"] = 166] = "SelectCharacterMichael";
    Control[Control["SelectCharacterFranklin"] = 167] = "SelectCharacterFranklin";
    Control[Control["SelectCharacterTrevor"] = 168] = "SelectCharacterTrevor";
    Control[Control["SelectCharacterMultiplayer"] = 169] = "SelectCharacterMultiplayer";
    Control[Control["SaveReplayClip"] = 170] = "SaveReplayClip";
    Control[Control["SpecialAbilityPC"] = 171] = "SpecialAbilityPC";
    Control[Control["PhoneUp"] = 172] = "PhoneUp";
    Control[Control["PhoneDown"] = 173] = "PhoneDown";
    Control[Control["PhoneLeft"] = 174] = "PhoneLeft";
    Control[Control["PhoneRight"] = 175] = "PhoneRight";
    Control[Control["PhoneSelect"] = 176] = "PhoneSelect";
    Control[Control["PhoneCancel"] = 177] = "PhoneCancel";
    Control[Control["PhoneOption"] = 178] = "PhoneOption";
    Control[Control["PhoneExtraOption"] = 179] = "PhoneExtraOption";
    Control[Control["PhoneScrollForward"] = 180] = "PhoneScrollForward";
    Control[Control["PhoneScrollBackward"] = 181] = "PhoneScrollBackward";
    Control[Control["PhoneCameraFocusLock"] = 182] = "PhoneCameraFocusLock";
    Control[Control["PhoneCameraGrid"] = 183] = "PhoneCameraGrid";
    Control[Control["PhoneCameraSelfie"] = 184] = "PhoneCameraSelfie";
    Control[Control["PhoneCameraDOF"] = 185] = "PhoneCameraDOF";
    Control[Control["PhoneCameraExpression"] = 186] = "PhoneCameraExpression";
    Control[Control["FrontendDown"] = 187] = "FrontendDown";
    Control[Control["FrontendUp"] = 188] = "FrontendUp";
    Control[Control["FrontendLeft"] = 189] = "FrontendLeft";
    Control[Control["FrontendRight"] = 190] = "FrontendRight";
    Control[Control["FrontendRdown"] = 191] = "FrontendRdown";
    Control[Control["FrontendRup"] = 192] = "FrontendRup";
    Control[Control["FrontendRleft"] = 193] = "FrontendRleft";
    Control[Control["FrontendRright"] = 194] = "FrontendRright";
    Control[Control["FrontendAxisX"] = 195] = "FrontendAxisX";
    Control[Control["FrontendAxisY"] = 196] = "FrontendAxisY";
    Control[Control["FrontendRightAxisX"] = 197] = "FrontendRightAxisX";
    Control[Control["FrontendRightAxisY"] = 198] = "FrontendRightAxisY";
    Control[Control["FrontendPause"] = 199] = "FrontendPause";
    Control[Control["FrontendPauseAlternate"] = 200] = "FrontendPauseAlternate";
    Control[Control["FrontendAccept"] = 201] = "FrontendAccept";
    Control[Control["FrontendCancel"] = 202] = "FrontendCancel";
    Control[Control["FrontendX"] = 203] = "FrontendX";
    Control[Control["FrontendY"] = 204] = "FrontendY";
    Control[Control["FrontendLb"] = 205] = "FrontendLb";
    Control[Control["FrontendRb"] = 206] = "FrontendRb";
    Control[Control["FrontendLt"] = 207] = "FrontendLt";
    Control[Control["FrontendRt"] = 208] = "FrontendRt";
    Control[Control["FrontendLs"] = 209] = "FrontendLs";
    Control[Control["FrontendRs"] = 210] = "FrontendRs";
    Control[Control["FrontendLeaderboard"] = 211] = "FrontendLeaderboard";
    Control[Control["FrontendSocialClub"] = 212] = "FrontendSocialClub";
    Control[Control["FrontendSocialClubSecondary"] = 213] = "FrontendSocialClubSecondary";
    Control[Control["FrontendDelete"] = 214] = "FrontendDelete";
    Control[Control["FrontendEndscreenAccept"] = 215] = "FrontendEndscreenAccept";
    Control[Control["FrontendEndscreenExpand"] = 216] = "FrontendEndscreenExpand";
    Control[Control["FrontendSelect"] = 217] = "FrontendSelect";
    Control[Control["ScriptLeftAxisX"] = 218] = "ScriptLeftAxisX";
    Control[Control["ScriptLeftAxisY"] = 219] = "ScriptLeftAxisY";
    Control[Control["ScriptRightAxisX"] = 220] = "ScriptRightAxisX";
    Control[Control["ScriptRightAxisY"] = 221] = "ScriptRightAxisY";
    Control[Control["ScriptRUp"] = 222] = "ScriptRUp";
    Control[Control["ScriptRDown"] = 223] = "ScriptRDown";
    Control[Control["ScriptRLeft"] = 224] = "ScriptRLeft";
    Control[Control["ScriptRRight"] = 225] = "ScriptRRight";
    Control[Control["ScriptLB"] = 226] = "ScriptLB";
    Control[Control["ScriptRB"] = 227] = "ScriptRB";
    Control[Control["ScriptLT"] = 228] = "ScriptLT";
    Control[Control["ScriptRT"] = 229] = "ScriptRT";
    Control[Control["ScriptLS"] = 230] = "ScriptLS";
    Control[Control["ScriptRS"] = 231] = "ScriptRS";
    Control[Control["ScriptPadUp"] = 232] = "ScriptPadUp";
    Control[Control["ScriptPadDown"] = 233] = "ScriptPadDown";
    Control[Control["ScriptPadLeft"] = 234] = "ScriptPadLeft";
    Control[Control["ScriptPadRight"] = 235] = "ScriptPadRight";
    Control[Control["ScriptSelect"] = 236] = "ScriptSelect";
    Control[Control["CursorAccept"] = 237] = "CursorAccept";
    Control[Control["CursorCancel"] = 238] = "CursorCancel";
    Control[Control["CursorX"] = 239] = "CursorX";
    Control[Control["CursorY"] = 240] = "CursorY";
    Control[Control["CursorScrollUp"] = 241] = "CursorScrollUp";
    Control[Control["CursorScrollDown"] = 242] = "CursorScrollDown";
    Control[Control["EnterCheatCode"] = 243] = "EnterCheatCode";
    Control[Control["InteractionMenu"] = 244] = "InteractionMenu";
    Control[Control["MpTextChatAll"] = 245] = "MpTextChatAll";
    Control[Control["MpTextChatTeam"] = 246] = "MpTextChatTeam";
    Control[Control["MpTextChatFriends"] = 247] = "MpTextChatFriends";
    Control[Control["MpTextChatCrew"] = 248] = "MpTextChatCrew";
    Control[Control["PushToTalk"] = 249] = "PushToTalk";
    Control[Control["CreatorLS"] = 250] = "CreatorLS";
    Control[Control["CreatorRS"] = 251] = "CreatorRS";
    Control[Control["CreatorLT"] = 252] = "CreatorLT";
    Control[Control["CreatorRT"] = 253] = "CreatorRT";
    Control[Control["CreatorMenuToggle"] = 254] = "CreatorMenuToggle";
    Control[Control["CreatorAccept"] = 255] = "CreatorAccept";
    Control[Control["CreatorDelete"] = 256] = "CreatorDelete";
    Control[Control["Attack2"] = 257] = "Attack2";
    Control[Control["RappelJump"] = 258] = "RappelJump";
    Control[Control["RappelLongJump"] = 259] = "RappelLongJump";
    Control[Control["RappelSmashWindow"] = 260] = "RappelSmashWindow";
    Control[Control["PrevWeapon"] = 261] = "PrevWeapon";
    Control[Control["NextWeapon"] = 262] = "NextWeapon";
    Control[Control["MeleeAttack1"] = 263] = "MeleeAttack1";
    Control[Control["MeleeAttack2"] = 264] = "MeleeAttack2";
    Control[Control["Whistle"] = 265] = "Whistle";
    Control[Control["MoveLeft"] = 266] = "MoveLeft";
    Control[Control["MoveRight"] = 267] = "MoveRight";
    Control[Control["MoveUp"] = 268] = "MoveUp";
    Control[Control["MoveDown"] = 269] = "MoveDown";
    Control[Control["LookLeft"] = 270] = "LookLeft";
    Control[Control["LookRight"] = 271] = "LookRight";
    Control[Control["LookUp"] = 272] = "LookUp";
    Control[Control["LookDown"] = 273] = "LookDown";
    Control[Control["SniperZoomIn"] = 274] = "SniperZoomIn";
    Control[Control["SniperZoomOut"] = 275] = "SniperZoomOut";
    Control[Control["SniperZoomInAlternate"] = 276] = "SniperZoomInAlternate";
    Control[Control["SniperZoomOutAlternate"] = 277] = "SniperZoomOutAlternate";
    Control[Control["VehicleMoveLeft"] = 278] = "VehicleMoveLeft";
    Control[Control["VehicleMoveRight"] = 279] = "VehicleMoveRight";
    Control[Control["VehicleMoveUp"] = 280] = "VehicleMoveUp";
    Control[Control["VehicleMoveDown"] = 281] = "VehicleMoveDown";
    Control[Control["VehicleGunLeft"] = 282] = "VehicleGunLeft";
    Control[Control["VehicleGunRight"] = 283] = "VehicleGunRight";
    Control[Control["VehicleGunUp"] = 284] = "VehicleGunUp";
    Control[Control["VehicleGunDown"] = 285] = "VehicleGunDown";
    Control[Control["VehicleLookLeft"] = 286] = "VehicleLookLeft";
    Control[Control["VehicleLookRight"] = 287] = "VehicleLookRight";
    Control[Control["ReplayStartStopRecording"] = 288] = "ReplayStartStopRecording";
    Control[Control["ReplayStartStopRecordingSecondary"] = 289] = "ReplayStartStopRecordingSecondary";
    Control[Control["ScaledLookLeftRight"] = 290] = "ScaledLookLeftRight";
    Control[Control["ScaledLookUpDown"] = 291] = "ScaledLookUpDown";
    Control[Control["ScaledLookUpOnly"] = 292] = "ScaledLookUpOnly";
    Control[Control["ScaledLookDownOnly"] = 293] = "ScaledLookDownOnly";
    Control[Control["ScaledLookLeftOnly"] = 294] = "ScaledLookLeftOnly";
    Control[Control["ScaledLookRightOnly"] = 295] = "ScaledLookRightOnly";
    Control[Control["ReplayMarkerDelete"] = 296] = "ReplayMarkerDelete";
    Control[Control["ReplayClipDelete"] = 297] = "ReplayClipDelete";
    Control[Control["ReplayPause"] = 298] = "ReplayPause";
    Control[Control["ReplayRewind"] = 299] = "ReplayRewind";
    Control[Control["ReplayFfwd"] = 300] = "ReplayFfwd";
    Control[Control["ReplayNewmarker"] = 301] = "ReplayNewmarker";
    Control[Control["ReplayRecord"] = 302] = "ReplayRecord";
    Control[Control["ReplayScreenshot"] = 303] = "ReplayScreenshot";
    Control[Control["ReplayHidehud"] = 304] = "ReplayHidehud";
    Control[Control["ReplayStartpoint"] = 305] = "ReplayStartpoint";
    Control[Control["ReplayEndpoint"] = 306] = "ReplayEndpoint";
    Control[Control["ReplayAdvance"] = 307] = "ReplayAdvance";
    Control[Control["ReplayBack"] = 308] = "ReplayBack";
    Control[Control["ReplayTools"] = 309] = "ReplayTools";
    Control[Control["ReplayRestart"] = 310] = "ReplayRestart";
    Control[Control["ReplayShowhotkey"] = 311] = "ReplayShowhotkey";
    Control[Control["ReplayCycleMarkerLeft"] = 312] = "ReplayCycleMarkerLeft";
    Control[Control["ReplayCycleMarkerRight"] = 313] = "ReplayCycleMarkerRight";
    Control[Control["ReplayFOVIncrease"] = 314] = "ReplayFOVIncrease";
    Control[Control["ReplayFOVDecrease"] = 315] = "ReplayFOVDecrease";
    Control[Control["ReplayCameraUp"] = 316] = "ReplayCameraUp";
    Control[Control["ReplayCameraDown"] = 317] = "ReplayCameraDown";
    Control[Control["ReplaySave"] = 318] = "ReplaySave";
    Control[Control["ReplayToggletime"] = 319] = "ReplayToggletime";
    Control[Control["ReplayToggletips"] = 320] = "ReplayToggletips";
    Control[Control["ReplayPreview"] = 321] = "ReplayPreview";
    Control[Control["ReplayToggleTimeline"] = 322] = "ReplayToggleTimeline";
    Control[Control["ReplayTimelinePickupClip"] = 323] = "ReplayTimelinePickupClip";
    Control[Control["ReplayTimelineDuplicateClip"] = 324] = "ReplayTimelineDuplicateClip";
    Control[Control["ReplayTimelinePlaceClip"] = 325] = "ReplayTimelinePlaceClip";
    Control[Control["ReplayCtrl"] = 326] = "ReplayCtrl";
    Control[Control["ReplayTimelineSave"] = 327] = "ReplayTimelineSave";
    Control[Control["ReplayPreviewAudio"] = 328] = "ReplayPreviewAudio";
    Control[Control["VehicleDriveLook"] = 329] = "VehicleDriveLook";
    Control[Control["VehicleDriveLook2"] = 330] = "VehicleDriveLook2";
    Control[Control["VehicleFlyAttack2"] = 331] = "VehicleFlyAttack2";
    Control[Control["RadioWheelUpDown"] = 332] = "RadioWheelUpDown";
    Control[Control["RadioWheelLeftRight"] = 333] = "RadioWheelLeftRight";
    Control[Control["VehicleSlowMoUpDown"] = 334] = "VehicleSlowMoUpDown";
    Control[Control["VehicleSlowMoUpOnly"] = 335] = "VehicleSlowMoUpOnly";
    Control[Control["VehicleSlowMoDownOnly"] = 336] = "VehicleSlowMoDownOnly";
    Control[Control["MapPointOfInterest"] = 337] = "MapPointOfInterest";
    Control[Control["ReplaySnapmaticPhoto"] = 338] = "ReplaySnapmaticPhoto";
    Control[Control["VehicleCarJump"] = 339] = "VehicleCarJump";
    Control[Control["VehicleRocketBoost"] = 340] = "VehicleRocketBoost";
    Control[Control["VehicleParachute"] = 341] = "VehicleParachute";
    Control[Control["VehicleBikeWings"] = 342] = "VehicleBikeWings";
    Control[Control["VehicleFlyBombBay"] = 343] = "VehicleFlyBombBay";
    Control[Control["VehicleFlyCounter"] = 344] = "VehicleFlyCounter";
    Control[Control["VehicleFlyTransform"] = 345] = "VehicleFlyTransform";
})(Control || (Control = {}));
var Control$1 = Control;

var HudColor;
(function (HudColor) {
    HudColor[HudColor["HUD_COLOUR_PURE_WHITE"] = 0] = "HUD_COLOUR_PURE_WHITE";
    HudColor[HudColor["HUD_COLOUR_WHITE"] = 1] = "HUD_COLOUR_WHITE";
    HudColor[HudColor["HUD_COLOUR_BLACK"] = 2] = "HUD_COLOUR_BLACK";
    HudColor[HudColor["HUD_COLOUR_GREY"] = 3] = "HUD_COLOUR_GREY";
    HudColor[HudColor["HUD_COLOUR_GREYLIGHT"] = 4] = "HUD_COLOUR_GREYLIGHT";
    HudColor[HudColor["HUD_COLOUR_GREYDARK"] = 5] = "HUD_COLOUR_GREYDARK";
    HudColor[HudColor["HUD_COLOUR_RED"] = 6] = "HUD_COLOUR_RED";
    HudColor[HudColor["HUD_COLOUR_REDLIGHT"] = 7] = "HUD_COLOUR_REDLIGHT";
    HudColor[HudColor["HUD_COLOUR_REDDARK"] = 8] = "HUD_COLOUR_REDDARK";
    HudColor[HudColor["HUD_COLOUR_BLUE"] = 9] = "HUD_COLOUR_BLUE";
    HudColor[HudColor["HUD_COLOUR_BLUELIGHT"] = 10] = "HUD_COLOUR_BLUELIGHT";
    HudColor[HudColor["HUD_COLOUR_BLUEDARK"] = 11] = "HUD_COLOUR_BLUEDARK";
    HudColor[HudColor["HUD_COLOUR_YELLOW"] = 12] = "HUD_COLOUR_YELLOW";
    HudColor[HudColor["HUD_COLOUR_YELLOWLIGHT"] = 13] = "HUD_COLOUR_YELLOWLIGHT";
    HudColor[HudColor["HUD_COLOUR_YELLOWDARK"] = 14] = "HUD_COLOUR_YELLOWDARK";
    HudColor[HudColor["HUD_COLOUR_ORANGE"] = 15] = "HUD_COLOUR_ORANGE";
    HudColor[HudColor["HUD_COLOUR_ORANGELIGHT"] = 16] = "HUD_COLOUR_ORANGELIGHT";
    HudColor[HudColor["HUD_COLOUR_ORANGEDARK"] = 17] = "HUD_COLOUR_ORANGEDARK";
    HudColor[HudColor["HUD_COLOUR_GREEN"] = 18] = "HUD_COLOUR_GREEN";
    HudColor[HudColor["HUD_COLOUR_GREENLIGHT"] = 19] = "HUD_COLOUR_GREENLIGHT";
    HudColor[HudColor["HUD_COLOUR_GREENDARK"] = 20] = "HUD_COLOUR_GREENDARK";
    HudColor[HudColor["HUD_COLOUR_PURPLE"] = 21] = "HUD_COLOUR_PURPLE";
    HudColor[HudColor["HUD_COLOUR_PURPLELIGHT"] = 22] = "HUD_COLOUR_PURPLELIGHT";
    HudColor[HudColor["HUD_COLOUR_PURPLEDARK"] = 23] = "HUD_COLOUR_PURPLEDARK";
    HudColor[HudColor["HUD_COLOUR_PINK"] = 24] = "HUD_COLOUR_PINK";
    HudColor[HudColor["HUD_COLOUR_RADAR_HEALTH"] = 25] = "HUD_COLOUR_RADAR_HEALTH";
    HudColor[HudColor["HUD_COLOUR_RADAR_ARMOUR"] = 26] = "HUD_COLOUR_RADAR_ARMOUR";
    HudColor[HudColor["HUD_COLOUR_RADAR_DAMAGE"] = 27] = "HUD_COLOUR_RADAR_DAMAGE";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER1"] = 28] = "HUD_COLOUR_NET_PLAYER1";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER2"] = 29] = "HUD_COLOUR_NET_PLAYER2";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER3"] = 30] = "HUD_COLOUR_NET_PLAYER3";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER4"] = 31] = "HUD_COLOUR_NET_PLAYER4";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER5"] = 32] = "HUD_COLOUR_NET_PLAYER5";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER6"] = 33] = "HUD_COLOUR_NET_PLAYER6";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER7"] = 34] = "HUD_COLOUR_NET_PLAYER7";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER8"] = 35] = "HUD_COLOUR_NET_PLAYER8";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER9"] = 36] = "HUD_COLOUR_NET_PLAYER9";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER10"] = 37] = "HUD_COLOUR_NET_PLAYER10";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER11"] = 38] = "HUD_COLOUR_NET_PLAYER11";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER12"] = 39] = "HUD_COLOUR_NET_PLAYER12";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER13"] = 40] = "HUD_COLOUR_NET_PLAYER13";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER14"] = 41] = "HUD_COLOUR_NET_PLAYER14";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER15"] = 42] = "HUD_COLOUR_NET_PLAYER15";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER16"] = 43] = "HUD_COLOUR_NET_PLAYER16";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER17"] = 44] = "HUD_COLOUR_NET_PLAYER17";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER18"] = 45] = "HUD_COLOUR_NET_PLAYER18";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER19"] = 46] = "HUD_COLOUR_NET_PLAYER19";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER20"] = 47] = "HUD_COLOUR_NET_PLAYER20";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER21"] = 48] = "HUD_COLOUR_NET_PLAYER21";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER22"] = 49] = "HUD_COLOUR_NET_PLAYER22";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER23"] = 50] = "HUD_COLOUR_NET_PLAYER23";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER24"] = 51] = "HUD_COLOUR_NET_PLAYER24";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER25"] = 52] = "HUD_COLOUR_NET_PLAYER25";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER26"] = 53] = "HUD_COLOUR_NET_PLAYER26";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER27"] = 54] = "HUD_COLOUR_NET_PLAYER27";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER28"] = 55] = "HUD_COLOUR_NET_PLAYER28";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER29"] = 56] = "HUD_COLOUR_NET_PLAYER29";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER30"] = 57] = "HUD_COLOUR_NET_PLAYER30";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER31"] = 58] = "HUD_COLOUR_NET_PLAYER31";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER32"] = 59] = "HUD_COLOUR_NET_PLAYER32";
    HudColor[HudColor["HUD_COLOUR_SIMPLEBLIP_DEFAULT"] = 60] = "HUD_COLOUR_SIMPLEBLIP_DEFAULT";
    HudColor[HudColor["HUD_COLOUR_MENU_BLUE"] = 61] = "HUD_COLOUR_MENU_BLUE";
    HudColor[HudColor["HUD_COLOUR_MENU_GREY_LIGHT"] = 62] = "HUD_COLOUR_MENU_GREY_LIGHT";
    HudColor[HudColor["HUD_COLOUR_MENU_BLUE_EXTRA_DARK"] = 63] = "HUD_COLOUR_MENU_BLUE_EXTRA_DARK";
    HudColor[HudColor["HUD_COLOUR_MENU_YELLOW"] = 64] = "HUD_COLOUR_MENU_YELLOW";
    HudColor[HudColor["HUD_COLOUR_MENU_YELLOW_DARK"] = 65] = "HUD_COLOUR_MENU_YELLOW_DARK";
    HudColor[HudColor["HUD_COLOUR_MENU_GREEN"] = 66] = "HUD_COLOUR_MENU_GREEN";
    HudColor[HudColor["HUD_COLOUR_MENU_GREY"] = 67] = "HUD_COLOUR_MENU_GREY";
    HudColor[HudColor["HUD_COLOUR_MENU_GREY_DARK"] = 68] = "HUD_COLOUR_MENU_GREY_DARK";
    HudColor[HudColor["HUD_COLOUR_MENU_HIGHLIGHT"] = 69] = "HUD_COLOUR_MENU_HIGHLIGHT";
    HudColor[HudColor["HUD_COLOUR_MENU_STANDARD"] = 70] = "HUD_COLOUR_MENU_STANDARD";
    HudColor[HudColor["HUD_COLOUR_MENU_DIMMED"] = 71] = "HUD_COLOUR_MENU_DIMMED";
    HudColor[HudColor["HUD_COLOUR_MENU_EXTRA_DIMMED"] = 72] = "HUD_COLOUR_MENU_EXTRA_DIMMED";
    HudColor[HudColor["HUD_COLOUR_BRIEF_TITLE"] = 73] = "HUD_COLOUR_BRIEF_TITLE";
    HudColor[HudColor["HUD_COLOUR_MID_GREY_MP"] = 74] = "HUD_COLOUR_MID_GREY_MP";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER1_DARK"] = 75] = "HUD_COLOUR_NET_PLAYER1_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER2_DARK"] = 76] = "HUD_COLOUR_NET_PLAYER2_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER3_DARK"] = 77] = "HUD_COLOUR_NET_PLAYER3_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER4_DARK"] = 78] = "HUD_COLOUR_NET_PLAYER4_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER5_DARK"] = 79] = "HUD_COLOUR_NET_PLAYER5_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER6_DARK"] = 80] = "HUD_COLOUR_NET_PLAYER6_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER7_DARK"] = 81] = "HUD_COLOUR_NET_PLAYER7_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER8_DARK"] = 82] = "HUD_COLOUR_NET_PLAYER8_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER9_DARK"] = 83] = "HUD_COLOUR_NET_PLAYER9_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER10_DARK"] = 84] = "HUD_COLOUR_NET_PLAYER10_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER11_DARK"] = 85] = "HUD_COLOUR_NET_PLAYER11_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER12_DARK"] = 86] = "HUD_COLOUR_NET_PLAYER12_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER13_DARK"] = 87] = "HUD_COLOUR_NET_PLAYER13_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER14_DARK"] = 88] = "HUD_COLOUR_NET_PLAYER14_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER15_DARK"] = 89] = "HUD_COLOUR_NET_PLAYER15_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER16_DARK"] = 90] = "HUD_COLOUR_NET_PLAYER16_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER17_DARK"] = 91] = "HUD_COLOUR_NET_PLAYER17_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER18_DARK"] = 92] = "HUD_COLOUR_NET_PLAYER18_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER19_DARK"] = 93] = "HUD_COLOUR_NET_PLAYER19_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER20_DARK"] = 94] = "HUD_COLOUR_NET_PLAYER20_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER21_DARK"] = 95] = "HUD_COLOUR_NET_PLAYER21_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER22_DARK"] = 96] = "HUD_COLOUR_NET_PLAYER22_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER23_DARK"] = 97] = "HUD_COLOUR_NET_PLAYER23_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER24_DARK"] = 98] = "HUD_COLOUR_NET_PLAYER24_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER25_DARK"] = 99] = "HUD_COLOUR_NET_PLAYER25_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER26_DARK"] = 100] = "HUD_COLOUR_NET_PLAYER26_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER27_DARK"] = 101] = "HUD_COLOUR_NET_PLAYER27_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER28_DARK"] = 102] = "HUD_COLOUR_NET_PLAYER28_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER29_DARK"] = 103] = "HUD_COLOUR_NET_PLAYER29_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER30_DARK"] = 104] = "HUD_COLOUR_NET_PLAYER30_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER31_DARK"] = 105] = "HUD_COLOUR_NET_PLAYER31_DARK";
    HudColor[HudColor["HUD_COLOUR_NET_PLAYER32_DARK"] = 106] = "HUD_COLOUR_NET_PLAYER32_DARK";
    HudColor[HudColor["HUD_COLOUR_BRONZE"] = 107] = "HUD_COLOUR_BRONZE";
    HudColor[HudColor["HUD_COLOUR_SILVER"] = 108] = "HUD_COLOUR_SILVER";
    HudColor[HudColor["HUD_COLOUR_GOLD"] = 109] = "HUD_COLOUR_GOLD";
    HudColor[HudColor["HUD_COLOUR_PLATINUM"] = 110] = "HUD_COLOUR_PLATINUM";
    HudColor[HudColor["HUD_COLOUR_GANG1"] = 111] = "HUD_COLOUR_GANG1";
    HudColor[HudColor["HUD_COLOUR_GANG2"] = 112] = "HUD_COLOUR_GANG2";
    HudColor[HudColor["HUD_COLOUR_GANG3"] = 113] = "HUD_COLOUR_GANG3";
    HudColor[HudColor["HUD_COLOUR_GANG4"] = 114] = "HUD_COLOUR_GANG4";
    HudColor[HudColor["HUD_COLOUR_SAME_CREW"] = 115] = "HUD_COLOUR_SAME_CREW";
    HudColor[HudColor["HUD_COLOUR_FREEMODE"] = 116] = "HUD_COLOUR_FREEMODE";
    HudColor[HudColor["HUD_COLOUR_PAUSE_BG"] = 117] = "HUD_COLOUR_PAUSE_BG";
    HudColor[HudColor["HUD_COLOUR_FRIENDLY"] = 118] = "HUD_COLOUR_FRIENDLY";
    HudColor[HudColor["HUD_COLOUR_ENEMY"] = 119] = "HUD_COLOUR_ENEMY";
    HudColor[HudColor["HUD_COLOUR_LOCATION"] = 120] = "HUD_COLOUR_LOCATION";
    HudColor[HudColor["HUD_COLOUR_PICKUP"] = 121] = "HUD_COLOUR_PICKUP";
    HudColor[HudColor["HUD_COLOUR_PAUSE_SINGLEPLAYER"] = 122] = "HUD_COLOUR_PAUSE_SINGLEPLAYER";
    HudColor[HudColor["HUD_COLOUR_FREEMODE_DARK"] = 123] = "HUD_COLOUR_FREEMODE_DARK";
    HudColor[HudColor["HUD_COLOUR_INACTIVE_MISSION"] = 124] = "HUD_COLOUR_INACTIVE_MISSION";
    HudColor[HudColor["HUD_COLOUR_DAMAGE"] = 125] = "HUD_COLOUR_DAMAGE";
    HudColor[HudColor["HUD_COLOUR_PINKLIGHT"] = 126] = "HUD_COLOUR_PINKLIGHT";
    HudColor[HudColor["HUD_COLOUR_PM_MITEM_HIGHLIGHT"] = 127] = "HUD_COLOUR_PM_MITEM_HIGHLIGHT";
    HudColor[HudColor["HUD_COLOUR_SCRIPT_VARIABLE"] = 128] = "HUD_COLOUR_SCRIPT_VARIABLE";
    HudColor[HudColor["HUD_COLOUR_YOGA"] = 129] = "HUD_COLOUR_YOGA";
    HudColor[HudColor["HUD_COLOUR_TENNIS"] = 130] = "HUD_COLOUR_TENNIS";
    HudColor[HudColor["HUD_COLOUR_GOLF"] = 131] = "HUD_COLOUR_GOLF";
    HudColor[HudColor["HUD_COLOUR_SHOOTING_RANGE"] = 132] = "HUD_COLOUR_SHOOTING_RANGE";
    HudColor[HudColor["HUD_COLOUR_FLIGHT_SCHOOL"] = 133] = "HUD_COLOUR_FLIGHT_SCHOOL";
    HudColor[HudColor["HUD_COLOUR_NORTH_BLUE"] = 134] = "HUD_COLOUR_NORTH_BLUE";
    HudColor[HudColor["HUD_COLOUR_SOCIAL_CLUB"] = 135] = "HUD_COLOUR_SOCIAL_CLUB";
    HudColor[HudColor["HUD_COLOUR_PLATFORM_BLUE"] = 136] = "HUD_COLOUR_PLATFORM_BLUE";
    HudColor[HudColor["HUD_COLOUR_PLATFORM_GREEN"] = 137] = "HUD_COLOUR_PLATFORM_GREEN";
    HudColor[HudColor["HUD_COLOUR_PLATFORM_GREY"] = 138] = "HUD_COLOUR_PLATFORM_GREY";
    HudColor[HudColor["HUD_COLOUR_FACEBOOK_BLUE"] = 139] = "HUD_COLOUR_FACEBOOK_BLUE";
    HudColor[HudColor["HUD_COLOUR_INGAME_BG"] = 140] = "HUD_COLOUR_INGAME_BG";
    HudColor[HudColor["HUD_COLOUR_DARTS"] = 141] = "HUD_COLOUR_DARTS";
    HudColor[HudColor["HUD_COLOUR_WAYPOINT"] = 142] = "HUD_COLOUR_WAYPOINT";
    HudColor[HudColor["HUD_COLOUR_MICHAEL"] = 143] = "HUD_COLOUR_MICHAEL";
    HudColor[HudColor["HUD_COLOUR_FRANKLIN"] = 144] = "HUD_COLOUR_FRANKLIN";
    HudColor[HudColor["HUD_COLOUR_TREVOR"] = 145] = "HUD_COLOUR_TREVOR";
    HudColor[HudColor["HUD_COLOUR_GOLF_P1"] = 146] = "HUD_COLOUR_GOLF_P1";
    HudColor[HudColor["HUD_COLOUR_GOLF_P2"] = 147] = "HUD_COLOUR_GOLF_P2";
    HudColor[HudColor["HUD_COLOUR_GOLF_P3"] = 148] = "HUD_COLOUR_GOLF_P3";
    HudColor[HudColor["HUD_COLOUR_GOLF_P4"] = 149] = "HUD_COLOUR_GOLF_P4";
    HudColor[HudColor["HUD_COLOUR_WAYPOINTLIGHT"] = 150] = "HUD_COLOUR_WAYPOINTLIGHT";
    HudColor[HudColor["HUD_COLOUR_WAYPOINTDARK"] = 151] = "HUD_COLOUR_WAYPOINTDARK";
    HudColor[HudColor["HUD_COLOUR_PANEL_LIGHT"] = 152] = "HUD_COLOUR_PANEL_LIGHT";
    HudColor[HudColor["HUD_COLOUR_MICHAEL_DARK"] = 153] = "HUD_COLOUR_MICHAEL_DARK";
    HudColor[HudColor["HUD_COLOUR_FRANKLIN_DARK"] = 154] = "HUD_COLOUR_FRANKLIN_DARK";
    HudColor[HudColor["HUD_COLOUR_TREVOR_DARK"] = 155] = "HUD_COLOUR_TREVOR_DARK";
    HudColor[HudColor["HUD_COLOUR_OBJECTIVE_ROUTE"] = 156] = "HUD_COLOUR_OBJECTIVE_ROUTE";
    HudColor[HudColor["HUD_COLOUR_PAUSEMAP_TINT"] = 157] = "HUD_COLOUR_PAUSEMAP_TINT";
    HudColor[HudColor["HUD_COLOUR_PAUSE_DESELECT"] = 158] = "HUD_COLOUR_PAUSE_DESELECT";
    HudColor[HudColor["HUD_COLOUR_PM_WEAPONS_PURCHASABLE"] = 159] = "HUD_COLOUR_PM_WEAPONS_PURCHASABLE";
    HudColor[HudColor["HUD_COLOUR_PM_WEAPONS_LOCKED"] = 160] = "HUD_COLOUR_PM_WEAPONS_LOCKED";
    HudColor[HudColor["HUD_COLOUR_END_SCREEN_BG"] = 161] = "HUD_COLOUR_END_SCREEN_BG";
    HudColor[HudColor["HUD_COLOUR_CHOP"] = 162] = "HUD_COLOUR_CHOP";
    HudColor[HudColor["HUD_COLOUR_PAUSEMAP_TINT_HALF"] = 163] = "HUD_COLOUR_PAUSEMAP_TINT_HALF";
    HudColor[HudColor["HUD_COLOUR_NORTH_BLUE_OFFICIAL"] = 164] = "HUD_COLOUR_NORTH_BLUE_OFFICIAL";
    HudColor[HudColor["HUD_COLOUR_SCRIPT_VARIABLE_2"] = 165] = "HUD_COLOUR_SCRIPT_VARIABLE_2";
    HudColor[HudColor["HUD_COLOUR_H"] = 166] = "HUD_COLOUR_H";
    HudColor[HudColor["HUD_COLOUR_HDARK"] = 167] = "HUD_COLOUR_HDARK";
    HudColor[HudColor["HUD_COLOUR_T"] = 168] = "HUD_COLOUR_T";
    HudColor[HudColor["HUD_COLOUR_TDARK"] = 169] = "HUD_COLOUR_TDARK";
    HudColor[HudColor["HUD_COLOUR_HSHARD"] = 170] = "HUD_COLOUR_HSHARD";
    HudColor[HudColor["HUD_COLOUR_CONTROLLER_MICHAEL"] = 171] = "HUD_COLOUR_CONTROLLER_MICHAEL";
    HudColor[HudColor["HUD_COLOUR_CONTROLLER_FRANKLIN"] = 172] = "HUD_COLOUR_CONTROLLER_FRANKLIN";
    HudColor[HudColor["HUD_COLOUR_CONTROLLER_TREVOR"] = 173] = "HUD_COLOUR_CONTROLLER_TREVOR";
    HudColor[HudColor["HUD_COLOUR_CONTROLLER_CHOP"] = 174] = "HUD_COLOUR_CONTROLLER_CHOP";
    HudColor[HudColor["HUD_COLOUR_VIDEO_EDITOR_VIDEO"] = 175] = "HUD_COLOUR_VIDEO_EDITOR_VIDEO";
    HudColor[HudColor["HUD_COLOUR_VIDEO_EDITOR_AUDIO"] = 176] = "HUD_COLOUR_VIDEO_EDITOR_AUDIO";
    HudColor[HudColor["HUD_COLOUR_VIDEO_EDITOR_TEXT"] = 177] = "HUD_COLOUR_VIDEO_EDITOR_TEXT";
    HudColor[HudColor["HUD_COLOUR_HB_BLUE"] = 178] = "HUD_COLOUR_HB_BLUE";
    HudColor[HudColor["HUD_COLOUR_HB_YELLOW"] = 179] = "HUD_COLOUR_HB_YELLOW";
})(HudColor || (HudColor = {}));
var HudColor$1 = HudColor;

var ChangeDirection;
(function (ChangeDirection) {
    ChangeDirection[ChangeDirection["Left"] = 0] = "Left";
    ChangeDirection[ChangeDirection["Right"] = 1] = "Right";
})(ChangeDirection || (ChangeDirection = {}));
var ChangeDirection$1 = ChangeDirection;

class Color {
    constructor(r, g, b, a = 255) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }
}
Color.Empty = new Color(0, 0, 0, 0);
Color.Transparent = new Color(0, 0, 0, 0);
Color.Black = new Color(0, 0, 0, 255);
Color.White = new Color(255, 255, 255, 255);
Color.WhiteSmoke = new Color(245, 245, 245, 255);

class Size {
    constructor(w = 0, h = 0) {
        this.Width = w;
        this.Height = h;
    }
}

class Point {
    constructor(x, y) {
        this.X = 0;
        this.Y = 0;
        this.X = x;
        this.Y = y;
    }
    static Parse(arg) {
        if (typeof arg === "object") {
            if (arg.length) {
                return new Point(arg[0], arg[1]);
            }
            else if (arg.X && arg.Y) {
                return new Point(arg.X, arg.Y);
            }
        }
        else if (typeof arg === "string") {
            if (arg.indexOf(",") !== -1) {
                const arr = arg.split(",");
                return new Point(parseFloat(arr[0]), parseFloat(arr[1]));
            }
        }
        return new Point(0, 0);
    }
}

class IElement {
    constructor() {
        this.Enabled = true;
    }
}

class Text extends IElement {
    constructor(caption, pos, scale, color, font, centered) {
        super();
        this.Caption = caption;
        this.Pos = pos;
        this.Scale = scale;
        this.Color = color || new Color(255, 255, 255, 255);
        this.Font = font || 0;
        this.Centered = centered || false;
    }
    Draw(caption, pos, scale, color, font, centered) {
        if (caption && !pos && !scale && !color && !font && !centered) {
            pos = new Point(this.Pos.X + caption.Width, this.Pos.Y + caption.Height);
            scale = this.Scale;
            color = this.Color;
            font = this.Font;
            centered = this.Centered;
        }
        const x = pos.X / 1280.0;
        const y = pos.Y / 720.0;
        game__default.setTextFont(parseInt(font));
        game__default.setTextScale(scale, scale);
        game__default.setTextColour(color.R, color.G, color.B, color.A);
        game__default.setTextCentre(centered);
        game__default.beginTextCommandDisplayText("STRING");
        Text.AddLongString(caption);
        game__default.endTextCommandDisplayText(x, y, 0);
    }
    static AddLongString(text) {
        if (!text.length)
            return;
        const maxStringLength = 99;
        for (let i = 0, position; i < text.length; i += maxStringLength) {
            let currentText = text.substr(i, i + maxStringLength);
            let currentIndex = i;
            if ((currentText.match(/~/g) || []).length % 2 !== 0) {
                position = currentText.lastIndexOf('~');
                i -= (maxStringLength - position);
            }
            else {
                position = Math.min(maxStringLength, text.length - currentIndex);
            }
            game__default.addTextComponentSubstringPlayerName(text.substr(currentIndex, position));
        }
    }
}

const gameScreen = game__default.getActiveScreenResolution(0, 0);
class Screen {
    static get ResolutionMaintainRatio() {
        const ratio = Screen.Width / Screen.Height;
        const width = 1080.0 * ratio;
        return new Size(width, 1080.0);
    }
    static MousePosition(relative = false) {
        const res = Screen.ResolutionMaintainRatio;
        const cursor = getCursorPos();
        let [mouseX, mouseY] = [cursor.x, cursor.y];
        if (relative)
            [mouseX, mouseY] = [cursor.x / res.Width, cursor.y / res.Height];
        return {
            X: mouseX,
            Y: mouseY
        };
    }
    static IsMouseInBounds(topLeft, boxSize) {
        const mousePosition = Screen.MousePosition();
        return (mousePosition.X >= topLeft.X &&
            mousePosition.X <= topLeft.X + boxSize.Width &&
            (mousePosition.Y > topLeft.Y && mousePosition.Y < topLeft.Y + boxSize.Height));
    }
    static GetTextWidth(text, font, scale) {
        game__default.beginTextCommandGetWidth("CELL_EMAIL_BCON");
        Text.AddLongString(text);
        game__default.setTextFont(font);
        game__default.setTextScale(1.0, scale);
        const width = game__default.endTextCommandGetWidth(true);
        const res = Screen.ResolutionMaintainRatio;
        return res.Width * width;
    }
    static GetLineCount(text, position, font, scale, wrap) {
        game__default.beginTextCommandLineCount("CELL_EMAIL_BCON");
        Text.AddLongString(text);
        const res = Screen.ResolutionMaintainRatio;
        const x = position.X / res.Width;
        const y = position.Y / res.Height;
        game__default.setTextFont(font);
        game__default.setTextScale(1.0, scale);
        if (wrap > 0) {
            const start = position.X / res.Width;
            const end = start + (wrap / res.Width);
            game__default.setTextWrap(x, end);
        }
        let lineCount = game__default.endTextCommandLineCount(x, y);
        return lineCount;
    }
}
Screen.Width = gameScreen[1];
Screen.Height = gameScreen[2];

class Sprite {
    constructor(textureDict, textureName, pos, size, heading = 0, color = new Color(255, 255, 255)) {
        this.TextureDict = textureDict;
        this.TextureName = textureName;
        this.Pos = pos;
        this.Size = size;
        this.Heading = heading;
        this.Color = color;
        this.Visible = true;
    }
    LoadTextureDictionary() {
        this.requestTextureDictPromise(this._textureDict).then((succ) => { });
    }
    requestTextureDictPromise(textureDict) {
        return new Promise((resolve, reject) => {
            game__default.requestStreamedTextureDict(textureDict, true);
            let inter = setInterval(() => {
                if (game__default.hasStreamedTextureDictLoaded(textureDict)) {
                    clearInterval(inter);
                    return resolve(true);
                }
            }, 10);
        });
    }
    set TextureDict(v) {
        this._textureDict = v;
        if (!this.IsTextureDictionaryLoaded)
            this.LoadTextureDictionary();
    }
    get TextureDict() {
        return this._textureDict;
    }
    get IsTextureDictionaryLoaded() {
        return game__default.hasStreamedTextureDictLoaded(this._textureDict);
    }
    Draw(textureDictionary, textureName, pos, size, heading, color, loadTexture) {
        textureDictionary = textureDictionary || this.TextureDict;
        textureName = textureName || this.TextureName;
        pos = pos || this.Pos;
        size = size || this.Size;
        heading = heading || this.Heading;
        color = color || this.Color;
        loadTexture = loadTexture || true;
        if (loadTexture) {
            if (!game__default.hasStreamedTextureDictLoaded(textureDictionary))
                game__default.requestStreamedTextureDict(textureDictionary, true);
        }
        const screenw = Screen.Width;
        const screenh = Screen.Height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;
        const w = this.Size.Width / width;
        const h = this.Size.Height / height;
        const x = this.Pos.X / width + w * 0.5;
        const y = this.Pos.Y / height + h * 0.5;
        game__default.drawSprite(textureDictionary, textureName, x, y, w, h, heading, color.R, color.G, color.B, color.A, true);
    }
}

class Rectangle extends IElement {
    constructor(pos, size, color) {
        super();
        this.Enabled = true;
        this.Pos = pos;
        this.Size = size;
        this.Color = color;
    }
    Draw(pos, size, color) {
        if (!pos)
            pos = new Size(0, 0);
        if (!size && !color) {
            pos = new Point(this.Pos.X + pos.Width, this.Pos.Y + pos.Height);
            size = this.Size;
            color = this.Color;
        }
        const w = size.Width / 1280.0;
        const h = size.Height / 720.0;
        const x = pos.X / 1280.0 + w * 0.5;
        const y = pos.Y / 720.0 + h * 0.5;
        game__default.drawRect(x, y, w, h, color.R, color.G, color.B, color.A, false);
    }
}

class ResRectangle extends Rectangle {
    constructor(pos, size, color) {
        super(pos, size, color);
    }
    Draw(pos, size, color) {
        if (!pos)
            pos = new Size();
        if (pos && !size && !color) {
            pos = new Point(this.Pos.X + pos.Width, this.Pos.Y + pos.Height);
            size = this.Size;
            color = this.Color;
        }
        const screenw = Screen.Width;
        const screenh = Screen.Height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;
        const w = size.Width / width;
        const h = size.Height / height;
        const x = pos.X / width + w * 0.5;
        const y = pos.Y / height + h * 0.5;
        game__default.drawRect(x, y, w, h, color.R, color.G, color.B, color.A, false);
    }
}

class ResText extends Text {
    constructor(caption, pos, scale, color, font, centered) {
        super(caption, pos, scale, color || new Color(255, 255, 255), font || 0, false);
        this.TextAlignment = Alignment$1.Left;
        this.Wrap = 0;
        if (centered)
            this.TextAlignment = centered;
    }
    get WordWrap() {
        return new Size(this.Wrap, 0);
    }
    set WordWrap(value) {
        this.Wrap = value.Width;
    }
    Draw(arg1, pos, scale, color, font, arg2, dropShadow, outline, wordWrap) {
        let caption = arg1;
        let centered = arg2;
        let textAlignment = arg2;
        if (!arg1)
            arg1 = new Size(0, 0);
        if (arg1 && !pos) {
            textAlignment = this.TextAlignment;
            caption = this.Caption;
            pos = new Point(this.Pos.X + arg1.Width, this.Pos.Y + arg1.Height);
            scale = this.Scale;
            color = this.Color;
            font = this.Font;
            if (centered == true || centered == false) {
                centered = this.Centered;
            }
            else {
                centered = undefined;
                dropShadow = this.DropShadow;
                outline = this.Outline;
                wordWrap = this.WordWrap;
            }
        }
        const screenw = Screen.Width;
        const screenh = Screen.Height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;
        const x = this.Pos.X / width;
        const y = this.Pos.Y / height;
        game__default.setTextFont(parseInt(font));
        game__default.setTextScale(1.0, scale);
        game__default.setTextColour(color.R, color.G, color.B, color.A);
        if (centered !== undefined) {
            game__default.setTextCentre(centered);
        }
        else {
            if (dropShadow)
                game__default.setTextDropshadow(2, 0, 0, 0, 0);
            if (outline)
                logWarning("[NativeUI] ResText outline not working!");
            switch (textAlignment) {
                case Alignment$1.Centered:
                    game__default.setTextCentre(true);
                    break;
                case Alignment$1.Right:
                    game__default.setTextRightJustify(true);
                    game__default.setTextWrap(0.0, x);
                    break;
            }
            if (this.Wrap) {
                const xsize = (this.Pos.X + this.Wrap) / width;
                game__default.setTextWrap(x, xsize);
            }
        }
        game__default.beginTextCommandDisplayText("CELL_EMAIL_BCON");
        Text.AddLongString(caption);
        game__default.endTextCommandDisplayText(x, y, 0);
    }
}

function UUIDV4() {
    let uuid = "";
    let ii;
    for (ii = 0; ii < 32; ii += 1) {
        switch (ii) {
            case 8:
            case 20:
                uuid += "-";
                uuid += ((Math.random() * 16) | 0).toString(16);
                break;
            case 12:
                uuid += "-";
                uuid += "4";
                break;
            case 16:
                uuid += "-";
                uuid += ((Math.random() * 4) | 8).toString(16);
                break;
            default:
                uuid += ((Math.random() * 16) | 0).toString(16);
        }
    }
    return uuid;
}

class UIMenuItem {
    constructor(text, description = "", data = null) {
        this.Id = UUIDV4();
        this.BackColor = UIMenuItem.DefaultBackColor;
        this.HighlightedBackColor = UIMenuItem.DefaultHighlightedBackColor;
        this.ForeColor = UIMenuItem.DefaultForeColor;
        this.HighlightedForeColor = UIMenuItem.DefaultHighlightedForeColor;
        this.RightLabel = "";
        this.LeftBadge = BadgeStyle$1.None;
        this.RightBadge = BadgeStyle$1.None;
        this.Enabled = true;
        this.Data = data;
        this._rectangle = new ResRectangle(new Point(0, 0), new Size(431, 38), new Color(150, 0, 0, 0));
        this._text = new ResText(text, new Point(8, 0), 0.33, Color.WhiteSmoke, Font$1.ChaletLondon, Alignment$1.Left);
        this.Description = description;
        this._selectedSprite = new Sprite("commonmenu", "gradient_nav", new Point(0, 0), new Size(431, 38));
        this._badgeLeft = new Sprite("commonmenu", "", new Point(0, 0), new Size(40, 40));
        this._badgeRight = new Sprite("commonmenu", "", new Point(0, 0), new Size(40, 40));
        this._labelText = new ResText("", new Point(0, 0), 0.35, Color.White, 0, Alignment$1.Right);
    }
    get Text() {
        return this._text.Caption;
    }
    set Text(text) {
        this._text.Caption = text;
    }
    get Description() {
        return this._description;
    }
    set Description(text) {
        this._description = text;
        if (this.hasOwnProperty('Parent')) {
            this.Parent.UpdateDescriptionCaption();
        }
    }
    SetVerticalPosition(y) {
        this._rectangle.Pos = new Point(this.Offset.X, y + 144 + this.Offset.Y);
        this._selectedSprite.Pos = new Point(0 + this.Offset.X, y + 144 + this.Offset.Y);
        this._text.Pos = new Point(8 + this.Offset.X, y + 147 + this.Offset.Y);
        this._badgeLeft.Pos = new Point(0 + this.Offset.X, y + 142 + this.Offset.Y);
        this._badgeRight.Pos = new Point(385 + this.Offset.X, y + 142 + this.Offset.Y);
        this._labelText.Pos = new Point(420 + this.Offset.X, y + 148 + this.Offset.Y);
    }
    addEvent(event, ...args) {
        this._event = { event: event, args: args };
    }
    fireEvent() {
        if (this._event) {
            emit(this._event.event, ...this._event.args);
        }
    }
    Draw() {
        this._rectangle.Size = new Size(431 + this.Parent.WidthOffset, 38);
        this._selectedSprite.Size = new Size(431 + this.Parent.WidthOffset, 38);
        if (this.Hovered && !this.Selected) {
            this._rectangle.Color = new Color(255, 255, 255, 20);
            this._rectangle.Draw();
        }
        this._selectedSprite.Color = this.Selected
            ? this.HighlightedBackColor
            : this.BackColor;
        this._selectedSprite.Draw();
        this._text.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        if (this.LeftBadge != BadgeStyle$1.None) {
            this._text.Pos = new Point(35 + this.Offset.X, this._text.Pos.Y);
            this._badgeLeft.TextureDict = this.BadgeToSpriteLib(this.LeftBadge);
            this._badgeLeft.TextureName = this.BadgeToSpriteName(this.LeftBadge, this.Selected);
            this._badgeLeft.Color = this.IsBagdeWhiteSprite(this.LeftBadge)
                ? this.Enabled
                    ? this.Selected
                        ? this.HighlightedForeColor
                        : this.ForeColor
                    : new Color(163, 159, 148)
                : Color.White;
            this._badgeLeft.Draw();
        }
        else {
            this._text.Pos = new Point(8 + this.Offset.X, this._text.Pos.Y);
        }
        if (this.RightBadge != BadgeStyle$1.None) {
            this._badgeRight.Pos = new Point(385 + this.Offset.X + this.Parent.WidthOffset, this._badgeRight.Pos.Y);
            this._badgeRight.TextureDict = this.BadgeToSpriteLib(this.RightBadge);
            this._badgeRight.TextureName = this.BadgeToSpriteName(this.RightBadge, this.Selected);
            this._badgeRight.Color = this.IsBagdeWhiteSprite(this.RightBadge)
                ? this.Enabled
                    ? this.Selected
                        ? this.HighlightedForeColor
                        : this.ForeColor
                    : new Color(163, 159, 148)
                : Color.White;
            this._badgeRight.Draw();
        }
        if (this.RightLabel && this.RightLabel !== "") {
            this._labelText.Pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._labelText.Pos.Y);
            this._labelText.Caption = this.RightLabel;
            this._labelText.Color = this._text.Color = this.Enabled
                ? this.Selected
                    ? this.HighlightedForeColor
                    : this.ForeColor
                : new Color(163, 159, 148);
            this._labelText.Draw();
        }
        this._text.Draw();
    }
    SetLeftBadge(badge) {
        this.LeftBadge = badge;
    }
    SetRightBadge(badge) {
        this.RightBadge = badge;
    }
    SetRightLabel(text) {
        this.RightLabel = text;
    }
    BadgeToSpriteLib(badge) {
        switch (badge) {
            case BadgeStyle$1.Sale:
                return "mpshopsale";
            case BadgeStyle$1.Audio1:
            case BadgeStyle$1.Audio2:
            case BadgeStyle$1.Audio3:
            case BadgeStyle$1.AudioInactive:
            case BadgeStyle$1.AudioMute:
                return "mpleaderboard";
            default:
                return "commonmenu";
        }
    }
    BadgeToSpriteName(badge, selected) {
        switch (badge) {
            case BadgeStyle$1.None:
                return "";
            case BadgeStyle$1.BronzeMedal:
                return "mp_medal_bronze";
            case BadgeStyle$1.GoldMedal:
                return "mp_medal_gold";
            case BadgeStyle$1.SilverMedal:
                return "medal_silver";
            case BadgeStyle$1.Alert:
                return "mp_alerttriangle";
            case BadgeStyle$1.Crown:
                return "mp_hostcrown";
            case BadgeStyle$1.Ammo:
                return selected ? "shop_ammo_icon_b" : "shop_ammo_icon_a";
            case BadgeStyle$1.Armour:
                return selected ? "shop_armour_icon_b" : "shop_armour_icon_a";
            case BadgeStyle$1.Barber:
                return selected ? "shop_barber_icon_b" : "shop_barber_icon_a";
            case BadgeStyle$1.Clothes:
                return selected ? "shop_clothing_icon_b" : "shop_clothing_icon_a";
            case BadgeStyle$1.Franklin:
                return selected ? "shop_franklin_icon_b" : "shop_franklin_icon_a";
            case BadgeStyle$1.Bike:
                return selected ? "shop_garage_bike_icon_b" : "shop_garage_bike_icon_a";
            case BadgeStyle$1.Car:
                return selected ? "shop_garage_icon_b" : "shop_garage_icon_a";
            case BadgeStyle$1.Gun:
                return selected ? "shop_gunclub_icon_b" : "shop_gunclub_icon_a";
            case BadgeStyle$1.Heart:
                return selected ? "shop_health_icon_b" : "shop_health_icon_a";
            case BadgeStyle$1.Lock:
                return "shop_lock";
            case BadgeStyle$1.Makeup:
                return selected ? "shop_makeup_icon_b" : "shop_makeup_icon_a";
            case BadgeStyle$1.Mask:
                return selected ? "shop_mask_icon_b" : "shop_mask_icon_a";
            case BadgeStyle$1.Michael:
                return selected ? "shop_michael_icon_b" : "shop_michael_icon_a";
            case BadgeStyle$1.Star:
                return "shop_new_star";
            case BadgeStyle$1.Tattoo:
                return selected ? "shop_tattoos_icon_b" : "shop_tattoos_icon_a";
            case BadgeStyle$1.Tick:
                return "shop_tick_icon";
            case BadgeStyle$1.Trevor:
                return selected ? "shop_trevor_icon_b" : "shop_trevor_icon_a";
            case BadgeStyle$1.Sale:
                return "saleicon";
            case BadgeStyle$1.ArrowLeft:
                return "arrowleft";
            case BadgeStyle$1.ArrowRight:
                return "arrowright";
            case BadgeStyle$1.Audio1:
                return "leaderboard_audio_1";
            case BadgeStyle$1.Audio2:
                return "leaderboard_audio_2";
            case BadgeStyle$1.Audio3:
                return "leaderboard_audio_3";
            case BadgeStyle$1.AudioInactive:
                return "leaderboard_audio_inactive";
            case BadgeStyle$1.AudioMute:
                return "leaderboard_audio_mute";
            default:
                return "";
        }
    }
    IsBagdeWhiteSprite(badge) {
        switch (badge) {
            case BadgeStyle$1.Lock:
            case BadgeStyle$1.Tick:
            case BadgeStyle$1.Crown:
                return true;
            default:
                return false;
        }
    }
    BadgeToColor(badge, selected) {
        switch (badge) {
            case BadgeStyle$1.Lock:
            case BadgeStyle$1.Tick:
            case BadgeStyle$1.Crown:
                return selected
                    ? new Color(255, 0, 0, 0)
                    : new Color(255, 255, 255, 255);
            default:
                return new Color(255, 255, 255, 255);
        }
    }
}
UIMenuItem.DefaultBackColor = Color.Empty;
UIMenuItem.DefaultHighlightedBackColor = Color.White;
UIMenuItem.DefaultForeColor = Color.WhiteSmoke;
UIMenuItem.DefaultHighlightedForeColor = Color.Black;

class UIMenuCheckboxItem extends UIMenuItem {
    constructor(text, check = false, description = "") {
        super(text, description);
        this.Checked = false;
        const y = 0;
        this._checkedSprite = new Sprite("commonmenu", "shop_box_blank", new Point(410, y + 95), new Size(50, 50));
        this.Checked = check;
    }
    SetVerticalPosition(y) {
        super.SetVerticalPosition(y);
        this._checkedSprite.Pos = new Point(380 + this.Offset.X + this.Parent.WidthOffset, y + 138 + this.Offset.Y);
    }
    Draw() {
        super.Draw();
        this._checkedSprite.Pos = this._checkedSprite.Pos = new Point(380 + this.Offset.X + this.Parent.WidthOffset, this._checkedSprite.Pos.Y);
        const isDefaultHightlitedForeColor = this.HighlightedForeColor == UIMenuItem.DefaultHighlightedForeColor;
        if (this.Selected && isDefaultHightlitedForeColor) {
            this._checkedSprite.TextureName = this.Checked
                ? "shop_box_tickb"
                : "shop_box_blankb";
        }
        else {
            this._checkedSprite.TextureName = this.Checked
                ? "shop_box_tick"
                : "shop_box_blank";
        }
        this._checkedSprite.Color = this.Enabled
            ? this.Selected && !isDefaultHightlitedForeColor
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._checkedSprite.Draw();
    }
    SetRightBadge(badge) {
        return this;
    }
    SetRightLabel(text) {
        return this;
    }
}

class ListItem {
    constructor(text = "", data = null) {
        this.Id = UUIDV4();
        this.DisplayText = text;
        this.Data = data;
    }
}

class ItemsCollection {
    constructor(items) {
        if (items.length === 0)
            throw new Error("ItemsCollection cannot be empty");
        this.items = items;
    }
    length() {
        return this.items.length;
    }
    getListItems() {
        const items = [];
        for (const item of this.items) {
            if (item instanceof ListItem) {
                items.push(item);
            }
            else if (typeof item == "string") {
                items.push(new ListItem(item));
            }
            else if (typeof item == "number") {
                items.push(new ListItem(item.toString()));
            }
        }
        return items;
    }
}

class UIMenuListItem extends UIMenuItem {
    constructor(text, description = "", collection = new ItemsCollection([]), startIndex = 0, data = null) {
        super(text, description, data);
        this.ScrollingEnabled = true;
        this.HoldTimeBeforeScroll = 200;
        this._currentOffset = 0;
        this._itemsCollection = [];
        this._index = 0;
        let y = 0;
        this.Collection = collection.getListItems();
        this.Index = startIndex;
        this._arrowLeft = new Sprite("commonmenu", "arrowleft", new Point(110, 105 + y), new Size(30, 30));
        this._arrowRight = new Sprite("commonmenu", "arrowright", new Point(280, 105 + y), new Size(30, 30));
        this._itemText = new ResText("", new Point(290, y + 104), 0.35, Color.White, Font$1.ChaletLondon, Alignment$1.Right);
    }
    get Collection() {
        return this._itemsCollection;
    }
    set Collection(v) {
        if (!v)
            throw new Error("The collection can't be null");
        this._itemsCollection = v;
    }
    set SelectedItem(v) {
        const idx = this.Collection.findIndex(li => li.Id === v.Id);
        if (idx > 0)
            this.Index = idx;
        else
            this.Index = 0;
    }
    get SelectedItem() {
        return this.Collection.length > 0 ? this.Collection[this.Index] : null;
    }
    get SelectedValue() {
        return this.SelectedItem == null
            ? null
            : this.SelectedItem.Data == null
                ? this.SelectedItem.DisplayText
                : this.SelectedItem.Data;
    }
    get Index() {
        if (this.Collection == null)
            return -1;
        if (this.Collection != null && this.Collection.length == 0)
            return -1;
        return this._index % this.Collection.length;
    }
    set Index(value) {
        if (this.Collection == null)
            return;
        if (this.Collection != null && this.Collection.length == 0)
            return;
        this._index = 100000000 - (100000000 % this.Collection.length) + value;
        const caption = this.Collection.length >= this.Index
            ? this.Collection[this.Index].DisplayText
            : " ";
        this._currentOffset = Screen.GetTextWidth(caption, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35);
    }
    setCollection(collection) {
        this.Collection = collection.getListItems();
    }
    setCollectionItem(index, item, resetSelection = true) {
        if (index > this.Collection.length)
            throw new Error("Index out of bounds");
        if (typeof item === "string")
            item = new ListItem(item);
        this.Collection.splice(index, 1, item);
        if (resetSelection)
            this.Index = 0;
    }
    SetVerticalPosition(y) {
        this._arrowLeft.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._arrowRight.Pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._itemText.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, y + 147 + this.Offset.Y);
        super.SetVerticalPosition(y);
    }
    SetRightLabel(text) {
        return this;
    }
    SetRightBadge(badge) {
        return this;
    }
    Draw() {
        super.Draw();
        const caption = this.Collection.length >= this.Index
            ? this.Collection[this.Index].DisplayText
            : " ";
        const offset = this._currentOffset;
        this._itemText.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._itemText.Caption = caption;
        this._arrowLeft.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowRight.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowLeft.Pos = new Point(380 - offset + this.Offset.X + this.Parent.WidthOffset, this._arrowLeft.Pos.Y);
        if (this.Selected) {
            this._arrowLeft.Draw();
            this._arrowRight.Draw();
            this._itemText.Pos = new Point(405 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        else {
            this._itemText.Pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        this._itemText.Draw();
    }
}

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};
const fixFloat = (n) => {
    return Number.isInteger(n) ? n : parseFloat(n.toFixed(10));
};

class UIMenuAutoListItem extends UIMenuItem {
    constructor(text, description = "", lowerThreshold = 0, upperThreshold = 10, startValue = 0, data = null) {
        super(text, description, data);
        this._currentOffset = 0;
        this._leftMoveThreshold = 1;
        this._rightMoveThreshold = 1;
        this._lowerThreshold = 0;
        this._upperThreshold = 10;
        this._preCaptionText = '';
        this._postCaptionText = '';
        let y = 0;
        this.LowerThreshold = lowerThreshold;
        this.UpperThreshold = lowerThreshold > upperThreshold ? lowerThreshold : upperThreshold;
        this.SelectedValue = (startValue < lowerThreshold || startValue > upperThreshold) ? lowerThreshold : startValue;
        this._arrowLeft = new Sprite("commonmenu", "arrowleft", new Point(110, 105 + y), new Size(30, 30));
        this._arrowRight = new Sprite("commonmenu", "arrowright", new Point(280, 105 + y), new Size(30, 30));
        this._itemText = new ResText("", new Point(290, y + 104), 0.35, Color.White, Font$1.ChaletLondon, Alignment$1.Right);
    }
    get PreCaptionText() {
        return this._preCaptionText;
    }
    set PreCaptionText(text) {
        if (!text)
            throw new Error("The pre caption text can't be null");
        if (typeof text !== 'string')
            throw new Error("The pre caption text must be a string");
        this._preCaptionText = text;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue.toString() + this.PostCaptionText, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35);
    }
    get PostCaptionText() {
        return this._postCaptionText;
    }
    set PostCaptionText(text) {
        if (!text)
            throw new Error("The post caption text can't be null");
        if (typeof text !== 'string')
            throw new Error("The post caption text must be a string");
        this._postCaptionText = text;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue.toString() + this.PostCaptionText, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35);
    }
    get LeftMoveThreshold() {
        return this._leftMoveThreshold;
    }
    set LeftMoveThreshold(value) {
        if (!value)
            throw new Error("The left threshold can't be null");
        this._leftMoveThreshold = value;
    }
    get RightMoveThreshold() {
        return this._rightMoveThreshold;
    }
    set RightMoveThreshold(value) {
        if (!value)
            throw new Error("The right threshold can't be null");
        this._rightMoveThreshold = value;
    }
    get LowerThreshold() {
        return this._lowerThreshold;
    }
    set LowerThreshold(value) {
        if (typeof value !== 'number' && !value)
            throw new Error("The lower threshold can't be null");
        this._lowerThreshold = value;
        if (this.SelectedValue < value) {
            this.SelectedValue = value;
        }
    }
    get UpperThreshold() {
        return this._upperThreshold;
    }
    set UpperThreshold(value) {
        if (typeof value !== 'number' && !value)
            throw new Error("The upper threshold can't be null");
        this._upperThreshold = value;
        if (this.SelectedValue > value) {
            this.SelectedValue = value;
        }
    }
    get SelectedValue() {
        return this._selectedValue;
    }
    set SelectedValue(value) {
        if (value < this._lowerThreshold || value > this._upperThreshold)
            throw new Error("The value can not be outside the lower or upper limits");
        this._selectedValue = fixFloat(value);
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue.toString() + this.PostCaptionText, this._itemText && this._itemText.Font ? this._itemText.Font : 0, this._itemText && this._itemText.Scale ? this._itemText.Scale : 0.35);
    }
    SetVerticalPosition(y) {
        this._arrowLeft.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._arrowRight.Pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._itemText.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, y + 147 + this.Offset.Y);
        super.SetVerticalPosition(y);
    }
    SetRightLabel(text) {
        return this;
    }
    SetRightBadge(badge) {
        return this;
    }
    Draw() {
        super.Draw();
        const offset = this._currentOffset;
        this._itemText.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._itemText.Caption = this.PreCaptionText + this._selectedValue + this.PostCaptionText;
        this._arrowLeft.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowRight.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowLeft.Pos = new Point(380 - offset + this.Offset.X + this.Parent.WidthOffset, this._arrowLeft.Pos.Y);
        if (this.Selected) {
            this._arrowLeft.Draw();
            this._arrowRight.Draw();
            this._itemText.Pos = new Point(405 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        else {
            this._itemText.Pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        this._itemText.Draw();
    }
}

class UIMenuSliderItem extends UIMenuItem {
    constructor(text, items, index, description = "", divider = false, data = null) {
        super(text, description, data);
        const y = 0;
        this._items = items;
        this._arrowLeft = new Sprite("commonmenutu", "arrowleft", new Point(0, 105 + y), new Size(15, 15));
        this._arrowRight = new Sprite("commonmenutu", "arrowright", new Point(0, 105 + y), new Size(15, 15));
        this._rectangleBackground = new ResRectangle(new Point(0, 0), new Size(150, 9), new Color(4, 32, 57, 255));
        this._rectangleSlider = new ResRectangle(new Point(0, 0), new Size(75, 9), new Color(57, 116, 200, 255));
        if (divider) {
            this._rectangleDivider = new ResRectangle(new Point(0, 0), new Size(2.5, 20), Color.WhiteSmoke);
        }
        else {
            this._rectangleDivider = new ResRectangle(new Point(0, 0), new Size(2.5, 20), Color.Transparent);
        }
        this.Index = index;
    }
    get Index() {
        return this._index % this._items.length;
    }
    set Index(value) {
        this._index = 100000000 - (100000000 % this._items.length) + value;
    }
    SetVerticalPosition(y) {
        this._rectangleBackground.Pos = new Point(250 + this.Offset.X + this.Parent.WidthOffset, y + 158.5 + this.Offset.Y);
        this._rectangleSlider.Pos = new Point(250 + this.Offset.X + this.Parent.WidthOffset, y + 158.5 + this.Offset.Y);
        this._rectangleDivider.Pos = new Point(323.5 + this.Offset.X + this.Parent.WidthOffset, y + 153 + this.Offset.Y);
        this._arrowLeft.Pos = new Point(235 + this.Offset.X + this.Parent.WidthOffset, 155.5 + y + this.Offset.Y);
        this._arrowRight.Pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 155.5 + y + this.Offset.Y);
        super.SetVerticalPosition(y);
    }
    IndexToItem(index) {
        return this._items[index];
    }
    Draw() {
        super.Draw();
        this._arrowLeft.Color = this.Enabled
            ? this.Selected
                ? Color.Black
                : Color.WhiteSmoke
            : new Color(163, 159, 148);
        this._arrowRight.Color = this.Enabled
            ? this.Selected
                ? Color.Black
                : Color.WhiteSmoke
            : new Color(163, 159, 148);
        let offset = ((this._rectangleBackground.Size.Width - this._rectangleSlider.Size.Width) / (this._items.length - 1)) * this.Index;
        this._rectangleSlider.Pos = new Point(250 + this.Offset.X + offset + +this.Parent.WidthOffset, this._rectangleSlider.Pos.Y);
        if (this.Selected) {
            this._arrowLeft.Draw();
            this._arrowRight.Draw();
        }
        this._rectangleBackground.Draw();
        this._rectangleSlider.Draw();
        this._rectangleDivider.Draw();
    }
    SetRightBadge(badge) { }
    SetRightLabel(text) { }
}

class Container extends Rectangle {
    constructor(pos, size, color) {
        super(pos, size, color);
        this.Items = [];
    }
    addItem(item) {
        this.Items.push(item);
    }
    Draw(offset) {
        if (!this.Enabled)
            return;
        offset = offset || new Size();
        const screenw = Screen.Width;
        const screenh = Screen.Height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;
        const w = this.Size.Width / width;
        const h = this.Size.Height / height;
        const x = (this.Pos.X + offset.Width) / width + w * 0.5;
        const y = (this.Pos.Y + offset.Height) / height + h * 0.5;
        game__default.drawRect(x, y, w, h, this.Color.R, this.Color.G, this.Color.B, this.Color.A, false);
        for (var item of this.Items)
            item.Draw(new Size(this.Pos.X + offset.Width, this.Pos.Y + offset.Height));
    }
}

class Common {
    static PlaySound(audioName, audioRef) {
        game__default.playSound(-1, audioName, audioRef, false, 0, true);
    }
}

class LiteEvent {
    constructor() {
        this.handlers = [];
    }
    on(handler) {
        this.handlers.push(handler);
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    emit(...args) {
        this.handlers.slice(0).forEach(h => h(...args));
    }
    expose() {
        return this;
    }
    count() {
        return this.handlers.length;
    }
}

class InstructionalButton {
    constructor(text, control, buttonString = null) {
        this._itemBind = null;
        this.Text = text;
        this._buttonControl = control;
        this._usingControls = buttonString == null;
        this._buttonString = buttonString;
    }
    get ItemBind() { return this._itemBind; }
    BindToItem(item) {
        this._itemBind = item;
    }
    GetButtonId() {
        return this._usingControls ? game__default.getControlInstructionalButton(2, this._buttonControl, false) : "t_" + this._buttonString;
    }
}

class Scaleform {
    constructor(scaleForm) {
        this._handle = 0;
        this.scaleForm = scaleForm;
        this._handle = requestScaleformMovie(this.scaleForm);
    }
    get handle() {
        return this._handle;
    }
    get isValid() {
        return this._handle != 0;
    }
    get isLoaded() {
        return hasScaleformMovieLoaded(this._handle);
    }
    callFunctionHead(funcName, ...args) {
        if (!this.isValid || !this.isLoaded)
            return;
        beginScaleformMovieMethod(this._handle, funcName);
        args.forEach((arg) => {
            switch (typeof arg) {
                case "number":
                    {
                        if (Number(arg) === arg && arg % 1 !== 0) {
                            scaleformMovieMethodAddParamFloat(arg);
                        }
                        else {
                            scaleformMovieMethodAddParamInt(arg);
                        }
                    }
                case "string":
                    {
                        scaleformMovieMethodAddParamPlayerNameString(arg);
                        break;
                    }
                case "boolean":
                    {
                        scaleformMovieMethodAddParamBool(arg);
                        break;
                    }
                default:
                    {
                        logError(`Unknown argument type ${typeof arg} = ${arg.toString()} passed to scaleform with handle ${this._handle}`);
                    }
            }
        });
    }
    callFunction(funcName, ...args) {
        this.callFunctionHead(funcName, ...args);
        endScaleformMovieMethod();
    }
    callFunctionReturn(funcName, ...args) {
        this.callFunctionHead(funcName, ...args);
        return endScaleformMovieMethodReturnValue();
    }
    render2D() {
        if (!this.isValid || !this.isLoaded)
            return;
        drawScaleformMovieFullscreen(this._handle, 255, 255, 255, 255, 0);
    }
    recreate() {
        if (!this.isValid || !this.isLoaded)
            return;
        setScaleformMovieAsNoLongerNeeded(this._handle);
        this._handle = requestScaleformMovie(this.scaleForm);
    }
    destroy() {
        if (!this.isValid)
            return;
        setScaleformMovieAsNoLongerNeeded(this._handle);
        this._handle = 0;
    }
}

class Message {
    static Initialize(scaleForm, transitionOutAnimName) {
        this._transitionOutAnimName = transitionOutAnimName;
        this._scaleform = new Scaleform(scaleForm);
    }
    static get IsVisible() {
        return this._messageVisible;
    }
    static get Scaleform() {
        return this._scaleform;
    }
    static Load() {
        if (this._delayedTransitionInTimeout != null) {
            clearTimeout(this._delayedTransitionInTimeout);
            this._delayedTransitionInTimeout = null;
        }
    }
    static SetDelayedTransition(messageHandler, time) {
        this._delayedTransitionInTimeout = setTimeout(() => {
            this._delayedTransitionInTimeout = null;
            this.TransitionIn(messageHandler, time);
        }, this._transitionOutTimeMs);
    }
    static ShowCustomShard(funcName, time = 5000, ...funcArgs) {
        this.ShowComplexCustomShard(() => {
            this._scaleform.callFunction(funcName, ...funcArgs);
        }, time);
    }
    static ShowComplexCustomShard(messageHandler, time = 5000) {
        this.Load();
        if (this._messageVisible) {
            this.TransitionOut();
            this.SetDelayedTransition(() => messageHandler(), time);
        }
        else {
            this.TransitionIn(messageHandler, time);
        }
    }
    static TransitionOut() {
        if (!this._messageVisible)
            return;
        if (this._transitionOutTimeout != null) {
            clearTimeout(this._transitionOutTimeout);
            this._transitionOutTimeout = null;
        }
        if (this._transitionOutFinishedTimeout != null) {
            clearTimeout(this._transitionOutFinishedTimeout);
            this._transitionOutFinishedTimeout = null;
        }
        this._scaleform.callFunction(this._transitionOutAnimName);
        this._transitionOutFinishedTimeout = setTimeout(() => {
            this._messageVisible = false;
            this._scaleform.recreate();
        }, this._transitionOutTimeMs);
    }
    static TransitionIn(messageHandler, transitionOutTime = 500) {
        this._messageVisible = true;
        messageHandler();
        this.SetTransitionOutTimer(transitionOutTime);
    }
    static SetTransitionOutTimer(time) {
        this._transitionOutTimeout = setTimeout(() => {
            this._transitionOutTimeout = null;
            this.TransitionOut();
        }, time);
    }
    static Render() {
        if (this._messageVisible) {
            this._scaleform.render2D();
        }
    }
}
Message._messageVisible = false;
Message._transitionOutTimeout = null;
Message._transitionOutFinishedTimeout = null;
Message._delayedTransitionInTimeout = null;
Message._scaleform = null;
Message._transitionOutTimeMs = 500;
Message._transitionOutAnimName = null;

class BigMessage extends Message {
    static Initialize(scaleForm, transitionOutAnimName) {
        super.Initialize(scaleForm, transitionOutAnimName);
        everyTick(() => this.Render());
    }
    static ShowMissionPassedMessage(msg, subtitle = "", time = 5000) {
        this.ShowCustomShard("SHOW_MISSION_PASSED_MESSAGE", time, msg, subtitle, 100, true, 0, true);
    }
    static ShowColoredShard(msg, desc, textColor, bgColor, time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_CENTERED_MP_MESSAGE", time, msg, desc, bgColor, textColor);
    }
    static ShowOldMessage(msg, time = 5000) {
        this.ShowCustomShard("SHOW_MISSION_PASSED_MESSAGE", time, msg);
    }
    static ShowSimpleShard(title, subtitle = "", time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_CREW_RANKUP_MP_MESSAGE", time, title, subtitle);
    }
    static ShowRankupMessage(msg, subtitle, rank, time = 5000) {
        this.ShowCustomShard("SHOW_BIG_MP_MESSAGE", time, msg, subtitle, rank, "", "");
    }
    static ShowPlaneMessage(title, planeName, planeHash, time = 5000) {
        this.ShowCustomShard("SHOW_PLANE_MESSAGE", time, title, planeName, planeHash, "", "");
    }
    static ShowWeaponPurchasedMessage(bigMessage, weaponName, weaponHash, time = 5000) {
        this.ShowCustomShard("SHOW_WEAPON_PURCHASED", time, bigMessage, weaponName, weaponHash, "", 100);
    }
    static ShowWastedMessage(title, message, color, darkenBackground, time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_WASTED_MP_MESSAGE", time, title, message, color, darkenBackground);
    }
    static ShowMpMessageLarge(msg, subtitle = "", time = 5000) {
        this.ShowComplexCustomShard(() => {
            this.Scaleform.callFunction("SHOW_CENTERED_MP_MESSAGE_LARGE", msg, subtitle, 100, true, 100);
            this.Scaleform.callFunction("TRANSITION_IN");
        }, time);
    }
}
BigMessage.Initialize("MP_BIG_MESSAGE_FREEMODE", "TRANSITION_OUT");

class MidsizedMessage extends Message {
    static Initialize(scaleForm, transitionOutAnimName) {
        super.Initialize(scaleForm, transitionOutAnimName);
        everyTick(() => this.Render());
    }
    static ShowMidsizedMessage(title, message = "", time = 5000) {
        this.ShowCustomShard("SHOW_MIDSIZED_MESSAGE", time, title, message);
    }
    static ShowBridgesKnivesProgress(title, totalToDo, message, info, completed, time = 5000) {
        this.ShowCustomShard("SHOW_BRIDGES_KNIVES_PROGRESS", time, title, totalToDo, message, info, completed);
    }
    static ShowCondensedShardMessage(title, message, bgColor, useDarkerShard, time = 5000) {
        this.ShowCustomShard("SHOW_COND_SHARD_MESSAGE", time, title, message, bgColor, useDarkerShard);
    }
    static ShowMidsizedShardMessage(title, message, bgColor, useDarkerShard, useCondensedShard, time = 5000) {
        this.ShowCustomShard("SHOW_SHARD_MIDSIZED_MESSAGE", time, title, message, bgColor, useDarkerShard, useCondensedShard);
    }
}
MidsizedMessage.Initialize("MIDSIZED_MESSAGE", "SHARD_ANIM_OUT");

class UIMenuDynamicListItem extends UIMenuItem {
    constructor(text, selectionChangeHandler, description = "", selectedStartValueHandler = null, data = null) {
        super(text, description, data);
        this._currentOffset = 0;
        this._precaptionText = '';
        this._selectedStartValueHandler = null;
        this.SelectionChangeHandler = null;
        if (!this.isVariableFunction(selectionChangeHandler)) {
            logError(`[UIMenuDynamicListItem] ${text} is not created with a valid selectionChangeHandler, needs to be function. Please see docs.`);
        }
        if (!this.isVariableFunction(selectedStartValueHandler)) {
            logError(`[UIMenuDynamicListItem] ${text} is not created with a valid selectedStartValueHandler, needs to be function. Please see docs.`);
        }
        this.SelectionChangeHandler = selectionChangeHandler;
        this._selectedStartValueHandler = selectedStartValueHandler;
        let y = 0;
        this._arrowLeft = new Sprite("commonmenu", "arrowleft", new Point(110, 105 + y), new Size(30, 30));
        this._arrowRight = new Sprite("commonmenu", "arrowright", new Point(280, 105 + y), new Size(30, 30));
        this._itemText = new ResText("", new Point(290, y + 104), 0.35, Color.White, Font$1.ChaletLondon, Alignment$1.Right);
    }
    SelectionChangeHandlerPromise(item, selectedValue, changeDirection) {
        return new Promise((resolve, reject) => {
            let newSelectedValue = this.SelectionChangeHandler(item, selectedValue, changeDirection);
            resolve(newSelectedValue);
        });
    }
    get PreCaptionText() {
        return this._precaptionText;
    }
    set PreCaptionText(text) {
        if (!text)
            throw new Error("The pre caption text can't be null");
        if (typeof text !== 'string')
            throw new Error("The pre caption text must be a string");
        this._precaptionText = text;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue, this._itemText && this._itemText.Font ? this._itemText.Font : 0, 0.35);
    }
    get SelectedValue() {
        return this._selectedValue;
    }
    set SelectedValue(value) {
        this._selectedValue = value;
        if (value == undefined)
            return;
        this._currentOffset = Screen.GetTextWidth(this.PreCaptionText + this._selectedValue, this._itemText && this._itemText.Font ? this._itemText.Font : 0, this._itemText && this._itemText.Scale ? this._itemText.Scale : 0.35);
    }
    SetVerticalPosition(y) {
        this._arrowLeft.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._arrowRight.Pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
        this._itemText.Pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, y + 147 + this.Offset.Y);
        super.SetVerticalPosition(y);
    }
    SetRightLabel(text) {
        return this;
    }
    SetRightBadge(badge) {
        return this;
    }
    Draw() {
        super.Draw();
        if (this._selectedValue == undefined) {
            if (this._selectedStartValueHandler != null) {
                this.SelectedValue = this._selectedStartValueHandler();
            }
            else {
                this._selectedValue = "";
            }
        }
        const offset = this._currentOffset;
        this._itemText.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._itemText.Caption = this.PreCaptionText + this._selectedValue;
        this._arrowLeft.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowRight.Color = this.Enabled
            ? this.Selected
                ? this.HighlightedForeColor
                : this.ForeColor
            : new Color(163, 159, 148);
        this._arrowLeft.Pos = new Point(380 - offset + this.Offset.X + this.Parent.WidthOffset, this._arrowLeft.Pos.Y);
        if (this.Selected) {
            this._arrowLeft.Draw();
            this._arrowRight.Draw();
            this._itemText.Pos = new Point(405 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        else {
            this._itemText.Pos = new Point(420 + this.Offset.X + this.Parent.WidthOffset, this._itemText.Pos.Y);
        }
        this._itemText.Draw();
    }
    isVariableFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
}

let menuPool = [];
class NativeUI {
    constructor(title, subtitle, offset, spriteLibrary, spriteName) {
        this._visible = true;
        this._counterPretext = "";
        this._counterOverride = undefined;
        this._lastUpDownNavigation = 0;
        this._lastLeftRightNavigation = 0;
        this._extraOffset = 0;
        this._buttonsEnabled = true;
        this._justOpened = true;
        this._justOpenedFromPool = false;
        this._justClosedFromPool = false;
        this._poolOpening = null;
        this._safezoneOffset = new Point(0, 0);
        this._activeItem = 1000;
        this._maxItemsOnScreen = 9;
        this._maxItem = this._maxItemsOnScreen;
        this._mouseEdgeEnabled = true;
        this._bannerSprite = null;
        this._bannerRectangle = null;
        this._recalculateDescriptionNextFrame = 1;
        this._instructionalButtons = [];
        this._defaultTitleScale = 1.15;
        this._maxMenuItems = 1000;
        this.Id = UUIDV4();
        this.SelectTextLocalized = getGxtText("HUD_INPUT2");
        this.BackTextLocalized = getGxtText("HUD_INPUT3");
        this.WidthOffset = 0;
        this.ParentMenu = null;
        this.ParentItem = null;
        this.MouseControlsEnabled = false;
        this.CloseableByUser = true;
        this.AUDIO_LIBRARY = "HUD_FRONTEND_DEFAULT_SOUNDSET";
        this.AUDIO_UPDOWN = "NAV_UP_DOWN";
        this.AUDIO_LEFTRIGHT = "NAV_LEFT_RIGHT";
        this.AUDIO_SELECT = "SELECT";
        this.AUDIO_BACK = "BACK";
        this.AUDIO_ERROR = "ERROR";
        this.MenuItems = [];
        this.IndexChange = new LiteEvent();
        this.ListChange = new LiteEvent();
        this.AutoListChange = new LiteEvent();
        this.DynamicListChange = new LiteEvent();
        this.SliderChange = new LiteEvent();
        this.CheckboxChange = new LiteEvent();
        this.ItemSelect = new LiteEvent();
        this.MenuOpen = new LiteEvent();
        this.MenuClose = new LiteEvent();
        this.MenuChange = new LiteEvent();
        if (!(offset instanceof Point))
            offset = Point.Parse(offset);
        this._spriteLibrary = spriteLibrary || "commonmenu";
        this._spriteName = spriteName || "interaction_bgd";
        this._offset = new Point(offset.X, offset.Y);
        this.Children = new Map();
        this._instructionalButtonsScaleform = new Scaleform("instructional_buttons");
        this.UpdateScaleform();
        this._mainMenu = new Container(new Point(0, 0), new Size(700, 500), new Color(0, 0, 0, 0));
        this._bannerSprite = new Sprite(this._spriteLibrary, this._spriteName, new Point(0 + this._offset.X, 0 + this._offset.Y), new Size(431, 107));
        this._mainMenu.addItem((this._titleResText = new ResText(title, new Point(215 + this._offset.X, 20 + this._offset.Y), this._defaultTitleScale, new Color(255, 255, 255), 1, Alignment$1.Centered)));
        if (subtitle !== "") {
            this._mainMenu.addItem(new ResRectangle(new Point(0 + this._offset.X, 107 + this._offset.Y), new Size(431, 37), new Color(0, 0, 0, 255)));
            this._mainMenu.addItem((this._subtitleResText = new ResText(subtitle, new Point(8 + this._offset.X, 110 + this._offset.Y), 0.35, new Color(255, 255, 255), 0, Alignment$1.Left)));
            if (subtitle.startsWith("~")) {
                this._counterPretext = subtitle.substr(0, 3);
            }
            this._counterText = new ResText("", new Point(425 + this._offset.X, 110 + this._offset.Y), 0.35, new Color(255, 255, 255), 0, Alignment$1.Right);
            this._extraOffset += 37;
        }
        this._upAndDownSprite = new Sprite("commonmenu", "shop_arrows_upanddown", new Point(190 + this._offset.X, 147 + 37 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset), new Size(50, 50));
        this._extraRectangleUp = new ResRectangle(new Point(0 + this._offset.X, 144 + 38 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset), new Size(431, 18), new Color(0, 0, 0, 200));
        this._extraRectangleDown = new ResRectangle(new Point(0 + this._offset.X, 144 + 18 + 38 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset), new Size(431, 18), new Color(0, 0, 0, 200));
        this._descriptionBar = new ResRectangle(new Point(this._offset.X, 123), new Size(431, 4), Color.Black);
        this._descriptionRectangle = new Sprite("commonmenu", "gradient_bgd", new Point(this._offset.X, 127), new Size(431, 30));
        this._descriptionText = new ResText("", new Point(this._offset.X + 5, 125), 0.35, new Color(255, 255, 255, 255), Font$1.ChaletLondon, Alignment$1.Left);
        this._descriptionText.Wrap = 400;
        this._background = new Sprite("commonmenu", "gradient_bgd", new Point(this._offset.X, 144 + this._offset.Y - 37 + this._extraOffset), new Size(290, 25));
        this._visible = false;
        everyTick(this.render.bind(this));
    }
    GetSpriteBanner() {
        return this._bannerSprite;
    }
    GetRectangleBanner() {
        return this._bannerRectangle;
    }
    GetTitle() {
        return this._titleResText;
    }
    get MaxItemsVisible() {
        return this._maxItemsOnScreen;
    }
    set MaxItemsVisible(value) {
        this._maxItemsOnScreen = value;
        this._maxItem = value;
    }
    get Title() {
        return this._titleResText.Caption;
    }
    set Title(text) {
        this._titleResText.Caption = text;
    }
    get GetSubTitle() {
        return this._titleResText;
    }
    get SubTitle() {
        return this._titleResText.Caption;
    }
    set SubTitle(text) {
        this._subtitleResText.Caption = text;
    }
    get Visible() {
        return this._visible;
    }
    set Visible(toggle) {
        this._visible = toggle;
        Common.PlaySound(this.AUDIO_BACK, this.AUDIO_LIBRARY);
        this.UpdateScaleform();
        if (toggle) {
            this.UpdateDescriptionCaption();
        }
        if (this._justOpenedFromPool === true) {
            this._justOpenedFromPool = false;
            return;
        }
        if (toggle) {
            this._justOpened = true;
            this.MenuOpen.emit();
            if (this.ParentMenu === null) {
                if (!menuPool.includes(this) && this !== this._poolOpening) {
                    const previousMenu = (menuPool.length) ? menuPool[menuPool.length - 1] : null;
                    menuPool.push(this);
                    if (previousMenu !== this._poolOpening && previousMenu !== null) {
                        previousMenu._justClosedFromPool = true;
                        previousMenu.Visible = false;
                    }
                }
            }
        }
        else {
            if (this._justClosedFromPool === true) {
                this._justClosedFromPool = false;
                return;
            }
            if (this.ParentMenu === null && menuPool.includes(this) && menuPool.length) {
                if (menuPool[menuPool.length - 1] === this) {
                    menuPool.pop();
                    this._justOpenedFromPool = true;
                    if (!menuPool.length) {
                        this._poolOpening = null;
                    }
                }
                if (menuPool.length) {
                    this._poolOpening = menuPool[menuPool.length - 1];
                    menuPool[menuPool.length - 1].Visible = true;
                }
            }
            if (menuPool.length === 0) {
                game__default.setMouseCursorSprite(1);
            }
        }
    }
    get CurrentSelection() {
        return this._activeItem % this.MenuItems.length;
    }
    set CurrentSelection(v) {
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length) + v;
        if (this.CurrentSelection > this._maxItem) {
            this._maxItem = this.CurrentSelection;
            this._minItem = this.CurrentSelection - this._maxItemsOnScreen;
        }
        else if (this.CurrentSelection < this._minItem) {
            this._maxItem = this._maxItemsOnScreen + this.CurrentSelection;
            this._minItem = this.CurrentSelection;
        }
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    DisableInstructionalButtons(disable) {
        this._buttonsEnabled = !disable;
    }
    AddInstructionalButton(button) {
        this._instructionalButtons.push(button);
    }
    SetSpriteBannerType(spriteBanner) {
        this._bannerRectangle = null;
        this.AddSpriteBannerType(spriteBanner);
    }
    SetRectangleBannerType(rectangle) {
        this._bannerSprite = null;
        this._bannerRectangle = rectangle;
        this._bannerRectangle.Pos = new Point(this._offset.X, this._offset.Y);
        this._bannerRectangle.Size = new Size(431 + this.WidthOffset, 107);
    }
    AddSpriteBannerType(spriteBanner) {
        this._bannerSprite = spriteBanner;
        this._bannerSprite.Size = new Size(431 + this.WidthOffset, 107);
        this._bannerSprite.Pos = new Point(this._offset.X, this._offset.Y);
    }
    SetNoBannerType() {
        this._bannerSprite = null;
        this._bannerRectangle = new ResRectangle(new Point(this._offset.X, this._offset.Y), new Size(431 + this.WidthOffset, 107), new Color(0, 0, 0, 0));
    }
    RemoveInstructionalButton(button) {
        for (let i = 0; i < this._instructionalButtons.length; i++) {
            if (this._instructionalButtons[i] === button) {
                this._instructionalButtons.splice(i, 1);
            }
        }
    }
    RecalculateDescriptionPosition() {
        const count = (this.MenuItems.length > this._maxItemsOnScreen + 1) ? this._maxItemsOnScreen + 2 : this.MenuItems.length;
        this._descriptionBar.Size = new Size(431 + this.WidthOffset, 4);
        this._descriptionRectangle.Size = new Size(431 + this.WidthOffset, 30);
        this._descriptionBar.Pos = new Point(this._offset.X, 149 - 37 + this._extraOffset + this._offset.Y);
        this._descriptionRectangle.Pos = new Point(this._offset.X, 149 - 37 + this._extraOffset + this._offset.Y);
        this._descriptionText.Pos = new Point(this._offset.X + 8, 155 - 37 + this._extraOffset + this._offset.Y);
        this._descriptionBar.Pos = new Point(this._offset.X, 38 * count + this._descriptionBar.Pos.Y);
        this._descriptionRectangle.Pos = new Point(this._offset.X, 38 * count + this._descriptionRectangle.Pos.Y);
        this._descriptionText.Pos = new Point(this._offset.X + 8, 38 * count + this._descriptionText.Pos.Y);
    }
    SetMenuWidthOffset(widthOffset) {
        this.WidthOffset = widthOffset;
        if (this._bannerSprite != null) {
            this._bannerSprite.Size = new Size(431 + this.WidthOffset, 107);
        }
        this._mainMenu.Items[0].pos = new Point((this.WidthOffset + this._offset.X + 431) / 2, 20 + this._offset.Y);
        if (this._counterText) {
            this._counterText.Pos = new Point(425 + this._offset.X + widthOffset, 110 + this._offset.Y);
        }
        if (this._mainMenu.Items.length >= 2) {
            const tmp = this._mainMenu.Items[1];
            tmp.size = new Size(431 + this.WidthOffset, 37);
        }
        if (this._bannerRectangle != null) {
            this._bannerRectangle.Size = new Size(431 + this.WidthOffset, 107);
        }
    }
    AddItem(item) {
        if (this._justOpened)
            this._justOpened = false;
        item.Offset = this._offset;
        item.Parent = this;
        item.SetVerticalPosition(this.MenuItems.length * 25 - 37 + this._extraOffset);
        this.MenuItems.push(item);
        this.RefreshIndex();
    }
    RemoveItem(item) {
        for (let i = 0; i < this.MenuItems.length; i++) {
            if (this.MenuItems[i] === item) {
                this.MenuItems.splice(i, 1);
                break;
            }
        }
        this.RefreshIndex();
    }
    RefreshIndex() {
        if (this.MenuItems.length == 0) {
            this._activeItem = this._maxMenuItems;
            this._maxItem = this._maxItemsOnScreen;
            this._minItem = 0;
            return;
        }
        for (let i = 0; i < this.MenuItems.length; i++)
            this.MenuItems[i].Selected = false;
        this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length);
        this._maxItem = this._maxItemsOnScreen;
        this._minItem = 0;
        if (this._visible) {
            this.UpdateDescriptionCaption();
        }
    }
    Clear() {
        this.MenuItems = [];
        this.RecalculateDescriptionPosition();
    }
    Open() {
        this.Visible = true;
    }
    CleanUp(closeChildren = false) {
        if (closeChildren) {
            this.Children.forEach(m => {
                m.Close(true);
            });
        }
        this.MenuItems.filter(menuItem => menuItem instanceof UIMenuDynamicListItem).forEach((menuItem) => {
            menuItem.SelectedValue = undefined;
        });
        this.RefreshIndex();
    }
    Close(closeChildren = false) {
        this.Visible = false;
        this.CleanUp(closeChildren);
        this.MenuClose.emit(true);
    }
    GoLeft() {
        if (!(this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) ||
            !this.MenuItems[this.CurrentSelection].Enabled)
            return;
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.Collection.length == 0)
                return;
            it.Index--;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.ListChange.emit(it, it.Index);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.SelectedValue <= it.LowerThreshold) {
                it.SelectedValue = it.UpperThreshold;
            }
            else {
                it.SelectedValue -= it.LeftMoveThreshold;
            }
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.AutoListChange.emit(it, it.SelectedValue, ChangeDirection$1.Left);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            it.SelectionChangeHandlerPromise(it, it.SelectedValue, ChangeDirection$1.Left).then((newSelectedValue) => {
                it.SelectedValue = newSelectedValue;
                this.DynamicListChange.emit(it, it.SelectedValue, ChangeDirection$1.Left);
            });
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) {
            const it = this.MenuItems[this.CurrentSelection];
            it.Index = it.Index - 1;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.SliderChange.emit(it, it.Index, it.IndexToItem(it.Index));
            this.UpdateDescriptionCaption();
        }
    }
    GoRight() {
        if (!(this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) &&
            !(this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) ||
            !this.MenuItems[this.CurrentSelection].Enabled)
            return;
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.Collection.length == 0)
                return;
            it.Index++;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.ListChange.emit(it, it.Index);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuAutoListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            if (it.SelectedValue >= it.UpperThreshold) {
                it.SelectedValue = it.LowerThreshold;
            }
            else {
                it.SelectedValue += it.RightMoveThreshold;
            }
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.AutoListChange.emit(it, it.SelectedValue, ChangeDirection$1.Right);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuDynamicListItem) {
            const it = this.MenuItems[this.CurrentSelection];
            it.SelectionChangeHandlerPromise(it, it.SelectedValue, ChangeDirection$1.Right).then((newSelectedValue) => {
                it.SelectedValue = newSelectedValue;
                this.DynamicListChange.emit(it, it.SelectedValue, ChangeDirection$1.Right);
            });
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.UpdateDescriptionCaption();
        }
        else if (this.MenuItems[this.CurrentSelection] instanceof UIMenuSliderItem) {
            const it = this.MenuItems[this.CurrentSelection];
            it.Index++;
            Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
            this.SliderChange.emit(it, it.Index, it.IndexToItem(it.Index));
            this.UpdateDescriptionCaption();
        }
    }
    SelectItem() {
        if (!this.MenuItems[this.CurrentSelection].Enabled) {
            Common.PlaySound(this.AUDIO_ERROR, this.AUDIO_LIBRARY);
            return;
        }
        const it = this.MenuItems[this.CurrentSelection];
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuCheckboxItem) {
            it.Checked = !it.Checked;
            Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
            this.CheckboxChange.emit(it, it.Checked);
        }
        else {
            Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
            this.ItemSelect.emit(it, this.CurrentSelection);
            if (this.Children.has(it.Id)) {
                const subMenu = this.Children.get(it.Id);
                this.Visible = false;
                subMenu.Visible = true;
                this.MenuChange.emit(subMenu, true);
            }
        }
        it.fireEvent();
    }
    HasCurrentSelectionChildren() {
        const it = this.MenuItems[this.CurrentSelection];
        if (this.MenuItems[this.CurrentSelection] instanceof UIMenuItem) {
            if (this.Children.has(it.Id)) {
                return true;
            }
        }
        return false;
    }
    IsMouseInListItemArrows(item, topLeft, safezone) {
        game__default.beginTextCommandGetWidth("jamyfafi");
        game__default.addTextComponentSubstringPlayerName(item.Text);
        let res = Screen.ResolutionMaintainRatio;
        let screenw = res.Width;
        let screenh = res.Height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        let width = height * ratio;
        const labelSize = game__default.endTextCommandGetWidth(false) * width * 0.35;
        const labelSizeX = 5 + labelSize + 10;
        const arrowSizeX = 431 - labelSizeX;
        return Screen.IsMouseInBounds(topLeft, new Size(labelSizeX, 38))
            ? 1
            : Screen.IsMouseInBounds(new Point(topLeft.X + labelSizeX, topLeft.Y), new Size(arrowSizeX, 38))
                ? 2
                : 0;
    }
    ProcessMouse() {
        if (!this.Visible || this._justOpened || this.MenuItems.length == 0 || !this.MouseControlsEnabled) {
            this.MenuItems.filter(i => i.Hovered).forEach(i => (i.Hovered = false));
            return;
        }
        showCursor(true);
        let limit = this.MenuItems.length - 1;
        let counter = 0;
        if (this.MenuItems.length > this._maxItemsOnScreen + 1)
            limit = this._maxItem;
        if (Screen.IsMouseInBounds(new Point(0, 0), new Size(30, 1080)) && this._mouseEdgeEnabled) {
            game__default.setGameplayCamRelativeHeading(game__default.getGameplayCamRelativeHeading() + 5.0);
            game__default.setMouseCursorSprite(6);
        }
        else if (Screen.IsMouseInBounds(new Point(Screen.ResolutionMaintainRatio.Width - 30.0, 0), new Size(30, 1080)) && this._mouseEdgeEnabled) {
            game__default.setGameplayCamRelativeHeading(game__default.getGameplayCamRelativeHeading() - 5.0);
            game__default.setMouseCursorSprite(7);
        }
        else if (this._mouseEdgeEnabled) {
            game__default.setMouseCursorSprite(1);
        }
        for (let i = this._minItem; i <= limit; i++) {
            let xpos = this._offset.X;
            let ypos = this._offset.Y + 144 - 37 + this._extraOffset + counter * 38;
            let xsize = 431 + this.WidthOffset;
            const ysize = 38;
            const uiMenuItem = this.MenuItems[i];
            if (Screen.IsMouseInBounds(new Point(xpos, ypos), new Size(xsize, ysize))) {
                uiMenuItem.Hovered = true;
                const res = this.IsMouseInListItemArrows(this.MenuItems[i], new Point(xpos, ypos), 0);
                if (uiMenuItem.Hovered && res == 1 && (this.MenuItems[i] instanceof UIMenuListItem || this.MenuItems[i] instanceof UIMenuAutoListItem || this.MenuItems[i] instanceof UIMenuDynamicListItem)) {
                    game__default.setMouseCursorSprite(5);
                }
                if (game__default.isControlJustReleased(0, 24) || game__default.isDisabledControlJustReleased(0, 24))
                    if (uiMenuItem.Selected && uiMenuItem.Enabled) {
                        if ((this.MenuItems[i] instanceof UIMenuListItem || this.MenuItems[i] instanceof UIMenuAutoListItem || this.MenuItems[i] instanceof UIMenuDynamicListItem)
                            && this.IsMouseInListItemArrows(this.MenuItems[i], new Point(xpos, ypos), 0) > 0) {
                            switch (res) {
                                case 1:
                                    Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
                                    this.MenuItems[i].fireEvent();
                                    this.ItemSelect.emit(this.MenuItems[i], i);
                                    break;
                                case 2:
                                    let it = this.MenuItems[i];
                                    if ((it.Collection == null ? it.Items.Count : it.Collection.Count) > 0) {
                                        it.Index++;
                                        Common.PlaySound(this.AUDIO_LEFTRIGHT, this.AUDIO_LIBRARY);
                                        this.ListChange.emit(it, it.Index);
                                    }
                                    break;
                            }
                        }
                        else
                            this.SelectItem();
                    }
                    else if (!uiMenuItem.Selected) {
                        this.CurrentSelection = i;
                        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
                        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
                        this.SelectItem();
                        this.UpdateDescriptionCaption();
                        this.UpdateScaleform();
                    }
                    else if (!uiMenuItem.Enabled && uiMenuItem.Selected) {
                        Common.PlaySound(this.AUDIO_ERROR, this.AUDIO_LIBRARY);
                    }
            }
            else
                uiMenuItem.Hovered = false;
            counter++;
        }
        const extraY = 144 + 38 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset + this._safezoneOffset.Y;
        const extraX = this._safezoneOffset.X + this._offset.X;
        if (this.MenuItems.length <= this._maxItemsOnScreen + 1)
            return;
        if (Screen.IsMouseInBounds(new Point(extraX, extraY), new Size(431 + this.WidthOffset, 18))) {
            this._extraRectangleUp.Color = new Color(30, 30, 30, 255);
            if (game__default.isControlJustPressed(0, 24) || game__default.isDisabledControlJustPressed(0, 24)) {
                if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                    this.GoUpOverflow();
                else
                    this.GoUp();
            }
        }
        else
            this._extraRectangleUp.Color = new Color(0, 0, 0, 200);
        if (Screen.IsMouseInBounds(new Point(extraX, extraY + 18), new Size(431 + this.WidthOffset, 18))) {
            this._extraRectangleDown.Color = new Color(30, 30, 30, 255);
            if (game__default.isControlJustPressed(0, 24) || game__default.isDisabledControlJustPressed(0, 24)) {
                if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                    this.GoDownOverflow();
                else
                    this.GoDown();
            }
        }
        else
            this._extraRectangleDown.Color = new Color(0, 0, 0, 200);
    }
    ProcessControl() {
        if (!this.Visible)
            return;
        if (this._justOpened) {
            this._justOpened = false;
            return;
        }
        if (game__default.isControlJustReleased(0, 177)) {
            this.GoBack();
        }
        if (this.MenuItems.length == 0)
            return;
        if (game__default.isControlPressed(0, 172) && this._lastUpDownNavigation + 120 < Date.now()) {
            this._lastUpDownNavigation = Date.now();
            if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                this.GoUpOverflow();
            else
                this.GoUp();
            this.UpdateScaleform();
        }
        else if (game__default.isControlJustReleased(0, 172)) {
            this._lastUpDownNavigation = 0;
        }
        else if (game__default.isControlPressed(0, 173) && this._lastUpDownNavigation + 120 < Date.now()) {
            this._lastUpDownNavigation = Date.now();
            if (this.MenuItems.length > this._maxItemsOnScreen + 1)
                this.GoDownOverflow();
            else
                this.GoDown();
            this.UpdateScaleform();
        }
        else if (game__default.isControlJustReleased(0, 173)) {
            this._lastUpDownNavigation = 0;
        }
        else if (game__default.isControlPressed(0, 174) && this._lastLeftRightNavigation + 100 < Date.now()) {
            this._lastLeftRightNavigation = Date.now();
            this.GoLeft();
        }
        else if (game__default.isControlJustReleased(0, 174)) {
            this._lastLeftRightNavigation = 0;
        }
        else if (game__default.isControlPressed(0, 175) && this._lastLeftRightNavigation + 100 < Date.now()) {
            this._lastLeftRightNavigation = Date.now();
            this.GoRight();
        }
        else if (game__default.isControlJustReleased(0, 175)) {
            this._lastLeftRightNavigation = 0;
        }
        else if (game__default.isControlJustReleased(0, 201)) {
            this.SelectItem();
        }
    }
    GoUpOverflow() {
        if (this.MenuItems.length <= this._maxItemsOnScreen + 1)
            return;
        if (this._activeItem % this.MenuItems.length <= this._minItem) {
            if (this._activeItem % this.MenuItems.length == 0) {
                this._minItem = this.MenuItems.length - this._maxItemsOnScreen - 1;
                this._maxItem = this.MenuItems.length - 1;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length);
                this._activeItem += this.MenuItems.length - 1;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
            else {
                this._minItem--;
                this._maxItem--;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem--;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
        }
        else {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
            this._activeItem--;
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        }
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoUp() {
        if (this.MenuItems.length > this._maxItemsOnScreen + 1)
            return;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem--;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoDownOverflow() {
        if (this.MenuItems.length <= this._maxItemsOnScreen + 1)
            return;
        if (this._activeItem % this.MenuItems.length >= this._maxItem) {
            if (this._activeItem % this.MenuItems.length == this.MenuItems.length - 1) {
                this._minItem = 0;
                this._maxItem = this._maxItemsOnScreen;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem = this._maxMenuItems - (this._maxMenuItems % this.MenuItems.length);
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
            else {
                this._minItem++;
                this._maxItem++;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
                this._activeItem++;
                this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            }
        }
        else {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
            this._activeItem++;
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        }
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoDown() {
        if (this.MenuItems.length > this._maxItemsOnScreen + 1)
            return;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = false;
        this._activeItem++;
        this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
        Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
        this.IndexChange.emit(this.CurrentSelection, this.MenuItems[this._activeItem % this.MenuItems.length]);
        this.UpdateDescriptionCaption();
    }
    GoBack() {
        if (this.ParentMenu != null) {
            this.Visible = false;
            this.ParentMenu.Visible = true;
            this.MenuChange.emit(this.ParentMenu, false);
            this.MenuClose.emit(false);
        }
        else if (this.CloseableByUser) {
            this.Visible = false;
            this.CleanUp(true);
            this.MenuClose.emit(false);
        }
    }
    BindMenuToItem(menuToBind, itemToBindTo) {
        if (!this.MenuItems.includes(itemToBindTo)) {
            this.AddItem(itemToBindTo);
        }
        menuToBind.ParentMenu = this;
        menuToBind.ParentItem = itemToBindTo;
        this.Children.set(itemToBindTo.Id, menuToBind);
    }
    AddSubMenu(subMenu, itemToBindTo) {
        this.BindMenuToItem(subMenu, itemToBindTo);
    }
    ReleaseMenuFromItem(releaseFrom) {
        if (!this.Children.has(releaseFrom.Id))
            return false;
        const menu = this.Children.get(releaseFrom.Id);
        menu.ParentItem = null;
        menu.ParentMenu = null;
        this.Children.delete(releaseFrom.Id);
        return true;
    }
    UpdateDescriptionCaption() {
        if (this.MenuItems.length) {
            this._descriptionText.Caption = this.MenuItems[this._activeItem % this.MenuItems.length].Description;
            this._descriptionText.Wrap = 400;
            this._recalculateDescriptionNextFrame++;
        }
    }
    CalculateDescription() {
        if (this.MenuItems.length <= 0)
            return;
        if (this._recalculateDescriptionNextFrame > 0) {
            this._recalculateDescriptionNextFrame--;
        }
        this.RecalculateDescriptionPosition();
        if (this.MenuItems.length > 0 && this._descriptionText.Caption && this.MenuItems[this._activeItem % this.MenuItems.length].Description.trim() !== "") {
            const numLines = Screen.GetLineCount(this._descriptionText.Caption, this._descriptionText.Pos, this._descriptionText.Font, this._descriptionText.Scale, this._descriptionText.Wrap);
            this._descriptionRectangle.Size = new Size(431 + this.WidthOffset, (numLines * 25) + 15);
            if (numLines === 0) {
                this._recalculateDescriptionNextFrame++;
            }
        }
    }
    UpdateScaleform() {
        if (!this.Visible || !this._buttonsEnabled)
            return;
        this._instructionalButtonsScaleform.callFunction("CLEAR_ALL");
        this._instructionalButtonsScaleform.callFunction("TOGGLE_MOUSE_BUTTONS", 0);
        this._instructionalButtonsScaleform.callFunction("CREATE_CONTAINER");
        this._instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", 0, game__default.getControlInstructionalButton(2, Control$1.PhoneSelect, false), this.SelectTextLocalized);
        this._instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", 1, game__default.getControlInstructionalButton(2, Control$1.PhoneCancel, false), this.BackTextLocalized);
        let count = 2;
        this._instructionalButtons.filter(b => b.ItemBind == null || this.MenuItems[this.CurrentSelection] == b.ItemBind).forEach((button) => {
            this._instructionalButtonsScaleform.callFunction("SET_DATA_SLOT", count, button.GetButtonId(), button.Text);
            count++;
        });
        this._instructionalButtonsScaleform.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", -1);
    }
    render() {
        if (!this.Visible)
            return;
        if (this._buttonsEnabled) {
            game__default.drawScaleformMovieFullscreen(this._instructionalButtonsScaleform.handle, 255, 255, 255, 255, 0);
            game__default.hideHudComponentThisFrame(6);
            game__default.hideHudComponentThisFrame(7);
            game__default.hideHudComponentThisFrame(9);
        }
        if (this._justOpened) {
            if (this._bannerSprite != null && !this._bannerSprite.IsTextureDictionaryLoaded)
                this._bannerSprite.LoadTextureDictionary();
            if (!this._background.IsTextureDictionaryLoaded)
                this._background.LoadTextureDictionary();
            if (!this._descriptionRectangle.IsTextureDictionaryLoaded)
                this._descriptionRectangle.LoadTextureDictionary();
            if (!this._upAndDownSprite.IsTextureDictionaryLoaded)
                this._upAndDownSprite.LoadTextureDictionary();
            if (!this._recalculateDescriptionNextFrame)
                this._recalculateDescriptionNextFrame++;
        }
        this._mainMenu.Draw();
        this.ProcessMouse();
        this.ProcessControl();
        this._background.Size = this.MenuItems.length > this._maxItemsOnScreen + 1
            ? new Size(431 + this.WidthOffset, 38 * (this._maxItemsOnScreen + 1))
            : new Size(431 + this.WidthOffset, 38 * this.MenuItems.length);
        this._background.Draw();
        if (this._recalculateDescriptionNextFrame) {
            this.CalculateDescription();
        }
        if (this.MenuItems.length > 0) {
            this.MenuItems[this._activeItem % this.MenuItems.length].Selected = true;
            if (this.MenuItems[this._activeItem % this.MenuItems.length].Description.trim() !== "") {
                this._descriptionBar.Draw();
                this._descriptionRectangle.Draw();
                this._descriptionText.Draw();
            }
        }
        let count = 0;
        if (this.MenuItems.length <= this._maxItemsOnScreen + 1) {
            for (const item of this.MenuItems) {
                item.SetVerticalPosition(count * 38 - 37 + this._extraOffset);
                item.Draw();
                count++;
            }
            if (this._counterText && this._counterOverride) {
                this._counterText.Caption = this._counterPretext + this._counterOverride;
                this._counterText.Draw();
            }
        }
        else {
            for (let index = this._minItem; index <= this._maxItem; index++) {
                let item = this.MenuItems[index];
                item.SetVerticalPosition(count * 38 - 37 + this._extraOffset);
                item.Draw();
                count++;
            }
            this._extraRectangleUp.Size = new Size(431 + this.WidthOffset, 18);
            this._extraRectangleDown.Size = new Size(431 + this.WidthOffset, 18);
            this._upAndDownSprite.Pos = new Point(190 + this._offset.X + this.WidthOffset / 2, 147 + 37 * (this._maxItemsOnScreen + 1) + this._offset.Y - 37 + this._extraOffset);
            this._extraRectangleUp.Draw();
            this._extraRectangleDown.Draw();
            this._upAndDownSprite.Draw();
            if (this._counterText) {
                if (!this._counterOverride) {
                    const cap = this.CurrentSelection + 1 + " / " + this.MenuItems.length;
                    this._counterText.Caption = this._counterPretext + cap;
                }
                else {
                    this._counterText.Caption = this._counterPretext + this._counterOverride;
                }
                this._counterText.Draw();
            }
        }
        if (this._bannerRectangle != null)
            this._bannerRectangle.Draw();
        if (this._bannerSprite != null)
            this._bannerSprite.Draw();
    }
}

export default NativeUI;
export { Alignment$1 as Alignment, BadgeStyle$1 as BadgeStyle, BigMessage, ChangeDirection$1 as ChangeDirection, Color, Control$1 as Control, Font$1 as Font, HudColor$1 as HudColor, InstructionalButton, ItemsCollection, ListItem, NativeUI as Menu, MidsizedMessage, Point, ResRectangle, Size, Sprite, UIMenuAutoListItem, UIMenuCheckboxItem, UIMenuDynamicListItem, UIMenuItem, UIMenuListItem, UIMenuSliderItem };
