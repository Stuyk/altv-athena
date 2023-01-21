import * as alt from 'alt-client';
import { PlayerConfigKeys } from '@AthenaShared/enums/playerConfigKeys';

type ConfigCallback = (value: any) => void;

const callbacks: { [key: string]: Array<ConfigCallback> } = {};

const InternalFunctions = {
    process(key: string, value: any) {
        if (!callbacks[key]) {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(value);
        }
    },
};

export const PlayerConfig = {
    /**
     * Get a value assigned by the server.
     *
     * @template ReturnType
     * @param {string} key
     * @return {(ReturnType | undefined)}
     */
    get<ReturnType, CustomKeys>(key: PlayerConfigKeys | CustomKeys): ReturnType | undefined {
        return alt.getMeta(String(key)) as ReturnType;
    },
    callback: {
        /**
         * Add a custom callback to listen for config changes.
         *
         * @template CustomKeys
         * @param {(PlayerConfigKeys | CustomKeys)} key
         * @param {ConfigCallback} callback
         */
        add<CustomKeys>(key: PlayerConfigKeys | CustomKeys, callback: ConfigCallback) {
            const keyName = String(key);

            if (!callbacks[keyName]) {
                callbacks[keyName] = [];
            }

            callbacks[keyName].push(callback);
        },
    },
};

alt.on('localMetaChange', InternalFunctions.process);
