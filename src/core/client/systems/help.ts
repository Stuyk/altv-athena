import * as alt from 'alt-client';
import * as native from 'natives';

import { Help } from '../../shared/interfaces/Help';
import { ScreenText } from '../utility/screenText';

let currentHelp: Help = null;
let helpShown: boolean = false;
let interval: number;

export class HelpController {
    /**
     * Used to display text and information temporarily in a specific location.
     * Call continuously with a range check.
     *
     * @static
     * @param {alt.Vector3} position
     * @param {(number | null)} key
     * @param {(string | null)} shortDesc
     * @param {(string | null)} longDesc
     * @memberof HelpController
     */
    static updateHelpText(helpData: Help): void {
        if (!interval) {
            interval = alt.setInterval(HelpController.drawHelp, 0);
        }

        currentHelp = helpData;
        helpShown = true;

        if (currentHelp && currentHelp.position) {
            currentHelp.position = new alt.Vector3(
                currentHelp.position.x,
                currentHelp.position.y,
                alt.Player.local.pos.z
            );
        } else {
            currentHelp = null;
        }
    }

    static drawHelp() {
        if (!currentHelp || !currentHelp.position) {
            return;
        }

        if (!currentHelp.shortDesc && !currentHelp.longDesc) {
            return;
        }

        if (alt.Player.local.vehicle) {
            return;
        }

        const [onScreen, x, y] = native.getScreenCoordFromWorldCoord(
            currentHelp.position.x,
            currentHelp.position.y,
            alt.Player.local.pos.z,
            0,
            0
        );

        if (!onScreen) {
            return;
        }

        HelpController.drawKey(x, y);
        HelpController.drawShortPress(x, y);
        HelpController.drawLongPress(x, y);
    }

    static drawKey(x: number, y: number) {
        if (!currentHelp.key) {
            return;
        }

        ScreenText.drawTextWithBackground(
            `~b~${String.fromCharCode(currentHelp.key).toUpperCase()}`,
            x,
            y,
            0.5,
            4,
            new alt.RGBA(0, 0, 0, 200),
            new alt.RGBA(255, 255, 255, 255),
            {
                paddingBottom: 0.02,
                paddingTop: 0.02,
                paddingRight: 0.01,
                paddingLeft: 0.01,
                offsetX: -0.05,
                offsetY: -0.02
            }
        );
    }

    static drawShortPress(x: number, y: number) {
        if (!currentHelp.shortDesc) {
            return;
        }

        ScreenText.drawTextWithBackground(
            currentHelp.shortDesc,
            x + 0.04,
            y,
            0.5,
            4,
            new alt.RGBA(0, 0, 0, 200),
            new alt.RGBA(255, 255, 255, 255),
            {
                paddingBottom: 0.02,
                paddingTop: 0.02,
                paddingRight: 0.1,
                paddingLeft: 0.01,
                offsetX: -0.05,
                offsetY: -0.02
            }
        );
    }

    static drawLongPress(x: number, y: number) {
        if (!currentHelp.longDesc) {
            return;
        }

        let xPosition = x;

        if (!currentHelp.key) {
            xPosition = x + 0.04;
        }

        ScreenText.drawTextWithBackground(
            currentHelp.longDesc,
            xPosition,
            y + 0.075,
            0.5,
            4,
            new alt.RGBA(0, 0, 0, 200),
            new alt.RGBA(255, 255, 255, 255),
            {
                paddingBottom: 0.02,
                paddingTop: 0.02,
                paddingRight: 0.05,
                paddingLeft: 0.01,
                offsetX: -0.05,
                offsetY: -0.02
            }
        );
    }

    /**
     * Check if help text is currently showing.
     * @static
     * @return {*}  {boolean}
     * @memberof HelpController
     */
    static isHelpShowing(): boolean {
        return helpShown;
    }
}
