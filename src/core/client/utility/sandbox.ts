import * as alt from 'alt-client';
import * as native from 'natives';
import MinimapHelper from './minimap';
import { drawRectangle2D } from './text';

// alt.setInterval(() => {
//     const pos = MinimapHelper.getMinimapTopRight(true);
//     const pos2 = MinimapHelper.getMinimapBottomRight(true);

//     drawRectangle2D(pos, { x: 4 / 1280, y: 4 / 720 }, new alt.RGBA(0, 0, 0, 255));
//     drawRectangle2D(pos2, { x: 4 / 1280, y: 4 / 720 }, new alt.RGBA(0, 0, 0, 255));

//     // drawText2D('bottom right', { x: absPos.x, y: absPos.y }, 0.4, new alt.RGBA(255, 255, 255, 255));
//     // drawText2D('top right', { x: absPos2.x, y: absPos2.y }, 0.4, new alt.RGBA(255, 255, 255, 255));
// }, 0);
