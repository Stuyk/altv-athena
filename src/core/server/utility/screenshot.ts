import * as alt from 'alt-server';
import Jimp from 'jimp';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { AthenaBuffer } from '../../shared/utility/buffer';

const MAX_TRIES = 1000;
const pendingScreenshots: {
    [key: string]: {
        data: Array<string>;
        didComplete: boolean;
    };
} = {};

export class AthenaScreenshot {
    /**
     * Take a screenshot of the player screen.
     * If the data becomes corrupted or does not retrieve in time it will return null.
     *
     * @static
     * @param {alt.Player} player
     * @return {(Promise<string | null>)}
     * @memberof AthenaScreenshot
     */
    static async takeScreenshot(player: alt.Player): Promise<string | null> {
        alt.emitClient(player, SYSTEM_EVENTS.SCREENSHOT_CREATE);

        return new Promise((resolve: Function) => {
            let tries = 0;

            const interval = alt.setInterval(() => {
                tries += 1;

                if (tries > MAX_TRIES) {
                    alt.clearInterval(interval);
                    delete pendingScreenshots[player.id];
                    return resolve(null);
                }

                if (!pendingScreenshots[player.id] || !pendingScreenshots[player.id].didComplete) {
                    return;
                }

                alt.clearInterval(interval);
                const fullData = AthenaBuffer.fromBuffer(pendingScreenshots[player.id].data);
                delete pendingScreenshots[player.id];
                return resolve(fullData);
            }, 100);
        });
    }

    /**
     * Builds data from a screenshot event.
     * @static
     * @param {alt.Player} player
     * @param {string} data
     * @param {number} index
     * @param {number} lengthOfData
     * @memberof AthenaScreenshot
     */
    static async buildData(player: alt.Player, data: string, index: number, lengthOfData: number) {
        if (!pendingScreenshots[player.id]) {
            pendingScreenshots[player.id] = {
                data: new Array(lengthOfData),
                didComplete: false,
            };
        }

        pendingScreenshots[player.id].data[index] = data;

        if (index === lengthOfData - 1) {
            pendingScreenshots[player.id].didComplete = true;
        }
    }

    /**
     * Crop an image.
     * @static
     * @param {string} image
     * @param {number} [left=0]
     * @param {number} [top=0]
     * @param {number} [width=0]
     * @param {number} [height=0]
     * @return {*}
     * @memberof AthenaScreenshot
     */
    static async crop(image: string, left: number = 0, top: number = 0, width: number = 0, height: number = 0) {
        const jimpImage = await Jimp.read(Buffer.from(image, 'base64'));
        const cropImage = await jimpImage.crop(left, top, width, height).quality(100).getBase64Async(Jimp.MIME_JPEG);
        return cropImage;
    }

    /**
     * Crop a percentage of an image.
     * @static
     * @param {string} image
     * @param {number} [left=0]
     * @param {number} [top=0]
     * @param {number} [width=0]
     * @param {number} [height=0]
     * @return {*}
     * @memberof AthenaScreenshot
     */
    static async cropByPercent(
        image: string,
        left: number = 0,
        top: number = 0,
        width: number = 0,
        height: number = 0,
    ) {
        const jimpImage = await Jimp.read(Buffer.from(image, 'base64'));
        const data = {
            width: jimpImage.getWidth(),
            height: jimpImage.getHeight(),
        };

        const numLeft = left * 0.01 * data.width;
        const numTop = top * 0.01 * data.height;
        const numWidth = width * 0.01 * data.width;
        const numHeight = height * 0.01 * data.height;

        return await this.crop(image, numLeft, numTop, numWidth, numHeight);
    }
}

alt.onClient(SYSTEM_EVENTS.SCREENSHOT_POPULATE_DATA, AthenaScreenshot.buildData);
