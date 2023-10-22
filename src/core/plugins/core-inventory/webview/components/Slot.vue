<template>
    <div
        class="slot-frame"
        :style="getDimensions"
        :class="getHover"
        @mouseenter="showName = true"
        @mouseleave="showName = false"
    >
        <div class="image" :style="getDimensions">
            <slot name="image"></slot>
        </div>
        <div class="index">
            <slot name="index"></slot>
        </div>
        <div class="quantity" v-if="info.quantity !== 0">{{ info.quantity }}x</div>
        <div class="weight" v-if="info.totalWeight !== 0">{{ info.totalWeight.toFixed(2) }}{{ units }}</div>
        <div class="name" v-if="info.name !== '' && showName">
            {{ info.name }}
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { INVENTORY_CONFIG } from '../../shared/config.js';
import { SlotInfo } from '../utility/slotInfo.js';

export default defineComponent({
    name: 'Slot',
    data() {
        return {
            showName: false,
            units: INVENTORY_CONFIG.WEBVIEW.WEIGHT.UNITS,
        };
    },
    props: {
        width: {
            type: Number,
            required: false,
            default: 90,
        },
        height: {
            type: Number,
            required: false,
            default: 90,
        },
        info: {
            type: Object as () => SlotInfo,
            required: true,
        },
    },
    computed: {
        getDimensions() {
            let style = '';

            style += `min-width: ${this.width}px; max-width: ${this.width}px;`;
            style += `min-height: ${this.height}px; max-height: ${this.height}px;`;

            return style;
        },
        getHover() {
            const data = {};

            if (this.info.hasItem) {
                data['can-hover'] = true;
            }

            if (this.info.highlight) {
                data['highlight'] = true;
                data['highlight-bg'] = true;
            }

            return data;
        },
    },
});
</script>

<style>
.slot-frame {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 4px solid rgba(0, 0, 0, 0.05);
    color: rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    position: relative;
}

.image {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none !important;
    pointer-events: none !important;
}

.image img {
    width: 65%;
    height: 65%;
}

.can-hover:hover {
    border: 4px solid rgba(17, 229, 187, 0.708);
    box-shadow: 0px 0px 3px rgba(255, 255, 255, 2);
    cursor: pointer;
}

.can-hover:active {
    transform: scale(0.98);
}

.highlight {
    border: 4px solid rgba(0, 0, 0, 0.2) !important;
}

.highlight-bg {
    background: repeating-linear-gradient(
        45deg,
        rgba(60, 190, 150, 0.1),
        rgba(60, 190, 150, 0.1) 10px,
        rgba(60, 190, 150, 0.2) 10px,
        rgba(60, 190, 150, 0.2) 20px
    ) !important;
}

.index {
    position: absolute;
    pointer-events: none !important;
}

.quantity {
    position: absolute;
    pointer-events: none !important;
    z-index: 99;
    color: yellow;
    font-size: 11px;
    left: 8px;
    top: 4px;
    font-family: 'consolas';
    text-shadow: 1px 1px 1px black;
}

.name {
    position: absolute;
    pointer-events: none !important;
    z-index: 99;
    color: rgba(255, 255, 255, 0.8);
    font-size: 11px;
    font-family: 'consolas';
    text-shadow: 1px 1px 1px black, -1px 1px 1px black, 1px -1px 1px black, -1px -1px 1px black;
    text-align: center;
}

.weight {
    position: absolute;
    pointer-events: none !important;
    z-index: 99;
    color: white;
    font-size: 11px;
    font-family: 'consolas';
    text-shadow: 1px 1px 1px black;
    right: 0;
    bottom: 4px;
    padding-right: 4px;
}

.clone {
    background: rgb(0, 0, 0, 0.75);
    position: fixed !important;
    transition: unset !important;
    border: 2px solid yellow !important;
    opacity: 0.75;
    pointer-events: none !important;
}
</style>
