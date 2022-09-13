<template>
    <Frame minWidth="30vw" maxWidth="30vw">
        <template v-slot:toolbar>
            <Toolbar>Login</Toolbar>
        </template>
        <template v-slot:content>
            <template v-if="!isAuthorizing">
                <div class="stack center">
                    <img class="discord center mb-4 mt-4" :src="ResolvePath(`../../assets/images/discord.svg`)" />
                    <span class="grey--text text--darken-1 boldest">{{ locales.LABEL_LOGIN_WITH_DISCORD }}</span>
                </div>
                <p class="grey--text text--darken-1 center">
                    {{ locales.LABEL_OPEN_PAGE }}
                </p>
                <Button class="mt-16" color="blue" @click="openExternalLoginWindow">
                    {{ locales.LABEL_LOGIN_WITH_DISCORD }}
                </Button>
            </template>
            <template v-else>
                <div class="stack center">
                    <img class="discord center mb-4 mt-4" :src="ResolvePath(`../../assets/images/discord.svg`)" />
                </div>
                <p class="grey--text text--darken-1 center">
                    {{ locales.LABEL_TAB_OUT }}
                </p>
                <!-- Default to leaving this window open. Show finishAuth after 2.5s~ or so -->
                <Button class="mt-16" color="amber">
                    {{ locales.LABEL_OPEN_WINDOW }}
                </Button>
                <Button v-if="isFinishAuthReady" class="mt-4" color="blue" @click="checkForAuthorization">
                    {{ locales.LABEL_FINISH_LOGIN }}
                </Button>
            </template>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { DISCORD_LOGIN_EVENTS } from '../shared/events';
import ResolvePath from '../../../../../src-webviews/src/utility/pathResolver';
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';

const ComponentName = 'Login';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
    },
    data() {
        return {
            uri: 'https://stuyk.com/',
            isAuthorizing: false,
            isFinishAuthReady: false,
            locales: {
                LABEL_OPEN_PAGE: `A page will open up outside of your game and assist you with logging in.`,
                LABEL_LOGIN_WITH_DISCORD: `Login with Discord`,
                LABEL_TRY_AGAIN: `Try again...`,
                LABEL_TAB_OUT: `Tab out and check your browser to finish authentication. If this fails try opening the
                window again.`,
                LABEL_FINISH_LOGIN: `Finish Login`,
                LABEL_OPEN_WINDOW: `Open Login Window Again`,
            },
        };
    },
    methods: {
        ResolvePath,
        setURI(uri: string) {
            if (!uri) {
                throw new Error('Failed to get a proper URI string for login window.');
            }

            this.uri = uri;
        },
        openExternalLoginWindow() {
            if (!this.uri) {
                throw new Error('Failed to get a proper URI string for login window.');
            }

            window.open(this.uri);
            this.isAuthorizing = true;
            this.delayFinishAuthButton();
        },
        checkForAuthorization() {
            WebViewEvents.emitServer(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_FINISH);
            this.delayFinishAuthButton();
        },
        setErrorMessage(message: string) {
            this.errorMessage = message;
            this.isAuthorizing = false;
            this.isFinishAuthReady = false;
        },
        delayFinishAuthButton() {
            this.isFinishAuthReady = false;

            setTimeout(() => {
                this.isFinishAuthReady = true;
            }, 2500);
        },
    },
    mounted() {
        WebViewEvents.on(DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_URI, this.setURI);
        WebViewEvents.on(DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE, this.setErrorMessage);
        WebViewEvents.emitReady('Login');

        if ('alt' in window) {
            alt.on(`${ComponentName}:SetLocales`, this.setLocales);
            alt.on(`${ComponentName}:OpenURL`, this.openURL);
            alt.on(`${ComponentName}:endWindow`, this.endWindow);
            alt.on(`${ComponentName}:Fail`, this.fail);
        }
    },
});
</script>

<style scoped>
.discord {
    opacity: 0.25;
    max-width: 150px;
    transition: all 1s;
}

.discord:hover {
    opacity: 0.75;
}
</style>
