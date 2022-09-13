<template>
    <div class="slot-frame" :style="getDimensions" :class="getHover">
        <div class="image" :style="getDimensions">
            <slot name="image"></slot>
        </div>
        <div class="index">
            <slot name="index"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Slot',
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
        slot: {
            type: Number,
            required: true,
        },
        location: {
            type: String as () => 'inventory' | 'equipment' | 'toolbar',
            required: true,
        },
        hasItem: {
            type: Boolean,
            required: true,
        },
    },
    methods: {},
    computed: {
        getDimensions() {
            let style = '';

            style += `min-width: ${this.width}px; max-width: ${this.width}px;`;
            style += `min-height: ${this.height}px; max-height: ${this.height}px;`;

            return style;
        },
        getHover() {
            return this.hasItem ? { 'can-hover': true } : {};
        },
    },
    mounted() {
        //
    },
    unmounted() {
        //
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
    width: 75%;
    height: 75%;
}

.can-hover:hover {
    border: 4px solid rgba(17, 229, 187, 0.708);
    box-shadow: 0px 0px 5px rgba(255, 255, 255, 2);
    cursor: pointer;
}

.can-hover:active {
    transform: scale(0.98);
}

.index {
    position: absolute;
    pointer-events: none !important;
}

.clone {
    background: rgb(0, 0, 0, 0.75);
    position: fixed !important;
    transition: unset !important;
    border: 4px solid aquamarine !important;
    pointer-events: none !important;
}
</style>
