const pluginFolders = ['sounds', 'images', 'icons', 'videos'];

export default function resolvePath(currentPath: string, pluginName = ''): string {
    if (!currentPath) {
        return '';
    }

    // Handles @plugins pathing
    if (currentPath.includes('@plugins') || currentPath.includes('@AthenaPlugins')) {
        for (const pluginFolder of pluginFolders) {
            if (!currentPath.includes(pluginFolder)) {
                continue;
            }

            if (currentPath.includes('@AthenaPlugins')) {
                currentPath = currentPath.replace(/.*\@AthenaPlugins\//gm, `./plugins/`);
            } else {
                currentPath = currentPath.replace(/.*\@plugins\//gm, `./plugins/`);
            }
        }
    }

    // Handles Older Path Values - Previous Item Types
    if (!currentPath.includes('/') && !currentPath.includes('../')) {
        return `./assets/icons/${currentPath}`;
    }

    while (currentPath.includes('../')) {
        currentPath = currentPath.replace('../', '');
    }

    if (currentPath.includes('assets/')) {
        currentPath = currentPath.replace('assets/', './assets/');
    }

    return currentPath;
}
