<template>
    <div class="barbershop-frame" v-if="ready">
        <div class="top-section">
            <div class="left-section">
                <div class="sidebar">
                    <div
                        v-for="(element, index) in navigation"
                        :key="index"
                        class="circle-btn mb-4"
                        :class="isNavSelected(index)"
                        @click="setNavIndex(index)"
                    >
                        <Icon :icon="element.icon" :size="18"></Icon>
                    </div>
                </div>
                <div class="color-palette pt-3">
                    <Button
                        v-for="index in getColorCount"
                        @click="selectColorType(getUpdaterName, index)"
                        class="mb-2 brb-btn"
                        :color="getButtonColor(getColorName(index))"
                    >
                        Color {{ index }}
                    </Button>

                    <!-- <Button
                        @click="selectColorType(getUpdaterName, 1)"
                        class="mb-2 brb-btn"
                        :color="getButtonColor('hairColor1')"
                    >
                        Color 1
                    </Button>
                    <Button
                        @click="selectColorType(getUpdaterName, 2)"
                        class="mb-2 brb-btn"
                        :color="getButtonColor('hairColor2')"
                    >
                        Color 2
                    </Button> -->
                    <ColorComponent
                        @select-color="selectColor"
                        :currentIndex="getColorIndex"
                        :colorType="0"
                        class="mb-4"
                    />
                </div>
            </div>
            <div class="right-section"></div>
        </div>
        <div class="bottom-section">
            <HairstyleComponent :sex="sex" :currentIndex="hairIndex" @setIndex="setHairIndex"></HairstyleComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, nextTick } from 'vue';
import { maleHair } from '../shared/maleHair';
import { femaleHair } from '../shared/femaleHair';
import { BarbershopEvents } from '../shared/events';
import { BarbershopData } from '../shared/interfaces';
import ColorComponentVue from './components/ColorComponent.vue';
import HairstyleComponentVue from './components/HairstyleComponent.vue';

import ResolvePath from '../../../../../src-webviews/src/utility/pathResolver';

export const ComponentName = 'Barbershop';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
        ColorComponent: ColorComponentVue,
        HairstyleComponent: HairstyleComponentVue,
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            // Nice
            sex: 0,
            // Update Check
            ready: false,
            // Navigation
            navIndex: 0,
            navigation: [
                { icon: 'icon-hair', type: 'hair', colors: 2 },
                { icon: 'icon-eye', type: 'eye', colors: 1 },
                { icon: 'icon-beard', type: 'beard', colors: 1 },
                { icon: 'icon-makeup', type: 'makeup', colors: 1 },
            ],
            // Color Palette Helper
            colorType: 'hairColor1',
            // Indexing  Information
            hairIndex: 0,
            eyeIndex: 0,
            beardIndex: 0,
            makeupIndex: 0,
            hairColor1: 0,
            hairColor2: 0,
            beardColor1: 0,
            beardOpacity: 0,
            eyeColor1: 0,
            eyeOpacity: 1,
            makeupColor1: 0,
            makeupOpacity: 1,
            // Utility
            resolvePath: ResolvePath,
        };
    },
    computed: {
        getColorCount() {
            return this.navigation[this.navIndex].colors;
        },
        getColorIndex() {
            return this[this.colorType];
        },
        getUpdaterName() {
            return this.navigation[this.navIndex].type;
        },
    },
    methods: {
        getColorName(index: number) {
            return this.navigation[this.navIndex].type + `Color` + index;
        },
        getButtonColor(type: string) {
            if (this.colorType === type) {
                return 'blue';
            }

            return 'grey';
        },
        selectColorType(typeName: string, index: number) {
            this.colorType = `${typeName}Color${index}`;
        },
        selectColor(index: number) {
            this[this.colorType] = index;
            this.update();
        },
        setHairIndex(index: number) {
            this.hairIndex = index;
            this.update();
        },
        async setData(data: BarbershopData) {
            this.sex = data.sex;
            this.hairStyles = data.sex === 0 ? femaleHair : maleHair;
            const hairStyleIndex = this.hairStyles.findIndex((x) =>
                x.includes(`2-${data.dlc}-${data.sex === 0 ? 'female' : 'male'}-${data.hair}`),
            );
            this.setHairIndex(hairStyleIndex === -1 ? 0 : hairStyleIndex);

            this.hairColor1 = data.hairColor1;
            this.hairColor2 = data.hairColor2;

            await nextTick();

            this.ready = true;
        },
        getHairStyleDlc(): number {
            return parseInt(this.hairStyles[this.hairIndex].split('-')[1]);
        },
        getHairStyle(): number {
            return parseInt(this.hairStyles[this.hairIndex].split('-')[3]);
        },
        update() {
            const updateInformation: BarbershopData = {
                dlc: this.getHairStyleDlc(),
                hair: this.getHairStyle(),
                hairColor1: this.hairColor1,
                hairColor2: this.hairColor2,
                hairFullName: this.hairStyles[this.hairIndex],
                eyebrowOpacity: this.eyeOpacity,
                eyebrowShape: this.eyeShape,
                eyebrowColor: this.eyeColor1,
            };

            if ('alt' in window) {
                alt.emit(BarbershopEvents.WebViewEvents.UPDATE, updateInformation);
            }
        },
        closePage() {
            //
        },
        isNavSelected(index: number) {
            return index === this.navIndex ? { 'circle-btn-selected': true } : {};
        },
        setNavIndex(index: number) {
            this.navIndex = index;
            this.colorType = this.getColorName(1);
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(BarbershopEvents.WebViewEvents.SET_DATA, this.setData);
            alt.emit(BarbershopEvents.WebViewEvents.READY);
        } else {
            this.setData({
                sex: 0,
                dlc: 1152146508,
                hair: 1,
                hairColor1: 0,
                hairColor2: 0,
            });
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(BarbershopEvents.WebViewEvents.SET_DATA, this.setData);
        }
    },
});
</script>

<style scoped>
.barbershop-frame {
    display: flex;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100vw;
    max-width: 100vw;
    flex-direction: column;
    box-sizing: border-box;
}

.barbershop-frame .top-section {
    display: flex;
    flex-direction: row;

    min-width: 100vw;
    max-width: 100vw;
}

.barbershop-frame .bottom-section {
    display: flex;
    flex-direction: column;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 175px;
    max-height: 175px;
}

.barbershop-frame .left-section {
    display: flex;
    min-width: calc(100vw / 2);
    max-width: calc(100vw / 2);
}

.barbershop-frame .sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 75px;
    max-width: 75px;
    box-sizing: border-box;
    padding-top: 12px;
}

.barbershop-frame .right-section {
    width: calc(100vw / 2);
}

.barbershop-frame .top-section {
    display: flex;
    flex-direction: row;
    min-height: calc(100vh - 175px);
    max-height: calc(100vh - 175px);
    min-width: 100vw;
    max-width: 100vw;
}

.color-palette {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-left: 0px;
    transition: all 0.5 ease-in-out;
}

.brb-btn {
    background: rgb(0, 0, 0, 0.9) !important;
    border-radius: 12px;
}

.circle-btn {
    padding: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.8);
    border-radius: 100%;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.1s ease-in-out;
}

.circle-btn:hover {
    color: rgba(255, 255, 255, 0.8);
    transform: scale(1.1);
}

.circle-btn-selected {
    color: rgba(255, 166, 0, 0.9);
    box-shadow: 0px 0px 10px rgba(255, 166, 0, 0.9);
}

.circle-btn-selected:hover {
    color: rgba(255, 166, 0, 0.9);
    box-shadow: 0px 0px 10px rgba(255, 166, 0, 0.9);
    transform: scale(1) !important;
}
</style>
