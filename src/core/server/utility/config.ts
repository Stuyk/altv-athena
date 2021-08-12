import * as alt from 'alt-server';
import { IConfig } from '../interface/IConfig';
import logger from './athenaLogger';

export default {
    validate: (config: IConfig): boolean => {
        if (config.WEBSERVER_IP && !alt.hasResource('webserver')) {
            if (!config.WEBSERVER_IP) {
                logger.warning(`Add WEBSERVER_IP to your .env file and target: 127.0.0.1:9111`);
                return false;
            }

            if (!config.WEBSERVER_IP.includes(':')) {
                logger.warning(`Please add port 9111 to your WEBSERVER_IP in your .env file. ie. 127.0.0.1:9111`);
            }

            logger.warning(`Reminder that you are using development mode for distributing files.`);
            logger.warning(`Please add 'webserver' as a resource when running in production mode.`);
        }

        return true;
    }
};
