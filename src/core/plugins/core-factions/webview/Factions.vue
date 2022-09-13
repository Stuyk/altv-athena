<template>
    <div class="factions-wrapper stack">
        <div class="toolbar split space-between">
            <span class="pl-2">{{ faction && faction.name ? faction.name : 'Faction Name Missing' }}</span>
            <Icon class="red--text red--hover hover pr-2" :size="24" icon="icon-times-circle" @click="close" />
        </div>
        <div class="split" style="width: 100%">
            <div class="factions-nav">
                <Navigation v-bind:pages="pages" v-bind:page="pageIndex" @navigate="setPage" />
            </div>
            <div class="factions-content stack" v-if="faction">
                <component
                    :is="pages[pageIndex].page"
                    class="fade-in"
                    :key="pageIndex"
                    v-bind:faction="faction"
                    v-bind:character="character"
                    v-bind:money="money"
                    v-bind:pos="pos"
                    v-bind:rot="rot"
                    v-bind:spawned-vehicles="spawnedVehicles"
                    @update-faction-prop="updateFactionProp"
                ></component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

import { ExampleFactionData } from './utility/exampleFactionData';
import { Faction } from '../shared/interfaces';
import { FACTION_EVENTS } from '../shared/factionEvents';
import { Vector3 } from '../../../shared/interfaces/vector';

export const ComponentName = 'Factions';
export default defineComponent({
    name: ComponentName,
    components: {
        // Global Components
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        // Local Components
        Navigation: defineAsyncComponent(() => import('./components/Navigation.vue')),
        Header: defineAsyncComponent(() => import('./components/Header.vue')),
        Actions: defineAsyncComponent(() => import('./pages/Actions.vue')),
        Bank: defineAsyncComponent(() => import('./pages/Bank.vue')),
        Members: defineAsyncComponent(() => import('./pages/Members.vue')),
        Ranks: defineAsyncComponent(() => import('./pages/Ranks.vue')),
        Settings: defineAsyncComponent(() => import('./pages/Settings.vue')),
        Vehicles: defineAsyncComponent(() => import('./pages/Vehicles.vue')),
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
            faction: null,
            // Character IDs and their associated test ranks...
            // 61a8efe590851930ac59f5ef - 0 Rank // 51a8efe590851930ac59f5eg - 1 Rank // 51a8efe590851930ac59f5cc - 2 Rank
            character: '61a8efe590851930ac59f5ef',
            // Money = Bank + Cash
            money: 0,
            // Position and rotation of the faction
            pos: { x: 25, y: 1, z: 25 },
            rot: { x: 0, y: 0, z: 0 },
            // Vehicles currently spawned
            spawnedVehicles: ['626c64fbfdf5ff231b4991cc'],
        };
    },
    methods: {
        setPage(pageIndex: number) {
            this.pageIndex = pageIndex;
        },
        updateFaction(
            faction: Faction,
            character: string,
            money: number,
            pos: Vector3,
            rot: Vector3,
            spawnedVehicles: Array<string>,
        ) {
            this.faction = faction;
            this.character = character;
            this.money = money;
            this.pos = pos;
            this.rot = rot;

            if (typeof spawnedVehicles === 'string') {
                console.log(spawnedVehicles);
                this.spawnedVehicles = JSON.parse(spawnedVehicles);
            } else {
                this.spawnedVehicles = spawnedVehicles;
            }
        },
        updateFactionProp(faction: Faction) {
            this.faction = faction;
        },
        close() {
            if (!('alt' in window)) {
                return;
            }

            console.log('test');
            alt.emit(FACTION_EVENTS.WEBVIEW.CLOSE);
        },
        handlePress(e: KeyboardEvent) {
            // Escape
            if (e.keyCode !== 27) {
                return;
            }

            this.close();
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(FACTION_EVENTS.WEBVIEW.UPDATE_DATA, this.updateFaction);
            alt.emit(FACTION_EVENTS.WEBVIEW.READY);
        } else {
            this.faction = ExampleFactionData;
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(FACTION_EVENTS.WEBVIEW.UPDATE_DATA, this.updateFaction);
        }

        document.removeEventListener('keyup', this.handlePress);
    },
});
</script>

<style>
.toolbar {
    min-height: 35px;
    max-height: 35px;
    background-color: rgba(12, 12, 12, 1);
    border-bottom: 2px solid rgba(48, 48, 48, 1);
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}

.factions-wrapper {
    display: flex;
    min-width: 800px;
    width: 900px;
    min-height: calc(75vh + 35px);
    max-height: calc(75vh + 35px);
    background-color: rgba(36, 36, 36, 1);
    overflow: hidden;
    border: 2px solid rgba(22, 22, 22, 1);
    box-shadow: 2px 2px 10px black;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}

.factions-nav {
    display: flex;
    flex-direction: column;
    min-width: 175px;
    max-width: 175px;
    height: 100%;
    border-right: 2px solid rgba(28, 28, 28, 1);
    box-sizing: border-box;
}

.factions-content {
    width: 100%;
    height: 100%;
    min-height: 75vh;
    max-height: 75vh;
    box-sizing: border-box;
}
</style>
