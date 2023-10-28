import * as AthenaClient from '@AthenaClient/api/index.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';

function registerHudPage() {
    AthenaClient.webview.registerOverlay('HudMain', () => {});
}

onTicksStart.add(registerHudPage);
