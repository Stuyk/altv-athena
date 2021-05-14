import * as alt from 'alt-client';
import { drawText3D } from '../../../utility/text';

export class HelpController {
    private static key: number | null;
    private static helpShown: boolean = false;
    private static shortPress: string | null;
    private static longPress: string | null;
    private static interval: number;
    private static position: alt.Vector3;

    static updateHelpText(
        position: alt.Vector3,
        key: number | null,
        shortDesc: string | null,
        longDesc: string | null
    ): void {
        if (!HelpController.interval) {
            HelpController.interval = alt.setInterval(HelpController.drawHelp, 0);
        }

        HelpController.key = key;
        HelpController.longPress = longDesc;
        HelpController.shortPress = shortDesc;
        HelpController.helpShown = true;

        if (position) {
            HelpController.position = new alt.Vector3(position.x, position.y, alt.Player.local.pos.z);
        } else {
            HelpController.position = null;
        }
    }

    private static drawHelp() {
        if (!HelpController.position) {
            return;
        }

        if (!HelpController.shortPress && !HelpController.longPress) {
            return;
        }

        HelpController.drawKey();
        HelpController.drawShortPress();
        HelpController.drawLongPress();
    }

    private static drawKey() {
        if (!HelpController.key) {
            return;
        }

        drawText3D(
            `[${String.fromCharCode(HelpController.key)}]`,
            HelpController.position,
            0.3,
            new alt.RGBA(255, 255, 255, 255)
        );
    }

    private static drawShortPress() {
        if (!HelpController.shortPress) {
            return;
        }

        drawText3D(
            HelpController.shortPress,
            new alt.Vector3(HelpController.position.x, HelpController.position.y, HelpController.position.z - 0.1),
            0.3,
            new alt.RGBA(255, 255, 255, 255)
        );
    }

    private static drawLongPress() {
        if (!HelpController.longPress) {
            return;
        }

        drawText3D(
            HelpController.longPress,
            new alt.Vector3(HelpController.position.x, HelpController.position.y, HelpController.position.z - 0.1 * 2),
            0.3,
            new alt.RGBA(255, 255, 255, 255)
        );
    }

    /**
     * Check if help text is currently showing.
     * @static
     * @return {*}  {boolean}
     * @memberof HelpController
     */
    static isHelpShowing(): boolean {
        return this.helpShown;
    }
}
