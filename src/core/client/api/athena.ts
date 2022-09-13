import { screenConst } from './consts/screen';
import { soundConst } from './consts/soundConst';
import { utilityConst } from './consts/utilityConst';
import { webViewConst } from './consts/webViewConst';
import Minimap from '../utility/minimap';
import Spinner from '../utility/spinner';
import Shard from '../utility/shard';
import { Timer } from '../utility/timers';
import Raycast from '../utility/raycast';
import PedEditCamera from '../utility/camera';
import { CinematicCam } from '../utility/cinematic';
import { showNotification } from '../utility/notification';
import * as math from '../utility/math';

export const AthenaClient = {
    camera: {
        ped: PedEditCamera,
        cinematic: CinematicCam,
    },
    math,
    minimap: Minimap,
    notification: showNotification,
    raycast: Raycast,
    screen: screenConst,
    shard: Shard,
    sound: soundConst,
    spinner: Spinner,
    timer: Timer,
    webview: webViewConst,
    utility: utilityConst,
};
