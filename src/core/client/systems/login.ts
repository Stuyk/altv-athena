import * as alt from 'alt-client';
import * as native from 'natives';

alt.log('loaded login.ts')

alt.onServer('Login:FadeScreenOut', handleFadeScreenOut);
alt.onServer('Login:FadeScreenIn', handleFadeScreenIn);

function handleFadeScreenOut(amount = 500) {
    native.doScreenFadeOut(amount);
}

function handleFadeScreenIn(amount = 2000) {
    native.doScreenFadeIn(amount);
}
