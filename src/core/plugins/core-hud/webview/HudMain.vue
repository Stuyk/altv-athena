<template>
    <div>
        <div
            class="flex flex-col fixed right-0 top-0 pr-2 pt-2 text-neutral-200 w-48 gap-2 text-xs select-none pointer-events-none"
        >
            <!-- ID -->
            <div
                class="flex flex-row items-center justify-between bg-neutral-900 border border-neutral-700 opacity-90 p-2 rounded"
            >
                <span class="flex-grow text-right pr-2">{{ id }}</span>
                <span class="flex items-center justify-center w-6">
                    <Icon icon="icon-person" :size="14" />
                </span>
            </div>
            <!-- Cash -->
            <div
                class="flex flex-row items-center justify-between bg-neutral-900 border border-neutral-700 opacity-90 p-2 rounded"
            >
                <span class="text-right flex-grow pr-2">{{ cash.toFixed(2) }}</span>
                <span class="flex items-center justify-center w-6">
                    <Icon icon="icon-dollar" :size="14" />
                </span>
            </div>
            <!-- Bank -->
            <div
                class="flex flex-row items-center justify-between bg-neutral-900 border border-neutral-700 opacity-90 p-2 rounded"
            >
                <span class="text-right flex-grow pr-2">{{ bank.toFixed(2) }}</span>
                <span class="flex items-center justify-center w-6">
                    <Icon icon="icon-bank" :size="12" />
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as StateManager from '@utility/state.js';

let cash = ref<number>(0);
let bank = ref<number>(0);
let id = ref<number>(0);

let interval = ref<NodeJS.Timeout>();

function updateData() {
    const data = StateManager.getCharacterData();
    if (data) {
        cash.value = data.cash;
        bank.value = data.bank;
    }

    const user_id = StateManager.getId();
    id.value = user_id;
}

function create() {
    if (!interval.value) {
        interval.value = setInterval(updateData, 100);
    }

    updateData();
}

function destroy() {
    if (interval.value) {
        clearTimeout(interval.value);
        interval.value = undefined;
    }
}

onMounted(create);
onUnmounted(destroy);
</script>
