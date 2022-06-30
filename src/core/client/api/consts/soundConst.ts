import {
    handleFrontendSound,
    handlePlayAudio2D,
    handlePlayAudio3D,
    handlePlayAudioPositional,
} from '../../systems/sound';

export const soundConst = {
    frontend: handleFrontendSound,
    play2D: handlePlayAudio2D,
    play3D: handlePlayAudioPositional,
    playFromEntity: handlePlayAudio3D,
};
