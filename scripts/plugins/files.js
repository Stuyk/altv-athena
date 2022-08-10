import { movePluginFilesToWebview } from './shared.js';

function run() {
    movePluginFilesToWebview('icons', ['png'])
    movePluginFilesToWebview('webview/css', ['sass', 'css', 'scss', 'stylus'])
    movePluginFilesToWebview('webview/images', ['jpg', 'png', 'svg', 'jpeg', 'gif'])
    movePluginFilesToWebview('webview/videos', ['webm', 'avi'])
    movePluginFilesToWebview('sounds', ['ogg'])
}

run();
