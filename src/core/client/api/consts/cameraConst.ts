import { CameraTarget } from '@AthenaClient/systems/cameraTarget';
import PedEditCamera from '@AthenaClient/utility/camera';
import { CinematicCam } from '@AthenaClient/utility/cinematic';

export const cameraConst = {
    ped: PedEditCamera,
    cinematic: CinematicCam,
    target: CameraTarget,
};
