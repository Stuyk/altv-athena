import { GameplayCamera } from '@AthenaClient/systems/gameplayCamera';
import PedEditCamera from '@AthenaClient/utility/camera';
import { CinematicCam } from '@AthenaClient/utility/cinematic';

export const cameraConst = {
    ped: PedEditCamera,
    gameplay: GameplayCamera,
    cinematic: CinematicCam,
};
