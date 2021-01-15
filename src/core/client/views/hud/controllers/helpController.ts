import * as alt from 'alt-client';
import { BaseHUD } from '../hud';

export class HelpController {
    private static helpShown: boolean = false;
    private static shortPress: string | null;
    private static longPress: string | null;
    private static timeout: number;

    static setHelpState(value: boolean): void {
        if (!BaseHUD.view) {
            return;
        }

        if (!HelpController.helpShown) {
            return;
        }

        BaseHUD.view.emit('hud:HelpState', value);
    }

    static updateHelpText(key: number | null, shortDesc: string | null, longDesc: string | null): void {
        if (!BaseHUD.view) {
            return;
        }

        if (!key && (HelpController.shortPress || HelpController.longPress)) {
            HelpController.longPress = null;
            HelpController.shortPress = null;
            BaseHUD.view.emit('hud:HelpText', null, HelpController.shortPress, HelpController.longPress);
            return;
        }

        if (HelpController.timeout) {
            alt.clearTimeout(HelpController.timeout);
        }

        HelpController.timeout = alt.setTimeout(HelpController.manageHelpTimeout, 5000);
        HelpController.longPress = longDesc;
        HelpController.shortPress = shortDesc;
        HelpController.helpShown = true;
        BaseHUD.view.emit('hud:HelpText', key, HelpController.shortPress, HelpController.longPress);
    }

    private static manageHelpTimeout(): void {
        HelpController.longPress = null;
        HelpController.shortPress = null;
        HelpController.helpShown = false;
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
