<script lang="ts" setup>
import { Item } from '@AthenaShared/interfaces/item';
import { computed } from 'vue';
import { TargetLocation } from '../interfaces/state';

const props = defineProps<{ item: Item; x: number; y: number; target: TargetLocation }>();
const emits = defineEmits<{ (e: 'close'): void }>();

const getPosStyle = computed(() => {
    return `left: ${props.x - 25}px; top: ${props.y - 25}px;`;
});

const extendForPlayer = computed(() => {
    return props.target === 'inventory' || props.target === 'toolbar';
});
</script>

<template>
    <div class="context-menu" :style="getPosStyle" @mouseleave="emits('close')">
        <template v-if="extendForPlayer">
            <span>Use</span>
            <span>Drop</span>
            <span>Give</span>
        </template>
        <span v-if="props.item.quantity >= 2">Split</span>
    </div>
</template>

<style scoped>
.context-menu {
    position: fixed;
    display: flex;
    flex-direction: column;
    background: var(--inventory-bg-light);
    border: 1px solid var(--inventory-bg-lighter);
    z-index: 30;
    padding: 6px;
    min-width: 150px;
    max-width: 150px;
    gap: 6px;
    border-radius: 6px;
    box-sizing: border-box;
    box-shadow: 0px 2px 5px black;
}

.context-menu span {
    padding: 6px;
    border-radius: 3px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

.context-menu span:hover {
    background: var(--inventory-bg-lighter);
    cursor: pointer;
    color: rgba(255, 255, 255, 1);
}
</style>
