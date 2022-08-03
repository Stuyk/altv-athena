export default function resolvePath(currentPath: string, pluginName = ''): string {
    if (currentPath.includes('images/') && pluginName) {
        currentPath = currentPath.replace(/.*images\//gm, `./plugins/${pluginName}/`);
    }

    if (!('alt' in window)) {
        return currentPath;
    }

    while (currentPath.includes('../')) {
        currentPath = currentPath.replace('../', '');
    }

    if (currentPath.includes('assets/')) {
        currentPath = currentPath.replace('assets/', './assets/');
    }

    return currentPath;
}
