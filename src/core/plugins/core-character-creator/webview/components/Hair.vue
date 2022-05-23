<template>
    <div class="wrapper stack">
        <Module :name="getLocale('LABEL_HAIRSTYLE')" class="mb-4">
            <!-- Hair Style -->
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_HAIRSTYLE') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="decValueWrap('hair', 0, getHairCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getHairCount()"
                    :indexValue="data.hair"
                    :increment="1"
                    :values="data.sex === 0 ? locales.hairComponent.feminine : locales.hairComponent.masculine"
                    @input="(e) => setValueWrap(e, 'hair')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="incValueWrap('hair', 0, getHairCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
            <!-- Hair Colours -->
            <div class="subtitle-2 grey--text mb-2 mt-4">{{ getLocale('LABEL_HAIRSTYLE_COLOUR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'hairColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getColourCount()"
                    :indexValue="data.hairColor1"
                    :increment="1"
                    :values="locales.color.hair"
                    @input="(e) => setValueWrap(e, 'hairColor1')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'hairColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
            <!-- Highlights -->
            <div class="subtitle-2 grey--text mb-2 mt-4">{{ getLocale('LABEL_HAIRSTYLE_HIGHLIGHTS') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'hairColor2', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getColourCount()"
                    :indexValue="data.hairColor2"
                    :increment="1"
                    :values="locales.color.hair"
                    @input="(e) => setValueWrap(e, 'hairColor2')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'hairColor2', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>

        <Module :name="getLocale('LABEL_EYEBROWS')" class="mb-4">
            <!-- Eyebrows -->
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_EYEBROWS') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'eyebrows', 0, getEyebrowsCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getEyebrowsCount()"
                    :indexValue="data.eyebrows"
                    :increment="1"
                    :values="locales.hairComponent.eyebrows"
                    @input="(e) => setValueWrap(e, 'eyebrows')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'eyebrows', 0, getEyebrowsCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
            <!-- Eyebrow Colour -->
            <div class="subtitle-2 grey--text mb-2 mt-4">{{ getLocale('LABEL_EYEBROWS_COLOUR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'eyebrowsColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getColourCount()"
                    :indexValue="data.eyebrowsColor1"
                    :increment="1"
                    :values="locales.color.hair"
                    @input="(e) => setValueWrap(e, 'eyebrowsColor1')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'eyebrowsColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
            <!-- Eyebrow Opacity -->
            <div class="subtitle-2 grey--text mb-2 mt-4">
                {{ getLocale('LABEL_EYEBROWS') }} {{ getLocale('LABEL_OPACITY') }}
            </div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'eyebrowsOpacity', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="1"
                    :indexValue="data.eyebrowsOpacity"
                    :increment="0.1"
                    @input="(e) => setValueWrap(e, 'eyebrowsOpacity')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'eyebrowsOpacity', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>

        <Module :name="getLocale('LABEL_FACIAL_HAIR')" class="mb-4" v-if="data.sex === 1">
            <!-- Facial Hair -->
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_FACIAL_HAIR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'facialHair', 0, getFacialCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getFacialCount()"
                    :indexValue="data.facialHair"
                    :increment="1"
                    :values="locales.hairComponent.facial"
                    @input="(e) => setValueWrap(e, 'facialHair')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'facialHair', 0, getFacialCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>

            <!-- Facial Hair Colour -->
            <div class="subtitle-2 grey--text mb-2 mt-4">{{ getLocale('LABEL_FACIAL_HAIR_COLOUR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'facialHairColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getColourCount()"
                    :indexValue="data.facialHairColor1"
                    :increment="1"
                    :values="locales.color.hair"
                    @input="(e) => setValueWrap(e, 'facialHairColor1')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'facialHairColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
            <!-- Eyebrow Opacity -->
            <div class="subtitle-2 grey--text mb-2 mt-4">
                {{ getLocale('LABEL_FACIAL_HAIR') }} {{ getLocale('LABEL_OPACITY') }}
            </div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'facialHairOpacity', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="1"
                    :indexValue="data.facialHairOpacity"
                    :increment="0.1"
                    @input="(e) => setValueWrap(e, 'facialHairOpacity')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'facialHairOpacity', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>

        <Module :name="getLocale('LABEL_CHEST_HAIR')" class="mb-4" v-if="data.sex === 1">
            <!-- Chest Hair -->
            <div class="subtitle-2 grey--text mb-2 mt-2">{{ getLocale('DESC_CHEST_HAIR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'chestHair', 0, getChestCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getChestCount()"
                    :indexValue="data.chestHair"
                    :increment="1"
                    :values="locales.hairComponent.chest"
                    @input="(e) => setValueWrap(e, 'chestHair')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'chestHair', 0, getChestCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>

            <!-- Chest Hair Colour -->
            <div class="subtitle-2 grey--text mb-2 mt-4">{{ getLocale('LABEL_CHEST_HAIR_COLOUR') }}</div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'chestHairColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="getColourCount()"
                    :indexValue="data.chestHairColor1"
                    :increment="1"
                    :values="locales.color.hair"
                    @input="(e) => setValueWrap(e, 'chestHairColor1')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'chestHairColor1', 0, getColourCount(), 1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
            <!-- Chest Hair Opacity -->
            <div class="subtitle-2 grey--text mb-2 mt-4">
                {{ getLocale('LABEL_CHEST_HAIR') }} {{ getLocale('LABEL_OPACITY') }}
            </div>
            <div class="split split-full center">
                <Button color="blue" @click="$emit('dec-parameter', 'chestHairOpacity', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-left"></Icon>
                </Button>
                <RangeInput
                    :minIndex="0"
                    :maxIndex="1"
                    :indexValue="data.chestHairOpacity"
                    :increment="0.1"
                    @input="(e) => setValueWrap(e, 'chestHairOpacity')"
                    class="pl-3 pr-3 fill-full-width"
                />
                <Button color="blue" @click="$emit('inc-parameter', 'chestHairOpacity', 0, 1, 0.1)">
                    <Icon :size="14" icon="icon-chevron-right"></Icon>
                </Button>
            </div>
        </Module>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ComponentName = 'Hair';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
        RangeInput: defineAsyncComponent(() => import('@components/RangeInput.vue')),
    },
    props: {
        data: Object,
        locales: Object,
    },
    data() {
        return {
            // Used to prevent certain hair values
            greylist: {
                masculine: [23],
                feminine: [24],
            },
        };
    },
    methods: {
        isFeminine(): boolean {
            return this.data.sex === 0;
        },
        isInvalidValue(value: number): boolean {
            if (typeof value === 'string') {
                value = parseFloat(value);
            }

            const valuesToCheck = this.isFeminine() ? this.greylist.feminine : this.greylist.masculine;
            return valuesToCheck.includes(value);
        },
        incValueWrap(parameterName: string, min: number, max: number, increment: number) {
            if (parameterName === 'hair' && this.isInvalidValue(this.data[parameterName] + increment)) {
                increment = 2;
            }

            this.$emit('inc-parameter', 'hair', min, max, increment);
        },
        decValueWrap(parameterName: string, min: number, max: number, increment: number) {
            if (parameterName === 'hair' && this.isInvalidValue(this.data[parameterName] - increment)) {
                increment = 2;
            }

            this.$emit('dec-parameter', 'hair', min, max, increment);
        },
        setValueWrap(e: Event, parameterName: string) {
            let value = parseFloat(e.target['value']);

            if (parameterName === 'hair' && this.isInvalidValue(value)) {
                value += 1;
            }

            this.$emit('set-parameter', parameterName, value);
        },
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
        getChestCount() {
            return this.locales.hairComponent.chest.length - 1;
        },
        getLocale(name: string | number) {
            let localeInfo = this.locales.hairComponent[name]
                ? this.locales.hairComponent[name]
                : `N/A hairComponent.${name}`;

            if (typeof name === 'string' && localeInfo.length >= 48) {
                localeInfo = `${localeInfo.substring(0, 48)}\r\n${localeInfo.substring(48, localeInfo.length - 1)}`;
            }

            return localeInfo;
        },
    },
});
</script>
