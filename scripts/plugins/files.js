import { movePluginFilesToWebview } from './shared.js';

export async function copyPluginFiles() {
    const extensions = {
        icons: ['png'],
        'webview/images': ['jpg', 'png', 'svg', 'jpeg', 'gif'],
        'webview/videos': ['webm', 'avi'],
        sounds: ['ogg'],
        'webview/assets': [
            'jpg',
            'png',
            'svg',
            'jpeg',
            'gif',
            'webm',
            'webp',
            'avi',
            'ogg',
            'wav',
            'css',
            'html',
            'js',
            'ico',
            'otf',
            'ttf',
        ],
    };

    const promises = Object.keys(extensions).map((folderName) =>
        movePluginFilesToWebview(folderName, extensions[folderName])
    );

    await Promise.all(promises);
}
