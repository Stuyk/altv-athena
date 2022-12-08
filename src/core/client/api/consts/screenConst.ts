import { drawMarker } from '@AthenaClient/utility/marker';
import { drawRectangle, drawRectangle2D, drawText2D, drawText3D } from '@AthenaClient/utility/text';
import Minimap from '@AthenaClient/utility/minimap';
import Spinner from '@AthenaClient/utility/spinner';
import Shard from '@AthenaClient/utility/shard';
import { Notification } from '@AthenaClient/utility/notification';

export const screenConst = {
    drawMarker,
    drawText3D,
    drawText2D,
    drawRectangle3D: drawRectangle,
    drawRectangle2D,
    minimap: Minimap,
    spinner: Spinner,
    shard: Shard,
    notification: Notification,
};
