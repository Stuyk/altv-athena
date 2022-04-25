import * as alt from 'alt-server';
import { Athena } from '../api/athena';
export default class SystemRules {
    /**
     * Verifies Rules for all System Types
     * @static
     * @param {string} ruleType
     * @param {Array<T>} rules
     * @param {...any[]} args
     * @return {*}  {boolean}
     * @memberof SystemRules
     */
    static check<T>(ruleType: string, rules: { [key: string]: any | T }, ...args: any[]): boolean {
        if (!rules[ruleType]) {
            alt.logError(`${ruleType} does not exist for StorageView Rules`);
            return false;
        }

        if (rules[ruleType].length <= 0) {
            return true;
        }

        for (let i = 0; i < rules[ruleType].length; i++) {
            const rule = rules[ruleType][i];
            const result = rule(...args);
            const isEmptyResponse = result.response !== '' && result.response !== null ? false : true;

            if (args[0] instanceof alt.Player && !result.status && !isEmptyResponse) {
                Athena.player.emit.message(args[0], result.response);
            }

            if (!result.status) {
                return false;
            }

            continue;
        }

        return true;
    }
}
