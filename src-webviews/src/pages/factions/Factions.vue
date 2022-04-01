<template>
    <div class="factions-wrapper">
        <div class="split">
            <div class="factions-nav">
                <Navigation v-bind:pages="pages" v-bind:page="pageIndex" @navigate="setPage" />
            </div>
            <div class="factions-content stack">
                <Header v-bind:faction="faction" />
                <component
                    :is="pages[pageIndex].page"
                    class="fade-in"
                    :key="pageIndex"
                    v-bind:faction="faction"
                ></component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../../components/Icon.vue';
import Button from '../../components/Button.vue';
import Navigation from './components/Navigation.vue';
import Header from './components/Header.vue';
import { FactionPages } from './pages/exports';

export const ComponentName = 'Factions';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon,
        Navigation,
        Header,
        ...FactionPages,
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            pageIndex: 0,
            pages: [
                { name: 'Members', page: 'Members' },
                { name: 'Ranks', page: 'Ranks' },
                { name: 'Bank', page: 'Bank' },
                { name: 'Vehicles', page: 'Vehicles' },
                { name: 'Actions', page: 'Actions' },
                { name: 'Settings', page: 'Settings' },
            ],
            faction: {
                name: 'Los Santos Police Department',
                motd: '',
            },
        };
    },
    methods: {
        setPage(pageIndex: number) {
            this.pageIndex = pageIndex;
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.emit(`${ComponentName}:Ready`);
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);
    },
});
</script>

<style>
.factions-wrapper {
    display: flex;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 100vh;
    max-height: 100vh;
    background-color: rgba(12, 12, 12, 0.85);
}

.factions-nav {
    display: flex;
    flex-direction: column;
    min-width: 175px;
    max-width: 175px;
    min-height: 100vh;
    max-height: 100vh;
    border-right: 2px solid rgba(23, 23, 23, 1);
    box-sizing: border-box;
}

.factions-content {
    width: 100%;
    min-width: calc(100vw - 175px);
    max-width: calc(100vw - 175px);
    min-height: 100vh;
    max-height: 100vh;
}
</style>
