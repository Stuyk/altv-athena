<template>
    <div class="wrapper stack" v-if="forceUpdate">
        <!-- Physical Frame -->
        <Module :name="getLocale('LABEL_FRAME')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_FRAME') }}</div>
            <div class="split space-between">
                <Button
                    class="mr-2"
                    :color="data.sex === 0 ? 'amber' : 'grey'"
                    @click="$emit('set-parameter', 'sex', 0)"
                    style="width: 100%"
                >
                    {{ getLocale('LABEL_FEMININE') }}
                </Button>
                <Button
                    class="ml-2"
                    :color="data.sex === 1 ? 'amber' : 'grey'"
                    @click="$emit('set-parameter', 'sex', 1)"
                    style="width: 100%"
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
                <div class="overline grey--text text--darken-1 mb-4" style="text-align: left; width: 100%">
                    {{ getLocale('LABEL_FACE') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'faceFather', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        uid="faceFather"
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        v-model="data.faceFather"
                        :increment="1"
                        :values="locales.faces"
                        style="width: 100%"
                    />
                    <Button color="blue" @click="$emit('inc-parameter', 'faceFather', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
                <div class="overline grey--text text--darken-1 mb-4 mt-4" style="text-align: left; width: 100%">
                    {{ getLocale('LABEL_SKIN') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'skinFather', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        uid="skinFather"
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        v-model="data.skinFather"
                        :increment="1"
                        :values="locales.faces"
                        style="width: 100%"
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
                <div class="overline grey--text text--darken-1 mb-4" style="text-align: left; width: 100%">
                    {{ getLocale('LABEL_FACE') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'faceMother', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        uid="faceMother"
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        v-model="data.faceMother"
                        :increment="1"
                        :values="locales.faces"
                        style="width: 100%"
                    />
                    <Button color="blue" @click="$emit('inc-parameter', 'faceMother', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-right"></Icon>
                    </Button>
                </div>
                <div class="overline grey--text text--darken-1 mb-4 mt-4" style="text-align: left; width: 100%">
                    {{ getLocale('LABEL_SKIN') }}
                </div>
                <div class="split split-full center">
                    <Button color="blue" @click="$emit('dec-parameter', 'skinMother', 0, 45, 1)">
                        <Icon :size="14" icon="icon-chevron-left"></Icon>
                    </Button>
                    <RangeInput
                        uid="skinMother"
                        :minIndex="0"
                        :maxIndex="locales.faces.length - 1"
                        v-model="data.skinMother"
                        :increment="1"
                        :values="locales.faces"
                        style="width: 100%"
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
                    uid="faceMix"
                    :minIndex="0"
                    :maxIndex="1"
                    v-model="data.faceMix"
                    :increment="0.1"
                    style="width: 100%"
                    class="pl-3 pr-3"
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
                    uid="skinMix"
                    :minIndex="0"
                    :maxIndex="1"
                    v-model="data.skinMix"
                    :increment="0.1"
                    style="width: 100%"
                    class="pl-3 pr-3"
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
                    uid="skinMix"
                    :minIndex="0"
                    :maxIndex="locales.color.eyes.length - 1"
                    v-model="data.eyes"
                    :values="locales.color.eyes"
                    :increment="1"
                    style="width: 100%"
                    class="pl-3 pr-3"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'eyes', 0, locales.color.eyes.length - 1, 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>
    </div>
</template>

<script lang="ts">
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import Module from '../../../components/Module.vue';
import RangeInput from '../../../components/RangeInput.vue';

import { defineComponent } from 'vue';
import { MalePresets, FemalePresets } from '../utility/presets';

const ComponentName = 'Appearance';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon,
        Module,
        RangeInput
    },
    props: {
        data: Object,
        locales: Object,
        update: Function,
        'decrement-parameter': {
            type: Function
        },
        'increment-parameter': {
            type: Function
        },
        'set-parameter': {
            type: Function
        }
    },
    data() {
        return {
            modules: {
                frame: false,
                presets: false,
                father: false,
                mother: false,
                skinBlend: false,
                faceBlend: false,
                eyeColour: false
            },
            forceUpdate: 1,
            preset: 1
        };
    },
    methods: {
        updatePreset(value: number) {
            this.preset = value;
            this.$emit('set-parameter', 'preset', value);
        },
        toggleModule(e) {
            console.log();

            // console.log(moduleName);
            // this.modules[moduleName] = !this.modules[moduleName];
        },
        isActive(parameter, value) {
            if (this.data[parameter] === value) {
                return { active: true };
            }

            return { active: false };
        },
        isHighlighted(arg1, arg2) {
            return arg1 === arg2 ? { 'blue--text': true, active: true } : { 'grey--text': true };
        },
        getLocale(name) {
            return this.locales.appearanceComponent[name]
                ? this.locales.appearanceComponent[name]
                : `COULD NOT FIND LOCALE FOR appearanceComponent.${name}`;
        }
    }
});
</script>
