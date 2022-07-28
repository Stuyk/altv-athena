import alt, { RmlElement } from 'alt-client';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { disableAllControls } from '../../utility/disableControls';

let document: alt.RmlDocument;
let form: alt.RmlElement;
let input: alt.RmlElement;
let callback: (result: string) => void;
let currentValue = '';

class Internal {
    static init() {
        document = new alt.RmlDocument('/client/rmlui/input/index.rml');
        document.hide();
    }

    static handleKey(key: number) {
        if (key === 13) {
        }

        // Closing
        if (key !== 27) {
            return;
        }

        disableAllControls(false);
        alt.toggleRmlControls(false);
        alt.off('keyup', Internal.handleKey);
        input.off('textinput', Internal.handleInput);
        callback('');
        document.hide();
    }

    static handleInput(element: alt.RmlElement, text: string) {
        console.log('submitted');
        console.log(text);

        // disableAllControls(false);
        // alt.toggleRmlControls(false);
        // alt.off('keyup', Internal.handleKey);
        // input.off('textinput', Internal.handleInput);
        // callback('');
        // document.hide();
    }
}

export class QuickInput {
    static open(_callback: (result: string) => void) {
        if (callback) {
            alt.logWarning(`Tried to Open Quick Input when Input is Already Open`);
            return;
        }

        callback = _callback;
        document.show();
        form = document.getElementByID('form');
        input = document.getElementByID('input');

        input.focus();
        alt.on('keyup', Internal.handleKey);
        form.on('submit', (e, args) => {
            console.log(e);
            console.log(args);
        });

        form.on('onsubmit', (e, args) => {
            console.log(e);
            console.log(args);
        });

        form.on('customevent', (e, args) => {
            console.log(e);
            console.log(args);
        });

        alt.nextTick(() => {
            alt.toggleGameControls(false);
            alt.toggleRmlControls(true);
            alt.showCursor(true);
            disableAllControls(true);
        });
    }
}

// Internal.init();

// alt.onServer(SYSTEM_EVENTS.TICKS_START, async () => {
//     await alt.Utils.wait(2000);

//     QuickInput.open((result) => {
//         console.log(`Final Text: ${result}`);
//     });
// });
