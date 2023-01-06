import * as alt from 'alt-client';
import { AthenaClient } from '@AthenaClient/api/athena';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

const THE_LETTER_T = 84;

async function handleInput() {
    const result = await AthenaClient.rmlui.inputBox.create({ placeholder: 'message...', darken: true });
    if (typeof result === 'undefined' || result === '') {
        return;
    }

    AthenaClient.messenger.send(result);
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, () => {
    AthenaClient.events.keyBinds.registerKeybind({ singlePress: handleInput, key: THE_LETTER_T });
});
