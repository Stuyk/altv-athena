export const AuthEvents = {
    toServer: {
        tryLogin: 'auth:event:push:login',
        finishLogin: 'auth:event:finish:login',
        tryRecovery: 'auth:event:try:recovery',
        tryRegister: 'auth:event:try:register',
    },
    toClient: {
        fromWebview: {
            quit: 'auth:event:quit',
        },
        requestLogin: 'auth:event:request:login',
        endLogin: 'auth:event:end:login',
    },
    toWebview: {
        showErrorMessage: 'auth:event:show:error',
        showSeedPhrase: 'auth:event:show:seed:phrase',
    },
};
