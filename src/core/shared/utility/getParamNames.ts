const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

/**
 * Used to reflect names of parameters from a given function.
 * Returns an array of parameter names.
 *
 *
 * @param {Function} func
 * @return {Array<string>}
 */
export function getParamNames(func: Function): Array<string> {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

    if (!result) {
        return [];
    }

    return result;
}
