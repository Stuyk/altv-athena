const pluginFolders = ['sounds', 'images', 'icons', 'videos'];

export default function resolvePath(currentPath: string, pluginName = ''): string {
    if (!currentPath) {
        return '';
    }

    if (currentPath.includes('@plugins')) {
        for (const pluginFolder of pluginFolders) {
            if (!currentPath.includes(pluginFolder)) {
                continue;
            }

            currentPath = currentPath.replace(/.*\@plugins\//gm, `./plugins/`);
        }
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
