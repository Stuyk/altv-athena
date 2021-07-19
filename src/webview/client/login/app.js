const app = new Vue({
    el: '#app',
    data() {
        return {
            url: null,
            loading: false,
            done: false,
            updates: 0,
            waitingForAuth: false,
            errorMessage: null,
            readyToFinish: false,
            locales: {
                LABEL_OPEN_PAGE: `A page will open up outside of your game and assist you with logging in.`,
                LABEL_LOGIN_WITH_DISCORD: `Login with Discord`,
                LABEL_TRY_AGAIN: `Try again...`,
                LABEL_TAB_OUT: `Tab out and check your browser to finish authentication. If this fails try opening the
                window again.`,
                LABEL_FINISH_LOGIN: `Finish Login`,
                LABEL_OPEN_WINDOW: `Open Login Window Again`
            },
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        setLocales(locales) {
            this.locales = locales;
        },
        setAsReady() {
            this.$nextTick(() => {
                this.updates += 1;

                if ('alt' in window) {
                    alt.emit('ready');
                    alt.emit('discord:Ready');
                }
            });
        },
        beginAuth() {
            setTimeout(() => {
                this.getURL();
                this.errorMessage = null;
                this.updates += 1;
            }, 100);

            setTimeout(() => {
                this.readyToFinish = true;
                this.updates += 1;
            }, 3000);
        },
        finishAuth() {
            this.loading = true;
            this.updates += 1;

            if ('alt' in window) {
                alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                alt.emit('discord:FinishAuth');
            } else {
                setTimeout(() => {
                    this.fail('Testing fail message');
                }, 2500);
            }
        },
        authAgain() {
            this.getURL();
        },
        getURL() {
            this.waitingForAuth = true;

            if ('alt' in window) {
                alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                alt.emit('discord:OpenURL');
            }
        },
        hover() {
            if ('alt' in window) {
                alt.emit('play:Sound', 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            }
        },
        openURL(url) {
            this.window = window.open(url);
        },
        finishedLoading() {
            this.$nextTick(() => {
                this.setAsReady();
            });
        },
        endWindow() {
            if (this.window) {
                try {
                    this.window.close();
                } catch (err) {
                    console.log(err);
                }
            }
        },
        fail(message) {
            this.errorMessage = message;
            this.waitingForAuth = false;
            this.loading = false;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('discord:SetLocales', this.setLocales);
            alt.on('discord:OpenURL', this.openURL);
            alt.on('discord:endWindow', this.endWindow);
            alt.on('discord:Fail', this.fail);
            alt.on('url', this.setURL);
            alt.emit('url');
        }

        this.finishedLoading();
    }
});
