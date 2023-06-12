<script lang="ts" setup>
import Icon from '@ViewComponents/Icon.vue';
import { getImagePath } from '../utility/inventoryIcon';
import { Item } from '@AthenaShared/interfaces/item';
import { computed, ref } from 'vue';
import DraggableElement from './DraggableElement.vue';
import { InterfaceState, InventoryState, TargetLocation } from '../interfaces/state';

const props = defineProps<{
    items: Item[];
    max: number;
    isDragging: boolean;
    location: TargetLocation;
    showIndex?: true;
    ignoreSlot?: true;
}>();

const emits = defineEmits<{
    (e: 'showInterface', key: keyof InterfaceState, value: boolean): void;
    <T extends keyof InventoryState>(e: 'setState', key: T, value: InventoryState[T]): void;
}>();

const items = computed(() => {
    const itemGrid: Item[] = props.ignoreSlot ? new Array(12) : new Array(props.max);
    for (let i = 0; i < props.items.length; i++) {
        const item = props.items[i];
        if (i > itemGrid.length) {
            itemGrid.push(item);
            continue;
        }

        if (props.ignoreSlot) {
            itemGrid[i] = item;
            continue;
        }

        itemGrid[item.slot] = item;
    }

    return itemGrid;
});

function handleStart(id: string) {
    emits('setState', 'dragging', true);
    console.log(id);
}

function handleStop(id: string) {
    emits('setState', 'dragging', false);
    console.log(id);
}

function showContext(pos: { x: number; y: number }, item: Item) {
    emits('setState', 'target', props.location);
    emits('setState', 'x', pos.x);
    emits('setState', 'y', pos.y);
    emits('setState', 'item', item);
    emits('showInterface', 'context', true);
}

function showInspector(e: MouseEvent, item: Item) {
    emits('setState', 'x', e.x);
    emits('setState', 'y', e.y);
    emits('setState', 'item', item);
    emits('showInterface', 'inspector', true);
}

function showTooltip(e: MouseEvent, item: Item) {
    const element = e.target as HTMLElement;
    if (!element) {
        return;
    }

    const { x, y } = element.getBoundingClientRect();
    emits('setState', 'x', x);
    emits('setState', 'y', y);
    emits('setState', 'item', item);
    emits('showInterface', 'tooltip', true);
}

function hideTooltip() {
    emits('showInterface', 'tooltip', false);
}
</script>

<template>
    <div class="item-grid">
        <template v-for="(item, index) in items">
            <DraggableElement
                class="item item-hover"
                v-if="item"
                :id="String(index)"
                @start="handleStart"
                @stop="handleStop"
                @context="(pos) => showContext(pos, item)"
            >
                <div class="item-equipped" v-if="item.isEquipped" />
                <div class="item-quantity">
                    {{ item.quantity >= 2 ? `${item.quantity}x` : '' }}
                </div>
                <div class="item-weight">{{ ((item.weight ? item.weight : 0) * item.quantity).toFixed(1) }}</div>
                <div class="item-icon">
                    <img :src="getImagePath(item)" />
                </div>
                <div
                    class="item-inspect"
                    @mouseenter="(e) => showTooltip(e, item)"
                    @mouseleave="hideTooltip"
                    @mousedown="(e) => showInspector(e, item)"
                    v-if="!props.isDragging"
                >
                    <Icon icon="icon-search" :size="10" />
                </div>
            </DraggableElement>
            <div class="item" :id="String(index)" :class="props.isDragging ? ['item-hover'] : []" v-else>
                <div class="item-index" v-if="props.showIndex">
                    {{ index + 1 }}
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.item-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 12px;
}

.item {
    position: relative;
    background: var(--inventory-bg-light);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    max-width: 90px;
    min-width: 90px;
    min-height: 90px;
    max-height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-items: center;
}

.item-hover:hover {
    border-color: var(--inventory-brand);
    box-shadow: 0px 0px 5px var(--inventory-brand);
    text-shadow: 0px 0px 5px var(--inventory-brand);
    background: var(--inventory-bg-lighter);
    cursor: grab;
}

.item-equipped {
    position: absolute;
    background-image: linear-gradient(
        45deg,
        transparent 25%,
        rgba(63, 153, 189, 0.2) 25%,
        rgba(63, 153, 189, 0.2) 50%,
        transparent 50%,
        transparent 75%,
        rgba(63, 153, 189, 0.2) 75%,
        rgba(63, 153, 189, 0.2) 100%
    );
    background-size: 5px 5px;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.item-inspect {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
    border-bottom-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 5px;
    z-index: 20;
}

.item-inspect:hover {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.2);
}

.item-quantity {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    color: rgba(255, 255, 255, 0.6);
    font-family: 'consolas';
    font-size: 10px;
    padding: 5px;
    pointer-events: none;
}

.item-weight {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.6);
    font-family: 'consolas';
    font-size: 10px;
    padding: 5px;
    pointer-events: none;
}

.item-index {
    position: absolute;
    color: rgba(255, 255, 255, 0.2);
    font-size: 12px;
    font-family: 'consolas';
    font-weight: 0;
    pointer-events: none;
}

.item-icon {
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    align-content: center;
    justify-items: center;
    pointer-events: none;
    position: absolute;
    top: 0;
}

.item-icon img {
    padding: 24px;
    box-sizing: border-box;
    user-select: none;
    width: 100%;
    pointer-events: none;
}
</style>
