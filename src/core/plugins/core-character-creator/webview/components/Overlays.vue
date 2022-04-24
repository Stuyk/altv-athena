<template>
    <div class="wrapper stack">
        <template v-for="(option, i) in overlaysList" :key="i">
            <Module :name="getLocale(option.id).name" class="mb-4">
                <!-- Option -->
                <div class="subtitle-2 grey--text mb-2">{{ getLocale(option.id).description }}</div>
                <div class="split space-between">
                    <Button color="blue" @click="(e) => decValueWrap(i, option.min, option.max, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="option.min"
                        :maxIndex="option.max"
                        :indexValue="data.opacityOverlays[i].value"
                        :increment="1"
                        :values="getLocale(option.id).labels"
                        @input="(e) => setValueWrap(e, i)"
                        class="pl-3 pr-3 fill-full-width"
                    />
                    <Button color="blue" @click="(e) => incValueWrap(i, option.min, option.max, 1)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>

                <!-- Opacity -->
                <div class="subtitle-2 grey--text mb-2 mt-2">{{ locales.overlaysComponent.LABEL_OPACITY }}</div>
                <div class="split space-between">
                    <Button color="blue" @click="(e) => decValueWrap(i, 0, 1, 0.1, true)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="1"
                        :indexValue="data.opacityOverlays[i].opacity"
                        :increment="0.1"
                        @input="(e) => setValueWrap(e, i, true)"
                        class="pl-3 pr-3 fill-full-width"
                    />
                    <Button color="blue" @click="(e) => incValueWrap(i, 0, 1, 0.1, true)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
            </Module>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import OverlaysList from '../utility/overlaysList';

const ComponentName = 'Overlays';
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
            overlaysList: [...OverlaysList],
        };
    },
    methods: {
        getLocale(id: string | number) {
            return this.locales.overlaysComponent.ids[id]
                ? this.locales.overlaysComponent.ids[id]
                : `COULD NOT FIND LOCALE FOR overlaysComponent.${id}`;
        },
        getOverlayColorCount() {
            return this.locales.color.overlays.length - 1;
        },
        setValueWrap(e: Event, index: number, isOpacity = false) {
            const currentValues = [...this.data.opacityOverlays];
            const valueToChange = isOpacity ? 'opacity' : 'value';
            const value = parseFloat(e.target['value']);

            currentValues[index][valueToChange] = value;

            this.$emit('set-parameter', 'opacityOverlays', currentValues);
        },
        decValueWrap(index: number, min: number, max: number, incrementValue: number, isOpacity = false) {
            const currentValues = [...this.data.opacityOverlays];
            const valueToChange = isOpacity ? 'opacity' : 'value';

            currentValues[index][valueToChange] -= incrementValue;

            if (currentValues[index][valueToChange] < min) {
                currentValues[index][valueToChange] = max;
            }

            this.$emit('set-parameter', 'opacityOverlays', currentValues);
        },
        incValueWrap(index: number, min: number, max: number, incrementValue: number, isOpacity = false) {
            const currentValues = [...this.data.opacityOverlays];
            const valueToChange = isOpacity ? 'opacity' : 'value';

            currentValues[index][valueToChange] += incrementValue;

            if (currentValues[index][valueToChange] > max) {
                currentValues[index][valueToChange] = min;
            }

            this.$emit('set-parameter', 'opacityOverlays', currentValues);
        },
    },
});
</script>
