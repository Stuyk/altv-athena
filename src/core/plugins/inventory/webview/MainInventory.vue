<script lang="ts">
// use normal <script> to declare options
export default {
    inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive } from 'vue';
import * as State from './interfaces/state';
import { exampleItems } from './examples/exampleItems';

import ItemGrid from './components/ItemGrid.vue';
import DisableContextMenu from './components/ItemDisableContext.vue';

const Icon = defineAsyncComponent(() => import('@ViewComponents/Icon.vue'));
const Tooltip = defineAsyncComponent(() => import('./components/ItemTooltip.vue'));
const Inspector = defineAsyncComponent(() => import('./components/ItemInspector.vue'));
const ContextMenu = defineAsyncComponent(() => import('./components/ItemContext.vue'));

const data = reactive({
    inventory: [],
    toolbar: [],
    storage: [],
    proximity: [],
});

const invState = reactive<State.InventoryState>({ dragging: false, interfaces: {} });

function setState<T extends keyof State.InventoryState>(
    key: keyof State.InventoryState,
    value: State.InventoryState[T],
): void {
    invState[String(key)] = value;
}

function showInterface(key: keyof State.InterfaceState, value: boolean) {
    Object.keys(invState.interfaces).forEach((key) => {
        invState.interfaces[key] = false;
    });

    invState.interfaces[key] = value;
}

const getStorageLength = computed(() => {
    if (data.storage.length <= 0) {
        return data.proximity.length;
    }

    return 30;
});

const getStorageClass = computed(() => {
    return data.storage.length >= 1 ? [] : ['section-custom-small'];
});

onMounted(() => {
    if ('alt' in window) {
        return;
    }

    data.inventory = exampleItems;
    // data.storage = exampleItems;
    data.proximity = [...exampleItems, ...exampleItems];
});
</script>

<template>
    <DisableContextMenu />
    <ContextMenu
        v-if="invState.interfaces.context"
        :item="invState.item"
        :x="invState.x"
        :y="invState.y"
        :target="invState.target"
        @close="showInterface('context', false)"
    />
    <Tooltip v-if="invState.interfaces.tooltip" :item="invState.item" :x="invState.x" :y="invState.y" />
    <div class="inventory" id="drop">
        <div class="stack stack-no-gap">
            <div class="split">
                <div class="section-custom icon-wrap no-bottom-border" :class="getStorageClass">
                    <Icon :icon="data.storage.length >= 1 ? 'icon-box' : 'icon-radar-sweep'" :size="24"></Icon>
                </div>
                <div class="section-player icon-wrap no-bottom-border">
                    <Icon icon="icon-person" :size="24"></Icon>
                </div>
            </div>
            <div class="split">
                <div class="section-custom scroll-y no-top-border" :class="getStorageClass">
                    <ItemGrid
                        @setState="setState"
                        @showInterface="showInterface"
                        :location="data.storage.length >= 1 ? 'storage' : 'ground'"
                        :items="data.storage.length >= 1 ? data.storage : data.proximity"
                        :max="getStorageLength"
                        :isDragging="invState.dragging"
                        :ignoreSlot="data.storage.length >= 1 ? false : true"
                    />
                </div>
                <div class="section-player scroll-y no-top-border">
                    <Inspector
                        v-if="invState.interfaces.inspector"
                        @hideInspector="showInterface('inspector', false)"
                        :item="invState.item"
                    />
                    <ItemGrid
                        @setState="setState"
                        @showInterface="showInterface"
                        location="toolbar"
                        :items="data.toolbar"
                        :max="5"
                        :showIndex="true"
                        :isDragging="invState.dragging"
                    />
                    <ItemGrid
                        @setState="setState"
                        @showInterface="showInterface"
                        location="inventory"
                        :items="data.inventory"
                        :max="30"
                        :isDragging="invState.dragging"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
:root {
    --inventory-bg-darker: #20232e;
    --inventory-bg: #272a37;
    --inventory-bg-light: #323644;
    --inventory-bg-lighter: #414658;
    --inventory-brand: #cbe1f0;
}

.inventory {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    background: url('https://img.gta5-mods.com/q75/images/net-riot-mod-2020/01f31e-Screenshot_10.png');
    background-size: cover;
}

.inventory .split,
.stack {
    gap: 12px;
}

.stack-no-gap {
    gap: 0px !important;
}

.inventory .section-player,
.inventory .section-custom {
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    gap: 12px;
    min-width: 542px;
    max-width: 542px;
    padding: 12px;
    border-radius: 6px;
    max-height: 636px;
    opacity: 0.95;
    background: var(--inventory-bg-darker);
}

@media screen and (max-width: 1279px) {
    .inventory .section-player,
    .inventory .section-custom {
        min-width: 436px;
        max-width: 436px;
        max-height: 426px;
    }
}

.inventory ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: var(--inventory-bg-lighter);
}

.inventory ::-webkit-scrollbar {
    border-radius: 6px;
    background: var(--inventory-bg-dark);
}

.inventory .section-custom-small {
    min-width: 228px;
    max-width: 228px;
}

.inventory .scroll-y {
    overflow-y: scroll;
}

.inventory .nav-categories {
    display: flex;
    width: 100%;
    gap: 12px;
}

.inventory .icon-wrap .icon {
    opacity: 0.5;
}

.inventory .no-bottom-border {
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
}

.inventory .no-top-border {
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
}

.nav-categories .option {
    background: var(--inventory-bg-light);
    border: 1px solid var(--inventory-bg-lighter);
    padding: 6px;
    min-width: 125px;
    text-align: center;
    border-radius: 6px;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
}

.nav-categories .option:hover {
    border-color: var(--inventory-brand);
    cursor: pointer;
    color: rgba(255, 255, 255, 1);
    text-shadow: 0px 0px 5px var(--inventory-brand);
    box-shadow: 0px 0px 5px var(--inventory-brand);
}

.nav-categories .option:active {
    transform: scale(0.95);
}

.nav-categories .option.active {
    background: var(--inventory-bg-lighter);
    border-color: var(--inventory-brand);
    color: rgba(255, 255, 255, 1);
    text-shadow: 0px 0px 5px var(--inventory-brand);
    box-shadow: 0px 0px 5px var(--inventory-brand);
}
</style>
