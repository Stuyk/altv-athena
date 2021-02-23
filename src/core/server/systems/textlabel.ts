import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/TextLabel';

const globalTextLabels: Array<TextLabel> = [];

export class TextLabelController {
    static add(marker: TextLabel) {
        globalTextLabels.push(marker);
    }

    static populateGlobalMarkers(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_TEXTLABELS, globalTextLabels);
    }
}
