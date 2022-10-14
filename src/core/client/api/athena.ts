import { screenConst } from './consts/screenConst';
import { soundConst } from './consts/soundConst';
import { utilityConst } from './consts/utilityConst';
import { webViewConst } from './consts/webViewConst';
import { Timer } from '../utility/timers';
import Raycast from '../utility/raycast';
import PedEditCamera from '../utility/camera';
import { CinematicCam } from '../utility/cinematic';
import * as math from '@AthenaClient/utility/math';
import { wheelMenusConst } from './consts/wheelMenus';
import { constData } from './consts/dataConst';
import { KeybindController } from '../events/keyup';
import { KeyHeld } from '../events/keyHeld';
import { rmluiConst } from './consts/rmluiConst';
import { cameraConst } from './consts/cameraConst';

export const AthenaClient = {
    camera: cameraConst,
    data: constData,
    events: {
        keyHeld: KeyHeld,
        keyBinds: KeybindController,
    },
    math,
    raycast: Raycast,
    rmlui: rmluiConst,
    screen: screenConst,
    sound: soundConst,
    timer: Timer,
    webview: webViewConst,
    wheelMenus: wheelMenusConst,
    utility: utilityConst,
};
