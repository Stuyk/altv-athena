<template>
    <div class="wrapper stack">
        <!-- Physical Frame -->
        <Module :name="getLocale('LABEL_FRAME')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_FRAME') }}</div>
            <div class="split space-between">
                <Button
                    class="mr-2 fill-full-width"
                    :color="data.sex === 0 ? 'amber' : 'grey'"
                    @click="$emit('set-parameter', 'sex', 0)"
                >
                    {{ getLocale('LABEL_FEMININE') }}
                </Button>
                <Button
                    class="ml-2 fill-full-width"
                    :color="data.sex === 1 ? 'amber' : 'grey'"
                    @click="$emit('set-parameter', 'sex', 1)"
                >
                    {{ getLocale('LABEL_MASCULINE') }}
                </Button>
            </div>
        </Module>

        <!-- Presets -->
        <Module :name="getLocale('LABEL_PRESETS')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_PRESETS') }}</div>
            <div class="split space-between">
                <Button
                    v-for="i in 6"
                    :key="i"
                    @click="updatePreset(i)"
                    :color="i === preset ? 'amber' : 'grey'"
                    outlined
                    text
                    small
                >
                    {{ i }}
                </Button>
            </div>
        </Module>

        <!-- Father -->
        <Module :name="getLocale('LABEL_FATHER')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_FATHER') }}</div>
            <div class="stack space-between">
                <div class="overline grey--text text--darken-1 mb-4 fill-full-width align-left">
                    {{ getLocale('LABEL_FACE') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'faceFather', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        :indexValue="data.faceFather"
                        :increment="1"
                        :values="locales.faces"
                        @input="(e) => setValueWrap(e, 'faceFather')"
                        class="fill-full-width"
                    />
                    <Button color="blue" @click="$emit('inc-parameter', 'faceFather', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
                <div class="overline grey--text text--darken-1 mb-4 mt-4 fill-full-width align-left">
                    {{ getLocale('LABEL_SKIN') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'skinFather', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        :indexValue="data.skinFather"
                        :increment="1"
                        :values="locales.faces"
                        @input="(e) => setValueWrap(e, 'skinFather')"
                        class="fill-full-width"
                    />
                    <Button color="blue" @click="$emit('inc-parameter', 'skinFather', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
            </div>
        </Module>

        <!-- Mother -->
        <Module :name="getLocale('LABEL_MOTHER')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_MOTHER') }}</div>
            <div class="stack space-between">
                <div class="overline grey--text text--darken-1 mb-4 fill-full-width align-left">
                    {{ getLocale('LABEL_FACE') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'faceMother', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        :indexValue="data.faceMother"
                        :increment="1"
                        :values="locales.faces"
                        @input="(e) => setValueWrap(e, 'faceMother')"
                        class="fill-full-width"
                    />
                    <Button color="blue" @click="$emit('inc-parameter', 'faceMother', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
                <div class="overline grey--text text--darken-1 mb-4 mt-4 fill-full-width align-left">
                    {{ getLocale('LABEL_SKIN') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'skinMother', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        :indexValue="data.skinMother"
                        :increment="1"
                        :values="locales.faces"
                        @input="(e) => setValueWrap(e, 'skinMother')"
                        class="fill-full-width"
                    />
                    <Button color="blue" @click="$emit('inc-parameter', 'skinMother', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
            </div>
        </Module>

        <!-- Face Blend -->
        <Module :name="getLocale('LABEL_FACEBLEND')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_FACEBLEND') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'faceMix', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="1"
                    :indexValue="data.faceMix"
                    :increment="0.1"
                    @input="(e) => setValueWrap(e, 'faceMix')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'faceMix', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>

        <!-- Skin Blend -->
        <Module :name="getLocale('LABEL_SKINBLEND')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_SKINBLEND') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'skinMix', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="1"
                    :indexValue="data.skinMix"
                    :increment="0.1"
                    @input="(e) => setValueWrap(e, 'skinMix')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'skinMix', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>

        <!-- Eye Colour -->
        <Module :name="getLocale('LABEL_EYECOLOUR')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_EYECOLOUR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'eyes', 0, locales.color.eyes.length - 1, 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="locales.color.eyes.length - 1"
                    :indexValue="data.eyes"
                    :values="locales.color.eyes"
                    :increment="1"
                    @input="(e) => setValueWrap(e, 'eyes')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'eyes', 0, locales.color.eyes.length - 1, 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Appearance';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
    },
    props: {
        data: {
            type: Object,
        },
        locales: {
            type: Object,
        },
    },
    data() {
        return {
            preset: 1,
        };
    },
    methods: {
        setValueWrap(e: Event, parameterName: string) {
            this.$emit('set-parameter', parameterName, parseFloat(e.target['value']));
        },
        updatePreset(value: number) {
            this.preset = value;
            this.$emit('set-parameter', 'preset', value);
        },
        getLocale(name: string | number) {
            return this.locales.appearanceComponent[name]
                ? this.locales.appearanceComponent[name]
                : `COULD NOT FIND LOCALE FOR appearanceComponent.${name}`;
        },
    },
});
</script>

<style scoped>
.align-left {
    text-align: left;
}
</style>
