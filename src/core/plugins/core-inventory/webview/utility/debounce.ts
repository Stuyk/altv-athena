const defaultTimeout = 300;

let nextAvailableEvent = Date.now();

export function debounceReady() {
    if (Date.now() < nextAvailableEvent) {
        return false;
    }

    nextAvailableEvent = Date.now() + defaultTimeout;
    return true;
}
