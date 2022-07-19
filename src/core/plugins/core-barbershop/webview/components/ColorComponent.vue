<template>
    <div class="hair-colors">
        <div
            v-for="(hex, index) in colors"
            :key="index"
            class="hair-color"
            :class="currentIndex === index ? 'selected' : 'unselected'"
            :style="getBackgroundColor(hex)"
            @click="selectColor(index)"
        />
    </div>
</template>

<script lang="ts">
import { makeupColors } from '../../../../shared/information/makeupColors';
import { hairColors } from '../../../../shared/information/hairColors';
import { defineComponent, nextTick } from 'vue';

const ComponentName = 'ColorComponent';
export default defineComponent({
    name: ComponentName,
    props: {
        currentIndex: {
            type: Number,
            default: 0,
        },
        colorType: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            colors: [],
        };
    },
    methods: {
        getBackgroundColor(hex: string) {
            return `background: ${hex} !important; display: block;`;
        },
        selectColor(index: number) {
            this.$emit('select-color', index);
        },
    },
    async mounted() {
        await nextTick();
        this.colors = this.colorType === 0 ? hairColors : makeupColors;
    },
});
</script>

<style>
.hair-colors {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 232px;
    height: auto;
}

.hair-color {
    display: flex;
    min-width: 25px;
    min-height: 25px;
    border: 2px solid black;
    border-radius: 3px;
    box-sizing: border-box;
    margin: 2px;
    justify-content: center;
    align-items: center;
    transform: scale(0.85);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
}

.hair-color:hover {
    border: 2px solid rgba(255, 255, 255, 0.8);
    transform: scale(1);
    animation: spin 3s linear infinite;
    box-shadow: 0px 0px 5px black;
}

.selected {
    border: 2px solid rgba(255, 255, 255, 0.75) !important;
    box-shadow: 0px 0px 5px black;
    transform: scale(1.05);
}

@keyframes spin {
    0% {
        transform: rotate(360deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
</style>
