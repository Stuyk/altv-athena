<template>
    <div class="wrapper stack mt-2">
        <span class="mb-2 mt-2 overline" style="width: 100%">Primary</span>
        <div class="stack mb-2 mr-2">
            <ColorSlider class="mr-2" :rgb="color1" @change="outputPrimaryColor" />
            <div class="finishes">
                <Button
                    style="width: 100%"
                    class="finish mt-4"
                    v-for="(finish, index) in getFinishes"
                    :color="finish1 === finish.value ? 'blue' : 'blue-grey'"
                    :key="index"
                    @click="setFinishType(finish.value, true)"
                >
                    {{ finish.key }}
                </Button>
            </div>
        </div>
        <span class="mb-2 mt-2 overline" style="width: 100%">Secondary</span>
        <div class="stack mb-2 mr-2">
            <ColorSlider class="mr-2" :rgb="color2" @change="outputSecondaryColor" />
            <div class="finishes">
                <Button
                    style="width: 100%"
                    class="finish mt-4"
                    v-for="(finish, index) in getFinishes"
                    :color="finish2 === finish.value ? 'blue' : 'blue-grey'"
                    :key="index"
                    @click="setFinishType(finish.value, false)"
                >
                    {{ finish.key }}
                </Button>
            </div>
        </div>
        <span class="mb-2 mt-2 overline" style="width: 100%">Pearl Finish</span>
        <span class="subtitle-2 pb-4">Click and use arrow keys for precise adjustment.</span>
        <div class="stack mr-2">
            <RangeInput
                :minIndex="0"
                :maxIndex="180"
                :indexValue="pearl"
                :increment="1"
                @input="(e) => setPearl(e)"
                style="width: 100%"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ColorSlider from '../../../components/ColorSlider.vue';
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import RangeInput from '../../../components/RangeInput.vue';
import { VEHICLE_COLOR_PAINTS } from '../../../../../src/core/shared-plugins/core-paintshop/paints';

const ComponentName = 'CustomColor';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            update: 1,
            pearl: 0,
            finish1: VEHICLE_COLOR_PAINTS.MATTE,
            finish2: VEHICLE_COLOR_PAINTS.MATTE,
        };
    },
    props: {
        color1: {
            type: Object,
        },
        color2: {
            type: Object,
        },
    },
    components: {
        Button,
        Icon,
        RangeInput,
        ColorSlider,
    },
    computed: {
        getFinishes(): Array<{ key: string; value: number }> {
            const finishes: Array<{ key: string; value: number }> = [];

            Object.keys(VEHICLE_COLOR_PAINTS).forEach((key) => {
                finishes.push({ key: key.replace('_', ' '), value: VEHICLE_COLOR_PAINTS[key] });
            });

            return finishes;
        },
    },
    methods: {
        setPearl(e: Event) {
            const result = e.target['value'];
            this.pearl = parseInt(result);

            this.$emit('update-pearl', this.pearl);
        },
        setFinishType(value: number, isPrimary = true) {
            if (isPrimary) {
                this.finish1 = value;
            } else {
                this.finish2 = value;
            }

            if (!this.finish2) {
                this.finish2 = this.finish1;
            }

            this.$emit('update-finish', this.finish1, this.finish2);
        },
        hexToRgb(hex: string) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                  }
                : null;
        },
        outputPrimaryColor(r: number, g: number, b: number) {
            if (r === undefined || g === undefined || b === undefined) {
                return;
            }

            this.$emit('set-colour', { r, g, b }, true);
        },
        outputSecondaryColor(r: number, g: number, b: number) {
            if (r === undefined || g === undefined || b === undefined) {
                return;
            }

            this.$emit('set-colour', { r, g, b }, false);
        },
    },
});
</script>

<style scoped>
.wrapper {
    overflow-y: auto;
    min-height: calc(100vh - 125px);
    max-height: calc(100vh - 125px);
}

.finishes {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    align-content: center;
}

input[type='color']::-webkit-color-swatch {
    padding: 4px;
    border: none;
    border-radius: 3px;
}

input[type='color']::-webkit-color-swatch-wrapper {
    padding: 4px;
    border: none;
    border-radius: 3px;
}

input[type='color'] {
    height: 35px;
    width: 100px;
    border-radius: 6px;
    overflow: hidden;
    background: none;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
}

input[type='color']:hover {
    cursor: pointer;
}
</style>
