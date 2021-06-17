import { Poster, PosterFormat } from '../interface/Poster';
import Ares from '../utility/ares';
import dotenv from 'dotenv';
import { IConfig } from '../interface/IConfig';

const config: IConfig = dotenv.config().parsed as IConfig;

/**
 * Generates a PosterFormat Type for making a Post Request.
 * @export
 * @param {any} data
 * @return {Promise<PosterFormat>}  {Promise<PosterFormat>}
 */
export async function generatePosterFormat(data: any): Promise<PosterFormat> {
    const posterData: Poster = {
        gumroad_key: config.GUMROAD,
        email: config.EMAIL,
        data
    };

    const encryption = await Ares.encrypt(JSON.stringify(posterData));
    const posterFormat: PosterFormat = {
        public_key: Ares.getPublicKey(),
        encryption
    };

    return posterFormat;
}
