<template>
    <Frame minWidth="30vw" maxWidth="30vw">
        <template v-slot:toolbar>
            <Toolbar>Login</Toolbar>
        </template>
        <template v-slot:content>
            <template v-if="!waitingForAuth">
                <div class="stack center">
                    <img class="discord center mb-4 mt-4" :src="ResolvePath(`../../assets/images/discord.svg`)" />
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
                    <img class="discord center mb-4 mt-4" :src="ResolvePath(`../../assets/images/discord.svg`)" />
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
import ResolvePath from '../../utility/pathResolver';

const ComponentName = 'Login';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Toolbar,
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
                LABEL_OPEN_WINDOW: `Open Login Window Again`,
            },
        };
    },
    methods: {
        ResolvePath,
        setLocales(locales) {
            this.locales = locales;
        },
        setAsReady() {
            this.$nextTick(() => {
                this.updates += 1;

                if ('alt' in window) {
                    alt.emit(`${ComponentName}:Ready`);
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
                alt.emit(`${ComponentName}:FinishAuth`);
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

            if ('alt' in window) {
                alt.emit(`${ComponentName}:OpenURL`);
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
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:SetLocales`, this.setLocales);
            alt.on(`${ComponentName}:OpenURL`, this.openURL);
            alt.on(`${ComponentName}:endWindow`, this.endWindow);
            alt.on(`${ComponentName}:Fail`, this.fail);
        }

        this.finishedLoading();
    },
    unmounted() {
        if (`alt` in window) {
            alt.off(`${ComponentName}:SetLocales`, this.setLocales);
            alt.off(`${ComponentName}:OpenURL`, this.openURL);
            alt.off(`${ComponentName}:endWindow`, this.endWindow);
            alt.off(`${ComponentName}:Fail`, this.fail);
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
