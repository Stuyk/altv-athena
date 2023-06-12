<script lang="ts" setup>
import { Item } from '@AthenaShared/interfaces/item';
import { computed, defineAsyncComponent } from 'vue';
import { getImagePath } from '../utility/inventoryIcon';

const props = defineProps<{ item: Item; x: number; y: number }>();
const Icon = defineAsyncComponent(() => import('@ViewComponents/Icon.vue'));

const getPosStyle = computed(() => {
    return `left: ${props.x}px; top: ${props.y}px;`;
});
</script>

<template>
    <div class="tooltip" :style="getPosStyle">
        <div class="split-stack">
            <div class="prop-stack">
                <div class="split">
                    <Icon icon="icon-tags" class="mr-2" :size="12"></Icon>
                    <div class="text">
                        {{ props.item.name }}
                    </div>
                </div>
                <div class="split">
                    <Icon icon="icon-database" class="mr-2" :size="12"></Icon>
                    <div class="text">{{ props.item.dbName }}</div>
                </div>
                <div class="split">
                    <Icon icon="icon-stack" class="mr-2" :size="12"></Icon>
                    <div class="text">{{ props.item.quantity }}</div>
                </div>
                <div class="split">
                    <Icon icon="icon-anvil" class="mr-2" :size="12"></Icon>
                    <div class="text">{{ props.item.weight ? props.item.weight * props.item.quantity : 0 }}</div>
                </div>
            </div>
            <div class="item-icon">
                <img :src="getImagePath(item)" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.tooltip {
    display: fixed;
    position: fixed;
    flex-direction: column;
    background: var(--inventory-bg);
    border: 1px solid var(--inventory-bg-lighter);
    border-right: 0px;
    display: flex;
    color: rgba(255, 255, 255, 0.6);
    font-family: 'consolas';
    z-index: 30;
    border-radius: 6px;
    flex-wrap: wrap;
    gap: 6px;
    min-width: 194px;
    max-width: 194px;
    min-height: 92px;
    transform: translateX(-172px) translateY(-1px);
    pointer-events: none;
    border-color: var(--inventory-brand);
    box-shadow: 0px 0px 5px var(--inventory-brand);
    box-sizing: border-box;
    overflow: hidden;
}

.prop-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
}

.split-stack {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.tooltip .text {
    text-transform: uppercase;
    font-variant: small-caps;
    font-size: 10px;
}

.item-icon {
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    box-sizing: border-box;
    min-height: 90px;
    max-height: 90px;
    min-width: 90px;
    max-width: 90px;
}

.item-icon img {
    box-sizing: border-box;
    user-select: none;
    pointer-events: none;
    min-width: 42px;
    max-width: 42px;
}
</style>
