import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer('Login:FadeScreenOut', handleFadeScreenOut);
alt.onServer('Login:FadeScreenIn', handleFadeScreenIn);

alt.on('disconnect', () => {
    native.doScreenFadeIn(0);
});

function handleFadeScreenOut(amount = 500) {
    native.doScreenFadeOut(amount);
}

function handleFadeScreenIn(amount = 2000) {
    native.doScreenFadeIn(amount);
}
