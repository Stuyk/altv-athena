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
            <template v-if="playerState">
                <!-- Health -->
                <div
                    class="flex flex-row items-center justify-between bg-neutral-900 border border-neutral-700 opacity-90 p-2 rounded"
                >
                    <span class="text-right flex-grow pr-2">{{ playerState.health - 99 }}</span>
                    <span class="flex items-center justify-center w-6">
                        <Icon icon="icon-heart" :size="12" />
                    </span>
                </div>
                <!-- Armour -->
                <div
                    class="flex flex-row items-center justify-between bg-neutral-900 border border-neutral-700 opacity-90 p-2 rounded"
                    v-if="playerState.armour >= 1"
                >
                    <span class="text-right flex-grow pr-2">{{ playerState.armour }}</span>
                    <span class="flex items-center justify-center w-6">
                        <Icon icon="icon-shield2" :size="12" />
                    </span>
                </div>
                <!-- Speed -->
                <div
                    class="flex flex-row items-center justify-between bg-neutral-900 border border-neutral-700 opacity-90 p-2 rounded"
                    v-if="playerState.inVehicle"
                >
                    <!-- Multiply by 3.6 for KMH -->
                    <span class="text-right flex-grow pr-2">{{ (playerState.speed * 2.237).toFixed(2) }} mph</span>
                    <span class="flex items-center justify-center w-6">
                        <Icon icon="icon-speed" :size="12" />
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as StateManager from '@utility/state.js';
import { WebViewPlayerState } from '@AthenaShared/interfaces/webviewPlayerState.js';

let cash = ref<number>(0);
let bank = ref<number>(0);
let playerState = ref<WebViewPlayerState>(undefined);
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

    // Update only in-game, this is for debugging out-of-game
    if ('alt' in window) {
        playerState.value = StateManager.getPlayerState();
    }
}

function create() {
    if (!interval.value) {
        interval.value = setInterval(updateData, 100);
    }

    updateData();

    if (!('alt' in window)) {
        // Dummy Data
        playerState.value = {
            armour: 1,
            health: 159,
            inVehicle: true,
            isAiming: true,
            isDriver: true,
            isTalking: true,
            micLevel: 100,
            pos: { x: 0, y: 0, z: 0 },
            rot: { x: 0, y: 0, z: 0 },
            speed: 100,
            stamina: 25,
            weapon: 1198256469,
        };
    }
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
