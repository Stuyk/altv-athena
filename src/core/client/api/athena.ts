import { screenConst } from './consts/screen';
import { soundConst } from './consts/soundConst';
import { utilityConst } from './consts/utilityConst';
import { webViewConst } from './consts/webViewConst';
import { Timer } from '../utility/timers';
import Raycast from '../utility/raycast';
import PedEditCamera from '../utility/camera';
import { CinematicCam } from '../utility/cinematic';
import * as math from '../utility/math';
import { wheelMenusConst } from './consts/wheelMenus';
import { constData } from './consts/dataConst';
import { KeybindController } from '../events/keyup';
import { KeyHeld } from '../events/keyHeld';
import { Sprite } from '../rmlui/sprites';
import { CameraTarget } from '../systems/cameraTarget';
import { ProgressBar } from '@AthenaClient/rmlui/progressbar';
import { InputBox } from '@AthenaClient/rmlui/input';
import { QuestionBox } from '@AthenaClient/rmlui/question';
import { Menu } from '@AthenaClient/rmlui/menu';
import { Menu3D } from '@AthenaClient/rmlui/menu3d';
import { StaticText } from '@AthenaClient/rmlui/staticText';

export const AthenaClient = {
    camera: {
        ped: PedEditCamera,
        cinematic: CinematicCam,
        target: CameraTarget,
    },
    data: constData,
    events: {
        keyHeld: KeyHeld,
        keyBinds: KeybindController,
    },
    math,
    raycast: Raycast,
    rmlui: {
        questionBox: QuestionBox,
        inputBox: InputBox,
        menu: Menu,
        menu3D: Menu3D,
        progressBar: ProgressBar,
        sprite: Sprite,
        staticText: StaticText,
    },
    screen: screenConst,
    sound: soundConst,
    timer: Timer,
    webview: webViewConst,
    wheelMenus: wheelMenusConst,
    utility: utilityConst,
};
