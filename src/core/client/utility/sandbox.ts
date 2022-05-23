import * as alt from 'alt-client';
import * as native from 'natives';
import MinimapHelper from './minimap';
import { drawRectangle2D, drawText2D } from './text';
// TODO: Still in Usage? Can't tell properly, so i'll keep it for now.

// const polygon = new Polygon([
//     { x: -1498.1483154296875, y: -677.0752563476562, z: 28.048023223876953 },
//     { x: -1491.2274169921875, y: -671.2970581054688, z: 28.943195343017578 },
//     { x: -1498.2650146484375, y: -664.248291015625, z: 29.025087356567383 },
//     { x: -1463.30908203125, y: -638.9778442382812, z: 29.582916259765625 },
//     { x: -1452.80712890625, y: -652.8944091796875, z: 29.582338333129883 },
//     { x: -1478.6595458984375, y: -672.8909301757812, z: 29.041839599609375 },
//     { x: -1481.732421875, y: -672.94677734375, z: 28.943140029907227 },
//     { x: -1493.603271484375, y: -681.1644897460938, z: 27.73985481262207 },
//     { x: -1493.603271484375, y: -681.1644897460938, z: 27.73985481262207 },
// ]);

// alt.setInterval(() => {
//     if (!polygon) {
//         return;
//     }

// const lines = polygon.getDrawLines();
// for (let i = 0; i < lines.length; i++) {
//     const a = lines[i].a;
//     const b = lines[i].b;
//     native.drawLine(a.x, a.y, a.z, b.x, b.y, b.z, 255, 0, 0, 255);
// }

// const center = polygon.getCenter();
// native.drawLine(center.x, center.y, center.z, center.x, center.y, center.z + 2, 255, 0, 0, 255);

//     if (polygon.isInPolygon(alt.Player.local.pos)) {
//         drawText2D('INSIDE', { x: 0.5, y: 0.2 }, 0.4, new alt.RGBA(255, 255, 255, 100));
//     } else {
//         drawText2D('OUTSIDE', { x: 0.5, y: 0.2 }, 0.4, new alt.RGBA(255, 255, 255, 100));
//     }
// }, 0);
