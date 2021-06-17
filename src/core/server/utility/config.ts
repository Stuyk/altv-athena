import { IConfig } from '../interface/IConfig';
import logger from './athenaLogger';

export default {
    validate: (config: IConfig): boolean => {
        if (!config.GUMROAD) {
            logger.error('Failed to retrieve GUMROAD from your .env file.');
            logger.log(`Visit: https://athena.stuyk.com/documentation/installing-athena`);
            process.exit(0);
        }

        if (!config.EMAIL) {
            logger.error('Failed to retrieve EMAIL from your .env file.');
            logger.log(`Visit: https://athena.stuyk.com/documentation/installing-athena`);
            process.exit(0);
        }

        return true;
    }
};
