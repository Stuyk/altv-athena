import { moveAssetsToWebview, movePluginFilesToWebview, clearPluginsWebViewFolder } from './shared.js';

export async function copyPluginFiles() {
    const promises = [];

    clearPluginsWebViewFolder();

    promises.push(movePluginFilesToWebview('icons', ['png']));
    promises.push(movePluginFilesToWebview('webview/images', ['jpg', 'png', 'svg', 'jpeg', 'gif']));
    promises.push(movePluginFilesToWebview('webview/videos', ['webm', 'avi']));
    promises.push(movePluginFilesToWebview('sounds', ['ogg']));
    promises.push(
        moveAssetsToWebview('webview/assets', [
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
        ]),
    );

    await Promise.all(promises);
}
