export function isNullOrUndefined(value: any) {
    if (typeof value === 'undefined') {
        return true;
    }

    if (typeof value !== 'number' && typeof value !== 'boolean' && !value) {
        return true;
    }

    return false;
}
