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
                    <div class="circle-btn mb-4 green--text" @click="save">
                        <Icon icon="icon-checkmark" :size="18"></Icon>
                    </div>
                    <div class="circle-btn mb-4 red--text" @click="close">
                        <Icon icon="icon-times-circle" :size="18"></Icon>
                    </div>
                </div>
                <div class="color-palette pt-3" :key="navIndex">
                    <Button
                        v-for="index in getColorCount"
                        @click="selectColorType(getUpdaterName, index)"
                        class="mb-2 brb-btn"
                        :color="getButtonColor(getColorName(index))"
                    >
                        {{ locale.COLOR }} {{ index }}
                    </Button>
                    <ColorComponent
                        @select-color="selectColor"
                        :currentIndex="getColorIndex"
                        :colorType="navigation[navIndex].colorComponentType"
                        class="mb-4"
                    />
                    <EyeComponent
                        :currentIndex="eyeIndex"
                        v-if="navigation[navIndex].isEyebrows"
                        @decrement-index="decrementIndex"
                        @increment-index="incrementIndex"
                        :opacity="eyeOpacity"
                    />
                    <BeardComponent
                        :currentIndex="beardIndex"
                        :opacity="beardOpacity"
                        v-if="navigation[navIndex].isBeard"
                        @decrement-index="decrementIndex"
                        @increment-index="incrementIndex"
                    />
                </div>
            </div>
            <div class="right-section"></div>
        </div>
        <div class="bottom-section">
            <HairstyleComponent
                :sex="sex"
                :currentIndex="hairIndex"
                @setIndex="setHairIndex"
                v-if="navigation[navIndex].isHair"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, nextTick } from 'vue';
import { maleHair } from '../shared/maleHair';
import { femaleHair } from '../shared/femaleHair';
import { BarbershopEvents } from '../shared/events';
import { BarbershopData } from '../shared/interfaces';
import { BARBER_SHOP_LOCALE } from '../shared/locales';
import ColorComponentVue from './components/ColorComponent.vue';
import HairstyleComponentVue from './components/HairstyleComponent.vue';
import EyeComponentVue from './components/EyeComponent.vue';
import BeardComponentVue from './components/BeardComponent.vue';

import ResolvePath from '../../../../../src-webviews/src/utility/pathResolver';
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';

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
        EyeComponent: EyeComponentVue,
        BeardComponent: BeardComponentVue,
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
                { icon: 'icon-hair', type: 'hair', colors: 2, isHair: true, colorComponentType: 0 },
                { icon: 'icon-eye', type: 'eye', colors: 1, isEyebrows: true, colorComponentType: 0 },
                { icon: 'icon-beard', type: 'beard', colors: 1, isBeard: true, colorComponentType: 0 },
                // { icon: 'icon-makeup', type: 'makeup', colors: 1, isMakeup: true, colorComponentType: 1 },
            ],
            // Color Palette Helper
            colorType: 'hairColor1',
            // Indexing  Information
            hairIndex: 0,
            eyeIndex: 16,
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
            locale: BARBER_SHOP_LOCALE,
        };
    },
    computed: {
        needToRefresh() {
            return this.refreshColorComponent;
        },
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
        decrementIndex(whatToDecrement: string, maxLength: number, decrementValue = 1) {
            if (this[whatToDecrement] - decrementValue < 0) {
                this[whatToDecrement] = maxLength;
            } else {
                this[whatToDecrement] -= decrementValue;
            }

            this.update();
        },
        incrementIndex(whatToIncrement: string, maxLength: number, incrementValue = 1) {
            if (this[whatToIncrement] + incrementValue >= maxLength) {
                this[whatToIncrement] = 0;
            } else {
                this[whatToIncrement] += incrementValue;
            }

            this.update();
        },
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

            for (const key of Object.keys(data)) {
                this[key] = data[key];
            }

            this.update();

            // Modify Navigation Options
            if (this.sex === 0) {
                const navigationOptions = [...this.navigation];
                const navIndex = navigationOptions.findIndex((x) => x.type === 'beard');
                if (navIndex !== -1) {
                    navigationOptions.splice(navIndex, 1);
                    this.navigation = navigationOptions;
                }

                if (navIndex >= this.navigation.length) {
                    this.navIndex = 0;
                }
            }

            await nextTick();

            this.setNavIndex(this.navIndex);
            this.ready = true;
        },
        getHairStyleDlc(): number {
            return parseInt(this.hairStyles[this.hairIndex].split('-')[1]);
        },
        getHairStyle(): number {
            return parseInt(this.hairStyles[this.hairIndex].split('-')[3]);
        },
        update(shouldSave = false) {
            const updateInformation: BarbershopData = {
                dlc: this.getHairStyleDlc(),
                hair: this.getHairStyle(),
                hairColor1: this.hairColor1,
                hairColor2: this.hairColor2,
                hairFullName: this.hairStyles[this.hairIndex],
                eyeOpacity: this.eyeOpacity,
                eyeIndex: this.eyeIndex,
                eyeColor1: this.eyeColor1,
                makeupIndex: this.makeupIndex,
                makeupColor1: this.makeupColor1,
                makeupOpacity: this.makeupOpacity,
                beardIndex: this.beardIndex,
                beardColor1: this.beardColor1,
                beardOpacity: this.beardOpacity,
            };

            if (!shouldSave) {
                WebViewEvents.emitClient(BarbershopEvents.WebViewEvents.UPDATE, updateInformation);
                return;
            }

            WebViewEvents.emitServer(BarbershopEvents.ServerClientEvents.SAVE, updateInformation);
        },
        closePage() {
            //
        },
        isNavSelected(index: number) {
            return index === this.navIndex ? { 'circle-btn-selected': true } : {};
        },
        async setNavIndex(index: number) {
            this.navIndex = index;
            this.colorType = this.getColorName(1);
        },
        close() {
            WebViewEvents.emitClose();
        },
        save() {
            this.update(true);
            WebViewEvents.emitClient(BarbershopEvents.WebViewEvents.SAVE_CLOSE);
        },
    },
    mounted() {
        if ('alt' in window) {
            WebViewEvents.on(BarbershopEvents.WebViewEvents.SET_DATA, this.setData);
            WebViewEvents.emitReady(ComponentName);
        } else {
            this.setData({
                sex: 1,
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
    display: flex;
    align-items: center;
    align-content: center;
    padding: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.8);
    border-radius: 100%;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.1s ease-in-out;
}

.circle-btn .icon {
    transform: translateX(-1px);
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
