<template>
    <div class="wrapper stack mt-2">
        <div class="stack mb-2 mr-2 mt-2">
            <Module :name="locale.PRIMARY_COLOUR">
                <ColorSlider class="mr-2" :rgb="data.color" @change="outputPrimaryColor" />
            </Module>
            <br />
            <Module :name="locale.SECONDARY_COLOUR">
                <ColorSlider class="mr-2" :rgb="data.color2" @change="outputSecondaryColor" />
            </Module>
            <br />
            <Module :name="locale.PRIMARY_FINISH">
                <div class="finishes">
                    <Button
                        class="finish fill-full-width"
                        v-for="(finish, index) in getFinishes"
                        :color="finish1 === finish.value ? 'green' : 'blue-grey'"
                        :key="index"
                        @click="setFinishType(finish.value, true)"
                    >
                        {{ locale[finish.key.toUpperCase()] }}
                    </Button>
                </div>
            </Module>
            <br />
            <Module :name="locale.SECONDARY_FINISH">
                <div class="finishes">
                    <Button
                        class="finish fill-full-width"
                        v-for="(finish, index) in getFinishes"
                        :color="finish2 === finish.value ? 'green' : 'blue-grey'"
                        :key="index"
                        @click="setFinishType(finish.value, false)"
                    >
                        {{ locale[finish.key.toUpperCase()] }}
                    </Button>
                </div>
            </Module>
            <br />
            <Module :name="locale.PEARL_FINISH">
                <span class="subtitle-2 pb-4">{{ locale.PEARL_DESC }}</span>
                <div class="stack pt-6">
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="180"
                        :indexValue="pearl"
                        :increment="1"
                        @input="(e) => setPearl(e)"
                        class="fill-full-width"
                    />
                </div>
            </Module>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { VEHICLE_COLOR_PAINTS } from '../../shared/paints';
import { iPaintshopSync } from '../../shared/interfaces';

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
        data: {
            type: Object,
        },
        locale: {
            type: Object,
            required: true,
        },
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
        ColorSlider: defineAsyncComponent(() => import('@components/ColorSlider.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
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
    watch: {
        data(syncData: iPaintshopSync) {
            this.finish1 = syncData.finish1;
            this.finish2 = syncData.finish2;
            this.pearl = syncData.pearl;

            this.$nextTick(() => {
                this.$emit('set-colour', syncData.color, true);
                this.$emit('set-colour', syncData.color2, false);
                this.$emit('update-finish', this.finish1, this.finish2);
                this.$emit('update-pearl', this.pearl);
            });
        },
    },
});
</script>

<style scoped>
.wrapper {
    overflow-y: scroll;
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
