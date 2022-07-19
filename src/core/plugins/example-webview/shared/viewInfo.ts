export const ExampleWebViewEvents = {
    ViewName: 'ExampleWebView', // This needs to match the `.vue` file name.
    ClientServer: {
        OPEN: 'example:webview:event:open',
        CLOSE: 'example:webview:event:close',
    },
    ClientToWebView: {
        LOAD_PLAYERS: 'example:webview:event:loadplayers',
    },
    ServerToWebView: {
        REFRESH_PLAYERS: 'example:webview:event:refreshplayers',
    },
    WebViewToServer: {
        KICK_PLAYER: 'example:webview:event:kick',
        REQUEST_REFRESH: 'example:webview:event:requestrefresh',
    },
};
