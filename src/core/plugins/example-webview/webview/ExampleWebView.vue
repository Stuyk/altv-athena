<template>
    <div class="example-wrapper">
        <div class="toptions mr-2">
            <Button color="green" @click="refresh" class="mb-10 mt-2 refresh-button">Refresh</Button>
            <Button color="red" @click="close" class="mb-10 mt-2 ml-2 close-button">Close</Button>
        </div>
        <div class="players">
            <div v-for="(player, index) in players" :key="index" class="player">
                <div class="info overline">
                    <span>{{ player.id }}</span>
                    <span>{{ player.name }}</span>
                    <span>{{ player.ping }}</span>
                </div>
                <Button color="red" @click="kick(player.id)">Kick</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';

// Other Imports
import { defineComponent, defineAsyncComponent } from 'vue';
import { ExPlayerInfo } from '../shared/interfaces';
import { ExampleWebViewEvents } from '../shared/viewInfo';

const ComponentName = ExampleWebViewEvents.ViewName;
export default defineComponent({
    name: ComponentName,
    components: {
        // Global Components
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            players: [] as Array<ExPlayerInfo>,
        };
    },
    mounted() {
        WebViewEvents.on(ExampleWebViewEvents.ServerToWebView.REFRESH_PLAYERS, this.loadPlayers);
        WebViewEvents.on(ExampleWebViewEvents.ClientToWebView.LOAD_PLAYERS, this.loadPlayers);
        WebViewEvents.emitReady(ExampleWebViewEvents.ViewName);

        // Do not load example data.
        if ('alt' in window) {
            return;
        }

        // Load example data...
        this.loadPlayers([
            { name: 'Johnny_Dillinger', ping: 25, id: 0 },
            { name: 'Ivy_Vilachi', ping: 34, id: 1 },
            { name: 'Ivan_Vilcaova', ping: 99, id: 2 },
            { name: 'Bobby_Burn', ping: 55, id: 3 },
            { name: 'Bob_Burns', ping: 55, id: 3 },
            { name: 'Carl_Burnham', ping: 55, id: 3 },
            { name: 'Konnie_Burnham', ping: 55, id: 3 },
            { name: 'Annie_Adenson', ping: 55, id: 3 },
        ]);
    },
    methods: {
        close() {
            WebViewEvents.emitClose();
        },
        loadPlayers(players: ExPlayerInfo[]) {
            this.players = players;
        },
        kick(id: number) {
            WebViewEvents.emitServer(ExampleWebViewEvents.WebViewToServer.KICK_PLAYER, id);
        },
        refresh() {
            WebViewEvents.emitServer(ExampleWebViewEvents.WebViewToServer.REQUEST_REFRESH);
        },
    },
});
</script>

<style scoped>
.example-wrapper {
    position: fixed;
    justify-content: center;
    align-items: center;
    background: rgba(12, 12, 12, 1) !important;
    min-height: 400px;
    max-height: 400px;
    min-width: 600px;
    max-width: 600px;
    border-radius: 6px;
}

.toptions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
}

.players {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 300px;
    max-height: 300px;
    overflow-y: scroll;
}

.player {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
    padding-bottom: 12px;
    padding-top: 12px;
    align-items: center;
}

.player .info {
    display: flex;
    min-width: 300px;
    max-width: 300px;
    justify-content: space-between;
}

.player:nth-child(odd) {
    background: rgba(255, 255, 255, 0.1);
}
</style>
