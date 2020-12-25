import { Poster, PosterFormat } from '../interface/Poster';
import { encryptData, getPublicKey } from '../utility/encryption';

export async function generatePosterFormat(data: any): Promise<PosterFormat> {
    const posterData: Poster = {
        gumroad_key: process.env.GUMROAD,
        email: process.env.EMAIL,
        data
    };

    const encryption = await encryptData(JSON.stringify(posterData));
    const posterFormat: PosterFormat = {
        public_key: getPublicKey(),
        encryption
    };

    return posterFormat;
}
