<template>
    <div class="wrapper stack mt-2 mr-2">
        <span class="mb-2 overline" style="width: 100%">Primary</span>
        <div class="palette mb-2">
            <div v-for="(color, index) in getColors" :key="index">
                <div class="selectable-box" @click="setColor(color.id, true)" :style="getStyle(color.hex)"></div>
            </div>
        </div>
        <span class="mb-2 overline" style="width: 100%">Secondary</span>
        <div class="palette">
            <div v-for="(color, index) in getColors" :key="index">
                <div class="selectable-box" @click="setColor(color.id, false)" :style="getStyle(color.hex)"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VehicleColorPresets } from '../../../../../src/core/shared-plugins/core-paintshop/colors';
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';

const ComponentName = 'Presets';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            primary: 1,
            secondary: 1,
        };
    },
    components: {
        Button,
        Icon,
    },
    computed: {
        getColors(): Array<{ name: string; id: number; hex: string }> {
            const colorList: Array<{ name: string; id: number; hex: string }> = [];

            Object.keys(VehicleColorPresets).forEach((id) => {
                colorList.push({ id: parseInt(id), ...VehicleColorPresets[id] });
            });

            return colorList;
        },
    },
    methods: {
        getStyle(hex: string) {
            return {
                'background-color': hex,
            };
        },
        setColor(value: number, isPrimary = true) {
            this.$emit('set-colour', value, isPrimary);
        },
    },
});
</script>

<style scoped>
.wrapper {
    min-height: calc(100vh - 125px);
    max-height: calc(100vh - 125px);
}

.palette {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
    border: 2px solid rgba(64, 64, 64, 1);
    padding: 12px;
    background: rgba(24, 24, 24, 1);
    align-self: stretch;
}

.selectable-box {
    min-width: 23px;
    max-width: 23px;
    min-height: 23px;
    max-height: 23px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    margin: 1px;
    border-radius: 4px;
}

.selectable-box:hover {
    cursor: pointer;
    border: 3px solid rgba(255, 255, 255, 0.75);
    box-sizing: border-box;
}
</style>
