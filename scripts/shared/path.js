/**
 * Replace windows based pathing with linux based pathing
 *
 * @export
 * @param {string} path
 * @return {string}
 */
export function sanitizePath(path) {
    return path.replace(/\\/g, '/');
}
