import * as alt from 'alt-client';
import * as native from 'natives';

import { Help } from '../../shared/interfaces/Help';
import { isAnyMenuOpen } from '../utility/menus';
import { ScreenText } from '../utility/screenText';

const TIME_BETWEEN_HELP_CLEARS = 3500;
const helpList: Array<Help> = [];

let helpShown: boolean = false;
let interval: number;

export class HelpController {
    static append(data: Help) {
        if (helpList.find((x) => x.key === data.key)) {
            return;
        }

        data.expiration = Date.now() + TIME_BETWEEN_HELP_CLEARS;
        data.position = new alt.Vector3(data.position.x, data.position.y, alt.Player.local.pos.z);
        helpList.push(data);
    }

    static drawHelp() {
        if (helpList.length <= 0) {
            return;
        }

        if (isAnyMenuOpen()) {
            return;
        }

        for (let i = helpList.length - 1; i >= 0; i--) {
            const currentHelp = helpList[i];

            if (Date.now() > currentHelp.expiration) {
                helpList.splice(i, 1);
                continue;
            }

            const [onScreen, x, y] = native.getScreenCoordFromWorldCoord(
                currentHelp.position.x,
                currentHelp.position.y,
                alt.Player.local.pos.z,
                0,
                0
            );

            if (!onScreen) {
                continue;
            }

            HelpController.drawKey(currentHelp.key, x, y, i);
            HelpController.drawShortPress(x, y, currentHelp.desc, i);
        }
    }

    static drawKey(key: number, x: number, y: number, offset: number) {
        ScreenText.drawTextWithBackground(
            `~b~${String.fromCharCode(key).toUpperCase()}`,
            x,
            y + offset * 0.01,
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

    static drawShortPress(x: number, y: number, description: string, offset: number) {
        ScreenText.drawTextWithBackground(
            description,
            x + 0.03,
            y + offset * 0.01,
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
