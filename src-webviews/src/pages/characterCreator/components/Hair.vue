<template>
    <div class="wrapper stack">
        <!-- Hair Style -->
        <Module :name="getLocale('LABEL_HAIRSTYLE')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_HAIRSTYLE') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'hair', 0, getHairCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    uid="hair"
                    :minIndex="0"
                    :maxIndex="getHairCount()"
                    v-model="data.hair"
                    :increment="1"
                    :values="data.sex === 0 ? locales.hairComponent.feminine : locales.hairComponent.masculine"
                    style="width: 100%"
                    class="pl-3 pr-3"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'hair', 0, getHairCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>

        <!-- Hair Colour -->
        <Module :name="getLocale('LABEL_HAIRSTYLE_COLOUR')" class="mb-4">
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_HAIRSTYLE_COLOUR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'hair', 0, getHairCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    uid="hair"
                    :minIndex="0"
                    :maxIndex="getHairCount()"
                    v-model="data.hair"
                    :increment="1"
                    :values="locales.color.hair"
                    style="width: 100%"
                    class="pl-3 pr-3"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'hair', 0, getHairCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>

        <!-- <button @click="toggleModule('hairstyle')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.hairstyle ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_HAIRSTYLE') }}
                    </div>
                </button>
                <template v-if="modules.hairstyle">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_HAIRSTYLE') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_HAIRSTYLE') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('hair', 0, getHairCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ data.sex === 0 ? locales.hairComponent.feminine[data.hair] : locales.hairComponent.masculine[data.hair] }}
                            </span>
                            <button @click="incrementParameter('hair', 0, getHairCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.hair }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getHairCount()" step="1" v-model.number="data.hair" @input="e => handleChange(e, 'hair')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_HAIRSTYLE_COLOUR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('hairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.hairColor1] }}
                            </span>
                            <button @click="incrementParameter('hairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.hairColor1 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.hairColor1" @input="e => handleChange(e, 'hairColor1')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_HAIRSTYLE_HIGHLIGHTS') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('hairColor2', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.hairColor2] }}
                            </span>
                            <button @click="incrementParameter('hairColor2', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.hairColor2 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.hairColor2" @input="e => handleChange(e, 'hairColor2')"/>
                        </div>
                    </div>
                </template>
    
                <button @click="toggleModule('eyebrows')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.eyebrows ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_EYEBROWS') }}
                    </div>
                </button>
                <template v-if="modules.eyebrows">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_EYEBROWS') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_EYEBROWS') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.hairComponent.eyebrows[data.eyebrows] }}
                            </span>
                            <button @click="incrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.eyebrows }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getEyebrowsCount()" step="1" v-model.number="data.eyebrows" @input="e => handleChange(e, 'eyebrows')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_EYEBROWS_COLOUR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('eyebrowsColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.eyebrowsColor1] }}
                            </span>
                            <button @click="incrementParameter('eyebrowsColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.eyebrowsColor1 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.eyebrowsColor1" @input="e => handleChange(e, 'eyebrowsColor1')"/>
                        </div>
                    </div>
                </template>


                <button @click="toggleModule('facial')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.facial ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_FACIAL_HAIR') }}
                    </div>
                </button>
                <template v-if="modules.facial">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_FACIAL_HAIR') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_OPACITY') }}</div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.facialHairOpacity }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.facialHairOpacity" @input="e => handleChange(e, 'facialHairOpacity')" />
                        </div>
                    
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_FACIAL_HAIR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('facialHair', 0, getFacialCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.hairComponent.facial[data.facialHair] }}
                            </span>
                            <button @click="incrementParameter('facialHair', 0, getFacialCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.facialHair }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getFacialCount()" step="1" v-model.number="data.facialHair" @input="e => handleChange(e, 'facialHair')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_FACIAL_HAIR_COLOUR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('facialHairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.facialHairColor1] }}
                            </span>
                            <button @click="incrementParameter('facialHairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.facialHairColor1 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.facialHairColor1" @input="e => handleChange(e, 'facialHairColor1')"/>
                        </div>
                    </div>
                </template> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import Module from '../../../components/Module.vue';
import RangeInput from '../../../components/RangeInput.vue';

const ComponentName = 'Hair';
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
        locales: Object
    },

    methods: {
        getHairCount() {
            if (this.data.sex === 0) {
                return this.locales.hairComponent.feminine.length - 2;
            }

            return this.locales.hairComponent.masculine.length - 2;
        },
        getColourCount() {
            return this.locales.color.hair.length - 1;
        },
        getFacialCount() {
            return this.locales.hairComponent.facial.length - 1;
        },
        getEyebrowsCount() {
            return this.locales.hairComponent.eyebrows.length - 1;
        },
        getLocale(name) {
            return this.locales.hairComponent[name]
                ? this.locales.hairComponent[name]
                : `COULD NOT FIND LOCALE FOR hairComponent.${name}`;
        }
    }
});
</script>
