<template>
    <div class="wrapper stack">
        <template v-for="(option, i) in overlaysList" :key="i">
            <Module :name="getLocale(option.id).name" class="mb-4">
                <!-- Option -->
                <div class="subtitle-2 grey--text mb-2">{{ getLocale(option.id).description }}</div>
                <div class="split space-between">
                    <Button color="blue" @click="(e) => decValueWrap(i, option.min, option.max, 1, 'value')">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="option.min"
                        :maxIndex="option.max"
                        :indexValue="data.colorOverlays[i].value"
                        :increment="1"
                        :values="getLocale(option.id).labels"
                        @input="(e) => setValueWrap(e, i, 'value')"
                        class="pl-3 pr-3 fill-full-width"
                    />
                    <Button color="blue" @click="(e) => incValueWrap(i, option.min, option.max, 1, 'value')">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>

                <!-- Opacity -->
                <div class="subtitle-2 grey--text mb-2 mt-2">{{ locales.makeupComponent.LABEL_OPACITY }}</div>
                <div class="split space-between">
                    <Button color="blue" @click="(e) => decValueWrap(i, 0, 1, 0.1, 'opacity')">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="1"
                        :indexValue="data.colorOverlays[i].opacity"
                        :increment="0.1"
                        @input="(e) => setValueWrap(e, i, 'opacity')"
                        class="pl-3 pr-3 fill-full-width"
                    />
                    <Button color="blue" @click="(e) => incValueWrap(i, 0, 1, 0.1, 'opacity')">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>

                <!-- Color Options 1 -->
                <div class="subtitle-2 grey--text mb-2 mt-2">{{ locales.makeupComponent.LABEL_COLOUR1 }}</div>
                <div class="split space-between">
                    <Button color="blue" @click="(e) => decValueWrap(i, 0, getOverlayColorCount(), 1, 'color1')">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="getOverlayColorCount()"
                        :indexValue="data.colorOverlays[i].color1 ? data.colorOverlays[i].color1 : 0"
                        :increment="1"
                        :values="locales.color.overlays"
                        @input="(e) => setValueWrap(e, i, 'color1')"
                        class="pl-3 pr-3 fill-full-width"
                    />
                    <Button color="blue" @click="(e) => incValueWrap(i, 0, getOverlayColorCount(), 1, 'color1')">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>

                <!-- Color Options 2 -->
                <template v-if="option.hasOwnProperty('color2')">
                    <div class="subtitle-2 grey--text mb-2 mt-2">{{ locales.makeupComponent.LABEL_COLOUR2 }}</div>
                    <div class="split space-between">
                        <Button color="blue" @click="(e) => decValueWrap(i, 0, getOverlayColorCount(), 1, 'color2')">
                            <Icon :size="14" icon="icon-chevron-left"></Icon>
                        </Button>
                        <RangeInput
                            :minIndex="0"
                            :maxIndex="getOverlayColorCount()"
                            :indexValue="data.colorOverlays[i].color2 ? data.colorOverlays[i].color2 : 0"
                            :increment="1"
                            :values="locales.color.overlays"
                            @input="(e) => setValueWrap(e, i, 'color2')"
                            class="pl-3 pr-3 fill-full-width"
                        />
                        <Button color="blue" @click="(e) => incValueWrap(i, 0, getOverlayColorCount(), 1, 'color2')">
                            <Icon :size="14" icon="icon-chevron-right"></Icon>
                        </Button>
                    </div>
                </template>
            </Module>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import MakeupList from '../utility/makeupList';

const ComponentName = 'Makeup';
export default defineComponent({
    name: ComponentName,
    props: {
        data: Object,
        locales: Object,
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
    },
    data() {
        return {
            overlaysList: [...MakeupList],
        };
    },
    methods: {
        getLocale(id: string | number) {
            return this.locales.makeupComponent.ids[id]
                ? this.locales.makeupComponent.ids[id]
                : `COULD NOT FIND LOCALE FOR makeupComponent.${id}`;
        },
        getOverlayColorCount() {
            return this.locales.color.overlays.length - 1;
        },
        setValueWrap(e: Event, index: number, valueName = 'value') {
            const currentValues = [...this.data.colorOverlays];
            const value = parseFloat(e.target['value']);

            currentValues[index][valueName] = value;
            this.$emit('set-parameter', 'colorOverlays', currentValues);
        },
        decValueWrap(index: number, min: number, max: number, incrementValue: number, valueName = 'value') {
            const currentValues = [...this.data.colorOverlays];
            currentValues[index][valueName] -= incrementValue;

            if (currentValues[index][valueName] < min) {
                currentValues[index][valueName] = max;
            }

            this.$emit('set-parameter', 'colorOverlays', currentValues);
        },
        incValueWrap(index: number, min: number, max: number, incrementValue: number, valueName = 'value') {
            const currentValues = [...this.data.colorOverlays];
            currentValues[index][valueName] += incrementValue;

            if (currentValues[index][valueName] > max) {
                currentValues[index][valueName] = min;
            }

            this.$emit('set-parameter', 'colorOverlays', currentValues);
        },
    },
});
</script>
