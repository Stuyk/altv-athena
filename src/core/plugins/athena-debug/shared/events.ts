export const ATHENA_DEBUG_EVENTS = {
    ClientToServer: {
        FORWARD: 'athena-debug-event-send-data',
    },
    toClient: {
        closePage: 'athena-debug-close-page',
        exec: 'athena-debug-exec-code',
        openExec: 'athena-debug-exec-page',
    },
    toServer: {
        exec: 'athena-debug-exec-code-server',
    },
};
