<template>
    <Frame minWidth="30vw" maxWidth="30vw">
        <template v-slot:toolbar>
            <Toolbar>Login</Toolbar>
        </template>
        <template v-slot:content>
            <template v-if="!waitingForAuth">
                <div class="stack center">
                    <img class="discord center mb-4 mt-4" src="/public/images/discord.svg" />
                    <span class="grey--text text--darken-1 boldest">{{ locales.LABEL_LOGIN_WITH_DISCORD }}</span>
                </div>
                <p class="grey--text text--darken-1 center">
                    {{ locales.LABEL_OPEN_PAGE }}
                </p>
                <Button class="mt-16" color="blue" @click="beginAuth">
                    {{ locales.LABEL_LOGIN_WITH_DISCORD }}
                </Button>
            </template>
            <template v-else>
                <div class="stack center">
                    <img class="discord center mb-4 mt-4" src="/public/images/discord.svg" />
                </div>
                <p class="grey--text text--darken-1 center">
                    {{ locales.LABEL_TAB_OUT }}
                </p>
                <Button class="mt-16" color="blue" @click="finishAuth">
                    {{ locales.LABEL_FINISH_LOGIN }}
                </Button>
                <Button class="mt-4" color="amber" @click="authAgain">
                    {{ locales.LABEL_OPEN_WINDOW }}
                </Button>
            </template>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../../components/Icon.vue';
import Button from '../../components/Button.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';

const ComponentName = 'Login';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Toolbar
    },
    data() {
        return {
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
            if (url.includes('assets/webserver')) {
                this.url = url;
                return;
            }

            this.url = `http://${url}`;
        },
        setLocales(locales) {
            this.locales = locales;
        },
        setAsReady() {
            this.$nextTick(() => {
                this.updates += 1;

                if ('alt' in window) {
                    alt.emit('discord:Ready');
                }
            });
        },
        beginAuth(payload: MouseEvent) {
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
        finishAuth(payload: MouseEvent) {
            this.loading = true;
            this.updates += 1;

            if ('alt' in window) {
                alt.emit('discord:FinishAuth');
            } else {
                setTimeout(() => {
                    this.fail('Testing fail message');
                }, 2500);
            }
        },
        authAgain(payload: MouseEvent) {
            this.getURL();
        },
        getURL() {
            this.waitingForAuth = true;

            if (window['alt']) {
                alt.emit('discord:OpenURL');
            }
        },
        openURL(url) {
            window.open(url);
        },
        finishedLoading() {
            this.$nextTick(() => {
                this.setAsReady();
            });
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
        }

        this.finishedLoading();
    }
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
