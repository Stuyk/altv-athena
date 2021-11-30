<template>
    <Frame minWidth="30vw" maxWidth="30vw">
        <template v-slot:toolbar>
            <Toolbar @close-page="() => {}" pageName="Job">Nothing</Toolbar>
        </template>
        <template v-slot:content> </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../../components/Icon.vue';
import Button from '../../components/Button.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';

export const ComponentName = 'Job';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Toolbar,
    },
    props: {
        emit: Function,
    },
    data() {
        return {};
    },
    methods: {
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:Close`);
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(`${ComponentName}:SetLocale`, this.setLocales);
            alt.emit(`${ComponentName}:Ready`);
            alt.emit('ready');
        } else {
            const cash = Math.floor(Math.random() * 5000000);
            const bank = Math.floor(Math.random() * 5000000);
            this.updateBalances(cash, bank);
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.off(`${ComponentName}:Update`, this.updateBalances);
            alt.off(`${ComponentName}:SetLocale`, this.setLocales);
        }
    },
});
</script>

<style scoped>
.balancer {
    position: relative;
    flex-grow: 1;
    min-width: 100% !important;
    background-color: #388e3c !important;
    text-align: center;
    overflow: hidden !important;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    box-sizing: border-box;
    border: 2px solid #2c2c2c;
}

.bar {
    position: absolute;
    height: 50px !important;
    top: 0px;
    right: -5px;
    transform: skew(-15deg);
}

.balancer .text {
    position: relative;
    z-index: 99;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.2);
}
</style>
