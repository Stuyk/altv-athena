import * as alt from 'alt-client';

alt.onServer('/screenshot', async () => {
    const result = await alt.takeScreenshot();
    alt.emitServer('/screenshot', result);
});
