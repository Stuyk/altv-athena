import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { AthenaBuffer } from '../../shared/utility/buffer';

alt.onServer(SYSTEM_EVENTS.SCREENSHOT_CREATE, async () => {
    const result = await alt.takeScreenshot();
    const data = AthenaBuffer.toBuffer(result);
    const totalLength = data.length;

    for (let i = 0; i < totalLength; i++) {
        alt.emitServer(SYSTEM_EVENTS.SCREENSHOT_POPULATE_DATA, data[i], i, totalLength);
    }
});
