import { IConfig } from '../interface/IConfig';
import logger from './athenaLogger';

export default {
    validate: (config: IConfig): boolean => {
        if (!config.WEBSERVER_IP) {
            logger.warning(`Please add the field 'WEBSERVER_IP' to your .env file.`);
            logger.warning(`===> Your IP is your actual server IP. This is used for routing traffic.`);
            process.exit(0);
        }

        if (config.WEBSERVER_IP.includes(':')) {
            logger.warning(`Please remove the port from the 'WEBSERVER_IP' variable in your .env file.`);
            process.exit(0);
        }

        return true;
    }
};
