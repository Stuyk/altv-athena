export default function resolvePath(currentPath: string): string {
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
