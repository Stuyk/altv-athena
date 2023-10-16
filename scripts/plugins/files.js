import { moveAssetsToWebview, movePluginFilesToWebview, clearPluginsWebViewFolder } from './shared.js';

export function copyPluginFiles() {
    clearPluginsWebViewFolder();
    movePluginFilesToWebview('icons', ['png']);
    movePluginFilesToWebview('webview/images', ['jpg', 'png', 'svg', 'jpeg', 'gif']);
    movePluginFilesToWebview('webview/videos', ['webm', 'avi']);
    movePluginFilesToWebview('sounds', ['ogg']);
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
    ]);
}
