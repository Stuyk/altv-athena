import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { JobTrigger } from '../../shared/interfaces/JobTrigger';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';

const url = `http://assets/webview/client/job/index.html`;
let trigger: JobTrigger;
let view: View;

class JobView implements ViewModel {
    static async open(_trigger: JobTrigger) {
        if (isAnyMenuOpen()) {
            return;
        }

        trigger = _trigger;
        view = await View.getInstance(url, true, false, true);
        view.on('job:Select', JobView.select);
        view.on('job:Exit', JobView.close);
        view.on('ready', JobView.ready);
        alt.toggleGameControls(false);
    }

    static select() {
        alt.emitServer(SYSTEM_EVENTS.INTERACTION_JOB_ACTION, trigger.event);
        JobView.close();
    }

    static close() {
        alt.toggleGameControls(true);

        if (!view) {
            return;
        }

        view.close();
        view = null;
    }

    static ready() {
        if (!view) {
            return;
        }

        view.emit('job:Data', trigger);
        view.emit('job:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_JOB));
    }
}

alt.onServer(SYSTEM_EVENTS.INTERACTION_JOB, JobView.open);
